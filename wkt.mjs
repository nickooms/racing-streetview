export const parsePolygon = (geometry) =>
  geometry
    .replace('POLYGON ((', '')
    .replace('))', '')
    .split(', ')
    .map((coordinate) => coordinate.split(' ').map(parseFloat).reverse());

export const parseLineString = (geometry) =>
  geometry
    .replace('LINESTRING (', '')
    .replace(')', '')
    .split(', ')
    .map((coordinate) => coordinate.split(' ').map(parseFloat).reverse());
