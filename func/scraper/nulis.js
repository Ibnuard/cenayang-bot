const config = require('../../config.json');
const userAgent = require('user-agents');
const {randomInt} = require('../../tools/utils');

//DOWNLOAD ALL MEDIA LINK
const nulis = async (browser, nama, isi) => {
  let BASE_URL = config.nulis;

  const name = nama.replace(/_/gms, ' ');

  const context = await browser.createIncognitoBrowserContext();

  const page = await context.newPage();

  page.on('dialog', async dialog => {
    const message = dialog.message();
    if (message !== 'Masukan nama kamu :') {
      await dialog.dismiss();
    } else {
      await dialog.accept(name);
    }
  });

  const response = await page.goto(BASE_URL, {waitUntil: 'load'});

  const pageStatus = response.status();

  if (pageStatus !== 200) {
    await page.close();

    return {
      status: pageStatus,
      media: [],
      error: 'ERROR_STATUS',
    };
  }

  await page.setUserAgent(userAgent.random().toString());

  try {
    await page.waitForSelector('#book');

    const randArray = randomInt(0, 6).toString();

    await page.select('#book', randArray);

    //wait for sometime
    await page.waitForTimeout(2000);

    await page.type('#content', isi);

    //wait for sometime
    await page.waitForTimeout(2000);

    const data = await page.evaluate(() => {
      return document.querySelector('#defaultCanvas0').toDataURL();
    });

    await context.close();

    return {
      status: 200,
      media: data,
      error: null,
    };
  } catch (error) {
    await context.close();
    return {
      status: 400,
      media: null,
      error: 'SERVER ERROR',
    };
  }
};

module.exports = {
  nulis,
};
