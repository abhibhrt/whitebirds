import { create } from "zustand";

type AuthState = {
  signupOpen: boolean;
  signinOpen: boolean;
  openSignup: () => void;
  closeSignup: () => void;
  openSignin: () => void;
  closeSignin: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  signupOpen: false,
  signinOpen: false,
  
  openSignup: () => set({ signupOpen: true, signinOpen: false }), 
  closeSignup: () => set({ signupOpen: false }),

  openSignin: () => set({ signinOpen: true, signupOpen: false }),
  closeSignin: () => set({ signinOpen: false }),
}));
