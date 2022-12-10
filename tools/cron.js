const cron = (func, cd = 10000, name = '') => {
  console.log('doing job : ' + name);
  setTimeout(() => {
    func();

    return cron(func, cd, name);
  }, cd);
};

module.exports = {
  cron,
};
