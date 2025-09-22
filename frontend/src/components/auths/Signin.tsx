"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { useAuthStore } from "@/zustand/authStore";
import api from "@/utils/axios";
import { useAlert } from "../Alert";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/private/userSlice";
import Image from "next/image";

interface FormState {
  email: string;
  password: string;
}

export default function Signin() {
  const { showAlert, AlertComponent } = useAlert();
  const [form, setForm] = useState<FormState>({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { closeSignin, openSignup } = useAuthStore();
  const dispatch = useDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/signin", form);
      dispatch(setUser(res.data.user));
      showAlert(res.data.message, "success");
      closeSignin();
    } catch (err: unknown) {
      const errorMessage =
        (err as any)?.response?.data?.error || "Invalid credentials";
      showAlert(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 p-2 flex items-center justify-center bg-secondary/50 backdrop-blur-md z-50">
      <AlertComponent />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-secondary w-full max-w-md p-8 shadow-lg relative rounded-xl"
      >
        {/* Close button */}
        <button
          onClick={closeSignin}
          className="absolute top-4 right-4 p-2 rounded-full bg-secondary hover:bg-accent transition-colors cursor-pointer"
          aria-label="Close signin form"
        >
          <IoClose className="h-5 w-5 text-primary" />
        </button>

        <h2 className="text-2xl font-bold text-center mb-6 text-primary">
          Welcome Back
        </h2>

        {/* Animated Avatar */}
        <div className="flex justify-center mb-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="flex flex-col items-center"
          >
            <div className="w-16 h-16 rounded-full overflow-hidden shadow-lg relative">
              <Image
                src="/user.png"
                alt="User Avatar"
                fill
                className="object-cover"
              />
            </div>
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-2 font-medium text-primary"
            >
              Sign In Here
            </motion.p>
          </motion.div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 border border-primary bg-secondary text-primary focus:ring-2 focus:ring-accent outline-none rounded-lg"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-3 border border-primary bg-secondary text-primary focus:ring-2 focus:ring-accent outline-none rounded-lg"
            required
          />
          <div className="flex justify-between items-center">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded text-accent focus:ring-accent"
              />
              <span className="ml-2 text-sm text-secondary">
                Remember me
              </span>
            </label>
            <button
              type="button"
              className="text-accent hover:text-accent-hover text-sm font-medium cursor-pointer"
            >
              Forgot Password?
            </button>
          </div>

          <motion.button
            type="submit"
            whileHover={!loading ? { scale: 1.02 } : {}}
            whileTap={!loading ? { scale: 0.98 } : {}}
            disabled={loading}
            className={`w-full py-3 font-semibold transition-colors shadow-md rounded-lg ${
              loading
                ? "bg-secondary text-secondary cursor-not-allowed"
                : "bg-accent hover:bg-accent-hover active:bg-accent-active text-white cursor-pointer"
            }`}
          >
            {loading ? "Signing in..." : "Sign In"}
          </motion.button>
        </form>

        {/* Signup Link */}
        <div className="mt-6 text-center">
          <p className="text-secondary">
            Don&apos;t have an account?{" "}
            <button
              className="text-accent hover:underline font-medium cursor-pointer"
              onClick={openSignup}
            >
              Sign Up
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}