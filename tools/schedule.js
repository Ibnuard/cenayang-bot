const cron = require('node-cron');

//group cron
const groupTask = func => {
  return cron.schedule('* 1 * * *', () => {
    func();
  });
};

//group cron
const quotaTask = func => {
  return cron.schedule('0 0 */12 * * *', () => {
    func();
  });
};

//reminder cron
const reminderTask = func => {
  return cron.schedule('* * * * *', () => {
    func();
  });
};

//BOT JOB
//reminder cron
const botTask = func => {
  return cron.schedule('0 0 */12 * * *', () => {
    func();
  });
};

module.exports = {
  groupTask,
  quotaTask,
  reminderTask,
  botTask,
};
