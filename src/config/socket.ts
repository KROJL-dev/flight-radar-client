import { io } from "socket.io-client";

export const socket = io(`${import.meta.env.VITE_APP_HOST}/flights`, {
  autoConnect: false,
});

export function connectWithKey(apiKey: string) {
  socket.auth = { apiKey };
  socket.connect();
}
