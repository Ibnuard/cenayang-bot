const config = require('../../config.json');
const userAgent = require('user-agents');

//DOWNLOAD ALL MEDIA LINK
const ssweb = async (browser, url) => {
  const context = await browser.createIncognitoBrowserContext();

  const page = await context.newPage();

  const response = await page.goto(url, {waitUntil: 'networkidle2'});

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
    const ss = await page.screenshot({
      type: 'jpeg',
      quality: 100,
      omitBackground: true,
    });

    const buff = ss.toString('base64');
    await context.close();

    return {
      status: 200,
      media: buff,
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
  ssweb,
};
