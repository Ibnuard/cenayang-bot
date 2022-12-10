const config = require('../config.json');

//teks to gif
const textToGif = text => {
  return `https://api.vhtear.com/textxgif?text=${encodeURI(text)}&apikey=${
    config.vhtear
  }`;
};

const nulis = text => {
  return `https://api.vhtear.com/write_image?text=${encodeURI(text)}&apikey=${
    config.vhtear
  }`;
};

const hartatahta = text => {
  return `https://api.vhtear.com/hartatahta?text=${encodeURI(text)}&apikey=${
    config.vhtear
  }`;
};

const qrcode = text => {
  return `https://api.vhtear.com/generateqr?data=${encodeURI(text)}&apikey=${
    config.vhtear
  }`;
};

const logoEsp = text => {
  return `https://api.vhtear.com/gamelogo?text=${encodeURI(text)}&apikey=${
    config.vhtear
  }`;
};

const pHub = (text1, text2) => {
  return `https://api.vhtear.com/pornlogo?text1=${encodeURI(
    text1,
  )}&text2=${encodeURI(text2)}&apikey=${config.vhtear}`;
};

module.exports = {
  textToGif,
  nulis,
  pHub,
  logoEsp,
  hartatahta,
  qrcode,
};
