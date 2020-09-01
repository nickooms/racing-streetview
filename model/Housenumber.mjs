import crab from '../crab.mjs';
import { SorteerVeld } from '../constants.mjs';

export const buildings = async (housenumber) => {
  const buildings = await crab('ListGebouwenByHuisnummerId', {
    HuisnummerId: housenumber.HuisnummerId,
    SorteerVeld,
  });
  return buildings;
};
