const cron = require('node-cron');
const {dLog} = require('./log');

//group cron
const groupTask = func => {
  return cron.schedule('* 1 * * *', () => {
    dLog('JOB', 'SYSTEM', false, 'RUNNING GROUP JOB');
    func();
  });
};

//reminder cron
const reminderTask = func => {
  return cron.schedule('* * * * *', () => {
    dLog('JOB', 'SYSTEM', false, 'RUNNING REMINDER TASK');
    func();
  });
};

module.exports = {
  groupTask,
  reminderTask,
};
