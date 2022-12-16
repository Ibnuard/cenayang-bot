const cron = require('node-cron');
const {dLog} = require('./log');

//group cron
const groupTask = func => {
  return cron.schedule('* 1 * * *', () => {
    dLog('JOB', 'SYSTEM', false, 'RUNNING GROUP JOB');
    func();
  });
};

//group cron
const quotaTask = func => {
  return cron.schedule('0 0 */12 * * *', () => {
    dLog('JOB', 'SYSTEM', false, 'RUNNING QUOTA JOB');
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

//BOT JOB
//reminder cron
const botTask = func => {
  return cron.schedule('0 0 */12 * * *', () => {
    dLog('JOB', 'SYSTEM', false, 'RUNNING BOT TASK EEVRY 12 HOURS');
    func();
  });
};

module.exports = {
  groupTask,
  quotaTask,
  reminderTask,
  botTask,
};
