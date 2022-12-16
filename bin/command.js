const {MessageMedia, List, Buttons} = require('whatsapp-web.js');

//NON PACKAGE
const {
  downloader,
  genMenu,
  db,
  text,
  misc,
  reminder,
  scraper,
  imageManipulation,
} = require('../func');
const config = require('../config.json');
const {dLog} = require('../tools/log');
const moment = require('moment');
const {msg, pReaction, badwReaction} = require('./messages');
const {antiKasarOn, antiKasarOff} = require('../func/group');
const katabot = require('../database/group/katabot.json');
const {randomInt} = require('../tools/utils');
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
    'Halo Gaes untuk kalian yang mau donasi / menambahkan bot ini ke grup kalian bisa kirim lewat aplikasi berikut ya : \n\n*OVO : 085741894533*\n*DANA : 085741894533*\n\nAtau kalian bisa hubungin telegram owner ya.\nDonasi kalian sangat membantu untuk biaya server, maklum ownernya sobat misqueen hihi.\n\nHave nice yayyyy!!\nTerima kasih.';
  send(client, message, word).then(async () => {
    await message.react(pReaction.success);
  });
};

//menu
const menu = async (client, message) => {
  await message.react(pReaction.loading);
  const word = genMenu.listMenu();
  send(client, message, word).then(async () => {
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
      reply(qMsg, msg.wait);

      if (media) {
        send(client, qMsg, media, {
          sendMediaAsSticker: true,
          stickerAuthor: 'CenayangBOT',
          stickerName: 'cenAyangSticker',
        }).then(async () => {
          await message.react(pReaction.success);
        });
      }
    } else {
      dLog('STICKER', message.from, true, 'NO MEDIA DETECTED');
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
      reply(message, msg.wait);

      if (media) {
        send(client, message, media, {
          sendMediaAsSticker: true,
          stickerAuthor: 'CenayangBOT',
          stickerName: 'cenAyangSticker',
        }).then(async () => {
          await message.react(pReaction.success);
        });
      }
    } else {
      dLog('STICKER', message.from, true, 'NO MEDIA DETECTED');
      const word =
        'Tidak ada gambar/video/gif untuk dijadikan sticker, pilih gambar lalu tambahkan pesan !sticker';
      reply(message, word).then(async () => {
        await message.react(pReaction.failed);
      });
    }
  }
};

//download video fb
const downFB = async (client, message, value) => {
  await message.react(pReaction.loading);
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
        await send(client, message, media, {sendMediaAsDocument: true}).then(
          async () => {
            await message.react(pReaction.success);
          },
        );
      })
      .catch(err => {
        dLog('FACEBOOK', message.from, true, 'ERR : ' + err);
        send(client, message, msg.error.norm).then(async () => {
          await message.react(pReaction.failed);
        });
      });
  } else {
    send(
      client,
      message,
      'Tidak ada url facebook terdeteksi,\n_contoh: !fb linkvideo_',
    ).then(async () => {
      await message.react(pReaction.failed);
    });
  }
};

//download tiktok wm
const downTik = async (client, message, value) => {
  await message.react(pReaction.loading);
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
        send(client, message, media).then(async () => {
          await message.react(pReaction.success);
        });
      })
      .catch(err => {
        dLog('TIKTOK', message.from, true, 'ERR : ' + err);
        send(client, message, msg.error.norm).then(async () => {
          await message.react(pReaction.failed);
        });
      });
  } else {
    send(client, message, 'Cara penggunaan : _!tt linkvideo_').then(
      async () => {
        await message.react(pReaction.info);
      },
    );
  }
};

//download tiktok wm
const downInsta = async (browser, client, message, value) => {
  await message.react(pReaction.loading);
  if (value) {
    reply(message, msg.wait);

    const isInstagramURL =
      /(?:https?:)?\/\/(?:www\.)?(?:instagram\.com|instagr\.am)\//.test(value);

    if (isInstagramURL) {
      const ig = await scraper.igDownload(browser, value);

      if (ig?.media) {
        for (links in ig?.media) {
          const media = await MessageMedia.fromUrl(ig?.media[links], {
            unsafeMime: true,
          });

          await send(client, message, media).then(async () => {
            await message.react(pReaction.success);
          });
        }
      } else {
        send(client, message, msg.error.norm).then(async () => {
          await message.react(pReaction.failed);
        });
      }
    } else {
      send(client, message, 'Url instagram tidak valid').then(async () => {
        await message.react(pReaction.info);
      });
    }
  } else {
    send(client, message, 'Cara penggunaan : _!ig <urlinstagram>_').then(
      async () => {
        await message.react(pReaction.info);
      },
    );
  }
};

//download tiktok wm
const downIGstory = async (client, message, value, extra) => {
  await message.react(pReaction.loading);
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
            send(client, message, media, {sendMediaAsDocument: true}).then(
              async () => {
                await message.react(pReaction.success);
              },
            );
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
              send(client, message, media, {sendMediaAsDocument: true}).then(
                async () => {
                  await message.react(pReaction.success);
                },
              );
            }
          }
        } else {
          send(client, message, msg.error.norm).then(async () => {
            await message.react(pReaction.failed);
          });
        }
      })
      .catch(err => {
        dLog('IGS', message.from, true, 'ERR : ' + err);
        send(client, message, msg.error.norm).then(async () => {
          await message.react(pReaction.failed);
        });
      });
  } else {
    send(client, message, 'Cara penggunaan : _!igs linkvideo_').then(
      async () => {
        await message.react(pReaction.info);
      },
    );
  }
};

//download youtube
const downYT = async (client, message, type, value) => {
  await message.react(pReaction.loading);
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
        await send(client, message, media, {sendMediaAsDocument: true}).then(
          async () => {
            await message.react(pReaction.success);
          },
        );
      })
      .catch(err => {
        dLog('YOUTUBE', message.from, true, 'ERR : ' + err);
        send(client, message, msg.error.norm).then(async () => {
          await message.react(pReaction.failed);
        });
      });
  } else {
    send(client, message, 'Cara penggunaan : _!ytmp4 linkvideo_').then(
      async () => {
        await message.react(pReaction.info);
      },
    );
  }
};

//teks ke nulis
const txToNulis = async (client, message, value) => {
  await message.react(pReaction.loading);
  if (value) {
    reply(message, msg.wait);
    const url = text.nulis(value);
    const media = await MessageMedia.fromUrl(url, {
      unsafeMime: true,
    });
    send(client, message, media).then(async () => {
      await message.react(pReaction.success);
    });
  } else {
    send(client, message, 'Cara penggunaan : _!nulis ini tulisan abang_').then(
      async () => {
        await message.react(pReaction.info);
      },
    );
  }
};

//teks ke nulis
const txToQR = async (client, message, value) => {
  await message.react(pReaction.loading);
  if (value) {
    reply(message, msg.wait);
    const url = text.qrcode(value);
    const media = await MessageMedia.fromUrl(url, {
      unsafeMime: true,
    });
    send(client, message, media).then(async () => {
      await message.react(pReaction.success);
    });
  } else {
    send(client, message, 'Cara penggunaan : _!buatqr www.google.com_').then(
      async () => {
        await message.react(pReaction.info);
      },
    );
  }
};

//teks ke nulis
const ssWeb = async (client, message, value) => {
  await message.react(pReaction.loading);
  if (value) {
    reply(message, msg.wait);
    const url = misc.ssWeb(value);
    const media = await MessageMedia.fromUrl(url, {
      unsafeMime: true,
    });
    send(client, message, media).then(async () => {
      await message.react(pReaction.success);
    });
  } else {
    send(client, message, 'Cara penggunaan : _!ssweb www.google.com_').then(
      async () => {
        await message.react(pReaction.info);
      },
    );
  }
};

//teks ke logo esports
const txToLogoEsp = async (client, message, value) => {
  await message.react(pReaction.loading);
  if (value) {
    reply(message, msg.wait);
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
  if (value) {
    misc
      .hitung(value)
      .then(async ({result}) => {
        if (result.data) {
          reply(message, `${result?.data}\n\n${result?.info}`).then(
            async () => {
              await message.react(pReaction.success);
            },
          );
        }
      })
      .catch(err => {
        dLog('CALCULATOR', message.from, true, 'ERR : ' + err);
        send(client, message, '_Ada masalah nih, mohon coba lagi ya!_').then(
          async () => {
            await message.react(pReaction.failed);
          },
        );
      });
  } else {
    send(client, message, 'Cara penggunaan : _=10*5:4+2-1_').then(async () => {
      await message.react(pReaction.info);
    });
  }
};

const gempa = async (client, message) => {
  await message.react(pReaction.loading);
  reply(message, msg.wait);
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
      dLog('GEMPA', message.from, true, 'ERR : ' + err);
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
          const result = antiKasarOn(message.from);
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
          const result = antiKasarOff(message.from);

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
  console.log('selected r : ' + reaction);
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
      reply(qMsg, msg.wait);

      if (media) {
        const face = await scraper.faceCartoon(browser, media.data);

        if (face.status == 200) {
          const messageMedia = new MessageMedia('image/jpg', face.media);
          await send(client, message, messageMedia);
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
  } else {
    if (message.hasMedia) {
      const media = await message.downloadMedia();
      reply(message, msg.wait);

      if (media) {
        const face = await scraper.faceCartoon(browser, media.data);

        if (face.status == 200) {
          const messageMedia = new MessageMedia('image/jpg', face.media);
          await send(client, message, messageMedia);
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
  if (message.hasQuotedMsg) {
    const qMsg = await message.getQuotedMessage();
    if (qMsg.hasMedia) {
      const media = await qMsg.downloadMedia();
      reply(qMsg, msg.wait);

      if (media) {
        const foto = await scraper.anime(browser, media.data);

        if (foto.status == 200) {
          const messageMedia = new MessageMedia('image/jpg', foto.media);
          await send(client, message, messageMedia);
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
      reply(message, msg.wait);

      if (media) {
        const foto = await scraper.anime(browser, media.data);

        if (foto.status == 200) {
          const messageMedia = new MessageMedia('image/jpg', foto.media);
          await send(client, message, messageMedia);
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
const premiumList = (client, message) => {
  db.loadData('premium');
};

//pup
const pup = async (client, message, browser) => {
  send(client, message, 'PUP');
  let button = new Buttons(
    'body',
    [{body: 'bt1'}, {body: 'bt2'}, {body: 'bt3'}],
    'title',
    'footer',
  );
  client.sendMessage(message['from'], button);
};

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

module.exports = {
  reply,
  send,
  ping,
  info,
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
};
