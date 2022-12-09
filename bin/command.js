const {MessageMedia} = require('whatsapp-web.js');
const {downloader, genMenu, db} = require('../func');

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
    'Halo saya adalah Bot Gedang, Gedang berarti pisang, gak tau developer saya emang suka lawak. Mas developer yang ganteng tolong kalo buat bot jangan lawak namanya hihi, kalo mau kontaknya bisa pake perintah !owner';
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
        send(client, message, '_Error nih bos sorry, devnya ga jago!_');
      });
  } else {
    send(
      client,
      message,
      'Tidak ada url facebook terdeteksi,\n_contoh: !facebook linkvideo_',
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
        console.log('tiktokwm: ' + err);
        send(client, message, '_Error nih bos sorry, devnya ga jago!_');
      });
  } else {
    send(
      client,
      message,
      'Tidak ada url tiktok terdeteksi,\n_contoh: !tiktok linkvideo_',
    );
  }
};

//download tiktok wm
const downInsta = async (client, message, value) => {
  reply(message, 'Videonya lagi di download bentar yaaww...');
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
          send(client, message, '_Video/reels tidak ada atau akun di privat!_');
        }
      })
      .catch(err => {
        console.log('ig : ' + err);
        send(client, message, '_Error nih bos sorry, devnya ga jago!_');
      });
  } else {
    send(
      client,
      message,
      'Tidak ada url tiktok terdeteksi,\n_contoh: !tiktok linkvideo_',
    );
  }
};

//download tiktok wm
const downIGstory = async (client, message, value, extra) => {
  reply(
    message,
    'Storynya lagi di download bentar yaaww...\n gunakan perintah _!igstory usernameIg_ untuk mendownload semua story yang ada.',
  );
  if (value) {
    downloader
      .instaStory(value)
      .then(async ({result}) => {
        if (result) {
          if (extra?.length) {
            const video = result.story?.itemlist[extra - 1]?.urlDownload;
            const media = await MessageMedia.fromUrl(video, {
              unsafeMime: true,
              filename: `story-${result?.owner_username}-${extra}.${
                result.story?.itemlist[extra]?.type == 'video' ? 'mp4' : 'jpeg'
              }`,
            });
            send(client, message, media);
          } else {
            console.log('c:' + result.story.itemlist.length);
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
        send(client, message, '_Error nih bos sorry, devnya ga jago!_');
      });
  } else {
    send(
      client,
      message,
      'Tidak ada url tiktok terdeteksi,\n_contoh: !tiktok linkvideo_',
    );
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
const addGroupPremium = async (client, message) => {
  const word = 'Sukses menambahkan grup ke premium bos!';
  await db.saveData('premium', message.from);
  send(client, message, word);
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
  addGroupPremium,
};
