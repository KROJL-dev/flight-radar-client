import { RootStore, store } from "@/shared/store";
import { createContext, useContext } from "react";

export const StoreContext = createContext<RootStore>(store);

export const useStore = (): RootStore => {
  const store = useContext(StoreContext);
  if (!store)
    throw new Error("You have forgot to use StoreProvider, shame on you.");
  return store;
};
