const userAgent = require('user-agents');
const {randomInt} = require('../tools/utils');
const fs = require('fs');

//INSTAGRAM
const igDownload = async (browser, url) => {
  let BASE_URL = 'https://igram.io/id/story-saver';

  const page = await browser.newPage();

  const response = await page.goto(BASE_URL, {waitUntil: 'load'});

  const pageStatus = response.status();

  if (pageStatus !== 200) {
    await page.close();

    return {
      status: pageStatus,
      media: [],
      error: 'ERROR_SERVER',
    };
  }

  await page.setUserAgent(userAgent.random().toString());

  await page.type('input[name=url]', url);

  await page.click('#submit');

  //await page.waitForNavigation({ timeout: 1000 });

  try {
    await page.waitForSelector("div[id='results'] > div", {visible: true});

    const data = await page.evaluate(async () => {
      root = Array.from(document.querySelectorAll("div[id='results'] > div"));
      const links = root.map(item => {
        return item.querySelector('div > div > a').getAttribute('href');
      });
      return links;
    });

    await page.close();

    return {
      status: 200,
      media: data,
      error: [],
    };
  } catch (error) {
    await page.close();
    return {
      status: 400,
      media: null,
      error: 'INVALID_URL',
    };
  }
};

// FACESWAP
const faceSwap = async (browser, image) => {
  let BASE_URL = 'https://faceswapper.ai/';

  let path = './temp/';
  let filename = `face-${randomInt(1000, 9999)}.jpg`;

  const page = await browser.newPage();

  const response = await page.goto(BASE_URL, {waitUntil: 'load'});

  const pageStatus = response.status();

  if (pageStatus !== 200) {
    await page.close();

    return {status: pageStatus, media: null, error: 'STATUS_ERROR'};
  }

  await page.setUserAgent(userAgent.random().toString());

  fs.writeFileSync(path + filename, Buffer.from(image, 'base64'));

  try {
    const elementHandle = await page.$('input[type=file]');
    await elementHandle.uploadFile('./temp/target.jpeg');

    await page.waitForNavigation();
    const elementHandle2 = await page.$("input[id='filePre2']");
    await elementHandle2.uploadFile(path + filename);

    await page.click('button.anor_fn_button.main-button');

    await page.waitForSelector(
      'button.anor_fn_button.main-button:not([disabled])',
      {timeout: 0},
    );

    fs.unlinkSync(path + filename);

    const data = await page.evaluate(async () => {
      root = Array.from(
        document.querySelectorAll('div.div-left > div > div > img'),
      );
      ``;
      const links = root.map(item => {
        return item.getAttribute('src');
      });
      return links;
    });

    await page.goto(data[0], {waitUntil: 'domcontentloaded'});
    const element = await page.$('img');
    await page.waitFor(1000);
    const ss = await element.screenshot({
      type: 'jpeg',
      quality: 100,
      omitBackground: true,
    });

    const buff = ss.toString('base64');

    await page.close();

    return {
      status: 200,
      media: buff,
      error: null,
    };
  } catch (error) {
    fs.unlinkSync(path + filename);
    await page.close();
    return {
      status: 400,
      media: null,
      error: 'SERVER_ERROR',
    };
  }
};

module.exports = {
  igDownload,
  faceSwap,
};
