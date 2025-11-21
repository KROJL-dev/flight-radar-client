import { useEffect, useRef, useState } from "react";

import { socket } from "@/config/socket";
import type {
  Coordinate,
  FlightID,
  PositionListenerMSG,
  RouteListenerMSG,
} from "../../types";

import * as L from "leaflet";
import { Polyline, Marker, Popup } from "react-leaflet";

const MissileIcon = new URL("@/assets/missile.png", import.meta.url).href;

import "leaflet-rotatedmarker";
import React from "react";

interface Props extends FlightID {
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

const Target: React.FC<Props> = React.memo(({ flightId, initialPos }) => {
  const [heading, setHeading] = useState<number>(0);
  const [coordinate, setCoordinate] = useState<Coordinate | undefined>(
    initialPos
  );
  const [isActive, setIsActive] = useState<boolean>(true);
  const [route, setRoute] = useState<Coordinate[]>([]);

  const markerRef = useRef<RotatedMarker | null>(null);

  useEffect(() => {
    socket.emit("subscribe", {
      flightId,
      initialPos: { lat: initialPos[0], lon: initialPos[1] },
    });

    const onRoute = ({ flightId: msgFlightId, route }: RouteListenerMSG) => {
      if (msgFlightId !== flightId) return;
      const points = route.map((p) => [p.lat, p.lon] as Coordinate);
      setRoute(points);
    };

    const onPosition = ({
      flightId: msgFlightId,
      position: { lat, lon, heading, active },
    }: PositionListenerMSG) => {
      if (msgFlightId !== flightId) return;

      setHeading(heading);
      setCoordinate([lat, lon]);
      setRoute((prev) => [...prev, [lat, lon]]);
      setIsActive(active);
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
            <div>Ідентифікатор: {flightId}</div>
            <div>
              Координати: {coordinate[0]?.toFixed(2)},{" "}
              {coordinate[1]?.toFixed(2)}
            </div>
            <div>Напрям: {(heading || 0).toFixed(2)}</div>
          </Popup>
        </Marker>
      )}
    </>
  );
});
export default Target;
