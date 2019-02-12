const assert = require('assert');
const puppeteer = require('puppeteer');

const server = require('./server');

describe('localStorage', function () {
  var browser, page, itDone;
  var currentValue = 'testValue';

  it('page ready', (done) => {
    (async () => {
      browser = await puppeteer.launch();
      page = await browser.newPage();


      page.on('console', message => {
        console.log(message.text());
      })

      page.on('error', err => {
        console.log(err);
      })

      await page.setCacheEnabled(false);
      await page.goto('http://127.0.0.1:8080');

      await page.exposeFunction('assert', async (value, current) => {
        return assert.equal(value, current);
      })

      await page.exposeFunction('getCurrentValue', async () => {
        return currentValue;
      })

      await page.exposeFunction('done', async (e) => {
        if (typeof e === 'string') {
          e = new Error(e);
        }
        return itDone(e);
      })

      itDone = done;
      await page.evaluate(async () => {
        var s = new Storage.default('name');
        window.s = s;
        await done();
      });
    })()
  })

  it('set a?', (done) => {
    (async () => {
      itDone = done;
      await page.evaluate(async () => {
        var currentValue = await getCurrentValue();
        try {
          s.set(currentValue);
          var value = localStorage.getItem('name').split('|')[0];
          value = JSON.parse(decodeURIComponent(value));
          await assert(value, currentValue)
          await done()
        } catch (e) {
          await done(e.toString())
        }
      });
    })();
  });

  it('get a?', (done) => {
    (async () => {
      itDone = done;
      await page.evaluate(async () => {
        var currentValue = await getCurrentValue();
        try {
          await assert(s.get(), currentValue)
          await done()
        } catch (e) {
          await done(e.toString())
        }
      });
    })();
  });

  it('can remove?', (done) => {
    (async () => {
      itDone = done;
      await page.evaluate(async () => {
        try {
          s.remove();
          await assert(s.get(), null);
          await done()
        } catch (e) {
          await done(e.toString())
        }
      });

      await browser.close();
    })();
  });

  // await done(e)
})

describe('cookie', function () {
  var browser, page, itDone;
  var currentValue = 'testValue';

  it('page ready', (done) => {
    (async () => {
      browser = await puppeteer.launch();
      page = await browser.newPage();


      page.on('console', message => {
        console.log(message.text());
      })

      page.on('error', err => {
        console.log(err);
      })

      await page.setCacheEnabled(false);
      await page.goto('http://127.0.0.1:8080');

      await page.exposeFunction('assert', async (value, current) => {
        return assert.equal(value, current);
      })

      await page.exposeFunction('getCurrentValue', async () => {
        return currentValue;
      })

      await page.exposeFunction('done', async (e) => {
        if (typeof e === 'string') {
          e = new Error(e);
        }
        return itDone(e);
      })

      itDone = done;
      await page.evaluate(async () => {
        var s = new Storage.default('name', { storage: Storage.storages.cookie });
        window.s = s;
        await done();
      });
    })()
  })

  it('set a?', (done) => {
    (async () => {
      itDone = done;
      await page.evaluate(async () => {
        var currentValue = await getCurrentValue();
        var key = 'name';
        var value;
        try {
          s.set(currentValue);
          var cookies = document.cookie.split(';');
          var i = 0;
          var len = cookies.length;
          var cookie;
          for (; i < len; i++) {
            cookie = cookies[i].split('=');
            if (cookie[0] === key) {
              value = decodeURIComponent(cookie[1])
            }
          }
          value = value.split('|')[0];
          value = JSON.parse(decodeURIComponent(value));
          await assert(value, currentValue)
          await done()
        } catch (e) {
          await done(e.toString())
        }
      });
    })();
  });

  it('get a?', (done) => {
    (async () => {
      itDone = done;
      await page.evaluate(async () => {
        var currentValue = await getCurrentValue();
        try {
          await assert(s.get(), currentValue)
          await done()
        } catch (e) {
          await done(e.toString())
        }
      });
    })();
  });

  it('can remove?', (done) => {
    (async () => {
      itDone = done;
      await page.evaluate(async () => {
        try {
          s.remove();
          await assert(s.get(), null);
          await done()
        } catch (e) {
          await done(e.toString())
        }
      });
      await browser.close();
      server.close();
    })();
  });
})