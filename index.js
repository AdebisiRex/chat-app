const express = require("express");
// const path = require("path");
const app = express();

const { instrument } = require("@socket.io/admin-ui");
const cors = require("cors")
app.use(cors())
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.use(express.json({ limit: "5mb" }))

let connection = app.listen(2350, () => {
  console.log("we are here");
});
const io = require("socket.io")(connection, {
  cors: { origin: ["http://localhost:5500", "https://admin.socket.io"] },
});

let socketIO;
let sockets;
io.on("connection", (socket) => {
    socketIO= socket
    sockets = Array.from(io.sockets.sockets).map(socket => socket[0])
    console.log(sockets,  "cut ------------------------------")
//   console.log(socket.id);
  socket.on("custom", (message) => {
    console.log(message, socket.id);
  });
  socket.on("send-message", (message) => {
    console.log(message);
    socket.broadcast.emit("receive", { message, id: socket.id });
    // io.emit("receive-new", "do not hurt yourself");
  });
});

instrument(io, { auth: false });
app.get("/", (req, res) => {
  res.send({ message: "Are you playing", socket: new Object(socketIO) });
});

app.post("/private-chat", (req, res)=>{
    console.log(req.body)
 
    io.emit('receive-new', req.body.message)
    res.send({message: "just work please "})
})