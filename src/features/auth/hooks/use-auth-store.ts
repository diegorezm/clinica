import {SafeUser} from "@/models/User";
import {create} from "zustand";

interface AuthState {
  user: SafeUser | null;
  setUser: (user: SafeUser | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  setUser: (user) => set({user}),
  clearAuth: () => set({user: null}),
}));
