const chalk = require('chalk');
const qrcode = require('qrcode-terminal');
const {Client, LocalAuth} = require('whatsapp-web.js');
const {handler} = require('./bin');
const {
  leaveGroup,
  joinedPremiumGroup,
  checkGroupStatus,
} = require('./func/group');
const {job} = require('./tools');

//CLIENT INIT
const client = new Client({
  //authStrategy: new LocalAuth(),
  puppeteer: {
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    executablePath:
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  },
});

client.on('qr', qr => {
  qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
  console.log(chalk.green('Client is ready!'));

  //GROUP CHECK
  job.groupTask(() => checkGroupStatus(client)).start();

  //cron(() => checkGroupStatus(client), 600000, 'Check Group Premium Validity');
});

client.on('group_join', async data => {
  if (data.type !== 'invite') {
    await leaveGroup(client, data);
  } else {
    await joinedPremiumGroup(client, data);
  }
});

client.on('message', async message => {
  //onMessageReceived(client, message);
  handler.onMessageReceived(client, message);
});

client.initialize();
