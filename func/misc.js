const config = require('../config.json');
const {fetchJson} = require('../tools/fetch');

//teks to gif
const ssWeb = url => {
  return `https://api.vhtear.com/ssweb?link=${url}&type=phone&apikey=${config.vhtear}`;
};

const hitung = formula =>
  new Promise((resolve, reject) => {
    fetchJson(
      `https://api.vhtear.com/calculator?value${formula}&apikey=${config.vhtear}`,
    )
      .then(result => resolve(result))
      .catch(err => reject(err));
  });

const gempa = () =>
  new Promise((resolve, reject) => {
    fetchJson(`https://api.vhtear.com/infogempa?apikey=${config.vhtear}`)
      .then(result => resolve(result))
      .catch(err => reject(err));
  });

module.exports = {
  ssWeb,
  hitung,
  gempa,
};
