const config = require('../../config.json');
const userAgent = require('user-agents');
const {randomInt} = require('../../tools/utils');
const fs = require('fs');

const faceSwap = async (browser, input, target) => {
  let BASE_URL = config.faceSwap;

  const randName = `temp${randomInt(10000, 99999)}`;

  let path = `./temp/${randName}/`;
  let inputfile = `input.jpg`;
  let targetfile = 'target.jpg';

  const page = await browser.newPage();

  const response = await page.goto(BASE_URL, {waitUntil: 'load'});

  const pageStatus = response.status();

  if (pageStatus !== 200) {
    await page.close();

    return {status: pageStatus, media: null, error: 'STATUS_ERROR'};
  }

  await page.setUserAgent(userAgent.random().toString());

  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, {recursive: true});
    fs.writeFileSync(path + inputfile, Buffer.from(input, 'base64'));
    fs.writeFileSync(path + targetfile, Buffer.from(target, 'base64'));
  }

  try {
    const elementHandle = await page.$('input[type=file]');
    await elementHandle.uploadFile(path + targetfile);

    await page.waitForNavigation();
    const elementHandle2 = await page.$("input[id='filePre2']");
    await elementHandle2.uploadFile(path + inputfile);

    await page.click('button.anor_fn_button.main-button');

    await page.waitForSelector(
      'button.anor_fn_button.main-button:not([disabled])',
      {timeout: 0},
    );

    fs.rmSync(path, {recursive: true, force: true});

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
    fs.rmSync(path, {recursive: true, force: true});
    await page.close();
    return {
      status: 400,
      media: null,
      error: 'SERVER_ERROR',
    };
  }
};

module.exports = {
  faceSwap,
};
