export type Coordinate = [number, number]; // [latitude, longitude]

export type AirTarget = {
  heading: number; // degrees
  speed: number; // m/s
  lat: number; // latitude
  lon: number; // longitude
};
export type Position = {
  timestamp: number; // ms
} & AirTarget;

export type FlightState = {
  id: string;
  history: Position[];
  active: boolean; // is flight active
} & AirTarget;

export type FlightID = { flightId: string };
export type RouteListenerMSG = { route: Position[] } & FlightID;
export type PositionListenerMSG = { position: FlightState } & FlightID;
