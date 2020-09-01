import crab from '../crab.mjs';

export const get = async (buildingId) => {
  const [b] = await crab('GetGebouwByIdentificatorGebouw', {
    IdentificatorGebouw: buildingId,
  });
  return b;
};

export const getId = (building) => building.IdentificatorGebouw;
