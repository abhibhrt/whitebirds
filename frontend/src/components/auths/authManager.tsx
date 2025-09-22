"use client";
import { useAuthStore } from "@/zustand/authStore";
import Signup from "./Signup";
import Signin from "./Signin";

export default function AuthManager() {
  const { signupOpen, signinOpen } = useAuthStore();
  return (
    <>
      <div>
        {signupOpen && <Signup />}
        {signinOpen && <Signin />}
      </div>
    </>
  );
}
