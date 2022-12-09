const MENUS = [
  {
    category: 'Informasi Bot',
    menu: [
      {
        cmd: '!ping',
        desc: 'Mengetahui status bot',
      },
      {
        cmd: '!owner',
        desc: 'Mengetahui info owner',
      },
    ],
  },
  {
    category: 'Buat Sticker',
    menu: [
      {
        cmd: '!sticker',
        desc: 'Membuat sticker dari gambar',
      },
    ],
  },
  {
    category: 'Download dari Sosmed',
    menu: [
      {
        cmd: '!facebook',
        desc: 'Download video dari facebook',
      },
      {
        cmd: '!tiktok',
        desc: 'Download video dari tiktok',
      },
      {
        cmd: '!instagram',
        desc: 'Download video/reels dari Instagram',
      },
      {
        cmd: '!igstory',
        desc: 'Download story dari Instagram. contoh !igstory username urutanStory',
      },
    ],
  },
];

const listMenu = () => {
  const prefix = '*LIST PERINTAH GEDANG BOT V1.0*\n';
  const endfix =
    '\nBot Gedang juga menerima perintah dengan awalan #!?.$\nJangan lupa kasih donasi ya buat biaya server, kasihan developernya budak misqueen hihi. Ayo menyerah jangan semangat hihi... ';
  let temp = '';

  function _splitMenu(arr = []) {
    let temp = '';

    for (let i = 0; i < arr.length; i++) {
      temp = temp + `_*${arr[i].cmd}*_ --> ${arr[i].desc}\n`;
    }

    return temp;
  }

  for (let i = 0; i < MENUS.length; i++) {
    // menu\n
    temp =
      temp + `\n# *${MENUS[i].category}* #\n\n${_splitMenu(MENUS[i].menu)}`;
  }

  return prefix + temp + endfix;
};

module.exports = {
  listMenu,
};
