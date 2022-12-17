const config = require('../../config.json');
const userAgent = require('user-agents');

//DOWNLOAD ALL MEDIA LINK
const ytmp3 = async (browser, url) => {
  let BASE_URL = config.ytmp3;

  const context = await browser.createIncognitoBrowserContext();

  const page = await context.newPage();

  const response = await page.goto(BASE_URL, {waitUntil: 'domcontentloaded'});

  const pageStatus = response.status();

  if (pageStatus !== 200) {
    await page.close();

    console.log(pageStatus);

    return {
      status: pageStatus,
      media: [],
      error: 'ERROR_STATUS',
    };
  }

  await page.setUserAgent(userAgent.random().toString());

  try {
    await page.type('input[name=keyword]', url);

    await page.select('#myDropdown', 'mp3');

    //wait for sometime
    await page.waitForTimeout(4000);
    //press Enter
    await page.keyboard.press('Enter');

    await page.waitForNavigation();

    await page.waitForSelector('#downloadButton');

    const downloadUrl = await page.evaluate(async () => {
      return document.querySelector('a#downloadButton').getAttribute('href');
    });

    const title = await page.evaluate(async () => {
      return document.querySelector('#blocLinkDownload > h2').textContent;
    });

    await context.close();

    return {
      status: 200,
      media: {
        url: downloadUrl,
        title: title,
      },
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
  ytmp3,
};
