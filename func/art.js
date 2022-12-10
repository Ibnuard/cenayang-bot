const {fetchJson} = require('../tools/fetch');
const config = require('../config.json');

const chord = title =>
  new Promise((resolve, reject) => {
    fetchJson(
      `https://api.vhtear.com/chord_guitar?query=${title}&apikey=${config.vhtear}`,
    )
      .then(result => resolve(result))
      .catch(err => reject(err));
  });

const lirik = title =>
  new Promise((resolve, reject) => {
    fetchJson(
      `https://api.vhtear.com/song_lyrics?query=${title}&apikey=${config.vhtear}`,
    )
      .then(result => resolve(result))
      .catch(err => reject(err));
  });

module.exports = {
  chord,
  lirik,
};
