import proj4 from 'proj4';

// var firstProjection =
//   'PROJCS["NAD83 / Massachusetts Mainland",GEOGCS["NAD83",DATUM["North_American_Datum_1983",SPHEROID["GRS 1980",6378137,298.257222101,AUTHORITY["EPSG","7019"]],AUTHORITY["EPSG","6269"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.01745329251994328,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4269"]],UNIT["metre",1,AUTHORITY["EPSG","9001"]],PROJECTION["Lambert_Conformal_Conic_2SP"],PARAMETER["standard_parallel_1",42.68333333333333],PARAMETER["standard_parallel_2",41.71666666666667],PARAMETER["latitude_of_origin",41],PARAMETER["central_meridian",-71.5],PARAMETER["false_easting",200000],PARAMETER["false_northing",750000],AUTHORITY["EPSG","26986"],AXIS["X",EAST],AXIS["Y",NORTH]]';
// var secondProjection =
//   '+proj=gnom +lat_0=90 +lon_0=0 +x_0=6300000 +y_0=6300000 +ellps=WGS84 +datum=WGS84 +units=m +no_defs';
export const EPSG_31370 = `
  PROJCS[
    "Belge 1972 / Belgian Lambert 72",
    GEOGCS[
      "Belge 1972",
      DATUM[
        "Reseau_National_Belge_1972",
        SPHEROID["International 1924",6378388,297,AUTHORITY["EPSG","7022"]],
        TOWGS84[106.869,-52.2978,103.724,-0.33657,0.456955,-1.84218,1],
        AUTHORITY["EPSG","6313"]
      ],
      PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],
      UNIT["degree",0.01745329251994328,AUTHORITY["EPSG","9122"]],
      AUTHORITY["EPSG","4313"]
    ],
    UNIT["metre",1,AUTHORITY["EPSG","9001"]],
    PROJECTION["Lambert_Conformal_Conic_2SP"],
    PARAMETER["standard_parallel_1",51.16666723333333],
    PARAMETER["standard_parallel_2",49.8333339],
    PARAMETER["latitude_of_origin",90],
    PARAMETER["central_meridian",4.367486666666666],
    PARAMETER["false_easting",150000.013],
    PARAMETER["false_northing",5400088.438],
    AUTHORITY["EPSG","31370"],
    AXIS["X",EAST],
    AXIS["Y",NORTH]
  ]
`.replace(/\n|\t/g, '');

const proj = (longitude, latitude) => proj4(EPSG_31370, [longitude, latitude]);

export const proj2 = (longitude, latitude) => proj4('WGS84', EPSG_31370, [longitude, latitude]);
//I'm not going to redefine those two in latter examples.
// proj4(firstProjection, secondProjection, [2, 5]);
// [-2690666.2977344505, 3662659.885459918]
// console.log(proj4(EPSG_31370, [4.3359033057084, 51.3356385251692]));
export default proj;
