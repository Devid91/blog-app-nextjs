"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";

// Define your global state interface
interface GlobalState {
  error: string | null;
  setError: (value: string | null) => void;
  userName: string;
  setUserName: (value: string) => void;
  waitBackGroundFetches: boolean;
  setWaitBackGroundFetches: (value: boolean) => void;
  timeoutComplete: boolean;
  setTimeoutComplete: (value: boolean) => void;
}

const useGlobalStore = create<GlobalState>()(
  devtools(
    (set) => ({
      error: null,
      setError: (value: string | null) =>
        set({ error: value }, false, "setError"),

      userName: "",
      setUserName: (value: string) =>
        set({ userName: value }, false, "setUserName"),

      waitBackGroundFetches: false,
      setWaitBackGroundFetches: (value: boolean) =>
        set(
          { waitBackGroundFetches: value },
          false,
          "setWaitBackGroundFetches"
        ),

      timeoutComplete: false,
      setTimeoutComplete: (value: boolean) =>
        set({ timeoutComplete: value }, false, "setTimeoutComplete"),
    }),
    {
      name: "GlobalStore", // Optional: name of the store for devtools
      enabled: process.env.NODE_ENV === "development", // Enable devtools only in development
    }
  )
);

export default useGlobalStore;
