import { syncedStore, getYjsDoc } from "@syncedstore/core";
import { WebsocketProvider } from "y-websocket";
import { IndexeddbPersistence } from "y-indexeddb";

export type Note = {
  content: string;
  timestamp: number;
};

export type Channel = {
  notes: Note[];
};

type DataStore = {
  channels: Record<string, Channel>;
};

const store = syncedStore<DataStore>({ channels: {} });
export default store;

const doc = getYjsDoc(store);
new WebsocketProvider(
  "wss://mistle.fawn-pirate.ts.net/",
  "react-syncedstore-notes-app",
  doc,
);
new IndexeddbPersistence("chatnotes", doc);
