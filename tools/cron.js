const cron = (func, cd = 10000) => {
  console.log('doing job');
  setTimeout(() => {
    func();

    return cron(func, cd);
  }, cd);
};

module.exports = {
  cron,
};
