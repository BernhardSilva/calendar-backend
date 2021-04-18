const moment = require('moment');

const dateTime = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');

module.exports = {
  dateTime,
};
