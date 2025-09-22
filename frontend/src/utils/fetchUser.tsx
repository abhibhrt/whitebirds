"use client";

import { useDispatch } from "react-redux";
import { useCallback } from "react";
import { setUser } from "@/redux/private/userSlice";
import api from "./axios";

const useFetchUser = () => {
  const dispatch = useDispatch();

  const fetchUser = useCallback(async () => {
    try {
      const res = await api.get("/personal");
      dispatch(setUser(res.data.user));
    } catch (err) {
      
    }
  }, [dispatch]);

  return fetchUser;
};

export default useFetchUser;
