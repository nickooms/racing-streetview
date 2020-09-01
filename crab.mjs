import fetch from 'node-fetch';
import querystring from 'querystring';
import fs from 'fs';
import fsp from 'fs/promises';
import { promisify } from 'util';

const URL = 'http://crab.agiv.be/Examples/Home/ExecOperation';

const headers = {
  'Content-Type': 'application/x-www-form-urlencoded',
};

const exists = promisify(fs.exists);

const crab = async (operation, params) => {
  let html;
  const fileName = Object.entries(params)
    .map(([key, value]) => [key, value].join('='))
    .join(' ');
  const path = `cache/${operation} ${fileName}.html`;
  if (await exists(path)) {
    html = await fsp.readFile(path, 'utf8');
  } else {
    const body = querystring.stringify({
      operation,
      parametersJson: JSON.stringify(
        Object.entries(params).map(([Name, Value]) => ({ Name, Value }))
      ),
    });
    // console.log(body);
    const response = await fetch(URL, {
      method: 'POST',
      headers,
      body,
    });
    html = await response.text();
    await fsp.writeFile(path, html, 'utf8');
  }
  // console.log(html);
  const table = html
    .replace(`<table border='1' cellspacing='0'><tr><td>`, '')
    .replace('</td></tr></table>', '')
    .split('</td></tr><tr><td>')
    .map((row) =>
      row
        .split('</td><td>')
        .map((cell) =>
          cell.replace('<b>', '').replace('</b>', '').replace('<i>', '').replace('</i>', '')
        )
        .map((cell) => (cell === 'NULL' ? null : cell))
    );
  const [columns, ...data] = table;
  const rows = data.map((row) =>
    row.reduce((result, cell, index) => ({ ...result, [columns[index]]: cell }), {})
  );
  return rows;
};

// const main = async () => {
//   await crab('GetStraatnaamByStraatnaam', { Straatnaam: 'markt', GemeenteId: 23 });
// };

// main();

export default crab;
