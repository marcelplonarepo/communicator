const prisma = require("../../prisma/index");


module.exports = (data, socket) => {
    prisma.rooms.findUnique({
        where: {
            id: data.call
        }
    })
        .then(result => {
            console.log("emit")
            socket.broadcast.to(result.call).emit('user-disconnected', data.peerId)
            socket.leave(result.call);
        })
        .catch(err => {
            console.log(err);
        })

}