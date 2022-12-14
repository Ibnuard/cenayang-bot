const config = require('../../config.json');
const userAgent = require('user-agents');
const {randomInt} = require('../../tools/utils');
const fs = require('fs');

//FOTO 2 ANIME
const anime = async (browser, image) => {
  let BASE_URL = config.faceAnime;

  let path = './temp/';
  let filename = `anime-${randomInt(10000, 99999)}.jpg`;

  const context = await browser.createIncognitoBrowserContext();

  const page = await context.newPage();

  const response = await page.goto(BASE_URL, {waitUntil: 'networkidle0'});

  const pageStatus = response.status();

  if (pageStatus !== 200) {
    await page.close();

    return {status: pageStatus, media: null, error: 'STATUS_ERROR'};
  }

  await page.setUserAgent(userAgent.random().toString());

  fs.writeFileSync(path + filename, Buffer.from(image, 'base64'));

  try {
    const dialog = (await page.$('div[class*="_confirm-btn"]')) || '';

    if (dialog) {
      await page.waitForSelector('div[class*="_confirm-btn"]');

      await page.click('div[class*="_confirm-btn"]');
    }

    await page.click('div[class*="_action-panel"]');

    await page.waitForSelector('div[class*="_choose-actions"]');

    const [fileChooser] = await Promise.all([
      page.waitForFileChooser(),
      page.click('div[class*="_choose-actions"]'),
    ]);

    await fileChooser.accept([path + filename]);

    await page.waitForNavigation();
    await page.waitForSelector('div[class*="_temp-result-row"] > img');

    const data = await page.evaluate(async () => {
      return document
        .querySelector('div[class*="_temp-result-row"] > img')
        .getAttribute('src');
    });

    await page.goto(data, {waitUntil: 'domcontentloaded'});

    // #hplogo - selector
    await page.waitForSelector('body > img'); // wait for the selector to load
    const logo = await page.$('body > img'); // declare a variable with an ElementHandle
    const box = await logo.boundingBox(); // this method returns an array of geometric parameters of the element in pixels.
    const x = box['x']; // coordinate x
    const y = box['y']; // coordinate y
    const w = box['width']; // area width

    const ss = await page.screenshot({
      type: 'jpeg',
      quality: 100,
      omitBackground: true,
      clip: {x: x, y: y, width: w, height: 480},
    });

    const buff = ss.toString('base64');
    fs.unlinkSync(path + filename);

    await page.close();

    return {
      status: 200,
      media: buff,
      error: null,
    };
  } catch (error) {
    console.log('err : ' + error);
    fs.unlinkSync(path + filename);
    await page.close();
    return {
      status: 400,
      media: null,
      error: 'SERVER ERROR',
    };
  }
};

module.exports = {
  anime,
};
