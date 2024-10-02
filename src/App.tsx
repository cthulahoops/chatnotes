import React, { useState } from 'react';
import { useSyncedStore } from "@syncedstore/react";
import { syncedStore, getYjsDoc } from "@syncedstore/core";
import { WebsocketProvider } from 'y-websocket';
import { IndexeddbPersistence } from "y-indexeddb";

import './App.css';

type Note = string;
type Channel = {
  notes: Note[];
};
type DataStore = {
  channels: Record<string, Channel>;
};

const store = syncedStore<DataStore>({ channels: {} });
const doc = getYjsDoc(store);
new WebsocketProvider("ws://localhost:1234", "react-syncedstore-notes-app", doc);
new IndexeddbPersistence("chatnotes", doc);

export default function NotesApp() {
  const [channelId, setChannelId] = useState<string>('default');
  const [newNote, setNewNote] = useState('');
  const [newChannelName, setNewChannelName] = useState('');
  const state = useSyncedStore(store);

  if (!state.channels['default']) {
    state.channels['default'] = { notes: [] };
  }

  const channel = state.channels[channelId];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newNote.trim()) {
      channel?.notes.push(newNote.trim());
      setNewNote('');
    }
  };

  const handleCreateChannel = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newChannelName.trim() && !state.channels[newChannelName]) {
      state.channels[newChannelName] = { notes: [] };
      setChannelId(newChannelName);
      setNewChannelName('');
    }
  };

  return (
    <div>
      <h1>Collaborative Notes App</h1>

      <div>
        <h2>Channels</h2>
        <ul>
          {Object.keys(state.channels).map((id) => (
            <li key={id}>
              <button onClick={() => setChannelId(id)}>
                {id}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <form onSubmit={handleCreateChannel}>
        <input
          type="text"
          value={newChannelName}
          onChange={(e) => setNewChannelName(e.target.value)}
          placeholder="New channel name"
        />
        <button type="submit">Create New Channel</button>
      </form>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Enter a new note"
        />
        <button type="submit">Add Note</button>
      </form>

      <div>
        <h2>Notes in {channelId}</h2>
        <ul>
          {channel?.notes.map((note, index) => (
            <li key={index}>{note}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
