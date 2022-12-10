const moment = require('moment/moment');

//get moemnt
const getMoment = (format = '') => {
  return moment().format(format);
};

const getMomentDiff = (startTime, key) => {
  const currentTime = moment();
  const duration = moment.duration(currentTime.diff(startTime));

  if (key == 'days') {
    const days = duration.asDays();

    return days;
  } else {
    const hours = duration.asHours();

    return hours;
  }
};

module.exports = {
  getMoment,
  getMomentDiff,
};
