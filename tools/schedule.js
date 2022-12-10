const cron = require('node-cron');
const {dLog} = require('./log');

//group cron
const groupTask = func => {
  return cron.schedule('* 1 * * *', () => {
    dLog('JOB', 'SYSTEM', false, 'RUNNING GROUP JOB');
    func();
  });
};

module.exports = {
  groupTask,
};
