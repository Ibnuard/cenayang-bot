const cron = require('node-cron');

//group cron
const groupTask = func => {
  return cron.schedule('0 0 0 * * *', () => {
    func();
  });
};

//group cron
const quotaTask = func => {
  return cron.schedule('0 0 0 * * *', () => {
    func();
  });
};

//reminder cron
const reminderTask = func => {
  return cron.schedule('* * * * *', () => {
    func();
  });
};

//crypto cron
const cryptoTask = func => {
  return cron.schedule('* * * * *', () => {
    func();
  });
};

//BOT JOB
//reminder cron
const botTask = func => {
  return cron.schedule('0 0 0 * * *', () => {
    func();
  });
};

//reminder cron
const clientTask = func => {
  return cron.schedule('0 0 1 * * *', () => {
    func();
  });
};

module.exports = {
  groupTask,
  quotaTask,
  reminderTask,
  botTask,
  clientTask,
  cryptoTask,
};
