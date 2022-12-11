const {MessageMedia} = require('whatsapp-web.js');
const {downloader, genMenu, db, text, art, misc, reminder} = require('../func');
const config = require('../config.json');
const {dLog} = require('../tools/log');
const moment = require('moment');
const {msg} = require('./messages');
moment.locale('id');

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
  const word = msg.success.greeting;
  send(client, message, word);
};

//owener
const owner = (client, message) => {
  const word = '_Kontak Owner Bot_\n\nt.me/bluetterflys';
  send(client, message, word);
};

const donasi = (client, message) => {
  const word =
    'Halo Gaes untuk kalian yang mau donasi / menambahkan bot ini ke grup kalian bisa kirim lewat aplikasi berikut ya : \n\n*OVO : 085741894533*\n*DANA : 085741894533*\n\nAtau kalian bisa hubungin telegram owner ya.\nDonasi kalian sangat membantu untuk biaya server, maklum ownernya sobat misqueen hihi.\n\nHave nice yayyyy!!\nTerima kasih.';
  send(client, message, word);
};

//menu
const menu = (client, message) => {
  const word = genMenu.listMenu();
  send(client, message, word);
};

//buat sticker
const sticker = async (client, message) => {
  if (message.hasQuotedMsg) {
    const qMsg = await message.getQuotedMessage();
    if (qMsg.hasMedia) {
      const media = await qMsg.downloadMedia();
      reply(qMsg, msg.wait);

      if (media) {
        send(client, qMsg, media, {sendMediaAsSticker: true});
      }
    } else {
      dLog('STICKER', message.from, true, 'NO MEDIA DETECTED');
      const word =
        'Tidak ada gambar/video/gif untuk dijadikan sticker, pilih gambar lalu tambahkan pesan !sticker';
      reply(message, word);
    }
  } else {
    if (message.hasMedia) {
      const media = await message.downloadMedia();
      reply(message, msg.wait);

      if (media) {
        send(client, message, media, {sendMediaAsSticker: true});
      }
    } else {
      dLog('STICKER', message.from, true, 'NO MEDIA DETECTED');
      const word =
        'Tidak ada gambar/video/gif untuk dijadikan sticker, pilih gambar lalu tambahkan pesan !sticker';
      reply(message, word);
    }
  }
};

//download video fb
const downFB = async (client, message, value) => {
  if (value) {
    reply(message, msg.wait);
    downloader
      .fb(value)
      .then(async ({result}) => {
        const video = await result?.VideoUrl;
        const media = await MessageMedia.fromUrl(video, {
          unsafeMime: true,
          filename: 'video.mp4',
        });
        await send(client, message, media, {sendMediaAsDocument: true});
      })
      .catch(err => {
        dLog('FACEBOOK', message.from, true, 'ERR : ' + err);
        send(client, message, msg.error.norm);
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
  if (value) {
    reply(message, msg.wait);
    downloader
      .tik(value)
      .then(async ({result}) => {
        const video = result?.video;
        const media = await MessageMedia.fromUrl(video, {
          filename: 'tiktok.mp4',
          unsafeMime: true,
        });
        send(client, message, media, {sendMediaAsDocument: true});
      })
      .catch(err => {
        dLog('TIKTOK', message.from, true, 'ERR : ' + err);
        send(client, message, msg.error.norm);
      });
  } else {
    send(client, message, 'Cara penggunaan : _!tt linkvideo_');
  }
};

//download tiktok wm
const downInsta = async (client, message, value) => {
  if (value) {
    reply(message, msg.wait);
    downloader
      .insta(value)
      .then(async ({result}) => {
        if (result) {
          for (let i = 0; i < result?.post?.length; i++) {
            const video = result.post[i].urlDownload;
            const media = await MessageMedia.fromUrl(video, {
              unsafeMime: true,
              filename: `insta-${result?.owner}.${
                result.post[i].type == 'image' ? 'jpeg' : 'mp4'
              }`,
            });
            send(client, message, media, {sendMediaAsDocument: true});
          }
        } else {
          send(client, message, msg.error.norm);
        }
      })
      .catch(err => {
        dLog('IG', message.from, true, 'ERR : ' + err);
        send(client, message, msg.error.norm);
      });
  } else {
    send(client, message, 'Cara penggunaan : _!ig linkPostingan_');
  }
};

//download tiktok wm
const downIGstory = async (client, message, value, extra) => {
  if (value) {
    reply(
      message,
      `${msg.wait}\n gunakan perintah _!igs usernameIg_ untuk mendownload semua story yang ada.`,
    );
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
            send(client, message, media, {sendMediaAsDocument: true});
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
              send(client, message, media, {sendMediaAsDocument: true});
            }
          }
        } else {
          send(client, message, msg.error.norm);
        }
      })
      .catch(err => {
        dLog('IGS', message.from, true, 'ERR : ' + err);
        send(client, message, msg.error.norm);
      });
  } else {
    send(client, message, 'Cara penggunaan : _!igs linkvideo_');
  }
};

//download youtube
const downYT = async (client, message, type, value) => {
  if (value) {
    reply(message, msg.wait);
    downloader
      .ytdl(value)
      .then(async ({result}) => {
        const video = await result?.UrlVideo;
        const audio = await result?.UrlMp3;

        const media = await MessageMedia.fromUrl(type == 'au' ? audio : video, {
          unsafeMime: true,
          filename: `${result.title}.${type == 'au' ? 'mp3' : 'mp4'}`,
        });
        await send(client, message, media, {sendMediaAsDocument: true});
      })
      .catch(err => {
        dLog('YOUTUBE', message.from, true, 'ERR : ' + err);
        send(client, message, msg.error.norm);
      });
  } else {
    send(client, message, 'Cara penggunaan : _!ytmp4 linkvideo_');
  }
};

//teks ke gif
const txToGif = async (client, message, value) => {
  if (value) {
    reply(message, msg.wait);
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
  if (value) {
    reply(message, msg.wait);
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
  if (value) {
    reply(message, msg.wait);
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
  if (value) {
    reply(message, msg.wait);
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
  if (value) {
    reply(message, msg.wait);
    const url = misc.ssWeb(value);
    const media = await MessageMedia.fromUrl(url, {
      unsafeMime: true,
    });
    send(client, message, media);
  } else {
    send(client, message, 'Cara penggunaan : _!ssweb www.google.com_');
  }
};

//teks ke logo esports
const txToLogoEsp = async (client, message, value) => {
  if (value) {
    reply(message, msg.wait);
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
  if (extra) {
    reply(message, msg.wait);
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
        dLog('CALCULATOR', message.from, true, 'ERR : ' + err);
        send(client, message, '_Ada masalah nih, mohon coba lagi ya!_');
      });
  } else {
    send(client, message, 'Cara penggunaan : _=10*5:4+2-1_');
  }
};

const gempa = async (client, message) => {
  reply(message, msg.wait);
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
      dLog('GEMPA', message.from, true, 'ERR : ' + err);
      send(client, message, msg.error.norm);
    });
};

const resep = async (client, message, value) => {
  if (value) {
    reply(message, msg.wait);
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
        dLog('RESEP', message.from, true, 'ERR : ' + err);
        send(
          client,
          message,
          '_Resep tidak ditemukan, coba cari resep lain ya!',
        );
      });
  } else {
    send(client, message, 'Cara penggunaan : _!resep rawon_');
  }
};

//kirim ping
const ingetin = (client, message, value, extra) => {
  const word =
    'Cara penggunaan ingetin : \n\nBedasarkan tanggal:\n\n _!ingetin [tanggal/bulan/tahun/jam/menit] ingetin makan_  \n\ndeskripsi -> bakal kirim chat sesuai pada tanggal yang diatur\n\nRelative: \n\n_!ingetin [besok/lusa] ulang tahun emak_ \n\n_!ingetin [besok/jam/menit] makan_\n\n_!ingetin [lusa/jam/menit] ketemu doi_ \n\ndeskripsi -> bakal kirim chat besok atau lusa\n\nHari ini: \n\n_!ingetin [harini/13/00] sholat_\n\ndeskripsi -> bakal kirim chat hari ini di jam/menit yang telah diatur';
  if (value) {
    if (value == 'list') {
      const result = reminder.reminderList(message.from);
      if (result == 'NO_DATA') {
        reply(message, 'Belum ada pengingat dibuat!');
      } else {
        reply(message, result);
      }
    } else {
      if (extra.length > 1 && extra[0] == 'hapus') {
        if (extra[1].length) {
          const result = reminder.deleteReminder(message.from, extra[1]);

          if (result == 'SUCCESS') {
            reply(
              message,
              `Pengingat dengan ID ${extra[1]} berhasil dihapus yaww!`,
            );
          } else {
            reply(
              message,
              `Pengingat dengan ID ${extra[1]} salah atau tidak ditemukan, mohon coba lagi!`,
            );
          }
        } else {
          reply(
            message,
            `Cara menghapus pengingat : _!ingetin hapus R12_\n\nR12 adalah id pengingat yang akan dihapus!`,
          );
        }
      } else {
        const remind = reminder.handleReminder(client, message, value);
        if (remind?.id?.length) {
          reply(
            message,
            `Pengingat udah diatur di ${moment(
              remind?.datetime,
            ).calendar()}, nanti aku ingetin yawww...!\n\nGunakan perintah _!ingetin list_ untuk melihat semua pengingat yang dibuat.`,
          );
          send(
            client,
            message,
            'Kalo kalian merasa BOT ini berguna / membantu kalian bisa donasi ya untuk membantu biaya server.\nHave nice yayy...',
          );
        } else if (remind == 'ERROR_DATE') {
          reply(message, `Tanggal tidak valid yaww, Mohon diecek kembali OK!`);
        } else {
          reply(
            message,
            `Format perintah salah yaww, kalian bisa gunakan perintah _!ingetin_ untuk lihat formatnya.`,
          );
        }
      }
    }
  } else {
    reply(message, word);
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
  txToQR,
  txToHartaTahta,
  ssWeb,
  hitung,
  gempa,
  resep,
  donasi,
  ingetin,
};
