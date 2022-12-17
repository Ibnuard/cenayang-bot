const config = require('../../config.json');
const userAgent = require('user-agents');

//DOWNLOAD ALL MEDIA LINK
const gempa = async browser => {
  let BASE_URL = config.gempa;

  const context = await browser.createIncognitoBrowserContext();

  const page = await context.newPage();

  const response = await page.goto(BASE_URL + 'felt', {
    waitUntil: 'networkidle0',
  });

  const pageStatus = response.status();

  if (pageStatus !== 200) {
    await page.close();

    return {
      status: pageStatus,
      data: null,
      error: 'ERROR_STATUS',
    };
  }

  await page.setUserAgent(userAgent.random().toString());

  try {
    const data = await page.evaluate(async () => {
      const root = Array.from(document.querySelectorAll('#model_6 a'));
      const getTextData = Array.from(root[0].querySelectorAll('p'));

      const magnitudo = root[0].querySelector('h2').textContent;

      const nextLink = root[0].getAttribute('href');

      const textData = {
        waktu: getTextData[2].textContent,
        wilayah: getTextData[3].textContent,
        kedalaman: getTextData[4].textContent,
        magnitudo: magnitudo,
        nextLink: nextLink,
      };

      return textData;
    });

    await page.goto(BASE_URL + data.nextLink, {
      waitUntil: 'networkidle0',
    });

    const element = await page.$('#main-header');
    const box = await element.boundingBox();
    const ss = await element.screenshot({
      type: 'jpeg',
      quality: 100,
      clip: {
        x: box.x,
        y: box.y + 150,
        width: box.width,
        height: 1000,
      },
      omitBackground: true,
    });

    const buff = ss.toString('base64');

    const result = {
      image: buff,
      ...data,
    };

    await context.close();

    return {
      status: 200,
      data: result,
      error: null,
    };
  } catch (error) {
    await context.close();
    return {
      status: 400,
      data: null,
      error: 'SERVER ERROR',
    };
  }
};

module.exports = {
  gempa,
};
