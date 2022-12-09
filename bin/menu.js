//const {owner, menu, sticker, downFB, ping} = require('./command');

const {command} = require('.');

const onMessageReceived = async (client, message) => {
  // ex, format !sticker
  const getMessage = message.body;

  const prefix = /^[°•π÷×¶∆£¢€¥®™✓=|~!#$%^&./\\©^]/.test(getMessage)
    ? getMessage.match(/^[°•π÷×¶∆£¢€¥®™✓=|~!#$%^&./\\©^]/gi)
    : '-';

  const cmd = getMessage.split(' ')[0].replace(prefix, '');
  const value = getMessage.split(' ')[1];
  const extra_value = getMessage.split(' ')[2] ?? '';

  console.log(`perintah diterima dari ${message?.from} -> ${cmd}`);

  switch (cmd) {
    case 'ping':
      return command.ping(client, message);
      break;
    case 'owner':
      return command.owner(client, message);
      break;
    case 'sticker':
      return command.sticker(client, message);
      break;
    case 'stiker':
      return command.sticker(client, message);
      break;
    case 'menu':
      return command.menu(client, message);
      break;
    case 'facebook':
      return command.downFB(client, message, value);
      break;
    case 'tiktok':
      return command.downTik(client, message, value);
      break;
    case 'instagram':
      return command.downInsta(client, message, value);
      break;
    case 'igstory':
      return command.downIGstory(client, message, value, extra_value);
      break;
    default:
      return null;
      break;
  }
};

module.exports = {
  onMessageReceived,
};
