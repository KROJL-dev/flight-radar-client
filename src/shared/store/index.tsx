import { AuthStore } from "@/features/auth/model";

export class RootStore {
  authStore: AuthStore;

  constructor() {
    this.authStore = new AuthStore(this);
    // this.integrations = new IntegrationsStore(this);
  }
}

export const store = new RootStore();
