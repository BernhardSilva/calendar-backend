const { response } = require('express');
const bcrypt = require('bcryptjs');
const { dateTime } = require('../helpers/date');
const User = require('../models/User');

//CREATE
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

    res.json({
      ok: true,
      msg: 'register',
      uid: user.id,
      name: user.name,
    });
  } catch (error) {
    console.log(`${error} | time: ${dateTime}`);
    res.status(500).json({
      ok: false,
      msg: 'Please contact your administrator',
    });
  }
};

//LOGIN
const loginUser = (req, res = response) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        ok: false,
        msg: `User doesn't exists with this email address`,
      });
    }

    res.json({
        ok: true,
        msg: 'login',
        email,
        password,
      });
      
  } catch (error) {
    console.log(`${error} | time: ${dateTime}`);
    res.status(500).json({
      ok: false,
      msg: 'Please contact your administrator',
    });
  }
};

//RENEW
const renewToken = (req, res = response) => {
  res.json({
    ok: true,
    msg: 'renew',
  });
};

module.exports = { createUser, loginUser, renewToken };
