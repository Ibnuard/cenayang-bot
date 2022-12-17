const config = require('../config.json');
const logoEsp = text => {
  return `https://api.vhtear.com/gamelogo?text=${encodeURI(text)}&apikey=${
    config.vhtear
  }`;
};

module.exports = {
  logoEsp,
};
