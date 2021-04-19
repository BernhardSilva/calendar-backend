const { dateTime } = require('./date');

const errorRes500 = (error, res) => {
  console.log(`${error} | time: ${dateTime}`);
  return res.status(500).json({
    ok: false,
    msg: 'Please contact your administrator',
  });
};

module.exports = {
  errorRes500,
};
