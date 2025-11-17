import { useCallback, useEffect, useState } from "react";

import {
  Circle,
  MapContainer,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";

import Target from "../features/Target";
import { Snackbar } from "@mui/material";

import { socket } from "@/config/socket";

import { Coordinate, FlightID } from "../types";

import "leaflet/dist/leaflet.css";

const MapClickHandler = ({ onClick }) => {
  useMapEvents({
    click(e) {
      onClick(e.latlng);
    },
  });
  return null;
};

const generateId = () => Math.random().toString(36).substring(2, 10);

const style = { height: "100vh", width: "100%" };
const center = { lat: 50.45, lng: 30.52 };

//***це тільки для демонтрації***
const DANGER_ZONES = [
  {
    lat: 53.25357418317993,
    lon: 34.39744943660905,
    radius: 50000,
    id: "dangerZone1",
  },
  {
    lat: 53.77005921474047,
    lon: 36.095438824334224,
    radius: 70000,
    id: "dangerZone2",
  },
  { lat: 54.2, lon: 36.0, radius: 45000, id: "dangerZone3" },
];

//***це тільки для демонтрації*** Зона де ціль втрачає звязок
const LOST_ZONES = [
  {
    lat: 54.510635879333144,
    lon: 36.25980525245943,
    radius: 50000,
    id: "lostZone1",
  },
  {
    lat: 57.61066041217554,
    lon: 39.84095401557063,
    radius: 60000,
    id: "lostZone2",
  },
  { lat: 54.2, lon: 36.0, radius: 45000, id: "lostZone3" },
];

const Map = () => {
  const [flightsIds, setFlightsIds] = useState<string[]>([]);
  const [initialPos, setInitialPos] = useState<Coordinate>();

  const [lastLost, setLastLost] = useState<string[]>([]);

  useEffect(() => {
    const handleFlightRemoved = ({ flightId }: FlightID) => {
      setLastLost((arr) => [...arr, flightId]);
      setFlightsIds((ids) => ids.filter((id) => id !== flightId));
    };

    socket.on("flightRemoved", handleFlightRemoved);

    return () => {
      socket.off("flightRemoved", handleFlightRemoved);
    };
  }, []);

  const onCloseNotification = useCallback(
    (id: string) => () =>
      setLastLost((arr) => arr.filter((itemId) => id !== itemId)),
    []
  );

  const handleMapClick = useCallback(({ lat, lng }) => {
    const id = generateId();
    setFlightsIds((value) => [...value, id]);
    setInitialPos([lat, lng]);
  }, []);

  return (
    <MapContainer center={center} zoom={6} style={style}>
      <Snackbar
        open={!flightsIds.length}
        autoHideDuration={6000}
        message={`Клік на карту, щоб створити ціль`}
      />
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {DANGER_ZONES.map((zone) => (
        <Circle
          center={[zone.lat, zone.lon]}
          radius={zone.radius}
          color="red"
          key={zone.id}
        >
          <Popup>
            <div>Трішки від себе. Не по ТЗ</div>
            <div>Зона ураження</div>
          </Popup>
        </Circle>
      ))}

      {LOST_ZONES.map((zone) => (
        <Circle
          center={[zone.lat, zone.lon]}
          radius={zone.radius}
          color="grey"
          key={zone.id}
        >
          <Popup>
            <div>Зона для демонтрації втрати сигналу</div>
          </Popup>
        </Circle>
      ))}
      {flightsIds.map((flightId) => (
        <Target flightId={flightId} initialPos={initialPos} key={flightId} />
      ))}

      <MapClickHandler onClick={handleMapClick} />
      {lastLost.map((lostId) => (
        <Snackbar
          open
          autoHideDuration={6000}
          onClose={onCloseNotification(lostId)}
          message={`Ціль ${lastLost} втрачена`}
          key={`snackbar-${lostId}`}
        />
      ))}
    </MapContainer>
  );
};
export default Map;
