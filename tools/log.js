const {getMoment} = require('./moment');

const dLog = (service, sender, isError, message) => {
  const datetime = `[${getMoment('L')}|${getMoment('LT')}]`;

  console.log(`${datetime}||[${sender}] - ${service} : ${message}`);
};

module.exports = {
  dLog,
};
