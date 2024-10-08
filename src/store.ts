import React, { createContext, useContext } from "react";
import { WebsocketProvider } from "y-websocket";
import { syncedStore } from "@syncedstore/core";

export type DataStore = {
  channels: Record<string, Channel>;
};

export type Note = {
  content: string;
  timestamp: number;
};

export type Channel = {
  notes: Note[];
};

export type SyncConfig = {
  websocketUrl: string;
  roomName: string;
};

export const SyncedStoreContext = createContext<SyncedStoreContextType | null>(
  null,
);

type SyncedStoreContextType = {
  config: SyncConfig | null;
  syncStore: ReturnType<typeof syncedStore<DataStore>>;
  setConfig: React.Dispatch<React.SetStateAction<SyncConfig | null>>;
  wsProvider: WebsocketProvider | null;
  connected: boolean;
};

export function useStoreContext() {
  const context = useContext(SyncedStoreContext);
  if (!context) {
    throw new Error(
      "useSyncedStoreContext must be used within a SyncedStoreProvider",
    );
  }
  return context;
}

export function useReactiveStore() {
  return useStoreContext().syncStore;
}
