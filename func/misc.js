const config = require('../config.json');
const {fetchJson} = require('../tools/fetch');
const {spawn} = require('child_process');

const gempa = () =>
  new Promise((resolve, reject) => {
    fetchJson(`https://api.vhtear.com/infogempa?apikey=${config.vhtear}`)
      .then(result => resolve(result))
      .catch(err => reject(err));
  });

const calculator = input => {
  try {
    const hasil = eval('(' + input + ')');
    return hasil;
  } catch (error) {
    return 'NOT_VALID';
  }
};

module.exports = {
  gempa,
  calculator,
};
