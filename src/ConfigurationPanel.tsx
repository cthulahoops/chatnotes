import React, { useState, useEffect } from "react";
import { useStoreContext } from "./store";

export default function ConfigurationPanel() {
  const { config, setConfig, wsProvider,  connected } = useStoreContext();
  const [editedConfig, setEditedConfig] = useState(
    config || { websocketUrl: "", roomName: "" },
  );

  useEffect(() => {
    if (config) {
      setEditedConfig(config);
    }
  }, [config]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedConfig((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConfig(editedConfig);
  };

  const connectionStatus = wsProvider
    ? connected
      ? "Connected"
      : "Disconnected"
    : "Not initialized";


  return (
    <main className="config-panel">
      <h2>Configuration Panel</h2>

      <div className="connection-status">
        <strong>Connection Status:</strong>
        <span className={connectionStatus.toLowerCase()}>
          {connectionStatus}
        </span>
      </div>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="websocketUrl">WebSocket URL</label>
          <input
            id="websocketUrl"
            type="text"
            name="websocketUrl"
            value={editedConfig.websocketUrl}
            onChange={handleInputChange}
            placeholder="wss://example.com"
            required
          />
        </div>
        <div>
          <label htmlFor="roomName">Room Name</label>
          <input
            id="roomName"
            type="text"
            name="roomName"
            value={editedConfig.roomName}
            onChange={handleInputChange}
            placeholder="my-room"
            required
          />
        </div>
        <div className="button-group">
          <button type="submit">Save Configuration</button>
          {config && (
            <button type="button" onClick={() => setConfig(null)}>
              Remove Configuration
            </button>
          )}
        </div>
      </form>
    </main>
  );
}
