import crab from '../crab.mjs';
import { SorteerVeld } from '../constants.mjs';

export const byName = async (name, city) => {
  const [street] = await crab('GetStraatnaamByStraatnaam', {
    Straatnaam: name,
    GemeenteId: city.GemeenteId,
  });
  return street;
};

export const housenumbers = async (street) => {
  const housenumbers = await crab('ListHuisnummersByStraatnaamId', {
    StraatnaamId: street.StraatnaamId,
    SorteerVeld,
  });
  return housenumbers;
};

export const roadobjects = async (street) => {
  const roadobjects = await crab('ListWegobjectenByStraatnaamId', {
    StraatnaamId: street.StraatnaamId,
    SorteerVeld,
  });
  return roadobjects;
};

export const roadsegments = async (street) => {
  const roadsegments = await crab('ListWegsegmentenByStraatnaamId', {
    StraatnaamId: street.StraatnaamId,
    SorteerVeld,
  });
  return roadsegments;
};
