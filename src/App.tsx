import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";

import Navigation from "./Navigation";
import ChannelNotes from "./ChannelNotes";

import "./App.css";

export default function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/channel/:channelId" element={<ChannelNotes />} />
      </Routes>
    </Router>
  );
}

function Index() {
  return <main>Select or create a channel.</main>;
}
