// import { io } from "socket.io-client";

const clientSocket = io("/");

const peer = new Peer(undefined, {
  path: "/peerjs",
  host: "/",
  port: "3000",
});
peer.on("open", (id) => {
  clientSocket.emit("join", roomId, id);
  // console.log("id", roomId);
});
console.log("peer", peer);

const getMedia = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: true,
    });
    return stream;
  } catch (err) {
    console.err("Trouble fetching users media");
  }
};

const addVideoStream = (videoEl, stream, name) => {
  videoEl.srcObject = stream;
  videoEl.addEventListener("loadedmetadata", () => {
    videoEl.play();
  });
  const video = document.getElementById("video-grid");
  video.appendChild(videoEl);
};

// const media = getMedia();

//test
clientSocket.on("connection from backend", () =>
  console.log("connecting from front end")
);

//keep
// clientSocket.on("user-connected", async (userId, userName) => {
//   connectToNewUser(userId, userName, stream);
//   clientSocket.emit("name", userName);
// });

//keep
// clientSocket.on("addGuestName", (userName) => {
//   let guest = userName;
// });

peer.on("call", async (call) => {
  const stream = await getMedia();
  call.answer(stream);
  const video = document.createElement("video");
  call.on("stream", (remoteStream) => {
    addVideoStream(video, remoteStream, guest);
  });
});

const connectToNewUser = (userId, userName, stream) => {
  const call = peer.call(userId, stream);
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream, userId);
  });
  call.on("close", () => {
    video.remove();
  });
};
