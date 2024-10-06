import { useRef, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useParams,
  Navigate,
} from "react-router-dom";

import { useSyncedStore } from "@syncedstore/react";
import { syncedStore, getYjsDoc } from "@syncedstore/core";
import { WebsocketProvider } from "y-websocket";
import { IndexeddbPersistence } from "y-indexeddb";

import AddNoteForm from "./AddNoteForm";
import Note from "./Note";
import CreateChannelForm from "./CreateChannelForm";

import "./App.css";

type Note = {
  content: string;
  timestamp: number;
};

type Channel = {
  notes: Note[];
};

type DataStore = {
  channels: Record<string, Channel>;
};

const store = syncedStore<DataStore>({ channels: {} });
const doc = getYjsDoc(store);
new WebsocketProvider(
  "wss://mistle.fawn-pirate.ts.net/",
  "react-syncedstore-notes-app",
  doc,
);
new IndexeddbPersistence("chatnotes", doc);

function ChannelComponent() {
  const { channelId = "default" } = useParams<{ channelId: string }>();
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
      timestamp: Date.now(),
    });
  };

  if (!channel) {
    return <Navigate to="/" />;
  }

  return (
    <main>
      <section className="channel-notes" ref={channelNotesRef}>
        <h2>#{channelId}</h2>
        <div>
          {channel.notes.map((note, index) => (
            <Note
              key={index}
              content={note.content}
              timestamp={note.timestamp}
            />
          ))}
        </div>
      </section>
      <AddNoteForm onAddNote={onAddNote} />
    </main>
  );
}

function Navigation() {
  const state = useSyncedStore(store);

  const handleCreateChannel = (newChannelName: string) => {
    if (newChannelName && !state.channels[newChannelName]) {
      state.channels[newChannelName] = { notes: [] };
    }
  };
  const sortedChannels = Object.keys(state.channels).sort((a, b) =>
    a.toLowerCase().localeCompare(b.toLowerCase()),
  );

  return (
    <nav>
      <h2>Channels</h2>
      <ul>
        {sortedChannels.map((id) => (
          <li key={id}>
            <Link to={`/channel/${id}`}>{id}</Link>
          </li>
        ))}
      </ul>
      <CreateChannelForm onCreateChannel={handleCreateChannel} />
    </nav>
  );
}

export default function NotesApp() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<Navigate to="/channel/default" />} />
        <Route path="/channel/:channelId" element={<ChannelComponent />} />
      </Routes>
    </Router>
  );
}
