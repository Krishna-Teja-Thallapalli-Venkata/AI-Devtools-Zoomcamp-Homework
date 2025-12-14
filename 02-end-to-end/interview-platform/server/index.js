const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const userMap = {};

io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on("join-room", (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room: ${roomId}`);
        // Optionally notify others in room
    });

    socket.on("code-change", ({ roomId, code }) => {
        // Broadcast code change to everyone else in the room
        socket.to(roomId).emit("code-update", code);
    });

    socket.on("sync-code", ({ socketId, code }) => {
        io.to(socketId).emit("code-update", code); // Sync usage if needed
    });

    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
    });
});

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`SERVER RUNNING ON PORT ${PORT}`);
});
