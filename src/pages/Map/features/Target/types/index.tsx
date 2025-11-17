export type Coordinate = [number, number];
export type Position = {
  alt: number; // meters
  heading: number; // degrees
  speed: number; // m/s
  timestamp: number;
  lat: number;
  lon: number;
  active: boolean;
};
export type FlightState = {
  id: string;
  lat: number;
  lon: number;
  alt: number;
  heading: number;
  speed: number;
  history: Position[];
  active: boolean;

  target?: Coordinate;
  path?: Coordinate[];
  pathIndex?: number;
  initialDistance?: number;

  paused?: boolean;

  desiredHeading?: number;
  headingSmoothed?: number;
  noiseSeed?: number;
};
