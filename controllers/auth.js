const { response } = require('express');
const bcrypt = require('bcryptjs');
const { errorRes500 } = require('../helpers/response-messages');

const User = require('../models/User');
const { createJWT } = require('../helpers/jwt');

const createUser = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        ok: false,
        msg: 'User already exists with this email address',
      });
    }
    user = new User(req.body);

    //Encrypt password
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);

    await user.save();

    //Create JWT
    const token = await createJWT(user.id, user.name);

    return res.status(201).json({
      ok: true,
      uid: user.id,
      name: user.name,
      token,
    });
  } catch (error) {
    errorRes500(error, res);
  }
};

const loginUser = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        ok: false,
        msg: `Email and password doesn't match`,
        //REAL ERROR but user don't need to know about that: `User doesn't exists with this email address`
      });
    }

    //Compare Password
    const passwordCompare = bcrypt.compareSync(password, user.password);

    if (!passwordCompare) {
      return res.status(401).json({
        ok: false,
        msg: 'Wrong password',
      });
    }

    //Generate JWT
    const token = await createJWT(user.id, user.name);

    return res.status(200).json({
      ok: true,
      uid: user.id,
      name: user.name,
      token,
    });
  } catch (error) {
    errorRes500(error, res);
  }
};

const renewToken = async (req, res = response) => {
  const { uid, name } = req;
  try {
    //Generate a new JWT and return in this request
    const token = await createJWT(uid, name);

    return res.status(201).json({
      ok: true,
      msg: 'renew',
      token,
    });
  } catch (error) {
    errorRes500(error, res);
  }
};

module.exports = { createUser, loginUser, renewToken };
