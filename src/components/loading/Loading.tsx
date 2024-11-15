"use client";

import { useState, useEffect, useCallback, type JSX } from "react";
import { twMerge } from "tailwind-merge";

// Define the LoadingProps interface
type LoadingProps = {
  screenSize?: string;
  dotNumbers?: string;
};

export default function Loading({
  screenSize = "",
  dotNumbers = "",
}: LoadingProps): JSX.Element {
  const [increaseLoading, setIncreaseLoading] = useState<string>("");

  const stringToConcat = ". ";
  const maxDots = 5;

  // Callback to update the loading text
  const handleLoading = useCallback(() => {
    setIncreaseLoading((prev) =>
      prev.split(stringToConcat).length - 1 >= maxDots
        ? ""
        : prev + stringToConcat
    );
  }, []);

  useEffect(() => {
    // Start interval to call handleLoading every 250 ms
    const increaseInterval = setInterval(handleLoading, 250);

    // Clear interval on component unmount
    return () => clearInterval(increaseInterval);
  }, [handleLoading]);

  return (
    <div
      className={twMerge(
        "place-content-center-screen text-white sm:text-6xl",
        screenSize
      )}
    >
      <div className="flex flex-row items-center justify-center text-center">
        <span>loading</span>
        <span className={twMerge("inline-block w-[6ch] text-left", dotNumbers)}>
          {increaseLoading}
        </span>
      </div>
    </div>
  );
}
