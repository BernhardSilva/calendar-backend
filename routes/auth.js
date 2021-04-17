/*
  Routes of users / Auth
  host + /api/auth
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { createUser, loginUser, renewToken } = require('../controllers/auth');

const { fieldsValidator } = require('../middlewares/fields-validator');

const router = Router();

router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Email is required, needs to be email format').isEmail(),
    check(
      'password',
      'Password is required, needs to be stronger',
    ).isStrongPassword(),
    fieldsValidator,
  ],
  createUser,
);

router.get(
  '/',
  [
    check('email', 'Email is required, needs to be email format')
      .not()
      .isEmpty(),
    check(
      'password',
      'Password is required, needs to be stronger',
    ).isStrongPassword(),
    fieldsValidator,
  ],
  loginUser,
);

router.get('/renew', renewToken);

module.exports = router;
