"use client";

import { useDispatch } from "react-redux";
import { useCallback } from "react";
import { setProduct } from "@/redux/private/productSlice";
import api from "./axios";

const useFetchProduct = () => {
  const dispatch = useDispatch();

  const fetchProduct = useCallback(async () => {
    try {
      const res = await api.get("/products");
      dispatch(setProduct(res.data));
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      
    }
  }, [dispatch]);

  return fetchProduct;
};

export default useFetchProduct;