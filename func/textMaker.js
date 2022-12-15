const config = require('../config.json');

const nulis = text => {
  return `https://api.vhtear.com/write_image?text=${encodeURI(text)}&apikey=${
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

module.exports = {
  nulis,
  logoEsp,
  qrcode,
};
