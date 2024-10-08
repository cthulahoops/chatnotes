import React, { useState, KeyboardEvent } from 'react';
import TextareaAutosize from 'react-textarea-autosize'

type AddNoteFormProps = {
  onAddNote: (content: string) => void;
};

export default function AddNoteForm({ onAddNote }: AddNoteFormProps) {
  const [newNote, setNewNote] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submitNote();
  };

  const submitNote = () => {
    if (newNote.trim()) {
      onAddNote(newNote.trim());
      setNewNote('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      submitNote();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextareaAutosize
        value={newNote}
        onChange={(e) => setNewNote(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter a new note"
        minRows={3}
      />
      <button type="submit">Add Note</button>
    </form>
  );
}
