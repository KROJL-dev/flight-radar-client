import { useNavigate } from "react-router-dom";

import { observer } from "mobx-react-lite";

import { useStore } from "@/app/providers/store";

const PrivateRoute: React.FC<React.PropsWithChildren> = observer(
  ({ children }) => {
    const { authStore } = useStore();
    const navigate = useNavigate();

    if (!authStore.isAuth) {
      navigate("/login");
      return;
    }

    return <>{children}</>;
  }
);

export default PrivateRoute;
