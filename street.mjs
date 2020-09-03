import BBOX from './bbox.mjs';
import { getFeature, setBBOX } from './wfs.mjs';
import fs from 'fs/promises';
import { svg, styledPolyLine as polyLine, styledPolygon as polygon, circle } from './svg.mjs';
import * as Location from './location.mjs';

const CITY_NAME = 'stabroek';
const STREET_NAME = 'markt';
const ENCODING = 'utf8';

const getCoordinates = (feature) => feature.geometry.coordinates;

const writeWFS = async (layer) => {
  const { features } = await getFeature(layer);
  return features;
};

const getType = (feature) => feature.properties.TYPE;

const getWGOStroke = (feature) => {
  switch (getType(feature)) {
    case 1:
      return '#BF00FF';
    case 2:
      return '#FFD700';
    case 3:
      return '#984C00';
  }
};

const styles = {
  ADP: () => ({ strokeWidth: 0.2, fill: '#FFFF7F', stroke: '#FFBF00' }),
  TRN: () => ({ strokeWidth: 0.2, fill: '#C0C0C0', stroke: '#848484' }),
  WRI: { r: 0.8, stroke: '#000000', fill: '#999999', strokeWidth: 0.2 },
  WVB: () => ({
    stroke: '#FFFFFF',
    strokeWidth: 0.5,
    strokeDasharray: '2 1',
  }),
  GBA: () => ({
    fill: '#CCCC66',
    strokeWidth: 0.2,
    stroke: '#CC0099',
  }),
  WBN: (feature) => ({
    stroke: '#333333',
    strokeWidth: 0.2,
    fill: getType(feature) === 1 ? '#ADADAD' : '#D6D6D6',
    fillOpacity: 1,
  }),
  WGO: (feature) => ({
    strokeWidth: 0.2,
    stroke: getWGOStroke(feature),
  }),
  GBG: () => ({ strokeWidth: 0.2, stroke: 'red', fill: 'red' }),
  WPI: { r: 0.5 },
  GVL_1: () => ({ stroke: '#000000' }),
};

const isType1 = (feature) => getType(feature) === 1;

const main = async () => {
  const location = await Location.street(CITY_NAME, STREET_NAME);
  const bbox = new BBOX(...location.boundingBox);
  bbox.grow(2);
  setBBOX(bbox);
  const { min, width, height } = bbox;
  const viewBox = [...min, width, height].join(' ');
  const gbg = await writeWFS('GBG');
  const wbn = await writeWFS('WBN');
  const trn = await writeWFS('TRN');
  const adp = await writeWFS('ADP');
  const gba = await writeWFS('GBA');
  const wvb = await writeWFS('WVB');
  const wpi = await writeWFS('WPI');
  const gvl = await writeWFS('GVL');
  const wri = await writeWFS('WRI');
  const wgo = await writeWFS('WGO');
  const frontWalls = gvl.filter(isType1);
  const svgFile = svg({
    viewBox,
    content: [
      adp.map(polygon(styles.ADP)),
      trn.map(polygon(styles.TRN)),
      wbn.map(polygon(styles.WBN)),
      gbg.map(polygon(styles.GBG)),
      gba.map(polygon(styles.GBA)),
      wvb.map(polyLine(styles.WVB)),
      wgo.map(polyLine(styles.WGO)),
      wvb.map((line) => getCoordinates(line).map(circle)).flat(),
      frontWalls.map(polyLine(styles.GVL_1)),
      frontWalls.map((wall) => getCoordinates(wall).map(circle)).flat(),
      wpi.map((pole) => circle(getCoordinates(pole), styles.WPI)),
      wri.map((hole) => circle(getCoordinates(hole), styles.WRI)),
    ].flat(),
  });
  await fs.writeFile('test.svg', svgFile, ENCODING);
};

main();
