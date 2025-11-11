import express from "express";
import http from "http";
import { Server } from "socket.io";
import bcrypt from "bcryptjs";

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(express.json());

let users = {}; // username -> passwordHash
let onlineUsers = {}; // socket.id -> username

// Register
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (users[username]) return res.status(400).send("User already exists");
  const hash = await bcrypt.hash(password, 10);
  users[username] = hash;
  res.send("Registered!");
});

// Login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const hash = users[username];
  if (!hash) return res.status(400).send("User not found");
  const match = await bcrypt.compare(password, hash);
  if (!match) return res.status(400).send("Incorrect password");
  res.send("Login success");
});

// Chat
io.on("connection", (socket) => {
  socket.on("join", (username) => {
    onlineUsers[socket.id] = username;
    io.emit("chat message", `${username} joined the chat`);
  });

  socket.on("chat message", (msg) => {
    const user = onlineUsers[socket.id];
    io.emit("chat message", `${user}: ${msg}`);
  });

  socket.on("disconnect", () => {
    const user = onlineUsers[socket.id];
    if (user) {
      io.emit("chat message", `${user} left`);
      delete onlineUsers[socket.id];
    }
  });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
