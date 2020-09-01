import { parsePolygon } from './wkt.mjs';
import BBOX from './bbox.mjs';
import { getFeature } from './wfs.mjs';
import fs from 'fs/promises';
import { svg, polyLine, polygon, circle, text } from './svg.mjs';
import { City, Street, Housenumber, Building } from './model/index.mjs';

const CITY_NAME = 'stabroek';
const STREET_NAME = 'markt';
const ENCODING = 'utf8';

const add = (a, b) => a + b;
const add1 = (x) => add(1, x);

const unique = (array) => [...new Set(array)];

const reverse = (point) => point.reverse();

const getCoordinates = (feature) => feature.geometry.coordinates;

const getGeometrie = (crabObject) => crabObject.Geometrie;

const json = (object) => JSON.stringify(object, null, 2);

const writeWFS = async (layer) => {
  const { features } = await getFeature(layer);
  await fs.writeFile(`output/wfs/${layer}.json`, json(features), ENCODING);
  return features;
};

const styles = {
  ADP: { fill: '#FFFF7F', stroke: '#FFBF00' },
  TRN: { fill: '#C0C0C0', stroke: '#848484' },
  WRI: { r: 0.6 },
  WVB: {
    stroke: 'white',
    strokeWidth: 0.5,
    strokeDasharray: '2 1',
  },
  GBA: {
    fill: '#CCCC66',
    strokeWidth: 0.353,
    stroke: '#CC0099',
  },
};

const main = async () => {
  const bboxPolyLines = new BBOX();
  const city = await City.byName(CITY_NAME);

  const street = await Street.byName(STREET_NAME, city);
  const housenumbers = await Street.housenumbers(street);

  const buildingIds = (await Promise.all(housenumbers.map(Housenumber.buildings)))
    .flat()
    .map(Building.getId);
  const buildings = await Promise.all(unique(buildingIds).map(Building.get));
  // console.log(buildings);
  bboxPolyLines.add(...buildings.map(getGeometrie).map(parsePolygon).flat().map(reverse));
  // const buildingPolygons = buildings
  //   .map((building) => parsePolygon(building.Geometrie))
  //   .map((pol) => {
  //     bboxPolyLines.add(...pol.map((p) => p.reverse()));
  //     return polygon(pol, { stroke: 'red', fill: 'red' });
  //   });

  const grounds = await writeWFS('TRN');
  // const parkingGrounds = grounds.map((ground) => polygon(getCoordinates(ground), styles.TRN));

  const parcels = await writeWFS('ADP');
  // const adminParcels = parcels.map((parcel) => polygon(getCoordinates(parcel), styles.ADP));

  const roads = await writeWFS('WBN');
  // const roadPolygons = roads
  //   .map((road) => [road, getCoordinates(road)])
  //   .map(([road, pol]) =>
  //     polygon(
  //       pol.map((p) => p.reverse()),
  //       {
  //         stroke: '#333333',
  //         strokeWidth: 0.353,
  //         fill: road.properties.TYPE === 1 ? '#ADADAD' : '#D6D6D6',
  //         fillOpacity: 1,
  //       }
  //     )
  //   );
  const { features } = await getFeature('WVB');
  const lines = features;
  // .filter(
  //   (feature) =>
  //     feature.properties.LSTRNMID === +street.StraatnaamId &&
  //     feature.properties.RSTRNMID === +street.StraatnaamId
  // );
  const polyLines = lines.map((line) => polyLine(getCoordinates(line), styles.WVB));
  const points = lines.map((line) => getCoordinates(line).map((point) => circle(point))).flat();
  lines.forEach((line) => {
    // bboxPolyLines.add(...getCoordinates(line));
  });
  bboxPolyLines.add(...lines.map((line) => getCoordinates(line)).flat());

  const getWGOStroke = (division) => {
    switch (division.properties.TYPE) {
      case 1: // grens zone zwakke weggebruiker (wcz)
        return '#BF00FF';
      case 2: // grens onverharde zone (woz)
        return '#FFD700';
      case 3: // rand van de rijbaan (wrb)
        return '#984C00';
    }
  };

  const buildingAdditions = await writeWFS('GBA');
  // const additions = buildingAdditions.map((addition) =>
  //   polygon(getCoordinates(addition), styles.GBA)
  // );

  const roadDivisions = await writeWFS('WGO');
  const divisions = roadDivisions.map((division) =>
    polyLine(getCoordinates(division), {
      strokeWidth: 0.353,
      stroke: getWGOStroke(division),
    })
  );

  const poles = await writeWFS('WPI');
  const lightPoles = poles.map((pole) => circle(getCoordinates(pole), { r: 0.5 }));

  const walls = await writeWFS('GVL');
  const frontWalls = walls.filter((wall) => wall.properties.TYPE === 1);

  const frontWallLines = frontWalls.map((wall) => {
    bboxPolyLines.add(...getCoordinates(wall));
    return polyLine(getCoordinates(wall), { stroke: 'black' });
  });

  const frontWallPoints = frontWalls.map((wall) => getCoordinates(wall).map(circle)).flat();

  const buildingHousenumbers = await writeWFS('TBLGBGADR');
  const housenumbersBuildings = buildingHousenumbers.map((buildingHousenumber) => {
    const coordinates = getCoordinates(buildingHousenumber);
    return [
      circle(coordinates),
      text(coordinates.map(add1), buildingHousenumber.properties.HNRLABEL),
    ];
  });

  const holes = await writeWFS('WRI');
  const manHoles = holes.map((hole) => circle(getCoordinates(hole), styles.WRI));

  const { min, width, height } = bboxPolyLines;
  const svgFile = svg({
    viewBox: [...min, width, height].join(' '),
    content: [
      ...parcels.map((parcel) => polygon(getCoordinates(parcel), styles.ADP)),
      ...grounds.map((ground) => polygon(getCoordinates(ground), styles.TRN)),
      ...roads
        .map((road) => [road, getCoordinates(road)])
        .map(([road, pol]) =>
          polygon(
            pol.map((p) => p.reverse()),
            {
              stroke: '#333333',
              strokeWidth: 0.353,
              fill: road.properties.TYPE === 1 ? '#ADADAD' : '#D6D6D6',
              fillOpacity: 1,
            }
          )
        ),
      ...buildings
        .map((building) => parsePolygon(building.Geometrie))
        .map((pol) => {
          bboxPolyLines.add(...pol.map((p) => p.reverse()));
          return polygon(pol, { stroke: 'red', fill: 'red' });
        }),
      ...buildingAdditions.map((addition) => polygon(getCoordinates(addition), styles.GBA)),
      ...polyLines,
      ...divisions,
      ...points,
      ...frontWallLines,
      ...frontWallPoints,
      ...lightPoles,
      ...housenumbersBuildings,
      ...manHoles,
    ].join('\n'),
  });
  await fs.writeFile('test.svg', svgFile, ENCODING);
};

main();
