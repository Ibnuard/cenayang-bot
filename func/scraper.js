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

//FACECARTOON
const faceCartoon = async (browser, image) => {
  let BASE_URL = 'https://animefilter.com/';

  let path = './temp/';
  let filename = `face-${randomInt(10000, 99990)}.jpg`;

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
    page.on('dialog', async dialog => {
      await dialog.accept();
    });

    await elementHandle.uploadFile(path + filename);

    await page.waitForSelector('.spinner', {hidden: true});

    // const data = await page.evaluate(async () => {
    //   return document
    //     .querySelector('#outputEl > div > div > img')
    //     .getAttribute('src');
    // });

    const element = await page.$('#outputEl > div > div > img');
    const ss = await element.screenshot({
      type: 'jpeg',
      quality: 100,
      omitBackground: true,
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
    fs.unlinkSync(path + filename);
    await page.close();
    return {
      status: 400,
      media: null,
      error: 'SERVER ERROR',
    };
  }
};

//FOTO 2 ANIME
const anime = async (browser, image) => {
  let BASE_URL = 'https://h5.tu.qq.com/web/ai-2d/cartoon/index';

  let path = './temp/';
  let filename = `anime-${randomInt(10000, 99999)}.jpg`;

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
    const dialog =
      (await page.$(
        '#page-container > div > div._modal_f95ly_1 > div > div > div._confirm-btn_1fu81_42',
      )) || '';

    if (dialog) {
      await page.waitForSelector(
        '#page-container > div > div._modal_f95ly_1 > div > div > div._confirm-btn_1fu81_42',
      );

      await page.click(
        '#page-container > div > div._modal_f95ly_1 > div > div > div._confirm-btn_1fu81_42',
      );
    }
    // await page.waitForSelector(
    //   '#page-container > div > div._modal_f95ly_1 > div > div > div._confirm-btn_1fu81_42',
    // );

    // await page.click(
    //   '#page-container > div > div._modal_f95ly_1 > div > div > div._confirm-btn_1fu81_42',
    // );

    await page.click('#page-container > div > div._action-panel_ewapq_64');

    //   await page.click(
    //     "#page-container > div > div._modal_f95ly_1 > div > div > div"
    //   );

    const [fileChooser] = await Promise.all([
      page.waitForFileChooser(),
      page.click(
        '#page-container > div > div._modal_f95ly_1 > div > div > div',
      ),
    ]);

    await fileChooser.accept([path + filename]);

    await page.waitForNavigation();

    await page.click(
      '#page-view > div._olympic-result-page_jnpgw_1 > div._result-page_jnpgw_93 > div._action-panel_jnpgw_144 > div._action-btn-group_jnpgw_149',
    );

    await page.waitForSelector(
      '#page-view > div._olympic-result-page_jnpgw_1 > div._modal_f95ly_1 > div > div > div > img._save-pic-container-content-image_jnpgw_288',
    );

    const data = await page.evaluate(async () => {
      return document
        .querySelector(
          '#page-view > div._olympic-result-page_jnpgw_1 > div._modal_f95ly_1 > div > div > div > img._save-pic-container-content-image_jnpgw_288',
        )
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
  igDownload,
  faceSwap,
  faceCartoon,
  anime,
};
