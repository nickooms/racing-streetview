import proj, { proj2 } from './proj.mjs';

const lon = 51.3064068;
const lat = 4.4053294;

const coords = proj2(lat, lon);

console.log(coords);
