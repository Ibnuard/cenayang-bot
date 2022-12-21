const {randomInt} = require('../tools/utils');
const {crypto} = require('./scraper');
const {saveData, loadData, saveDataOvt} = require('./storage');

const createAlert = async (browser, message, value) => {
  const author = message.from;
  const params = value.split(' ');

  if (params.length < 3) {
    return 'FORMAT_ERROR';
  }

  const data = {
    code: params[0].toUpperCase(),
    type: params[1],
    price: params[2],
  };

  if (data.type !== '>' && data.type !== '<') {
    return 'FORMAT_ERROR';
  }

  if (!Number(data.price)) {
    return 'FORMAT_ERROR';
  }

  const cryptoData = await crypto(browser, data.code);

  if (cryptoData.status !== 200) {
    return 'CODE_ERROR';
  }

  const id = `alert${randomInt(10000, 99999)}`;

  const writeData = {
    id: id,
    author: author,
    ...data,
  };

  saveData('crypto', writeData);
  return 'SUCCESS';
};

const checkPrice = async (browser, client) => {
  const loadAlert = loadData('crypto');
  const cryptoData = await crypto(browser, '', true);

  if (loadAlert.length > 0) {
    for (let alert of loadAlert) {
      const getPriceByCode = cryptoData.data.filter((item, index) => {
        return item.code == alert.code;
      });

      const newPrice = getPriceByCode[0].usdt;

      if (alert.type == '>') {
        if (Number(newPrice) >= alert.price) {
          await client.sendMessage(
            alert.author,
            `Crypto Alert❗️❗️ \n\n_Harga ${alert.code} lebih tinggi dari *${alert.price}* USDT._\n\nHarga ${alert.code} sekarang *${newPrice}*\n\nData dikirim oleh CenayangBOT.\n\nauthor note : Depo mulu WD kaga hihi...`,
          );
          deleteAlert(alert.author, alert.id);
        }
      } else {
        if (Number(newPrice) <= alert.price) {
          await client.sendMessage(
            alert.author,
            `Crypto Alert❗️❗️ \n\n_Harga ${alert.code} lebih rendah dari *${alert.price}* USDT._\n\nHarga ${alert.code} sekarang *${newPrice}*\n\nData dikirim oleh CenayangBOT.\n\nauthor note : Depo mulu WD kaga hihi...`,
          );
          deleteAlert(alert.author, alert.id);
        }
      }
    }
  } else {
    console.log('NO CRYPTO ALERT');
  }
};

const alertList = async message => {
  const alertData = loadData('crypto');
  const author = message.from;

  if (alertData.length > 0) {
    const find = alertData.filter((item, index) => {
      return item.author == author;
    });

    if (find.length > 0) {
      let teks = '';

      for (let alert of find) {
        teks += `-> ${alert.id} : ${alert.code} ${alert.type} ${alert.price}\n`;
      }

      return teks;
    } else {
      return 'NO_DATA';
    }
  } else {
    return 'NO_DATA';
  }
};

const deleteAlert = async (author, id) => {
  const alertData = loadData('crypto');

  if (alertData.length > 0) {
    const find = alertData.filter((item, index) => {
      return item.author == author && item.id == id;
    });

    if (find.length > 0) {
      const newData = alertData.filter((item, index) => {
        return item.author !== author && item.id !== id;
      });

      saveDataOvt('crypto', newData);
      return 'SUCCESS';
    } else {
      return 'NO_DATA';
    }
  } else {
    return 'NO_DATA';
  }
};

module.exports = {
  createAlert,
  checkPrice,
  alertList,
  deleteAlert,
};
