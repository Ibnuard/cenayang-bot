const qrcode = require('qrcode-terminal');
const {Client, LocalAuth, LegacySessionAuth} = require('whatsapp-web.js');
const {handler} = require('./bin');
const {
  leaveGroup,
  joinedPremiumGroup,
  checkGroupStatus,
} = require('./func/group');
const {job} = require('./tools');
const moment = require('moment');
const {checkReminderTime} = require('./func/reminder');
const {user, cryptoalert} = require('./func');

const config = require('./config.json');

moment.locale('id');

//CLIENT INIT
const client = new Client({
  authStrategy: new LocalAuth({
    dataPath: './wa_auth/',
  }),
  puppeteer: {
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    executablePath: '/usr/bin/google-chrome-stable',
  },
  ffmpegPath: '/usr/bin/ffmpeg',
});

//GENERATE QR
client.on('qr', qr => {
  qrcode.generate(qr, {small: true});
});

client.on('auth_failure', async message => {
  console.log('AUTH FAIL ' + JSON.stringify(message));
});

// Save session values to the file upon successful auth
client.on('authenticated', session => {
  console.log('AUTH SUCCESS!');
});

//INTIALIZE
client.on('ready', () => {
  console.log('CLIENT READY!');

  //GROUP CHECK
  job.groupTask(() => checkGroupStatus(client)).start();

  //REMINDER TASK
  job.reminderTask(() => checkReminderTime(client)).start();

  //BOT TASK
  job
    .botTask(async () => {
      const chats = await client.getChats();

      for (let i = 0; i < chats.length; i++) {
        if (chats[i].isGroup == true) {
          console.log('clear group chat');
          await chats[i].clearMessages();
        } else {
          await chats[i].delete();
        }
      }
    })
    .start();

  job.quotaTask(() => user.resetUserQuota()).start();
  job
    .cryptoTask(() => cryptoalert.checkPrice(client.pupBrowser, client))
    .start();
});

//ON JOIN GROUP
client.on('group_join', async data => {
  if (data.id.participant == config.bot) {
    if (data.type !== 'invite') {
      await leaveGroup(client, data);
    } else {
      await joinedPremiumGroup(client, data);
    }
  }
});

//ON RECEIVE MESSAGES
client.on('message', async message => {
  //onMessageReceived(client, message);
  handler.onMessageReceived(client, message, client.pupBrowser);
});

//ON GET CALL
client.on('incoming_call', async data => {
  if (!data.isGroup) {
    const contact = await client.getContactById(data.from);
    await client.sendMessage(
      data.from,
      'Ih nakal ya dibilangin, bot tidak menerima call yaa..\nKamu di block karena melanggar peraturan.\n\nUntuk membuka block silahkan hubungi owner lewat telegram t.me/bluetterflys.',
    );

    setTimeout(() => {
      console.log('block contact : ' + data.from);
      contact.block();
    }, 5000);
  }
});

//INITITLIAZE CLIENT
client.initialize();

//CLIENT TASK TO RE INITIALIZE EVERY MIDNIGHT
job
  .clientTask(async () => {
    console.log('reinitialize');
    await client.destroy();

    setTimeout(() => {
      client.initialize();
    }, 5000);
  })
  .start();
