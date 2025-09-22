"use client";

import { useDispatch } from "react-redux";
import { useCallback } from "react";
import { setUser } from "@/redux/private/userSlice";
import api from "./axios";

const useFetchUser = () => {
  const dispatch = useDispatch();

  const fetchUser = useCallback(async (): Promise<void> => {
    try {
      const res = await api.get("/personal");
      dispatch(setUser(res.data.user));
    } catch (err: unknown) {
      console.error(err);
    }
  }, [dispatch]);

  return fetchUser;
};

export default useFetchUser;
