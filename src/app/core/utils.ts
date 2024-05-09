import { Coordinate } from "ol/coordinate";

const EARTH_RADIUS = 6371e3; // metres
const ONE_DEGREE_IN_RAD = Math.PI / 180;
const ONE_DEGREE_IN_RAD_HALF = ONE_DEGREE_IN_RAD / 2;

/**
 * @see https://www.movable-type.co.uk/scripts/latlong.html
 */
export function distance(aC: Coordinate, bC: Coordinate): number {
  const lat1 = aC[1];
  const lat2 = bC[1];
  const lon1 = aC[0];
  const lon2 = bC[0];

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

/**
  * @see https://github.com/Experience-Monks/chaikin-smooth/blob/master/index.js
  */
export function smooth<T extends Coordinate[]>(input: T, iterations: number): T {
  const output = [];

  if (input.length > 0)
    output.push(input[0])

  for (let i = 0; i < input.length - 1; i++) {
    const p0 = input[i]
    const p1 = input[i + 1]

    output.push([0.75 * p0[0] + 0.25 * p1[0], 0.75 * p0[1] + 0.25 * p1[1]])
    output.push([0.25 * p0[0] + 0.75 * p1[0], 0.25 * p0[1] + 0.75 * p1[1]])
  }

  if (input.length > 1)
    output.push(input[input.length - 1])

  if (iterations > 0) {
    return smooth(output as T, iterations - 1);
  } else {
    return output as T;
  }
}
