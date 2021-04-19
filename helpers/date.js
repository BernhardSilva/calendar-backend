const moment = require('moment');

const dateTime = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');

const isDate = (value) => {
  if (!value) {
    return false;
  }
  const date = moment(value);
  if (date.isValid()) {
    return true;
  } else {
    return false;
  }
};

module.exports = {
  dateTime,
  isDate,
};
