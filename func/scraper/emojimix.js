const config = require('../../config.json');
const userAgent = require('user-agents');

//DOWNLOAD ALL MEDIA LINK
const emojimix = async (browser, emoji) => {
  let BASE_URL = config.emojimix;
  const context = await browser.createIncognitoBrowserContext();

  const page = await context.newPage();

  const emoji1 = emoji.slice(0, 2);
  const emoji2 = emoji.slice(2);

  if (!emoji1 || !emoji2) {
    return {
      status: 400,
      media: null,
      error: 'FORMAT_ERROR',
    };
  }

  try {
    await page.setUserAgent(userAgent.random().toString());
    await page.goto(`${BASE_URL}${encodeURI(emoji1)}+${encodeURI(emoji2)}`, {
      waitUntil: 'networkidle0',
    });

    const result = await page.evaluate(async () => {
      const img = document.querySelector('#output').getAttribute('src');
      return img;
    });

    await context.close();

    return {
      status: 200,
      media: result,
      error: null,
    };
  } catch (error) {
    console.log(error);
    await context.close();
    return {
      status: 400,
      media: null,
      error: 'SERVER ERROR',
    };
  }
};

module.exports = {
  emojimix,
};
