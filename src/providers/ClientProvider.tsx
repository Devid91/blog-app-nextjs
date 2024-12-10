"use client";

import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect, useState } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24,
      staleTime: 1000000,
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
    },
  },
});

export default function ClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [localStoragePersister, setLocalStoragePersister] = useState<ReturnType<
    typeof createSyncStoragePersister
  > | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const persister = createSyncStoragePersister({
        storage: window.localStorage,
      });
      setLocalStoragePersister(persister);
    }
  }, []);

  if (!localStoragePersister) {
    // Optionally, render a fallback or nothing until the persister is initialized
    return null;
  }

  const clearReactQueryCache = () => {
    queryClient.clear();
    localStorage.removeItem("REACT_QUERY_OFFLINE_CACHE");
  };

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: localStoragePersister,
      }}
    >
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
      {children}
    </PersistQueryClientProvider>
  );
}
