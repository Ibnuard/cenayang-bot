//const {owner, menu, sticker, downFB, ping} = require('./command');

const {command} = require('.');

const onMessageReceived = async (client, message) => {
  // ex, format !sticker
  const getMessage = message.body;

  const prefix = /^[°•π÷×¶∆£¢€¥®™✓=|~!#$%^&./\\©^]/.test(getMessage)
    ? getMessage.match(/^[°•π÷×¶∆£¢€¥®™✓=|~!#$%^&./\\©^]/gi)
    : '-';

  const cmd = getMessage.split(' ')[0].replace(prefix, '');
  const value = getMessage.replace(getMessage.split(' ')[0], '').trimStart();
  const extra_value = value.split(' '); //extra_value[0] extra_value[1]

  console.log(`from ${message?.from} -> ${cmd} -> ${value} ${extra_value}`);

  if (prefix == '=') {
    console.log('calculator');
    return command.hitung(client, message, getMessage);
  }

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
    case 'fb':
      return command.downFB(client, message, value);
      break;
    case 'tt':
      return command.downTik(client, message, value);
      break;
    case 'ig':
      return command.downInsta(client, message, value);
      break;
    case 'igs':
      return command.downIGstory(client, message, value, extra_value);
      break;
    case 'ytmp4':
      return command.downYT(client, message, 'vi', value);
      break;
    case 'ytmp3':
      return command.downYT(client, message, 'au', value);
      break;
    case 'text2gif':
      return command.txToGif(client, message, value);
      break;
    case 'nulis':
      return command.txToNulis(client, message, value);
      break;
    case 'logo':
      return command.txToLogoEsp(client, message, value);
      break;
    case 'logoPhub':
      return command.txToPhub(client, message, value, extra_value);
      break;
    case 'chord':
      return command.chord(client, message, value);
      break;
    case 'lirik':
      return command.lirik(client, message, value);
      break;
    case 'buatqr':
      return command.txToQR(client, message, value);
      break;
    case 'hartatahta':
      return command.txToHartaTahta(client, message, value);
      break;
    case 'ssweb':
      return command.ssWeb(client, message, value);
      break;
    case 'puisi':
      return command.puisi(client, message);
      break;
    case 'gempa':
      return command.gempa(client, message);
      break;
    case 'pantun':
      return command.pantun(client, message);
      break;
    case 'quotes':
      return command.quotes(client, message);
      break;
    case 'resep':
      return command.resep(client, message, value);
      break;
    case 'join':
      return command.joinGroupPremium(client, message, value);
      break;
    case 'pList':
      return command.premiumList(client, message);
      break;
    default:
      return null;
      break;
  }
};

module.exports = {
  onMessageReceived,
};
