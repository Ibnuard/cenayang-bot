const config = require('../../config.json');
const userAgent = require('user-agents');

//DOWNLOAD ALL MEDIA LINK
const allDownloader = async (browser, url) => {
  let BASE_URL = config.allDownloader;

  const context = await browser.createIncognitoBrowserContext();

  const page = await context.newPage();

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
    await page.type('#sf_url', url);

    await page.click('#sf_submit');

    await page.waitForSelector(
      "div[id='sf_result'] > div.media-result > div.result-box.video",
    );

    const video =
      (await page.$(
        "div[id='sf_result'] > div.media-result > div.result-box.video > div.info-box > div.link-box",
      )) || '';

    if (video) {
      const download = await page.evaluate(async () => {
        root = Array.from(
          document.querySelectorAll(
            "div[id='sf_result'] > div.media-result > div.result-box.video",
          ),
        );

        const links = root.map(item => {
          const data = item.querySelector('div > div.def-btn-box > a');
          return {
            link: data.getAttribute('href'),
            filename: data?.getAttribute('download'),
            filetype: data?.getAttribute('data-type'),
          };
        });
        return links;
      });

      await page.close();

      return {
        status: 200,
        media: download,
        error: null,
      };
    } else {
      const download = await page.evaluate(async () => {
        root = Array.from(
          document.querySelectorAll(
            "div[id='sf_result'] > div.media-result > div.result-box.video",
          ),
        );

        const links = root.map(item => {
          const data = item.querySelector('div .single > div.def-btn-box > a');
          return {
            link: data.getAttribute('href'),
            filename: data?.getAttribute('download'),
            filetype: data?.getAttribute('data-type'),
          };
        });
        return links;
      });

      await page.close();

      return {
        status: 200,
        media: download,
        error: null,
      };
    }
  } catch (error) {
    await page.close();
    return {
      status: 400,
      media: null,
      error: 'SERVER ERROR',
    };
  }
};

module.exports = {
  allDownloader,
};
