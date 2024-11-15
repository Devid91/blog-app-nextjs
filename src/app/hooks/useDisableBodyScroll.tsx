"use client";

import { useEffect } from "react";

export default function useDisableBodyScroll(state: boolean) {
  return useEffect(() => {
    if (state) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
      document.body.style.overflow = "hidden";
    };
  }, [state]);
}
