const {db} = require('.');
const {getMoment, getMomentDiff} = require('../tools/moment');
const {loadData, updateData, saveData, saveDataOvt} = require('./storage');
const moment = require('moment');

const checkGroupStatus = async client => {
  const groupList = loadData('group_premium');

  async function _checkValidity(id, time) {
    const valid = getMomentDiff(time, 'days');

    if (valid > 29) {
      const grup = await client.getChatById(id);
      await client
        .sendMessage(
          id,
          'Halo gaes..\nGedang leave dari grup ya soalnya masa berlakunya udah habis huhuu\n\nKalian bisa hubungin admin yaa untuk pake bot ini lagi\n\nMaaciww.. See u...',
        )
        .then(async () => {
          await grup.leave();
        });
    }
  }

  if (groupList.length) {
    for (let i = 0; i < groupList.length; i++) {
      await _checkValidity(groupList[i].id, groupList[i].joinTime);
    }
  }
};

const leaveGroup = async (client, group) => {
  const groupId = await client.getChatById(group?.chatId);
  await client.sendMessage(
    group?.chatId,
    'Maaf ya grupnya belum premium buat pake Bot ini.\nSilahkan kontak admin untuk dapat menambahkan bot ini ke grup chat yaa..',
  );
  await client.sendMessage(
    group?.chatId,
    'Aku leave dulu ya dari grup, nanti kalo udah premium aku siap membantu... \nMaaaciwww...',
  );

  setTimeout(async () => {
    await groupId.leave();
  }, 3000);
};

const joinedPremiumGroup = async (client, group) => {
  const data = {
    id: group?.chatId,
    joinTime: getMoment(),
  };

  const existingData = loadData('group_premium');
  const expiredDate = moment().add(30, 'days');

  if (existingData.length > 0) {
    const find = existingData.filter((item, index) => {
      return item.id == group.chatId;
    });

    if (find.length > 0) {
      updateData('group_premium', data, 'joinTime');

      await client.sendMessage(
        group?.chatId,
        'Halo Gaes David Disini...\nEh maaf salah intro hihi🤭\n\nHalo Everyone! 👋\nKenalin, aku gedang.\n\nNote:\nJangan call abang yaa, otomatis abang block nanti! 🚫\n\nSelain (/) abang juga akan merespon simbol berikut : \n/ ! $ . ,\n\nAbang juga jago matematika loh, kalian bisa gunakan prefix (=)\ncontoh: =10+2+4\n\nKalian bisa lakukan perintah *!menu* untuk menampilkan menu yang tersedia.\n\nTerima kasih sudah mau menggunakan bot pintar nan ganteng ini. ✨\n\nKalo kalian merasa bot ini berguna silahkan berdonasi yaa, kasihan soalnya ownernya sobat misqueen ga bisa bayar server huhu 🙈\n\nHowever literally ayo nyerah jangan semangat 🐣\nHave a bad dayy 🌧\n\nMaaciww...',
      );
      await client.sendMessage(
        group?.chatId,
        `BOT akan otomatis keluar pada ${moment(expiredDate).format('LL')}`,
      );
    } else {
      db.saveData('group_premium', data);

      await client.sendMessage(
        group?.chatId,
        'Halo Gaes David Disini...\nEh maaf salah intro hihi🤭\n\nHalo Everyone! 👋\nKenalin, aku gedang.\n\nNote:\nJangan call abang yaa, otomatis abang block nanti! 🚫\n\nSelain (/) abang juga akan merespon simbol berikut : \n/ ! $ . ,\n\nAbang juga jago matematika loh, kalian bisa gunakan prefix (=)\ncontoh: =10+2+4\n\nKalian bisa lakukan perintah *!menu* untuk menampilkan menu yang tersedia.\n\nTerima kasih sudah mau menggunakan bot pintar nan ganteng ini. ✨\n\nKalo kalian merasa bot ini berguna silahkan berdonasi yaa, kasihan soalnya ownernya sobat misqueen ga bisa bayar server huhu 🙈\n\nHowever literally ayo nyerah jangan semangat 🐣\nHave a bad dayy 🌧\n\nMaaciww...',
      );
      await client.sendMessage(
        group?.chatId,
        `BOT akan otomatis keluar pada ${moment(expiredDate).format('LL')}`,
      );
    }
  } else {
    db.saveData('group_premium', data);

    await client.sendMessage(
      group?.chatId,
      'Halo Gaes David Disini...\nEh maaf salah intro hihi🤭\n\nHalo Everyone! 👋\nKenalin, aku gedang.\n\nNote:\nJangan call abang yaa, otomatis abang block nanti! 🚫\n\nSelain (/) abang juga akan merespon simbol berikut : \n/ ! $ . ,\n\nAbang juga jago matematika loh, kalian bisa gunakan prefix (=)\ncontoh: =10+2+4\n\nKalian bisa lakukan perintah *!menu* untuk menampilkan menu yang tersedia.\n\nTerima kasih sudah mau menggunakan bot pintar nan ganteng ini. ✨\n\nKalo kalian merasa bot ini berguna silahkan berdonasi yaa, kasihan soalnya ownernya sobat misqueen ga bisa bayar server huhu 🙈\n\nHowever literally ayo nyerah jangan semangat 🐣\nHave a bad dayy 🌧\n\nMaaciww...',
    );
    await client.sendMessage(
      group?.chatId,
      `BOT akan otomatis keluar pada ${moment(expiredDate).format('LL')}`,
    );
  }
};

// ==============================================
//
//
//
// ================= ANTI KASAR =================
//
//
//
// =============================================

const antiKasarOn = groupId => {
  const list = loadData('antikasar');

  if (list.length) {
    const find = list.filter((item, index) => {
      return item == groupId;
    });

    if (find.length > 0) {
      return 'EXIST';
    } else {
      saveData('antikasar', groupId);
      return 'ADDED';
    }
  } else {
    saveData('antikasar', groupId);
    return 'ADDED';
  }
};

const antiKasarOff = groupId => {
  const list = loadData('antikasar');

  if (list.length) {
    const find = list.filter((item, index) => {
      return item == groupId;
    });

    if (find.length > 0) {
      const rmData = list.filter((item, index) => {
        return item !== groupId;
      });

      saveDataOvt('antikasar', rmData);
      return 'REMOVED';
    } else {
      return 'INACTIVE';
    }
  } else {
    return 'INACTIVE';
  }
};

const checkStatusAntiKasar = groupId => {
  const data = loadData('antikasar');

  if (data.length) {
    const find = data.filter((item, index) => {
      return item == groupId;
    });

    if (find.length > 0) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

module.exports = {
  checkGroupStatus,
  leaveGroup,
  joinedPremiumGroup,
  antiKasarOff,
  antiKasarOn,
  checkStatusAntiKasar,
};
