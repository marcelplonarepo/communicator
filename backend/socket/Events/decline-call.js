const prisma = require("../../prisma/index");

module.exports = (data, socket) => {
    prisma.rooms.findUnique({
        where: {
            id: data.call
        }
    })
        .then(result => {
            if(result){
                socket.broadcast.to(result.call).emit('decline', data.userId)
            }
        })
        .catch(err => {
            console.log(err);
        })

}