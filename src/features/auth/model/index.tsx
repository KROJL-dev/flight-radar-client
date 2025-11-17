import { makeObservable, action, observable } from "mobx";

import { api } from "@/config/axios";
import { RootStore } from "@/shared/store";

export class AuthStore {
  rootStore: RootStore;

  isAuth: boolean;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeObservable(this);
  }

  @action
  setIsAuth(value: boolean) {
    this.isAuth = value;
  }

  @action
  async login(apiKey: string) {
    console.log("apiKey", apiKey);
    const { data } = await api.post("auth/verify", { apiKey });
    return data;
  }
}
