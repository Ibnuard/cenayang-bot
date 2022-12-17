const {MessageMedia, List, Buttons} = require('whatsapp-web.js');

//NON PACKAGE
const {
  genMenu,
  db,
  text,
  misc,
  reminder,
  imageManipulation,
  user,
  group,
  scraper,
} = require('../func');
const config = require('../config.json');
const moment = require('moment');
const {msg, pReaction, badwReaction} = require('./messages');
const katabot = require('../database/group/katabot.json');
const {randomInt, generateQRCode} = require('../tools/utils');
const {utils} = require('../tools');
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
const ping = async (client, message) => {
  await message.react(pReaction.loading);
  const word = `Pongg Pongg!!!`;
  send(client, message, word).then(async () => {
    await message.react(pReaction.success);
  });
};

//kirim info bot
const info = async (client, message) => {
  const word = msg.success.greeting;
  await message.react(pReaction.loading);
  send(client, message, word).then(async () => {
    await message.react(pReaction.success);
  });
};

//owener
const owner = async (client, message) => {
  await message.react(pReaction.loading);
  const word = '_Kontak Owner Bot_\n\nt.me/bluetterflys';
  send(client, message, word).then(async () => {
    await message.react(pReaction.success);
  });
};

const donasi = async (client, message) => {
  await message.react(pReaction.loading);
  const word =
    'Halo Gaes untuk kalian yang mau donasi / menambahkan bot ini ke grup kalian bisa kirim lewat aplikasi berikut ya : \n\n*OVO : 085741894533*\n*DANA : 085741894533*\n\nAtau kalian bisa hubungin t.me/bluetterflys di telegram ya.\nDonasi kalian sangat membantu untuk biaya server, maklum ownernya sobat misqueen hihi.\n\nHave nice yayyyy!!\nTerima kasih.';
  send(client, message, word).then(async () => {
    await message.react(pReaction.success);
  });
};

//menu
const menu = async (client, message) => {
  await message.react(pReaction.loading);
  let button = new Buttons(
    'CENAYANG BOT MENU',
    [
      {id: '!menuteks', body: 'Menu Teks'},
      {id: '!menubutton', body: 'Menu Tombol'},
    ],
    'Pilih tipe menu',
  );

  await client.sendMessage(message.from, button);
};

//menu
const menuTeks = async (client, message, prefix) => {
  await message.react(pReaction.loading);
  const word = genMenu.listMenu(prefix);
  send(client, message, word).then(async () => {
    await message.react(pReaction.success);
  });
};

//menu tombol
const menuTombol = async (client, message) => {
  await message.react(pReaction.loading);
  const list = genMenu.MENUS;
  send(client, message, list).then(async () => {
    await message.react(pReaction.success);
  });
};

//buat sticker
const sticker = async (client, message) => {
  await message.react(pReaction.loading);
  if (message.hasQuotedMsg) {
    const qMsg = await message.getQuotedMessage();
    if (qMsg.hasMedia) {
      const media = await qMsg.downloadMedia();

      if (media) {
        send(client, qMsg, media, {
          sendMediaAsSticker: true,
          stickerAuthor: 'CenayangBOT',
          stickerName: 'cenAyangSticker',
        }).then(async () => {
          await onCommandStatus(client, message, 'success');
        });
      }
    } else {
      const word =
        'Tidak ada gambar/video/gif untuk dijadikan sticker, pilih gambar lalu tambahkan pesan !sticker';
      reply(message, word).then(async () => {
        await message.react(pReaction.failed);
      });
    }
  } else {
    await message.react(pReaction.loading);
    if (message.hasMedia) {
      const media = await message.downloadMedia();

      if (media) {
        send(client, message, media, {
          sendMediaAsSticker: true,
          stickerAuthor: 'CenayangBOT',
          stickerName: 'cenAyangSticker',
        }).then(async () => {
          await onCommandStatus(client, message, 'success');
        });
      }
    } else {
      const word =
        'Tidak ada gambar/video/gif untuk dijadikan sticker, pilih gambar lalu tambahkan pesan !sticker';
      reply(message, word).then(async () => {
        await message.react(pReaction.failed);
      });
    }
  }
};

//download all media
const allMediaDownload = async (client, message, value, browser) => {
  await message.react(pReaction.loading);

  if (!value) {
    return send(
      client,
      message,
      'Cara penggunaan : _!dl <link ig/igstory/fb/tiktok/yt/twitter>_',
    ).then(async () => {
      await message.react(pReaction.info);
    });
  }

  await send(client, message, 'Sebentar yaa lagi di proses kok...');

  try {
    const social = await scraper.allDownloader(browser, value);
    if (social.status == 200) {
      social.media.forEach(async (item, index) => {
        const media = await MessageMedia.fromUrl(item.link, {
          unsafeMime: true,
          filename: item.filename,
        });

        if (media) {
          await client
            .sendMessage(message.from, media, {
              caption: 'Downloaded by Cenayang BOT',
              sendMediaAsDocument:
                utils.toMB(media.filesize) >= 15 ? true : false,
            })
            .then(async () => {
              if (index == social.media.length - 1) {
                await onCommandStatus(client, message, 'success');
              }
            });
        }
      });
    } else {
      await onCommandStatus(client, message, 'failed');
    }
  } catch (error) {
    await onCommandStatus(client, message, 'failed');
  }
};

//download all media
const ytmp3 = async (client, message, value, browser) => {
  await message.react(pReaction.loading);

  if (!value) {
    return send(
      client,
      message,
      'Cara penggunaan : _!ytmp3 <link youtube>_',
    ).then(async () => {
      await message.react(pReaction.info);
    });
  }

  await send(client, message, 'Sebentar yaa lagi di proses kok...');

  try {
    const youtube = await scraper.ytmp3(browser, value);
    if (youtube.status == 200) {
      const media = await MessageMedia.fromUrl(youtube.media.url, {
        unsafeMime: true,
        filename: youtube.media.title + '.mp3',
      });

      if (media) {
        await client
          .sendMessage(message.from, media, {
            caption: youtube.media.title + '\n\nDownloaded by Cenayang BOT',
            sendMediaAsDocument:
              utils.toMB(media.filesize) >= 15 ? true : false,
          })
          .then(async () => {
            await onCommandStatus(client, message, 'success');
          });
      }
    } else {
      await onCommandStatus(client, message, 'failed');
    }
  } catch (error) {
    console.log(error);
    await onCommandStatus(client, message, 'failed');
  }
};

//teks ke nulis
const txToNulis = async (browser, client, message, value, extra) => {
  await message.react(pReaction.loading);

  if (!value) {
    return await send(
      client,
      message,
      'Cara penggunaan : _!nulis nama_kamu ini isi tulisan_\n\nGunakan _ untuk pengganti spasi pada nama.',
    ).then(async () => {
      await message.react(pReaction.info);
    });
  }

  try {
    const name = extra[0];

    let content = '';

    for (let i = 1; i < extra.length; i++) {
      content = content + extra[i] + ' ';
    }

    const nulis = await scraper.nulis(browser, name, content);
    if (nulis) {
      const qrBase64 = await nulis.media.replace('data:image/png;base64,', '');
      const media = new MessageMedia('image/jpeg', qrBase64);

      if (media) {
        await client.sendMessage(message.from, media).then(async () => {
          await onCommandStatus(client, message, 'success');
        });
      }
    } else {
      await onCommandStatus(client, message, 'failed');
    }
  } catch (error) {
    console.log(error);
    await onCommandStatus(client, message, 'failed');
  }
};

//teks ke nulis
const txToQR = async (client, message, value) => {
  await message.react(pReaction.loading);

  if (!value) {
    return await send(
      client,
      message,
      'Cara penggunaan : _!buatqr www.google.com_',
    ).then(async () => {
      await message.react(pReaction.info);
    });
  }

  try {
    const qr = await generateQRCode(value);
    if (qr) {
      const qrBase64 = await qr.replace('data:image/png;base64,', '');
      const media = new MessageMedia('image/jpeg', qrBase64);

      if (media) {
        await client.sendMessage(message.from, media).then(async () => {
          await onCommandStatus(client, message, 'success');
        });
      }
    } else {
      await onCommandStatus(client, message, 'failed');
    }
  } catch (error) {
    console.log(error);
    await onCommandStatus(client, message, 'failed');
  }
};

//teks ke nulis
const ssWeb = async (browser, client, message, value) => {
  await message.react(pReaction.loading);
  if (!value) {
    return await send(
      client,
      message,
      'Cara penggunaan : _!ssweb www.google.com_',
    ).then(async () => {
      await message.react(pReaction.info);
    });
  }

  try {
    const ss = await scraper.ssweb(browser, value);
    if (ss.status == 200) {
      const media = new MessageMedia('image/jpeg', ss.media);

      if (media) {
        await client.sendMessage(message.from, media).then(async () => {
          await onCommandStatus(client, message, 'success');
        });
      }
    } else {
      await onCommandStatus(client, message, 'failed');
    }
  } catch (error) {
    console.log(error);
    await onCommandStatus(client, message, 'failed');
  }
};

//teks ke logo esports
const txToLogoEsp = async (client, message, value) => {
  await message.react(pReaction.loading);
  if (value) {
    const url = text.logoEsp(value);
    const media = await MessageMedia.fromUrl(url, {
      unsafeMime: true,
    });
    send(client, message, media).then(async () => {
      await message.react(pReaction.success);
    });
  } else {
    send(client, message, 'Cara penggunaan : _!logo squadKece_').then(
      async () => {
        await message.react(pReaction.info);
      },
    );
  }
};

//chord
const hitung = async (client, message, value) => {
  await message.react(pReaction.loading);
  const result = misc.calculator(value);
  if (result !== 'NOT_VALID') {
    reply(message, `${value}=${result}`).then(async () => {
      await message.react(pReaction.success);
    });
  } else {
    const word =
      'Cara penggunaan fitur kalkulator' +
      '\n\nGunakan prefix = untuk menggunakan fitur kalkulator.' +
      '\n\nSimbol : ' +
      '\n\n+ untuk operasi penjumlahan' +
      '\n- untuk operasi pengurangan' +
      '\n/ untuk operasi pembagian' +
      '\n* untuk operasi perkalian' +
      '\n\nContoh : =10*5/2+2-10';
    send(client, message, word).then(async () => {
      await message.react(pReaction.info);
    });
  }
};

const gempa = async (client, message) => {
  await message.react(pReaction.loading);

  misc
    .gempa()
    .then(async ({result}) => {
      if (result) {
        const data = result[0];
        const word = `GEMPA TERBARU\n\nJam : ${data?.Jam} - ${data?.Tanggal}\nKedalaman : ${data?.Kedalaman}\nWilayah : ${data?.Wilayah}\nMagnitude : ${data?.magnitude}`;
        send(client, message, word).then(async () => {
          await message.react(pReaction.success);
        });
      }
    })
    .catch(err => {
      send(client, message, msg.error.norm).then(async () => {
        await message.react(pReaction.failed);
      });
    });
};

//kirim ping
const ingetin = async (client, message, value, extra) => {
  await message.react(pReaction.loading);
  const word =
    'Cara penggunaan ingetin : \n\nBedasarkan tanggal:\n\n _!ingetin [tanggal/bulan/tahun/jam/menit] ingetin makan_  \n\ndeskripsi -> bakal kirim chat sesuai pada tanggal yang diatur\n\nRelative: \n\n_!ingetin [besok/lusa] ulang tahun emak_ \n\n_!ingetin [besok/jam/menit] makan_\n\n_!ingetin [lusa/jam/menit] ketemu doi_ \n\ndeskripsi -> bakal kirim chat besok atau lusa\n\nHari ini: \n\n_!ingetin [harini/13/00] sholat_\n\ndeskripsi -> bakal kirim chat hari ini di jam/menit yang telah diatur';
  if (value) {
    if (value == 'list') {
      const result = reminder.reminderList(message.from);
      if (result == 'NO_DATA') {
        reply(message, 'Belum ada pengingat dibuat!').then(async () => {
          await message.react(pReaction.success);
        });
      } else {
        reply(message, result).then(async () => {
          await message.react(pReaction.success);
        });
      }
    } else {
      if (extra.length > 1 && extra[0] == 'hapus') {
        if (extra[1].length) {
          const result = reminder.deleteReminder(message.from, extra[1]);

          if (result == 'SUCCESS') {
            reply(
              message,
              `Pengingat dengan ID ${extra[1]} berhasil dihapus yaww!`,
            ).then(async () => {
              await message.react(pReaction.success);
            });
          } else {
            reply(
              message,
              `Pengingat dengan ID ${extra[1]} salah atau tidak ditemukan, mohon coba lagi!`,
            ).then(async () => {
              await message.react(pReaction.failed);
            });
          }
        } else {
          reply(
            message,
            `Cara menghapus pengingat : _!ingetin hapus R12_\n\nR12 adalah id pengingat yang akan dihapus!`,
          ).then(async () => {
            await message.react(pReaction.info);
          });
        }
      } else {
        const remind = reminder.handleReminder(client, message, value);
        if (remind?.id?.length) {
          reply(
            message,
            `Pengingat udah diatur di ${moment(
              remind?.datetime,
            ).calendar()}, nanti aku ingetin yawww...!\n\nGunakan perintah _!ingetin list_ untuk melihat semua pengingat yang dibuat.`,
          ).then(async () => {
            await message.react(pReaction.success);
          });
          send(
            client,
            message,
            'Kalo kalian merasa BOT ini berguna / membantu kalian bisa donasi ya untuk membantu biaya server.\nHave nice yayy...',
          );
        } else if (remind == 'ERROR_DATE') {
          reply(
            message,
            `Tanggal tidak valid yaww, Mohon diecek kembali OK!`,
          ).then(async () => {
            await message.react(pReaction.failed);
          });
        } else {
          reply(
            message,
            `Format perintah salah yaww, kalian bisa gunakan perintah _!ingetin_ untuk lihat formatnya.`,
          ).then(async () => {
            await message.react(pReaction.failed);
          });
        }
      }
    }
  } else {
    reply(message, word).then(async () => {
      await message.react(pReaction.failed);
    });
  }
};

//load data
const antikasar = (client, message, value, chat) => {
  if (chat.isGroup) {
    const admin = isAdmin(message, chat);
    if (admin) {
      if (value) {
        if (value == 'on') {
          const result = group.antiKasarOn(message.from);
          if (result == 'ADDED') {
            send(client, message, 'Fitur Anti Kasar *ON*').then(async () => {
              await message.react(pReaction.success);
            });
          } else {
            send(
              client,
              message,
              'Fitur Anti Kasar memang sudah nyala ege!!!',
            ).then(async () => {
              await message.react(pReaction.info);
            });
          }
        } else {
          const result = group.antiKasarOff(message.from);

          if (result == 'REMOVED') {
            send(client, message, 'Fitur Anti Kasar *OFF*').then(async () => {
              await message.react(pReaction.success);
            });
          } else {
            send(
              client,
              message,
              'Fitur Anti Kasar memang belum nyala ege!!!',
            ).then(async () => {
              await message.react(pReaction.info);
            });
          }
        }
      } else {
        send(
          client,
          message,
          'Cara penggunaan : _!antikasar on_ untuk menyalakan fitur anti kasar atau _!antikasar off_ untuk mematikan fitur anti kasar.',
        ).then(async () => {
          await message.react(pReaction.info);
        });
      }
    } else {
      send(
        client,
        message,
        'Fitur ini hanya bisa digunakan oleh admin grup!',
      ).then(async () => {
        await message.react(pReaction.info);
      });
    }
  } else {
    send(client, message, 'Fitur ini hanya tersedia untuk grup!').then(
      async () => {
        await message.react(pReaction.info);
      },
    );
  }
};

//load data
const badWord = (client, message) => {
  const reaction = badwReaction();
  reply(message, reaction);
};

//load data
const warnBye = async (client, message, value, chat) => {
  if (chat.isGroup) {
    const admin = isAdmin(message, chat);
    if (admin) {
      await send(
        client,
        message,
        'Ihhh kok gitu, Aku ada salah? apa udah ga butuh aku lagi? 😔 \nYauda kalo itu mau kamu... \n\nkirim !yesbye untuk mengeluarkan bot.',
      ).then(async () => {
        await message.react(pReaction.success);
      });
    } else {
      send(
        client,
        message,
        'Fitur ini hanya bisa digunakan oleh admin grup!',
      ).then(async () => {
        await message.react(pReaction.info);
      });
    }
  } else {
    send(client, message, 'Fitur ini hanya tersedia untuk grup!').then(
      async () => {
        await message.react(pReaction.info);
      },
    );
  }
};

//load data
const bye = async (client, message, value, chat) => {
  if (chat.isGroup) {
    const admin = isAdmin(message, chat);
    if (admin) {
      await send(
        client,
        message,
        'Bot izin pamit yaa, semoga kita bertemu lagi .\n\nThank You and I Love You 4000',
      ).then(async () => {
        await message.react(pReaction.success);
      });
      await chat.leave();
      await chat.delete();
    } else {
      send(
        client,
        message,
        'Fitur ini hanya bisa digunakan oleh admin grup!',
      ).then(async () => {
        await message.react(pReaction.info);
      });
    }
  } else {
    send(client, message, 'Fitur ini hanya tersedia untuk grup!').then(
      async () => {
        await message.react(pReaction.info);
      },
    );
  }
};

const faceswapHandler = async (client, message) => {
  await message.react(pReaction.loading);
  const tutor =
    'Cara penggunaan fitur !faceswap\n\n' +
    'Silahkan reply foto muka dengan foto muka orang lain\n\n' +
    'Tambahkan caption _!faceswap mulai_\n\n' +
    'Terima kasih';
  await send(client, message, tutor).then(async () => {
    await message.react(pReaction.success);
  });
};

//faceswap
const faceswap = async (client, message, browser) => {
  await message.react(pReaction.loading);

  if (message.hasQuotedMsg) {
    const quoted = await message.getQuotedMessage();
    if (quoted.hasMedia) {
      //do here

      const result = await imageManipulation.faceSwap(
        browser,
        client,
        message,
        quoted,
      );

      if (result.message == 'SUCCESS') {
        const messageMedia = new MessageMedia('image/jpg', result.data);
        await send(client, message, messageMedia).then(async () => {
          await message.react(pReaction.success);
        });
        await send(
          client,
          message,
          'Kalo kalian merasa BOT ini berguna / membantu kalian bisa donasi ya untuk membantu biaya server.\nHave nice yayy...',
        );
      } else {
        await send(client, message, msg.error.norm).then(async () => {
          await message.react(pReaction.failed);
        });
      }
    } else {
      const word =
        'Tidak ada foto, pilih foto lalu tambahkan caption !faceswap';
      reply(message, word).then(async () => {
        await message.react(pReaction.failed);
      });
      return await faceswapHandler(client, message);
    }
  } else {
    const word =
      'Tidak ada foto yang di reply, silahkan reply foto dengan foto lain lalu gunakan perintah !faceswap';
    reply(message, word).then(async () => {
      await message.react(pReaction.failed);
    });
    return await faceswapHandler(client, message);
  }
};

//face cartoon
const facecartoon = async (client, message, browser) => {
  await message.react(pReaction.loading);
  if (message.hasQuotedMsg) {
    const qMsg = await message.getQuotedMessage();
    if (qMsg.hasMedia) {
      const media = await qMsg.downloadMedia();

      if (media?.data) {
        const face = await scraper.faceCartoon(browser, media?.data);

        if (face.status == 200) {
          const messageMedia = new MessageMedia('image/jpg', face.media);
          await send(client, message, messageMedia).then(async () => {
            await message.react(pReaction.success);
          });
          await send(
            client,
            message,
            'Kalo kalian merasa BOT ini berguna / membantu kalian bisa donasi ya untuk membantu biaya server.\nHave nice yayy...',
          );
        } else {
          await send(client, message, msg.error.norm).then(async () => {
            await message.react(pReaction.failed);
          });
        }
      } else {
        await send(client, message, 'Maaf tolong kirim ulang gambarnya!').then(
          async () => {
            await message.react(pReaction.failed);
          },
        );
      }
    } else {
      const word =
        'Tidak ada gambar, pilih gambar lalu tambahkan pesan !facetoon atau !kartun';
      reply(message, word).then(async () => {
        await message.react(pReaction.failed);
      });
    }
  } else {
    if (message.hasMedia) {
      const media = await message.downloadMedia();

      if (media) {
        const face = await scraper.faceCartoon(browser, media.data);

        if (face.status == 200) {
          const messageMedia = new MessageMedia('image/jpg', face.media);
          await send(client, message, messageMedia).then(async () => {
            await message.react(pReaction.success);
          });
          await send(
            client,
            message,
            'Kalo kalian merasa BOT ini berguna / membantu kalian bisa donasi ya untuk membantu biaya server.\nHave nice yayy...',
          );
        } else {
          await send(client, message, msg.error.norm).then(async () => {
            await message.react(pReaction.failed);
          });
        }
      }
    } else {
      const word =
        'Tidak ada gambar, pilih gambar lalu tambahkan pesan !facetoon atau !kartun';
      reply(message, word).then(async () => {
        await message.react(pReaction.failed);
      });
    }
  }
};

//anime
const fotoAnime = async (client, message, browser) => {
  await message.react(pReaction.loading);
  const isPremium = await user.checkIsUserPremium(message.from);
  const chat = await message.getChat();
  const isGroup = await chat.isGroup;

  if (!isGroup) {
    if (!isPremium) {
      return premiumOnly(client, message);
    }
  }

  if (message.hasQuotedMsg) {
    const quoted = await message.getQuotedMessage();
    if (quoted.hasMedia == true) {
      const media = await quoted.downloadMedia();

      if (media?.data) {
        const foto = await scraper.anime(browser, media?.data);

        if (foto.status == 200) {
          const messageMedia = new MessageMedia('image/jpg', foto.media);
          await send(client, message, messageMedia).then(async () => {
            await message.react(pReaction.success);
          });
          await send(
            client,
            message,
            'Kalo kalian merasa BOT ini berguna / membantu kalian bisa donasi ya untuk membantu biaya server.\nHave nice yayy...',
          );
        } else {
          await send(client, message, msg.error.norm).then(async () => {
            await message.react(pReaction.failed);
          });
        }
      }
    } else {
      const word =
        'Tidak ada gambar, pilih gambar lalu tambahkan pesan !jadianime atau !anime';
      reply(message, word).then(async () => {
        await message.react(pReaction.failed);
      });
    }
  } else {
    if (message.hasMedia) {
      const media = await message.downloadMedia();

      if (media) {
        const foto = await scraper.anime(browser, media.data);

        if (foto.status == 200) {
          const messageMedia = new MessageMedia('image/jpg', foto.media);
          await send(client, message, messageMedia).then(async () => {
            message.react(pReaction.success);
          });
          await send(
            client,
            message,
            'Kalo kalian merasa BOT ini berguna / membantu kalian bisa donasi ya untuk membantu biaya server.\nHave nice yayy...',
          );
        } else {
          await send(client, message, msg.error.norm).then(async () => {
            await message.react(pReaction.failed);
          });
        }
      }
    } else {
      const word =
        'Tidak ada gambar, pilih gambar lalu tambahkan pesan !jadianime atau !anime';
      reply(message, word).then(async () => {
        await message.react(pReaction.failed);
      });
    }
  }
};

const tagAll = async (client, message) => {
  await message.react(pReaction.loading);
  const chat = await message.getChat();

  if (chat.isGroup) {
    let text = '';
    let mentions = [];

    for (let participant of chat.participants) {
      const contact = await client.getContactById(participant.id._serialized);

      mentions.push(contact);
      text += `@${participant.id.user} \n`;
    }

    await chat.sendMessage(text, {mentions});
    await message.react(pReaction.success);
  } else {
    send(client, message, 'Fitur ini hanya tersedia untuk grup!').then(
      async () => {
        await message.react(pReaction.info);
      },
    );
  }
};

const detectIfMention = async (client, message) => {
  const mentions = await message.getMentions();

  for (let contact of mentions) {
    if (contact.isMe) {
      const rand = randomInt(0, katabot.length - 1);
      const pilihKata = katabot[rand];
      await reply(message, pilihKata);
    }
  }
};

//QUOTA EXCEED
const quotaExceed = async (client, message) => {
  const word =
    'Maaf kesempatan kamu hari ini sudah habis buat pake bot ini.' +
    '\nKamu punya 30 kesempatan / hari untuk menggunakan fitur bot ini' +
    '\n\nKesempatan akan di reset setiap jam 12 malam' +
    '\n\nDaftar menjadi premium dengan cara donasi minimal 20k untuk mendapatkan semua fitur bot tanpa batasan tiap hari.';
  await send(client, message, word).then(async () => {
    return await donasi(client, message);
  });
};

//QUOTA EXCEED
const premiumOnly = async (client, message) => {
  const word =
    'Maaf fitur ini hanya untuk user premium.' +
    '\n\nDaftar menjadi premium dengan cara donasi minimal 20k untuk mendapatkan semua fitur bot tanpa batasan tiap hari.';
  await send(client, message, word).then(async () => {
    await message.react(pReaction.info);
    return await donasi(client, message);
  });
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
};

//load data
const addUserPremium = async (client, message, value) => {
  const owner = config.owner;

  const serialized = `${value}@c.us`;

  if (message.from == owner) {
    const result = await user.addUserToPremium(serialized);

    if (result == 'SUCCESS') {
      send(client, message, 'Bos tambah user premium sukses! misi selesai!');
    } else {
      send(client, message, 'Udah premium bos');
    }
  } else {
    send(
      client,
      message,
      'Ga boleh nakal yaa, perintah ini hanya boleh dilakuin sama owner ganteng!!',
    );
  }
};

//load data
const premiumList = (client, message) => {
  db.loadData('premium');
};

//pup
const pup = async (browser, client, message, value) => {
  await message.react(pReaction.loading);
  try {
    const test = MessageMedia.fromUrl(
      'https://dl150.y2mate.com/?file=M3R4SUNiN3JsOHJ6WWQ2a3NQS1Y5ZGlxVlZIOCtyZ1FzUFFVN0ZzYUxwNEg4c1lEK05LSkRZSmlDK3dqMUppckVwVmkvRHJkZnA2R0lGelBzSkVxUjB5UjlzSTE1SHFkMVpjdlROMWtWQk85eWNDdWhtSXoyeUdnTzRycklMUURSSEJJdVdkaDVEWGR3ZUdIL3hMOXZDQ0Vnd3VHZERRRG9ENGZOUGpWck00ZWdqaVpQYUc4Z01aRHZpK0Y1OGNkaWFYRTVGZXVoYUVvNWRoM0R4UT0%3D',
      {
        unsafeMime: true,
      },
    );
    client.sendMessage(message.from, test);
  } catch (error) {
    console.log(error);
  }
};

// ======================
//
//
// ====== GAP ===========
// === AUTOMATION =======
//
//
//
// ======================

//check if is admin
const isAdmin = (message, chat) => {
  const authorId = message.author;
  for (let participant of chat.participants) {
    if (participant.id._serialized === authorId && participant.isAdmin) {
      return true;
      break;
    } else {
      return false;
    }
  }
};

//on success command
const onCommandStatus = async (client, message, status) => {
  await message.react(
    status == 'success' ? pReaction.success : pReaction.failed,
  );
  await send(
    client,
    message,
    status == 'success' ? msg.success.norm : msg.error.norm,
  );
};

module.exports = {
  reply,
  send,
  ping,
  info,
  owner,
  sticker,
  menu,
  menuTeks,
  allMediaDownload,
  ytmp3,
  joinGroupPremium,
  premiumList,
  txToLogoEsp,
  txToNulis,
  txToQR,
  ssWeb,
  hitung,
  gempa,
  donasi,
  ingetin,
  antikasar,
  faceswap,
  facecartoon,
  fotoAnime,
  pup,
  badWord,
  bye,
  warnBye,
  tagAll,
  detectIfMention,
  quotaExceed,
  addUserPremium,
};
