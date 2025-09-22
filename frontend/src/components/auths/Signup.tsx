"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { useAuthStore } from "@/zustand/authStore";
import api from "@/utils/axios";
import { useAlert } from "../Alert";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/private/userSlice";

interface FormState {
  name: string;
  email: string;
  password: string;
  mobNo: string;
}

export default function Signup() {
  const { showAlert, AlertComponent } = useAlert();
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    password: "",
    mobNo: "",
  });
  const [loading, setLoading] = useState(false);
  const { closeSignup, openSignin } = useAuthStore();
  const dispatch = useDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/signup", form);
      const userData = res.data.user || {};
      dispatch(setUser({ ...userData, mobNo: form.mobNo }));
      showAlert("Account created successfully", "success");
      closeSignup();
    } catch (err: unknown) {
      // Type-safe error handling
      let errorMessage = "Invalid credentials";
      if (err && typeof err === "object" && "response" in err) {
        const resp = (err as { response?: { data?: { error?: string } } })
          .response;
        if (resp?.data?.error) {
          errorMessage = resp.data.error;
        }
      }
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
          onClick={closeSignup}
          className="absolute top-4 right-4 p-2 rounded-full bg-secondary hover:bg-accent transition-colors cursor-pointer"
          aria-label="Close signup form"
        >
          <IoClose className="h-5 w-5 text-primary" />
        </button>

        <h2 className="text-2xl font-bold text-center mb-6 text-primary">
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name (e.g., Abhishek Bharti)"
            value={form.name}
            onChange={handleChange}
            className="w-full p-3 border border-primary bg-secondary text-primary focus:ring-2 focus:ring-accent outline-none rounded-lg"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address (e.g., name@example.com)"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 border border-primary bg-secondary text-primary focus:ring-2 focus:ring-accent outline-none rounded-lg"
            required
          />
          <input
            type="tel"
            name="mobNo"
            placeholder="Mobile No. (e.g., 9876543210)"
            value={form.mobNo}
            onChange={handleChange}
            className="w-full p-3 border border-primary bg-secondary text-primary focus:ring-2 focus:ring-accent outline-none rounded-lg"
          />
          <input
            type="password"
            name="password"
            placeholder="Password (e.g., User@123)"
            value={form.password}
            onChange={handleChange}
            className="w-full p-3 border border-primary bg-secondary text-primary focus:ring-2 focus:ring-accent outline-none rounded-lg"
            required
          />

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
            {loading ? "Signing up..." : "Sign Up"}
          </motion.button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-secondary mb-3">
            Already have an account?{" "}
            <button
              className="text-accent hover:underline font-medium cursor-pointer"
              onClick={openSignin}
            >
              Sign In
            </button>
          </p>
          <button className="text-sm text-secondary hover:text-accent underline cursor-pointer">
            Forgot Password?
          </button>
        </div>
      </motion.div>
    </div>
  );
}
