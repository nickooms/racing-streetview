import crab from '../crab.mjs';

export const get = async (roadsegmentId) => {
  const [b] = await crab('GetWegsegmentByIdentificatorWegsegment', {
    IdentificatorWegsegment: roadsegmentId,
  });
  return b;
};

export const getId = (roadsegment) => roadsegment.IdentificatorWegsegment;
