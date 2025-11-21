import { socket } from "@/config/socket";
import { AppRouter } from "./providers/Router";
import { useStore } from "./providers/store";

const App = () => {
  const { authStore } = useStore();

  socket.on("notAllowed", () => {
    if (authStore.isAuth) {
      authStore.setIsAuth(false);
      window.location.pathname = "/login";
    }
  });

  return <AppRouter />;
};
export default App;
