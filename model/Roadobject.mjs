import crab from '../crab.mjs';

export const get = async (roadobjectId) => {
  const [b] = await crab('GetWegobjectByIdentificatorWegobject', {
    IdentificatorWegobject: roadobjectId,
  });
  return b;
};

export const getId = (roadobjecr) => roadobjecr.IdentificatorWegobject;
