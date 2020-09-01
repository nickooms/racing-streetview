import fetch from 'node-fetch';
import querystring from 'querystring';

const URL = 'https://geoservices.informatievlaanderen.be/overdrachtdiensten/GRB/wfs';

export const getFeature = async (type = 'GVP') => {
  const query = {
    SERVICE: 'WFS',
    VERSION: '2.0.0',
    REQUEST: 'GetFeature',
    typeName: `GRB:${type}`,
    outputFormat: 'json',
    BBOX: [152546.79738901556, 221859.9860119559, 152560.24404501915, 221874.44745196775].join(','),
  };
  const url = `${URL}?${querystring.stringify(query)}`;
  const response = await fetch(url);
  // console.log(response);
  const json = await response.json();
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
