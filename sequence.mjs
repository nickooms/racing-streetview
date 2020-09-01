import fsp from 'fs/promises';
import fs from 'fs';
import { promisify } from 'util';
import { proj2 } from './proj.mjs';
import BBOX from './bbox.mjs';

const exists = promisify(fs.exists);
(async () => {
  const { features: sequences } = JSON.parse(await fsp.readFile('sequences.json', 'utf8'));
  const features = sequences.map((feature) => {
    const {
      properties,
      geometry: { coordinates },
    } = feature;
    const { key, coordinateProperties } = properties;
    const images = coordinateProperties.image_keys;
    return { key, images, coordinates };
  });

  const bbox = new BBOX();
  const allCoords = await Promise.all(
    features.map(async (feature) => {
      const folder = `output/${feature.key}`;
      if (!(await exists(folder))) {
        await fsp.mkdir(folder);
      }
      // console.log({ feature });
      const wgets = feature.images
        .map((image, index) => {
          const url = `https://images.mapillary.com/${image}/thumb-2048.jpg`;
          return `wget -c --output-document=${`${process.cwd()}/${folder}/${image}.jpg`} ${url}`;
        })
        .join('\n');
      await fsp.writeFile('imgs.sh', 'cd output\nmkdir ${folder}\n' + wgets, 'utf8');
      const coords = feature.coordinates.map((coordinates, index) =>
        proj2(coordinates[0], coordinates[1])
      );
      bbox.add(...coords);
      return coords;
    })
  );
  // console.log(allCoords);
  const { width, height } = bbox;
  console.log({ width, height });
})();
