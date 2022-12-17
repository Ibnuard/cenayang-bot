//FACECARTOON
const faceCartoon = async (browser, image) => {
  let BASE_URL = config.faceToon;

  let path = './temp/';
  let filename = `toon-${randomInt(10000, 99990)}.jpg`;

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

module.exports = {
  faceCartoon,
};
