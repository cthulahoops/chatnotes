# Collaborative Notes App

A real-time collaborative note-taking application built with React, Yjs, and Vite.

## Status

This is a quick prototype to try out an approach to note-taking and to experiment with
Yjs. It is very unfinished!

## Features

- Real-time synchronization across multiple clients
- Markdown support for rich text notes
- Channel-based organization of notes

## Setup

1. Clone the repository:
   ```
   git clone https://github.com/cthulahoops/chatnotes.git
   cd chatnotes
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the WebSocket server:
   ```
   npx y-websocket-server
   ```

4. In a new terminal, start the Vite development server:
   ```
   npm run dev
   ```

5. Open the URL shown in your terminal (typically [http://localhost:5173](http://localhost:5173)) in your browser.

## Usage

- Create a new channel or select an existing one from the sidebar
- Type your note in the input field and press Enter to add it
- Notes are automatically synchronized across all connected clients

## Technologies Used

- React
- Yjs
- SyncedStore
- y-websocket
- Vite

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
