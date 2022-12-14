//const {owner, menu, sticker, downFB, ping} = require('./command');

const {command} = require('.');
const {checkStatusAntiKasar} = require('../func/group');
const {dLog} = require('../tools/log');

const onMessageReceived = async (client, message, browser) => {
  // ex, format !sticker
  const getMessage = message.body;
  const chat = await message.getChat();

  const prefix = /^[°•π÷×¶∆£¢€¥®™✓=|~!#$%^&./\\©^]/.test(getMessage)
    ? getMessage.match(/^[°•π÷×¶∆£¢€¥®™✓=|~!#$%^&./\\©^]/gi)
    : '-';

  let cmd;

  cmd = getMessage.split(' ')[0].replace(prefix, '');
  const value = getMessage.replace(getMessage.split(' ')[0], '').trimStart();
  const extra_value = value.split(' '); //extra_value[0] extra_value[1]

  //IF RECEIVE BADWORD
  if (chat.isGroup == true) {
    if (message.body.includes('kontol')) {
      const antikasar = checkStatusAntiKasar(message?.from);

      if (antikasar == true) {
        console.log('kata kasar detected!');
        cmd = 'badword';
      }
    }
  }

  //console.log(`from ${message?.from} -> ${cmd} -> ${value} ${extra_value}`);
  dLog(cmd, message.from, false, `${value} || ${extra_value}`);

  if (prefix == '=') {
    dLog('CALCULATOR', message.from, false, getMessage);
    return command.hitung(client, message, getMessage);
  }

  switch (cmd) {
    case 'ping':
      return command.ping(client, message);
      break;
    case 'info':
      return command.info(client, message);
      break;
    case 'donasi':
      return command.donasi(client, message);
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
    case 'facebook':
      return command.downFB(client, message, value);
      break;
    case 'tt':
      return command.downTik(client, message, value);
      break;
    case 'tiktok':
      return command.downTik(client, message, value);
      break;
    case 'ig':
      return command.downInsta(browser, client, message, value);
      break;
    case 'instagram':
      return command.downInsta(browser, client, message, value);
      break;
    case 'ytmp4':
      return command.downYT(client, message, 'vi', value);
      break;
    case 'yt':
      return command.downYT(client, message, 'vi', value);
      break;
    case 'youtube':
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
    case 'buatqr':
      return command.txToQR(client, message, value);
      break;
    case 'hartatahta':
      return command.txToHartaTahta(client, message, value);
      break;
    case 'ssweb':
      return command.ssWeb(client, message, value);
      break;
    case 'gempa':
      return command.gempa(client, message);
      break;
    case 'resep':
      return command.resep(client, message, value);
      break;
    case 'ingetin':
      return command.ingetin(client, message, value, extra_value);
      break;
    case 'badword':
      return command.badWord(client, message);
      break;
    case 'antikasar':
      return command.antikasar(client, message, value, chat);
      break;
    case 'faceswap':
      return command.faceswap(client, message, browser, value);
      break;
    case 'facetoon':
      return command.facecartoon(client, message, browser, value);
      break;
    case 'kartun':
      return command.facecartoon(client, message, browser, value);
      break;
    case 'gantimuka':
      return command.faceswap(client, message, browser, value);
      break;
    case 'join':
      return command.joinGroupPremium(client, message, value);
      break;
    case 'pList':
      return command.premiumList(client, message);
      break;
    case 'pup':
      return command.pup(client, message, browser, value);
      break;
      return null;
      break;
  }
};

module.exports = {
  onMessageReceived,
};
