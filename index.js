const PORT = process.env.PORT;
const io = require("socket.io")(PORT, {
    cors: {
        origin: "http://localhost:3000/",
    }
});

let users = [];

const adduser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) && users.push({ userId, socketId })
}
const removeuser = (socketId) => {
    users = users.filter(user => user.socketId !== socketId);
}

const getuser = (userId) => {
    return users.find(user => user.userId === userId)
}

io.on("connection", (socket) => {
    console.log("user connected");
    socket.on("addUser", userId => {
        adduser(userId, socket.id);
        io.emit("getUsers", users);
    });
    // send and get message
    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
        const user = getuser(receiverId);
        if (user) {
            io.to(user.socketId).emit("getMessage", {
                senderId,
                text,
            });
        }

    });

    socket.on("disconnect", () => {
        console.log("user Disconnected");
        removeuser(socket.id);
        io.emit("getUsers", users);
    });


});
