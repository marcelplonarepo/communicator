const prisma = require("../../prisma/index");

module.exports = (data, socket) => {

    prisma.user.update({
        where: {
            id: data
        },
        data: {
            status: true,
            socketId: socket.id
        }

    })
        .then(result => {
            // console.log(result)
        })

    socket.on("disconnect", (reason) => {
        prisma.user.update({
            where: {
                id: data
            },
            data: {
                status: false,
                socketId: `${Math.random()} ${Date.now()}`
            }
        })
            .then(result => {
                // console.log(result)
            })
    })

}