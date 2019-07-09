const app = require("express")();
const http = require("http").Server(app);
const path = require('path');

const io = require("socket.io")(http);
const port = process.env.PORT || 3000;


let Usercounter = 0;

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});
app.get('/index.js', function(req, res) {
  res.sendFile((path.join(__dirname, '../client/index.js')));
});

io.on("connection", function(socket) {
  Usercounter = Usercounter + 1;
  io.emit("user", Usercounter);
  console.log("a user is connected");
  socket.on("disconnect", function() {
    Usercounter = Usercounter - 1;
    io.emit("user", Usercounter);
    console.log("user disconnected");
  });

  socket.on("audioMessage", function(msg) {
    io.emit("audioMessage", msg);
  });

  socket.on("recordStarted", () => {
    io.emit("playStarSound");
  })
});

http.listen(port, function() {
  console.log("listening to port:" + port);
});
