const express = require("express");
const path = require("path");
const morgan = require("morgan");
const app = express();
// const server = require("http").Server(app);
const socket = require("socket.io");
const { ExpressPeerServer } = require("peer");
const { v4: uuidv4 } = require("uuid");

app.use(express.static(path.join(__dirname, "public")));
app.use(morgan("dev"));

app.set("views", path.join(__dirname, "server/views"));
app.set("view engine", "ejs");

app.get("/", (req, res, next) => {
  try {
    res.render("index", { key: "value" });
  } catch (err) {
    next(err);
  }
});

app.get("/join", (req, res, next) => {
  try {
    res.redirect(`/join/${uuidv4()}`);
  } catch (err) {
    next(err);
  }
});
app.get("/join/:id", (req, res, next) => {
  try {
    res.render("room", { roomId: req.params.id, name: req.query.name });
  } catch (err) {
    next(err);
  }
});
app.get("/joinexisting", (req, res, next) => {
  try {
    res.redirect(`/join/${req.query.room}`);
  } catch (err) {
    next(err);
  }
});

const server = app.listen(process.env.PORT || 3000);

io = socket(server);
io.on("connection", (socket) => {
  socket.emit("connection from backend");
  socket.on("join", (roomId, userId, userName) => {
    console.log("roomID", roomId, userId);
    socket.join(roomId);
    socket.to(roomId).emit("user-connected", userId, userName);

    //   socket.on("name", (userName) => {
    //     socket.to(roomId).emit("addName", userName);
    //   });
    //   socket.on("disconnect", () => {
    //     socket.to(roomId).emit("user-disconnected", userId);
    //   });
  });
});

const peerServer = ExpressPeerServer(app, {
  debug: true,
});

app.use("/peerjs", peerServer);
