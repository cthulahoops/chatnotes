import CreateChannelForm from "./CreateChannelForm";
import { useSyncedStore } from "@syncedstore/react";
import { Link } from "react-router-dom";

import store from "./store";

export default function Navigation() {
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
