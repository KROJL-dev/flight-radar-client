import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";

import Target from "../features/Target";
import { useEffect, useState } from "react";
import { socket } from "@/config/socket";

import "leaflet/dist/leaflet.css";

function MapClickHandler({ onClick }) {
  useMapEvents({
    click(e) {
      onClick(e.latlng);
    },
  });
  return null;
}

const generateId = () => Math.random().toString(36).substring(2, 10);

const style = { height: "100vh", width: "100%" };
const center = [50.45, 30.52];

export default function App() {
  const [flightsIds, setFlightsIds] = useState<string[]>([]);
  const [initialPos, setInitialPos] = useState<[number, number]>();

  useEffect(() => {
    const handleFlightRemoved = (msg: { flightId: string }) => {
      setFlightsIds((ids) => ids.filter((id) => id !== msg.flightId));
    };

    socket.on("flightRemoved", handleFlightRemoved);

    return () => {
      socket.off("flightRemoved", handleFlightRemoved);
    };
  }, []);

  return (
    <MapContainer center={center} zoom={6} style={style}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {flightsIds.map((flightId) => (
        <Target flightId={flightId} initialPos={initialPos} key={flightId} />
      ))}

      <MapClickHandler
        onClick={({ lat, lng }) => {
          setFlightsIds((value) => [...value, generateId()]);
          setInitialPos({ lat, lon: lng });
        }}
      />
    </MapContainer>
  );
}
