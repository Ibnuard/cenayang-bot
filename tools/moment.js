const moment = require('moment/moment');

//get moemnt
const getMoment = (format = '') => {
  return moment().format(format);
};

const getMomentDiff = startTime => {
  var duration = moment.duration(end.diff(startTime));
  var days = duration.asDays();

  return days;
};

module.exports = {
  getMoment,
  getMomentDiff,
};
