import { useState } from 'react';

type InputFormProps = {
  onAddNote: (content: string) => void;
};

export default function InputForm({ onAddNote }: InputFormProps) {
  const [newNote, setNewNote] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newNote.trim()) {
      onAddNote(newNote.trim());
      setNewNote('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={newNote}
        onChange={(e) => setNewNote(e.target.value)}
        placeholder="Enter a new note"
      />
      <button type="submit">Add Note</button>
    </form>
  );
}
