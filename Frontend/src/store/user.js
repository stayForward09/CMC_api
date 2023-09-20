import { create } from "zustand";

export const useUserStore = create((set) => ({
  user: null,
  setUser: (data) => {
    set({ user: data });
  },
}));
