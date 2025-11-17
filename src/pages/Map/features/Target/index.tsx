import { useEffect, useRef, useState } from "react";

import { socket } from "@/config/socket";
import type { Coordinate, FlightState, Position } from "./types";

import * as L from "leaflet";
import { Polyline, Marker, Popup } from "react-leaflet";

const MissileIcon = new URL("@/assets/missile.png", import.meta.url).href;

import "leaflet-rotatedmarker";

interface Props {
  flightId: string;
  initialPos: Coordinate;
}

interface RotatedMarker extends L.Marker {
  setRotationAngle: (angle: number) => void;
  setRotationOrigin?: (origin: string) => void;
}

const markerIcon = new L.Icon({
  iconUrl: MissileIcon,
  iconSize: [25, 41],
  iconAnchor: [20, 40],
});

const Target: React.FC<Props> = ({ flightId, initialPos }) => {
  const [heading, setHeading] = useState<number>(0);
  const [coordinate, setCoordinate] = useState<Coordinate | undefined>(
    initialPos
  );
  const [isActive, setIsActive] = useState<boolean>(true);
  const [route, setRoute] = useState<Coordinate[]>([]);

  const markerRef = useRef<RotatedMarker | null>(null);

  useEffect(() => {
    console.log("flightId", flightId);
    socket.emit("subscribe", { flightId, initialPos });

    const onRoute = (msg: { flightId: string; route: Position[] }) => {
      if (msg.flightId !== flightId) return;
      const points = msg.route.map((p) => [p.lat, p.lon] as Coordinate);
      setRoute(points);
    };

    const onPosition = (msg: { flightId: string; position: FlightState }) => {
      if (msg.flightId !== flightId) return;

      setHeading(msg.position.heading);
      setCoordinate([msg.position.lat, msg.position.lon]);
      setRoute((prev) => [...prev, [msg.position.lat, msg.position.lon]]);
      setIsActive(msg.position.active);
    };

    socket.on("route", onRoute);
    socket.on("position", onPosition);

    return () => {
      socket.emit("unsubscribe", { flightId });
      socket.off("route", onRoute);
      socket.off("position", onPosition);
    };
  }, [flightId, initialPos]);

  useEffect(() => {
    if (!markerRef.current) return;

    try {
      const orientationCorrection = 0;
      markerRef.current.setRotationAngle(
        (heading ?? 0) + orientationCorrection
      );
      markerRef.current.setRotationOrigin?.("center");
    } catch (e) {
      console.error(e);
    }
  }, [heading]);

  return (
    <>
      {route.length > 1 && <Polyline positions={route} />}

      {coordinate && (
        <Marker
          position={coordinate}
          icon={markerIcon}
          ref={markerRef}
          opacity={isActive ? 1 : 0.5}
        >
          <Popup>
            <div>
              <b>{flightId}</b>
            </div>
          </Popup>
        </Marker>
      )}
    </>
  );
};
export default Target;
