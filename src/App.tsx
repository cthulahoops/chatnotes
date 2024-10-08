import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Navigation from "./Navigation";
import ChannelNotes from "./ChannelNotes";
import ConfigurationPanel from "./ConfigurationPanel";

import StoreProvider from "./StoreProvider";

import "./App.css";

export default function App() {
  return (
    <StoreProvider>
      <Router>
        <Navigation />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/channel/:channelId" element={<ChannelNotes />} />
          <Route path="/config" element={<ConfigurationPanel />} />
        </Routes>
      </Router>
    </StoreProvider>
  );
}

function Index() {
  return <main>Select or create a channel.</main>;
}
