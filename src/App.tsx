import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import Navigation from "./Navigation";
import ChannelNotes from "./ChannelNotes";

import "./App.css";

export default function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<Navigate to="/channel/default" />} />
        <Route path="/channel/:channelId" element={<ChannelNotes />} />
      </Routes>
    </Router>
  );
}

