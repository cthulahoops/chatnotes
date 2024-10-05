import { useState, useRef, useEffect } from 'react';
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
new WebsocketProvider("wss://mistle.fawn-pirate.ts.net/", "react-syncedstore-notes-app", doc);
new IndexeddbPersistence("chatnotes", doc);

export default function NotesApp() {
  const [channelId, setChannelId] = useState<string>('default');
  const state = useSyncedStore(store);
  const channel = state.channels[channelId];

  const channelNotesRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (channelNotesRef.current) {
      channelNotesRef.current.scrollTop = channelNotesRef.current.scrollHeight;
    }
  }, [channelId, channel?.notes.length]);

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
        <section className="channel-notes" ref={channelNotesRef}>
          <h2>#{channelId}</h2>
          <div>
            {channel?.notes.map((note, index) => (
              <Note key={index} content={note.content} timestamp={note.timestamp} />
            ))}
          </div>
        </section>
        <AddNoteForm onAddNote={onAddNote} />
      </main>
    </>
  );
}
