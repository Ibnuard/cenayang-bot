const {scraper} = require('.');
const {info} = require('../bin/command');
const {loadData, saveData} = require('./storage');

//handle faceSwap session
const faceSwap = async (browser, client, message, quoted) => {
  const input = await quoted.downloadMedia();
  const target = await message.downloadMedia();

  const face = await scraper.faceSwap(browser, input.data, target.data);

  if (face.status == 200) {
    return {
      message: 'SUCCESS',
      data: face.media,
    };
  } else {
    return {
      message: 'FAILED',
      data: null,
    };
  }
};

module.exports = {
  faceSwap,
};
