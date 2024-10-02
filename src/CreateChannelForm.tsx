import { useState } from 'react';

type CreateChannelFormProps = {
  onCreateChannel: (channelName: string) => void;
}

export default function CreateChannelForm({ onCreateChannel }: CreateChannelFormProps) {
  const [newChannelName, setNewChannelName] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newChannelName.trim()) {
      onCreateChannel(newChannelName.trim());
      setNewChannelName('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={newChannelName}
        onChange={(e) => setNewChannelName(e.target.value)}
        placeholder="New channel name"
      />
      <button type="submit">Create New Channel</button>
    </form>
  );
}
