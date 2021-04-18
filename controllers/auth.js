const { response } = require('express');
const bcrypt = require('bcryptjs');
const { dateTime } = require('../helpers/date');
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

    res.status(201).json({
      ok: true,
      msg: 'User created',
      uid: user.id,
      name: user.name,
      token,
    });
  } catch (error) {
    console.log(`${error} | time: ${dateTime}`);
    res.status(500).json({
      ok: false,
      msg: 'Please contact your administrator',
    });
  }
};

const loginUser = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        ok: false,
        msg: `User doesn't exists with this email address`, //TODO: msg: Email and password doesn't match
      });
    }

    //Compare Password
    const passwordCompare = bcrypt.compareSync(password, user.password);

    if (!passwordCompare) {
      return res.status(400).json({
        ok: false,
        msg: 'Wrong password',
      });
    }

    //Generate JWT
    const token = await createJWT(user.id, user.name);

    res.json({
      ok: true,
      uid: user.id,
      name: user.name,
      token,
    });
  } catch (error) {
    console.log(`${error} | time: ${dateTime}`);
    res.status(500).json({
      ok: false,
      msg: 'Please contact your administrator',
    });
  }
};

const renewToken = async (req, res = response) => {
  const { uid, name } = req;
  try {
    //Generate a new JWT and return in this request
    const token = await createJWT(uid, name);

    res.status(201).json({
      ok: true,
      msg: 'renew',
      token,
    });
  } catch (error) {
    console.log(`${error} | time: ${dateTime}`);
    res.status(500).json({
      ok: false,
      msg: 'Please contact your administrator',
    });
  }
};

module.exports = { createUser, loginUser, renewToken };
