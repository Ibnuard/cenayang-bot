const config = require('../../config.json');
const userAgent = require('user-agents');

//DOWNLOAD ALL MEDIA LINK
const crypto = async (browser, kode, all) => {
  let BASE_URL = config.crypto;
  const context = await browser.createIncognitoBrowserContext();

  const page = await context.newPage();

  const response = await page.goto(BASE_URL, {waitUntil: 'networkidle0'});

  const pageStatus = response.status();

  const code = kode.toUpperCase();

  if (pageStatus !== 200) {
    await page.close();

    return {
      status: pageStatus,
      media: [],
      error: 'ERROR_SERVER',
    };
  }

  await page.setUserAgent(userAgent.random().toString());

  try {
    await page.waitForSelector('table[id=market-table-idr] > tbody > tr');

    const list = await page.evaluate(async () => {
      container = Array.from(
        document.querySelectorAll('table[id=market-table-idr] > tbody > tr'),
      );

      const data = container.map(item => {
        return {
          code: item
            .querySelector('td[data-order]')
            .textContent.replace('\n', '')
            .replace('/IDR', ''),
          name: item.querySelector('td > span').textContent,
          price: item.querySelector('td > span.field-idr').textContent,
        };
      });

      function _getUsdtPrice() {
        return data.filter((item, index) => {
          return item.code == 'USDT';
        });
      }

      const result = data.map(item => {
        return {
          usdt: Number(
            item.price.replace(/\./gu, '') /
              Number(_getUsdtPrice()[0].price.replace(/\./gu, '')),
          ).toFixed(2),
          ...item,
        };
      });

      return result;
    });

    await context.close();

    const getPriceDetail = list.filter((item, index) => {
      return item.code == code;
    });

    if (all) {
      return {
        status: 200,
        data: list,
        error: null,
      };
    }

    if (getPriceDetail.length > 0) {
      return {
        status: 200,
        data: getPriceDetail[0],
        error: null,
      };
    } else {
      return {
        status: 400,
        data: null,
        error: 'NO_DATA',
      };
    }
  } catch (error) {
    console.log(error);
    await context.close();
    return {
      status: 400,
      data: null,
      error: 'SERVER ERROR',
    };
  }
};

module.exports = {
  crypto,
};
