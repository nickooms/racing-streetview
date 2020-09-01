import crab from '../crab.mjs';
import { REGION_ID } from '../constants.mjs';

export const byName = async (name) => {
  const [city] = await crab('GetGemeenteByGemeenteNaam', {
    GemeenteNaam: name,
    GewestId: REGION_ID,
  });
  return city;
};
