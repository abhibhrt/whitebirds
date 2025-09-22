// components/ClientLayout.tsx
"use client";

import { ReactNode, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useAlert } from "./Alert";
import AuthManager from "./auths/authManager";
import  useFetchUser from "@/utils/fetchUser";
import useFetchProduct from "@/utils/fetchProduct";

export default function ClientLayout({ children }: { children: ReactNode }) {
  const { AlertComponent } = useAlert();
  const fetchUser = useFetchUser();
  const fetchProduct = useFetchProduct();
  useEffect(() => {
    fetchUser();
    fetchProduct();
  }, [fetchUser]);

  return (
    <>
      <Navbar />
      <AlertComponent />
      {children}
      <AuthManager />
      <Footer />
    </>
  );
}