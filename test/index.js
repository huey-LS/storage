const path = require('path');
var assert = require('assert');
const puppeteer = require('puppeteer');

describe('localStorage', function () {
  var browser, page, itDone;

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
      await page.goto('file://' + path.resolve(__dirname, './main.html'));

      await page.exposeFunction('assert', async (value, current) => {
        return assert.equal(value, current);
      })

      await page.exposeFunction('close', async (e) => {
        await browser.close();
      })

      await page.exposeFunction('done', async (e) => {
        if (typeof e === 'string') {
          e = new Error(e);
        }
        return itDone(e);
      })

      itDone = done;
      await page.evaluate(async () => {
        var s = new Storage('name', { storageType: 'localStorage' });
        window.s = s;
        await done();
      });
    })()
  })

  it('set a?', (done) => {
    (async () => {
      itDone = done;
      await page.evaluate(async () => {
        try {
          s.set('a');
          await assert(s.get(), JSON.parse(localStorage.getItem('name')).value)
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
        // console.log(123);
        try {
          s.set('a');
          await assert(s.get(), 'a')
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
        // console.log(123);
        try {
          s.remove();
          await assert(s.get(), null);
          await done()
        } catch (e) {
          await done(e.toString())
        }
      });
    })();
  });

  // await done(e)
})

describe('cookie', function () {
  var browser, page, itDone;

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
      await page.goto('file://' + path.resolve(__dirname, './main.html'));

      await page.exposeFunction('assert', async (value, current) => {
        return assert.equal(value, current);
      })

      await page.exposeFunction('close', async (e) => {
        await browser.close();
      })

      await page.exposeFunction('done', async (e) => {
        if (typeof e === 'string') {
          e = new Error(e);
        }
        return itDone(e);
      })

      itDone = done;
      await page.evaluate(async () => {
        var s = new Storage('name', { storageType: 'cookie' });
        window.s = s;
        await done();
      });
    })()
  })

  it('set a?', (done) => {
    (async () => {
      itDone = done;
      await page.evaluate(async () => {
        try {
          s.set('a');
          // await assert(s.get(), JSON.parse(localStorage.getItem('name')).value)
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
        console.log(123);
        console.log(document.cookie);
        try {
          s.set('a');
          await assert(s.get(), 'a')
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
        // console.log(123);
        try {
          s.remove();
          await assert(s.get(), null);
          await done()
        } catch (e) {
          await done(e.toString())
        }
      });
    })();
  });

  // await done(e)
})