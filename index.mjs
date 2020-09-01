import puppeteer from 'puppeteer';
import fsp from 'fs/promises';
import fs from 'fs';
import querystring from 'querystring';
import Canvas from 'canvas';

const X_TILES = 13;
const Y_TILES = 4;

const URL = 'https://www.instantstreetview.com';

const lon = 51.306457;
const lat = 4.405445;
const heading = -34.24;
const p = 5;
const zoom = 1;

const tileUrl = ({ panoid, x, y }) =>
  `https://geo1.ggpht.com/cbk?${querystring.stringify({
    cb_client: 'maps_sv.tactile',
    authuser: 0,
    hl: 'nl',
    gl: 'be',
    panoid,
    output: 'tile',
    x,
    y,
    zoom: 4,
    nbt: '',
    fover: 3,
  })}`;

const sleep = (ms = 5000) =>
  new Promise((resolve, reject) => {
    setTimeout(() => resolve(), ms);
  });

(async () => {
  // const url = `${URL}/@${lon},${lat},${heading}h,${p}p,${zoom}z`;
  const url =
    // 'https://www.google.be/maps/@51.3064068,4.4053294,3a,75y,70.49h,90t/data=!3m7!1e1!3m5!1sNKe-V9NUGVhIp3wsrEMMpw!2e0!6s%2F%2Fgeo1.ggpht.com%2Fcbk%3Fpanoid%3DNKe-V9NUGVhIp3wsrEMMpw%26output%3Dthumbnail%26cb_client%3Dmaps_sv.tactile.gps%26thumb%3D2%26w%3D203%26h%3D100%26yaw%3D60.457973%26pitch%3D0%26thumbfov%3D100!7i13312!8i6656';
    // 'https://www.google.be/maps/@51.3064068,4.4053294,3a,75y,70.49h,90t/data=!3m7!1e1!3m5!1sNKe-V9NUGVhIp3wsrEMMpw!2e0!6s%2F%2Fgeo1.ggpht.com%2Fcbk%3Fpanoid%3DNKe-V9NUGVhIp3wsrEMMpw&output=thumbnail&cb_client=maps_sv.tactile.gps&thumb=2&w=203&h=100&yaw=60.457973&pitch=0&thumbfov=100!7i13312!8i6656';
    'https://www.google.be/maps/@51.3064068,4.4053294,3a,75y,170.49h,90t/data=!3m7!1e1!3m5!1sNKe-V9NUGVhIp3wsrEMMpw!2e0!6s%2F%2Fgeo1.ggpht.com%2Fcbk%3Fpanoid%3DNKe-V9NUGVhIp3wsrEMMpw&output=thumbnail&cb_client=maps_sv.tactile.gps&thumb=2&w=203&h=100&yaw=60.457973&pitch=0&thumbfov=100!7i13312!8i6656';
  const browser = await puppeteer.launch({
    // executablePath: "/usr/bin/google-chrome-unstable",
  });
  const page = await browser.newPage();
  await page.goto(url);
  await sleep();
  const datauri = await page.evaluate(() => {
    const a = Array.from(document.querySelectorAll('a'))
      .map((a) => a.href)
      .filter((href) => href !== '' && href.startsWith('https://www.google.com/cbk'));
    return a;
  });
  console.log(datauri);
  const imageKey = querystring.parse(datauri.substr(datauri.indexOf('?') + 1)).image_key;
  const panoid = imageKey.substr(imageKey.length - 22);
  console.log(panoid);
  const html = Array(X_TILES)
    .fill(0)
    .map((_x, x) => {
      return Array(Y_TILES)
        .fill(0)
        .map((_y, y) => tileUrl({ panoid, x, y }));
    })
    .flat()
    .map((u) => `<img src="${u}">`)
    .join('\n');
  // console.log(html);
  await fsp.writeFile('tiles.html', html, 'utf8');
  const canvas = Canvas.createCanvas(X_TILES * 512, Y_TILES * 512);
  console.log(canvas);
  const ctx = canvas.getContext('2d');
  await Promise.all(
    Array(X_TILES)
      .fill(0)
      .map((_x, x) => {
        return Array(Y_TILES)
          .fill(0)
          .map((_y, y) => ({ panoid, x, y }));
      })
      .flat()
      .map(async ({ panoid, x, y }) => {
        const img = await Canvas.loadImage(tileUrl({ panoid, x, y }));
        ctx.drawImage(img, x * 512, y * 512);
      })
  );
  const out = fs.createWriteStream('test.jpeg');
  const stream = canvas.createJPEGStream();
  stream.pipe(out);
  out.on('finish', () => console.log('The JPEG file was created.'));
  await page.screenshot({ path: 'example.png' });

  await browser.close();
})();
