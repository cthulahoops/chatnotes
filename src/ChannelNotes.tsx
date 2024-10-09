import { useRef, useEffect } from "react";
import { useParams } from "react-router-dom";

import AddNoteForm from "./AddNoteForm";
import Note from "./Note";

import { useReactiveStore } from "./store";

export default function ChannelNotes() {
  const { channelId = "default" } = useParams<{ channelId: string }>();

  const state = useReactiveStore();

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

  const notes = channel?.notes || [];

  return (
    <main>
      <section className="channel-notes" ref={channelNotesRef}>
        <h2>#{channelId}</h2>
        <div>
          {notes.map((note, index) => (
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
