const config = require('../config.json');
const {fetchJson} = require('../tools/fetch');

//teks to gif
const ssWeb = url => {
  return `https://api.vhtear.com/ssweb?link=${url}&type=phone&apikey=${config.vhtear}`;
};

//teks to gif
const puisi = () => {
  return `https://api.vhtear.com/puisi_image?apikey=${config.vhtear}`;
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

const pantun = () =>
  new Promise((resolve, reject) => {
    fetchJson(`https://api.vhtear.com/random_pantun?apikey=${config.vhtear}`)
      .then(result => resolve(result))
      .catch(err => reject(err));
  });

const quotes = () =>
  new Promise((resolve, reject) => {
    fetchJson(`https://api.vhtear.com/quoteid?apikey=${config.vhtear}`)
      .then(result => resolve(result))
      .catch(err => reject(err));
  });

const resep = masakan =>
  new Promise((resolve, reject) => {
    const url = encodeURI(masakan);
    fetchJson(
      `https://api.vhtear.com/recipes_food?query=${url}&apikey=${config.vhtear}`,
    )
      .then(result => resolve(result))
      .catch(err => reject(err));
  });

module.exports = {
  ssWeb,
  puisi,
  hitung,
  gempa,
  pantun,
  quotes,
  resep,
};
