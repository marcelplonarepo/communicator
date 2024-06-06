const prisma = require("../../prisma/index");


module.exports = (data, socket) => {

    let call_room = null;


    new Promise((resolve, reject) => {
        if (call_room) {
            return prisma.rooms.findUnique({
                where: {
                    id: data.call
                }
            })
        }
        else {
            resolve(false)
        }
    })
        .then(result => {
            if (result) {
                call_room = result.call;
            }

            return prisma.rooms.findUnique({
                where: {
                    id: data.roomId
                }
            })
        })
        .then(result => {


            const sockets = [...socket.rooms]
            sockets.shift()

            sockets.forEach(singleRoom => {
                if (call_room && singleRoom != call_room) {
                    socket.leave(singleRoom);
                }
            })

            socket.join(result.room);

            return prisma.messages.findMany({
                where: {
                    roomId: data.roomId
                }
            })
        })
        .then((result) => {
            socket.emit("receive_message", {
                data: result,
                senderID: data.userId
            });
        })
        .catch(err => {
            console.log(err);
        })


}