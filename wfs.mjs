import fetch from 'node-fetch';
import querystring from 'querystring';
import fs from 'fs';
import fsp from 'fs/promises';
import { promisify } from 'util';

const URL = 'https://geoservices.informatievlaanderen.be/overdrachtdiensten/GRB/wfs';

let bbox = [152546.79738901556, 221859.9860119559, 152560.24404501915, 221874.44745196775];

export const setBBOX = ({ min, max }) => {
  bbox = [...min, ...max];
};

const exists = promisify(fs.exists);

export const getFeature = async (type = 'GVP') => {
  let json;
  const query = {
    typeName: `GRB:${type}`,
    SERVICE: 'WFS',
    VERSION: '2.0.0',
    REQUEST: 'GetFeature',
    outputFormat: 'json',
    BBOX: bbox.join(','),
  };
  const fileName = Object.entries(query)
    .map(([key, value]) => [key, value].join('='))
    .join(' ');
  const path = `cache/wfs/${fileName}.html`;
  if (await exists(path)) {
    json = JSON.parse(await fsp.readFile(path, 'utf8'));
  } else {
    const qs = querystring.stringify(query);
    const url = `${URL}?${qs}`;
    const response = await fetch(url);
    // console.log(response);
    json = await response.json();
    await fsp.writeFile(path, JSON.stringify(json, null, 2), 'utf8');
  }
  // console.dir(json, { colors: true, depth: null });
  return json;
};

// https://geoservices.informatievlaanderen.be/overdrachtdiensten/GRB/wfs?SERVICE=WFS&VERSION=2.0.0&REQUEST=GetFeature&typeName=GRB:GBG&BBOX=152546.79738901556,221859.9860119559,152560.24404501915,221874.44745196775

// const typeName = this.#featureTypes[0].name;
//     const query = {
//       service: 'wfs',
//       version: WFS.VERSION,
//       request: name,
//       typeName,
//       styles: 'default',
//       format: 'json',
//       crs: CRS,
//       bbox: BBOX,
//     };
