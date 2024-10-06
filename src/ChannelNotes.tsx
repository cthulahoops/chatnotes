import { useRef, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";

import { useSyncedStore } from "@syncedstore/react";
import AddNoteForm from "./AddNoteForm";
import Note from "./Note";

import store from "./store";

export default function ChannelNotes() {
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
