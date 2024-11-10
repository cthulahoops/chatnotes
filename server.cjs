const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;

app.use(
  "/assets",
  express.static(path.join(__dirname, "dist", "assets"), {
    maxAge: "1y",
    immutable: true,
  }),
);

app.get("*", (req, res) => {
  res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
