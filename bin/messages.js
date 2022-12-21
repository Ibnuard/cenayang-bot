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
  'Ya lambe mu cuk dijaga!',
  'Sayang ga boleh ngomong kasar ya!',
  'Husttt bocil bocil toxic!',
  'Inget ibumu dirumah nak!',
  'Ibumu masih sayang kamu?',
];

const msg = {
  wait: rand(waitArr),
  error: {
    norm: '❌ Yah maaf ada yang error! Coba lagi ya!',
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

const botTermsCondition = [
  '1. Bot tidak akan menyimpan media atau chat yang kalian kirimkan',
  '2. Owner bot tidak akan mengetahui chat yang kalian kirimkan',
  '3. Bot berjalan di server tanpa perangkat',
  '4. Bot tidak akan bertanggungjawab dengan apa yang dikirimkan',
  '5. Bot akan di reset setiap jam 1 pagi',
  '6. *Bot akan selalu aktif jika donasi kalian lancar hehe*',
];

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
  botTermsCondition,
};
