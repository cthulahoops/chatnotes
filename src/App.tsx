import './App.css'

import { useState } from 'react';
import { useSyncedStore } from "@syncedstore/react";
import { syncedStore, getYjsDoc } from "@syncedstore/core";
import { WebsocketProvider } from 'y-websocket';
import { IndexeddbPersistence } from "y-indexeddb";

type Note = string;
type Channel = {
  notes: Note[];
};
type DataStore = {
  channels: Record<string, Channel>;
};

const store = syncedStore<DataStore>({ channels: {} });

const doc = getYjsDoc(store);

new WebsocketProvider("ws://localhost:1234", "react-syncedstore-notes-app", getYjsDoc(store)
);
// new WebrtcProvider("my-document-id", doc);
new IndexeddbPersistence("chatnotes", doc);

export default function NotesApp() {
  const [channelId, setChannelId] = useState<string>('default');
  const [newNote, setNewNote] = useState('');
  const state = useSyncedStore(store);

  const channel = state.channels[channelId];

  if (!channel) {
    state.channels[channelId] = { notes: [] };
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newNote.trim()) {
      channel?.notes.push(newNote.trim());
      setNewNote('');
    }
  };

  return (
    <div>
      <h1>Collaborative Notes App</h1>
      <ul>
        {Object.keys(state.channels).map((channelId) => (
          <li key={channelId}>
            <button
              onClick={() => setChannelId(channelId)}
            >
              {channelId}
            </button>
          </li>
        ))
        }
      </ul>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Enter a new note"
        />
        <button type="submit">
          Add Note
        </button>
      </form>
      <ul>
        {channel?.notes.map((note, index) => (
          <li key={index}>{note}</li>
        ))}
      </ul>
    </div>
  );
};
