//const {owner, menu, sticker, downFB, ping} = require('./command');

const {command} = require('.');
const {checkStatusAntiKasar} = require('../func/group');
const bwordList = require('../database/group/katakasar.json');
const {detectIfMention} = require('./command');
const {user} = require('../func');

const onMessageReceived = async (client, message, browser) => {
  // ex, format !sticker
  const getMessage = message.body;
  const chat = await message.getChat();

  //HANDLE PREFIX
  const prefix = /^[°•π÷×¶∆£¢€¥®™✓=|~!#$%^&./\\©^]/.test(getMessage)
    ? getMessage.match(/^[°•π÷×¶∆£¢€¥®™✓=|~!#$%^&./\\©^]/gi)
    : '-';

  //HANDLE USER COMMAND
  let cmd;

  cmd = getMessage.split(' ')[0];
  const value = getMessage.replace(getMessage.split(' ')[0], '').trimStart();
  const extra_value = value.split(' '); //extra_value[0] extra_value[1]

  //IS USER CAN USE THE BOT (bool)
  const isCanUse = await user.isUserQuotaAvailable(message.from, chat);

  //IF BOT MENTIONED
  await detectIfMention(client, message);

  //HANDLE MESSAGE RECEIVED
  if (chat.isGroup == true) {
    //IF RECEIVE BADWORD
    if (bwordList.some(v => message.body.toLowerCase().includes(v))) {
      const antikasar = checkStatusAntiKasar(message?.from);

      if (antikasar == true) {
        console.log('kata kasar detected!');
        cmd = 'badword';
      }
    }
  }

  //HANDLE IF PREFIX =
  if (prefix == '=') {
    const operation = cmd.replace('=', '');
    return command.hitung(client, message, operation);
  }

  //IF USER PREMIUM OR HAVE QUOTAS
  if (isCanUse) {
    //HANDLING USER QUOTA / REQUEST

    switch (cmd) {
      case prefix + 'ping':
        await user.addUserCommandCount(message.from, chat);
        return command.ping(client, message);
        break;
      case prefix + 'info':
        await user.addUserCommandCount(message.from, chat);
        return command.info(client, message);
        break;
      case prefix + 'donasi':
        return command.donasi(client, message);
        break;
      case prefix + 'owner':
        await user.addUserCommandCount(message.from, chat);
        return command.owner(client, message);
        break;
      case prefix + 'sticker':
        await user.addUserCommandCount(message.from, chat);
        return command.sticker(client, message);
        break;
      case prefix + 'stiker':
        await user.addUserCommandCount(message.from, chat);
        return command.sticker(client, message);
        break;
      case prefix + 'stikers':
        await user.addUserCommandCount(message.from, chat);
        return command.sticker(client, message);
        break;
      case prefix + 'menu':
        await user.addUserCommandCount(message.from, chat);
        return command.menuTeks(client, message, prefix);
        break;
      case prefix + 'dl':
        await user.addUserCommandCount(message.from, chat);
        return command.allMediaDownload(client, message, value, browser);
        break;
      case prefix + 'ytmp3':
        await user.addUserCommandCount(message.from, chat);
        return command.ytmp3(client, message, value, browser);
        break;
      case prefix + 'nulis':
        await user.addUserCommandCount(message.from, chat);
        return command.txToNulis(browser, client, message, value, extra_value);
        break;
      case prefix + 'buatqr':
        await user.addUserCommandCount(message.from, chat);
        return command.txToQR(client, message, value);
        break;
      case prefix + 'ssweb':
        await user.addUserCommandCount(message.from, chat);
        return command.ssWeb(browser, client, message, value);
        break;
      case prefix + 'gempa':
        await user.addUserCommandCount(message.from, chat);
        return command.gempa(browser, client, message);
        break;
      case prefix + 'ingetin':
        await user.addUserCommandCount(message.from, chat);
        return command.ingetin(client, message, value, extra_value);
        break;
      case prefix + 'faceswap':
        await user.addUserCommandCount(message.from, chat);
        return command.faceswap(client, message, browser, value, extra_value);
        break;
      case prefix + 'facetoon':
        await user.addUserCommandCount(message.from, chat);
        return command.facecartoon(client, message, browser, value);
        break;
      case prefix + 'jadianime':
        await user.addUserCommandCount(message.from, chat);
        return command.fotoAnime(client, message, browser, value);
        break;

      // =========================================
      //
      //
      // ============ GROUP GAP ==================
      //
      //
      // ========================================

      case prefix + 'badword':
        return command.badWord(client, message);
        break;
      case prefix + 'antikasar':
        return command.antikasar(client, message, value, chat);
        break;
      case prefix + 'bye':
        return command.warnBye(client, message, value, chat);
        break;
      case prefix + 'yesbye':
        return command.bye(client, message, value, chat);
        break;
      case prefix + 'everyone':
        return command.tagAll(client, message);
        break;
      case prefix + 'tagAll':
        return command.tagAll(client, message);
        break;

      // =========================================
      //
      //
      // ============ ADMIN GAP ==================
      //
      //
      // ========================================

      case prefix + 'join':
        return command.joinGroupPremium(client, message, value);
        break;
      case prefix + 'addUser':
        return command.addUserPremium(client, message, value);
        break;
      case prefix + 'pList':
        return command.premiumList(client, message);
        break;
      case prefix + 'pup':
        return command.pup(browser, client, message, value);
        break;
        return null;
        break;
    }
  } else {
    if (message.body.includes(prefix)) {
      return command.quotaExceed(client, message);
    }
  }
};

module.exports = {
  onMessageReceived,
};
