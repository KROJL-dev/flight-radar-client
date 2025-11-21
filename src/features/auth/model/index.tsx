import { action, makeAutoObservable } from "mobx";

import { api } from "@/config/axios";
import { RootStore } from "@/shared/store";
import { connectWithKey } from "@/config/socket";

export class AuthStore {
  rootStore: RootStore;

  isAuth: boolean;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  @action
  setIsAuth(value: boolean) {
    this.isAuth = value;
  }

  @action
  async login(apiKey: string) {
    connectWithKey(apiKey);
    const { data } = await api.post("auth/verify", { apiKey });
    if (data) this.setIsAuth(true);
    return data;
  }
}
