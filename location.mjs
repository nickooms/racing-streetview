import fetch from 'node-fetch';

const URL = 'http://loc.geopunt.be/v4/location';

const point = ({ X_Lambert72: x, Y_Lambert72: y }) => [x, y];

export const street = async (cityName, streetName) => {
  const response = await fetch(`${URL}?q=${cityName} ${streetName}`);
  const {
    LocationResult: [
      {
        Location: location,
        BoundingBox: { LowerLeft: min, UpperRight: max },
      },
    ],
  } = await response.json();
  return { location: point(location), boundingBox: [point(min), point(max)] };
};
