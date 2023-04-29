const EARTH_RADIUS = 6371e3; // metres
const ONE_DEGREE_IN_RAD = Math.PI / 180;
const ONE_DEGREE_IN_RAD_HALF = ONE_DEGREE_IN_RAD / 2;

/**
 * @see https://www.movable-type.co.uk/scripts/latlong.html
 */
export function distance(lat1: number, lon1: number, lat2: number, lon2: number): number {

  const φ1 = lat1 * ONE_DEGREE_IN_RAD; // φ, λ in radians
  const φ2 = lat2 * ONE_DEGREE_IN_RAD;
  const Δφ = (lat2 - lat1) * ONE_DEGREE_IN_RAD_HALF;
  const Δλ = (lon2 - lon1) * ONE_DEGREE_IN_RAD_HALF;

  const x = Math.sin(Δφ);
  const y = Math.sin(Δλ);

  const a = x * x + Math.cos(φ1) * Math.cos(φ2) * y * y;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS * c; // in metres
}
