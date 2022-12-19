const MENUS = [
  {
    title: 'Informasi Bot',
    rows: [
      {
        id: 'ping',
        title: 'Ping',
        description: 'Melakukan ping ke bot',
      },
      {
        id: 'info',
        title: 'Info',
        description: 'Mengetahui info bot',
      },
      {
        id: 'donasi',
        title: 'Donasi',
        description: 'Mengetahui info donasi',
      },
      {
        id: 'owner',
        title: 'Owner',
        description: 'Mengetahui info owner',
      },
    ],
  },
  {
    title: 'Media dan Sticker',
    rows: [
      {
        id: 'sticker',
        title: 'Sticker',
        description: 'Membuat sticker dari gambar',
      },
      {
        id: 'faceswap',
        title: 'Faceswap',
        description: 'Menukar wajah dengan orang lain',
      },
      {
        id: 'facetoon',
        title: 'Facetoon',
        description: 'Mengubah wajah menjadi kartun',
      },
      {
        id: 'jadianime',
        title: 'Jadi Anime',
        description: 'Mengubah foto jadi anime',
      },
    ],
  },
  {
    title: 'Automation dan Kegunaan',
    rows: [
      {
        id: 'ingetin',
        title: 'Ingetin',
        description: 'Membuat reminder atau pengingat',
      },
      {
        id: 'dl',
        title: 'Download Social Media',
        description:
          'Download dari semua social media (Instagram, Facebook, TikTok, Youtube, Twitter)',
      },
      {
        id: 'ytmp3',
        title: 'Download Youtube MP3',
        description: 'Download dari youtube sebagai mp3',
      },
      {
        id: 'nulis',
        title: 'Nulis',
        description: 'Ubah teks jadi nulis di kertas',
      },
    ],
  },
  {
    title: 'Fitur Grup dan Admin',
    rows: [
      {
        id: 'antikasar',
        title: 'Antikasar',
        description: 'Filter kata kata kasar',
      },
      {
        id: 'promote',
        title: 'Promote',
        description: 'Mempromosikan anggota sebagai admin',
      },
      {
        id: 'demote',
        title: 'Demote',
        description: 'Menurunkan anggota sebagai admin',
      },
      {
        id: 'kick',
        title: 'Kick',
        description: 'Menegeluarkan anggota dari grup',
      },
      {
        id: 'bye',
        title: 'Bye',
        description: 'Mengeluarkan BOT dari grup',
      },
    ],
  },
  {
    title: 'Fitur Lainnya',
    rows: [
      {
        id: 'mix',
        title: 'Emojimix',
        description: 'Mincampur 2 emoji',
      },
      {
        id: 'ssweb',
        title: 'Screenshoot Website',
        description: 'Screenshoot website',
      },
      {
        id: 'buatqr',
        title: 'Buat QR',
        description: 'Buat QRCode dari teks',
      },
      {
        id: 'gempa',
        title: 'Gempa',
        description: 'Data gempa BMKG terbaru',
      },
    ],
  },
];

const listMenu = simbol => {
  const prefix = '*LIST PERINTAH CENAYANG BOT V1.0*\n';
  const endfix =
    '\nNote:\nKalo dirasa bot ini keren / membantu kalian bisa berdonasi yaa. \n\nKasihan ownernya sobat misqueen hihi.. \n\nLove you...';
  let temp = '';

  function _splitMenu(arr = []) {
    let temp = '';

    for (let i = 0; i < arr.length; i++) {
      temp =
        temp +
        `${i == 0 ? '╔' : '╠'} _*${simbol}${arr[i].id}*_\n${
          i == arr.length - 1 ? '╚' : '╠'
        }► ${arr[i].description}\n${i == arr.length - 1 ? '' : '║'}\n`;
    }

    return temp;
  }

  for (let i = 0; i < MENUS.length; i++) {
    // menu\n
    temp = temp + `\n🔰 *${MENUS[i].title}* 🔰\n\n${_splitMenu(MENUS[i].rows)}`;
  }

  return prefix + temp + endfix;
};

module.exports = {
  listMenu,
  MENUS,
};
