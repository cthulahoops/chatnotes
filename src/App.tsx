import { useState } from 'react';
import { useSyncedStore } from "@syncedstore/react";
import { syncedStore, getYjsDoc } from "@syncedstore/core";
import { WebsocketProvider } from 'y-websocket';
import { IndexeddbPersistence } from "y-indexeddb";

import AddNoteForm from './AddNoteForm';

import Note from './Note';
import CreateChannelForm from './CreateChannelForm';

import './App.css';

type Note = {
  content: string;
  timestamp: number;
}

type Channel = {
  notes: Note[];
};
type DataStore = {
  channels: Record<string, Channel>;
};

const store = syncedStore<DataStore>({ channels: {} });
const doc = getYjsDoc(store);
new WebsocketProvider("ws://grape.fawn-pirate.ts.net:1234", "react-syncedstore-notes-app", doc);
new IndexeddbPersistence("chatnotes", doc);

export default function NotesApp() {
  const [channelId, setChannelId] = useState<string>('default');
  const state = useSyncedStore(store);
  const channel = state.channels[channelId];

  const onAddNote = (newNote: string) => {
    channel?.notes.push({
      content: newNote.trim(),
      timestamp: Date.now()
    });
  };

  const handleCreateChannel = (newChannelName: string) => {
    if (!state.channels[newChannelName]) {
      state.channels[newChannelName] = { notes: [] };
      setChannelId(newChannelName);
    }
  };

  return (
    <>
      <nav>
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
        <CreateChannelForm onCreateChannel={handleCreateChannel} />
      </nav>
      <main>
        <section className="channel-notes">
          <h2>Notes in {channelId}</h2>
          <ul>
            {channel?.notes.map((note, index) => (
              <li className="note">
                <Note key={index} content={note.content} timestamp={note.timestamp} />
              </li>
            ))}
          </ul>
        </section>
        <AddNoteForm onAddNote={onAddNote} />
      </main>
    </>
  );
}
