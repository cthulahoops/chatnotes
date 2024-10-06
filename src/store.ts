import React, { createContext, useContext } from "react";
import { WebsocketProvider } from "y-websocket";
import { syncedStore } from "@syncedstore/core";
import { useSyncedStore } from "@syncedstore/react";

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
  store: ReturnType<typeof syncedStore<DataStore>>;
  config: SyncConfig | null;
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

export function useReactiveStore(): ReturnType<typeof syncedStore<DataStore>> {
  const { store } = useStoreContext();
  return useSyncedStore(store);
}
