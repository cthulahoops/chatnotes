import { useEffect, useState, ReactNode } from "react";

import useLocalStorage from "./hooks/useLocalStorage";

import { SyncedStoreContext, SyncConfig } from "./store";

import { WebsocketProvider } from "y-websocket";
import { syncedStore, getYjsDoc } from "@syncedstore/core";
import { IndexeddbPersistence } from "y-indexeddb";
import { useSyncedStore } from "@syncedstore/react";

import { DataStore } from "./store";

export default function StoreProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useLocalStorage<SyncConfig | null>(
    "syncConfig",
    null,
  );
  const [wsProvider, setWsProvider] = useState<WebsocketProvider | null>(null);
  const [connected, setConnected] = useState<boolean>(false);

  const store = syncedStore<DataStore>({ channels: {} });
  const doc = getYjsDoc(store);

  // Initialize IndexedDB persistence
  new IndexeddbPersistence("chatnotes", doc);

  const syncStore = useSyncedStore(store);

  useEffect(() => {
    if (config && !wsProvider) {
      const newProvider = new WebsocketProvider(
        config.websocketUrl,
        config.roomName,
        doc,
      );
      setWsProvider(newProvider);
      newProvider.on("status", () => setConnected(newProvider.wsconnected));
    } else if (!config && wsProvider) {
      wsProvider.disconnect();
      setWsProvider(null);
    }

    return () => {
      if (wsProvider) {
        wsProvider.disconnect();
      }
    };
  }, [config, wsProvider]);

  const value = { store, config, setConfig, wsProvider, connected, syncStore };

  return (
    <SyncedStoreContext.Provider value={value}>
      {children}
    </SyncedStoreContext.Provider>
  );
}
