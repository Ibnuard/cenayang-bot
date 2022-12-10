const {MessageMedia} = require('whatsapp-web.js');
const {downloader, genMenu, db, text, art, misc} = require('../func');
const config = require('../config.json');

// ========================
//
//
//         basic bot
//
//
// ========================

const reply = (message, reply = '') => {
  return message.reply(reply);
};

const send = (client, message, reply, ops) => {
  return client.sendMessage(message.from, reply, ops);
};

// =================================================
//
//
//         fungsi bot umum
//
//
// ==================================================

//kirim ping
const ping = (client, message) => {
  const word =
    'Halo Gaes David Disini...\nEh maaf salah intro hihi🤭\n\nHalo Everyone! 👋\nKenalin, aku gedang.\n\nNote:\nJangan call abang yaa, otomatis abang block nanti! 🚫\n\nSelain (/) abang juga akan merespon simbol berikut : \n/ ! $ . ,\n\nAbang juga jago matematika loh, kalian bisa gunakan prefix (=)\ncontoh: =10+2+4\n\nKalian bisa lakukan perintah *!menu* untuk menampilkan menu yang tersedia.\n\nTerima kasih sudah mau menggunakan bot pintar nan ganteng ini. ✨\n\nKalo kalian merasa bot ini berguna silahkan berdonasi yaa, kasihan soalnya ownernya sobat misqueen ga bisa bayar server huhu 🙈\n\nHowever literally ayo nyerah jangan semangat 🐣\nHave a bad dayy 🌧\n\nMaaciww...';
  send(client, message, word);
};

//owener
const owner = (client, message) => {
  const word = '_Kontak Owner Bot_\n\nt.me/bluetterflys';
  send(client, message, word);
};

//menu
const menu = (client, message) => {
  const word = genMenu.listMenu();
  send(client, message, word);
};

//buat sticker
const sticker = async (client, message) => {
  if (message.hasMedia) {
    const media = await message.downloadMedia();
    reply(message, 'Sticker lagi otw dibikin yaa...');

    if (media) {
      send(client, message, media, {sendMediaAsSticker: true});
    }
  } else {
    console.log('Ga ada medianya...');
    const word =
      'Tidak ada gambar untuk dijadikan sticker, pilih gambar lalu tambahkan pesan !jadianime';
    reply(message, word);
  }
};

//download video fb
const downFB = async (client, message, value) => {
  reply(message, 'Videonya lagi di download bentar yaaww...');
  if (value) {
    downloader
      .fb(value)
      .then(async ({result}) => {
        const video = result?.VideoUrl;
        const media = await MessageMedia.fromUrl(video, {
          unsafeMime: true,
          filename: 'video.mp4',
        });
        send(client, message, media);
      })
      .catch(err => {
        console.log(err);
        send(
          client,
          message,
          '_Ada masalah nih, coba cek linknya ya atau coba lagi!_',
        );
      });
  } else {
    send(
      client,
      message,
      'Tidak ada url facebook terdeteksi,\n_contoh: !fb linkvideo_',
    );
  }
};

//download tiktok wm
const downTik = async (client, message, value) => {
  reply(message, 'Videonya lagi di download bentar yaaww...');
  if (value) {
    downloader
      .tik(value)
      .then(async ({result}) => {
        const video = result?.video;
        const media = await MessageMedia.fromUrl(video, {
          unsafeMime: true,
        });
        send(client, message, media);
      })
      .catch(err => {
        console.log(err);
        send(
          client,
          message,
          '_Ada masalah nih, coba cek linknya ya atau coba lagi!_',
        );
      });
  } else {
    send(client, message, 'Cara penggunaan : _!tt linkvideo_');
  }
};

//download tiktok wm
const downInsta = async (client, message, value) => {
  reply(message, 'Postingan/Reelsnya lagi di download bentar yaaww...');
  if (value) {
    downloader
      .insta(value)
      .then(async ({result}) => {
        console.log('result : ' + JSON.stringify(result));
        if (result) {
          for (let i = 0; i < result?.post?.length; i++) {
            const video = result.post[i].urlDownload;
            const media = await MessageMedia.fromUrl(video, {
              unsafeMime: true,
              filename: `insta-${result?.owner}.${
                result.post[i].type == 'image' ? 'jpeg' : 'mp4'
              }`,
            });
            send(client, message, media);
          }
        } else {
          send(
            client,
            message,
            '_Postingan/reels tidak ada atau akun di privat!_',
          );
        }
      })
      .catch(err => {
        console.log('ig : ' + err);
        send(
          client,
          message,
          '_Ada masalah nih, coba cek linknya ya atau coba lagi!_',
        );
      });
  } else {
    send(client, message, 'Cara penggunaan : _!ig linkPostingan_');
  }
};

//download tiktok wm
const downIGstory = async (client, message, value, extra) => {
  reply(
    message,
    'Storynya lagi di download bentar yaaww...\n gunakan perintah _!igs usernameIg_ untuk mendownload semua story yang ada.',
  );
  if (value) {
    downloader
      .instaStory(extra.length > 1 ? extra[0] : value)
      .then(async ({result}) => {
        if (!result?.error) {
          if (extra?.length) {
            const video = result.story?.itemlist[extra[1] - 1]?.urlDownload;
            const media = await MessageMedia.fromUrl(video, {
              unsafeMime: true,
              filename: `story-${result?.owner_username}-${extra}.${
                result.story?.itemlist[extra]?.type == 'video' ? 'mp4' : 'jpeg'
              }`,
            });
            send(client, message, media);
          } else {
            for (let i = 0; i < result.story.itemlist.length; i++) {
              const video = result.story?.itemlist[i]?.urlDownload;
              const media = await MessageMedia.fromUrl(video, {
                unsafeMime: true,
                filename: `story-${result?.owner_username}-${i}.${
                  result.story?.itemlist[extra]?.type == 'video'
                    ? 'mp4'
                    : 'jpeg'
                }`,
              });
              send(client, message, media);
            }
          }
        } else {
          send(client, message, '_Story tidak ada atau akun di privat!_');
        }
      })
      .catch(err => {
        console.log('igs : ' + err);
        send(
          client,
          message,
          '_Ada masalah nih, coba cek linknya ya atau coba lagi!_',
        );
      });
  } else {
    send(client, message, 'Cara penggunaan : _!igs linkvideo_');
  }
};

//download youtube
const downYT = async (client, message, type, value) => {
  reply(
    message,
    `${
      type == 'au' ? 'Audionya' : 'Videonya'
    } lagi di download bentar yaaww...`,
  );
  if (value) {
    downloader
      .ytdl(value)
      .then(async ({result}) => {
        const video = result?.UrlVideo;
        const audio = result?.UrlMp3;

        const media = await MessageMedia.fromUrl(type == 'au' ? audio : video, {
          unsafeMime: true,
          filename: `${result.title}.${type == 'au' ? 'mp3' : 'mp4'}`,
        });
        send(client, message, media);
      })
      .catch(err => {
        console.log(err);
        send(
          client,
          message,
          '_Ada masalah nih, coba cek linknya ya atau coba lagi!_',
        );
      });
  } else {
    send(client, message, 'Cara penggunaan : _!ytmp4 linkvideo_');
  }
};

//teks ke gif
const txToGif = async (client, message, value) => {
  reply(message, 'Lagi di proses yaw...');
  if (value) {
    const url = text.textToGif(value);
    const media = await MessageMedia.fromUrl(url, {
      unsafeMime: true,
      filename: 'image.gif',
    });
    send(client, message, media);
  } else {
    send(client, message, 'Cara penggunaan : _!text2gif halo ganteng_');
  }
};

//teks ke nulis
const txToNulis = async (client, message, value) => {
  reply(message, 'Lagi di proses yaw...');
  if (value) {
    const url = text.nulis(value);
    const media = await MessageMedia.fromUrl(url, {
      unsafeMime: true,
    });
    send(client, message, media);
  } else {
    send(client, message, 'Cara penggunaan : _!nulis ini tulisan abang_');
  }
};

//teks ke nulis
const txToQR = async (client, message, value) => {
  reply(message, 'Lagi di proses yaw...');
  if (value) {
    const url = text.qrcode(value);
    const media = await MessageMedia.fromUrl(url, {
      unsafeMime: true,
    });
    send(client, message, media);
  } else {
    send(client, message, 'Cara penggunaan : _!buatqr www.google.com_');
  }
};

//teks ke nulis
const txToHartaTahta = async (client, message, value) => {
  reply(message, 'Lagi di proses yaw...');
  if (value) {
    const url = text.hartatahta(value);
    const media = await MessageMedia.fromUrl(url, {
      unsafeMime: true,
    });
    send(client, message, media);
  } else {
    send(client, message, 'Cara penggunaan : _!hartatahta melisa_');
  }
};

//teks ke nulis
const ssWeb = async (client, message, value) => {
  reply(message, 'Lagi di proses yaw...');
  if (value) {
    const url = misc.ssWeb(value);
    const media = await MessageMedia.fromUrl(url, {
      unsafeMime: true,
    });
    send(client, message, media);
  } else {
    send(client, message, 'Cara penggunaan : _!ssweb www.google.com_');
  }
};

//teks ke nulis
const puisi = async (client, message) => {
  reply(message, 'Lagi di proses yaw...');
  const url = misc.puisi();
  const media = await MessageMedia.fromUrl(url, {
    unsafeMime: true,
  });
  send(client, message, media);
};

//teks ke logo esports
const txToLogoEsp = async (client, message, value) => {
  reply(message, 'Lagi di proses yaw...');
  if (value) {
    const url = text.logoEsp(value);
    const media = await MessageMedia.fromUrl(url, {
      unsafeMime: true,
    });
    send(client, message, media);
  } else {
    send(client, message, 'Cara penggunaan : _!logo squadKece_');
  }
};

//teks ke gif
const txToPhub = async (client, message, value, extra) => {
  reply(message, 'Lagi di proses yaw...');
  if (extra) {
    const url = text.pHub(extra[0], extra[1]);
    const media = await MessageMedia.fromUrl(url, {
      unsafeMime: true,
    });
    send(client, message, media);
  } else {
    send(client, message, 'Cara penggunaan : _!logoPhub teks1 teks2_');
  }
};

//chord
const chord = async (client, message, value) => {
  reply(message, 'Lagi nyari lagunya bentar yaw...');
  if (value) {
    art
      .chord(value)
      .then(async ({result}) => {
        if (result.result) {
          send(client, message, result.result);
        } else {
          send(
            client,
            message,
            '_Ada masalah nih, coba cek judl lagunya ya atau coba lagi!_',
          );
        }
      })
      .catch(err => {
        console.log(err);
        send(
          client,
          message,
          '_Ada masalah nih, coba cek judul lagunya ya atau coba lagi!_',
        );
      });
  } else {
    send(client, message, 'Cara penggunaan : _!chord sayang_');
  }
};

//chord
const lirik = async (client, message, value) => {
  reply(message, 'Lagi nyari lagunya bentar yaw...');
  if (value) {
    art
      .lirik(value)
      .then(async ({result}) => {
        if (result.result) {
          send(client, message, result.result);
        } else {
          send(
            client,
            message,
            '_Ada masalah nih, coba cek judul lagunya ya atau coba lagi!_',
          );
        }
      })
      .catch(err => {
        console.log(err);
        send(
          client,
          message,
          '_Ada masalah nih, coba cek judul lagunya ya atau coba lagi!_',
        );
      });
  } else {
    send(client, message, 'Cara penggunaan : _!lirik sayang_');
  }
};

//chord
const hitung = async (client, message, value) => {
  if (value) {
    misc
      .hitung(value)
      .then(async ({result}) => {
        if (result.data) {
          reply(message, `${result?.data}\n\n${result?.info}`);
        }
      })
      .catch(err => {
        console.log(err);
        send(client, message, '_Ada masalah nih, mohon coba lagi ya!_');
      });
  } else {
    send(client, message, 'Cara penggunaan : _=10*5:4+2-1_');
  }
};

const gempa = async (client, message) => {
  reply(message, 'Alat pendeteksi gempa....');
  misc
    .gempa()
    .then(async ({result}) => {
      if (result) {
        const data = result[0];
        const word = `GEMPA TERBARU\n\nJam : ${data?.Jam} - ${data?.Tanggal}\nKedalaman : ${data?.Kedalaman}\nWilayah : ${data?.Wilayah}\nMagnitude : ${data?.magnitude}`;
        send(client, message, word);
      }
    })
    .catch(err => {
      console.log(err);
      send(client, message, '_Ada masalah nih, mohon coba lagi ya!_');
    });
};

const pantun = async (client, message) => {
  misc
    .pantun()
    .then(async ({result}) => {
      if (result.pantun) {
        reply(message, `${result?.pantun}`);
      }
    })
    .catch(err => {
      console.log(err);
      send(client, message, '_Ada masalah nih, mohon coba lagi ya!_');
    });
};

const quotes = async (client, message) => {
  misc
    .quotes()
    .then(async ({result}) => {
      if (result.kata) {
        reply(message, `${result?.kata}`);
      }
    })
    .catch(err => {
      console.log(err);
      send(client, message, '_Ada masalah nih, mohon coba lagi ya!_');
    });
};

const resep = async (client, message, value) => {
  reply(message, 'Bentar yaaa mas bot yang ganteng lagi cari resepnya');

  if (value) {
    misc
      .resep(value)
      .then(async ({result}) => {
        if (result) {
          const word = `${result?.title}\n\nBahan: \n${result?.bahan}\n\nCara Pembuatan: ${result?.cara}`;
          const media = await MessageMedia.fromUrl(result?.image, {
            unsafeMime: true,
          });

          send(client, message, media, {caption: word});
        }
      })
      .catch(err => {
        console.log(err);
        send(
          client,
          message,
          '_Ada masalah nih atau resep tidak ditemukan, mohon coba lagi ya!_',
        );
      });
  } else {
    send(client, message, 'Cara penggunaan : _!resep rawon_');
  }
};

// =================================================
//
//
//         fungsi bot owner
//
//
// ==================================================

//kirim ping
const joinGroupPremium = async (client, message, value) => {
  const groupUrl = value;
  const inviteCode = groupUrl.replace('https://chat.whatsapp.com/', '');

  const owner = config.owner;

  if (message.from == owner) {
    try {
      await client.acceptInvite(inviteCode);
      send(client, message, 'Bos join grup sukses! misi selesai!');
    } catch (e) {
      send(client, message, 'Bos join grup gagal! misi gagal!');
    }
  } else {
    send(
      client,
      message,
      'Ga boleh nakal yaa, perintah ini hanya boleh dilakuin sama owner ganteng!!',
    );
  }

  //db.saveData('premium', message.from);
};

//load data
const premiumList = (client, message) => {
  db.loadData('premium');
};

module.exports = {
  reply,
  send,
  ping,
  owner,
  sticker,
  menu,
  downFB,
  downTik,
  downInsta,
  downIGstory,
  downYT,
  joinGroupPremium,
  premiumList,
  txToGif,
  txToLogoEsp,
  txToNulis,
  txToPhub,
  chord,
  lirik,
  txToQR,
  txToHartaTahta,
  ssWeb,
  puisi,
  hitung,
  gempa,
  pantun,
  quotes,
  resep,
};
