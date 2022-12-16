const {randomInt} = require('../tools/utils');

const rand = (arr = []) => {
  const num = randomInt(0, arr.length - 1);

  return arr[num];
};

const waitArr = [
  '⏳ Okey siap, sedang diproses!',
  '⏳ Okey tenang tunggu bentar!',
  '⏳ Okey, tunggu sebentar...',
  '⏳ Shap, silakan tunggu!',
  '⏳ Baiklah, sabar ya!',
  '⏳ Sedang diproses!',
  '⏳ Otw!',
];

const badwArr = [
  'Ngomong kasar ga ditemenin!',
  'Yo rasah nggo misuh cuk!',
  'Ga boleh gitu ya maniesssss ngomongnya!',
  'Tolong lah omonganmu cuk!',
  'Kamu kesepian Ya?',
  'Kamu jomblo ya, bicaranya jelek!',
  'Husttttt... Bicara yang cantik!',
];

const msg = {
  wait: rand(waitArr),
  error: {
    norm: '❌ Yah Maaf, Ada yang error! Coba lagi nanti ya!',
    admin: '⛔ Perintah ini cuma buat admin grup ya!',
    owner: '⛔ Ih kok bisa tau perintah owner si! gaboleh!',
    group: `⛔ Perintah ini cuma bisa dipake di grup ya!`,
    botAdm: '⛔ Naikin dulu jadi admin yaa botnya!',
  },
  success: {
    norm: 'Kalo kalian merasa BOT ini berguna / membantu kalian bisa donasi ya untuk membantu biaya server.\nHave nice yayy🥰',
    join: '✅ Berhasil berhasil horee!',
    sticker: 'Monggo stickernya😜',
    greeting:
      'Halo Gaes David Disini...\nEh maaf salah intro hihi🤭\n\nHalo Everyone! 👋\nKenalin, aku Cenayang Bot.\n\nNote:\nJangan call abang cenayang yaa, otomatis abang block nanti! 🚫\n\nSelain (/) abang juga akan merespon simbol berikut : \n/ ! $ . ,\n\nAbang juga jago matematika loh, kalian bisa gunakan prefix (=)\ncontoh: =10+2+4\n\nKalian bisa lakukan perintah *!menu* untuk menampilkan menu yang tersedia.\n\nTerima kasih sudah mau menggunakan bot pintar nan ganteng ini. ✨\n\nKalo kalian merasa bot ini berguna silahkan berdonasi yaa, kasihan soalnya ownernya sobat misqueen ga bisa bayar server huhu 🙈\n\nHowever literally ayo nyerah jangan semangat 🐣\nHave a bad dayy 🌧\n\nMaaciww...',
  },
  reaction: rand(badwArr),
};

const pReaction = {
  loading: '⏳',
  success: '👌',
  failed: '😓',
  info: '🤔',
};

const badwReaction = () => {
  return rand(badwArr);
};

module.exports = {
  msg,
  pReaction,
  badwReaction,
};
