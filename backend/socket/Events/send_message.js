const prisma = require("../../prisma/index");

module.exports = (data, io) => {
    const results = {};

    prisma.rooms.findUnique({
        where: {
            id: data.roomId
        }
    })
        .then(result => {
            results.roomId = result.room;
            return prisma.messages.create({
                data: {
                    message: data.message,
                    userId: data.userId,
                    roomId: data.roomId,
                    createdAt: Date.now()
                }
            })
        })
        .then((result) => {
            return prisma.messages.findMany({
                where: {
                    roomId: data.roomId
                }
            })
        })
        .then(result => {
            io.to(results.roomId).emit("receive_message", {
                data: result,
                senderId: data.userId
            });
        })
        .catch(err => {
            console.log(err);
        })
}