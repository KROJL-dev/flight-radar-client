import { AuthStore } from "@/features/auth/model";

export class RootStore {
  authStore: AuthStore;

  constructor() {
    this.authStore = new AuthStore(this);
  }
}

export const store = new RootStore();
