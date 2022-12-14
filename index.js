const qrcode = require('qrcode-terminal');
const {Client, LocalAuth} = require('whatsapp-web.js');
const {handler} = require('./bin');
const {
  leaveGroup,
  joinedPremiumGroup,
  checkGroupStatus,
} = require('./func/group');
const {job} = require('./tools');
const moment = require('moment');
const {checkReminderTime} = require('./func/reminder');

moment.locale('id');

//CLIENT INIT
const client = new Client({
  //authStrategy: new LocalAuth(),
  puppeteer: {
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    executablePath:
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  },
  ffmpegPath: './ffmpeg/bin/ffmpeg.exe',
});

//GENERATE QR
client.on('qr', qr => {
  qrcode.generate(qr, {small: true});
});

client.on('disconnected', async reason => {
  console.log('dissconnected : ' + reason);
});

//INTIALIZE
client.on('ready', () => {
  console.log('Client is ready!');

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

  //cron(() => checkGroupStatus(client), 600000, 'Check Group Premium Validity');
});

//ON JOIN GROUP
client.on('group_join', async data => {
  if (data.type !== 'invite') {
    await leaveGroup(client, data);
  } else {
    await joinedPremiumGroup(client, data);
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

client.initialize();
