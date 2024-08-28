const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const socketIO = require("socket.io");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./model/userModel");

const app = express();
const server = http.createServer(app);
const io = socketIO(server, { cors: { origin: "*" } });

app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Message model
const MessageSchema = new mongoose.Schema({
  sender: String,
  content: String,
  timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model("Message", MessageSchema);

// Sample users
const users = [
  { id: 1, username: "user1", password: "password1" },
  { id: 2, username: "user2", password: "password2" },
];

// JWT secret
const JWT_SECRET = "secretkey";

//user Register
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user
  const newUser = new User({ email, username: name, password: hashedPassword });
  await newUser.save();
  const token = jwt.sign(
    { id: newUser._id, email: newUser.email },
    JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );

  res.status(201).json({ message: "User registered successfully", token });
});

//  User Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare the plain password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Authentication endpoint
// app.post("/login", async(req, res) => {
//     const { email, password } = req.body;

//   const user = await User.create({email, password})

// //   const user = users.find(
// //     (u) => u.username === username && u.password === password
// //   );

//   if (!user) {
//     return res.status(401).json({ message: "Invalid credentials" });
//   }

//   const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, {
//     expiresIn: "1h",
//   });
//   res.json({ token });
// });

// Middleware to verify JWT
const authenticateToken = (socket, next) => {
  const token = socket.handshake.auth.token;
  if (token) {
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) return next(new Error("Authentication error"));
      socket.user = user;
      next();
    });
  } else {
    next(new Error("Authentication error"));
  }
};

// Socket.io middleware for authentication
io.use(authenticateToken);

io.on("connection", (socket) => {
  console.log(`${socket.user.username} connected`);

  // Emit all messages on connection
  Message.find().then((messages) => {
    socket.emit("previousMessages", messages);
  });

  // Handle incoming messages
  socket.on("sendMessage", (message) => {
    const newMessage = new Message({
      sender: socket.user.username,
      content: message,
    });
    newMessage.save().then((savedMessage) => {
      io.emit("newMessage", savedMessage); 
    });
  });

  socket.on("disconnect", () => {
    console.log(`${socket.user.username} disconnected`);
  });
});

server.listen(5000, () => console.log("Server running on port 5000"));
