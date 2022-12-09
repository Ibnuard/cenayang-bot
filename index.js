const qrcode = require('qrcode-terminal');
const {Client, LocalAuth, ChatTypes} = require('whatsapp-web.js');
const {handler} = require('./bin');
const {leaveGroup, joinedPremiumGroup} = require('./func/group');
const {cron} = require('./tools/cron');
const client = new Client({
  //authStrategy: new LocalAuth(),
  puppeteer: {
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    executablePath:
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  },
});

client.on('qr', qr => {
  console.log('QR : ' + qr);
  qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
  console.log('Client is ready!');

  function _test() {
    console.log('test called!');
  }

  //cron(_test);
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
