import puppeteer from 'puppeteer';
import querystring from 'querystring';
import fetch from 'node-fetch';

const pKey = 'Ifck14OFidSut54ryB5caA';
// f7401jumn3u7yo9q4lzvem
const URL = 'https://www.mapillary.com/app/';
const url = `${URL}?${querystring.stringify({
  // lat: 51.30679961465481,
  lat: 51.3067996175481,
  lng: 4.406056239909276,
  z: 18.642720975107213,
  focus: 'photo',
  menu: false,
  pKey,
  x: 0.4916163833883386,
  y: 0.5268090586248929,
  zoom: 0,
})}`;
console.log(url);
const sleep = (ms = 5000) =>
  new Promise((resolve, reject) => {
    setTimeout(() => resolve(), ms);
  });
(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    // executablePath: "/usr/bin/google-chrome-unstable",
  });
  const page = await browser.newPage();
  await page.goto(url);
  await sleep();
  const datauri = await page.evaluate(() => {
    const canvas = Array.from(document.querySelectorAll('a')).map((a) => a.href);
    console.log(canvas);
    // return canvas.toDatatUrl();
  });
  console.log(datauri);
  await page.screenshot({ path: 'example.png' });
  const src = `https://images.mapillary.com/${pKey}/thumb-2048.jpg`;
  console.log(src);
  await browser.close();
})();
