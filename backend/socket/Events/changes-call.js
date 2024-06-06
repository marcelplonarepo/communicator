const prisma = require("../../prisma/index");

module.exports = (data, socket) => {
    prisma.rooms.findUnique({
        where: {
            id: data.call
        }
    })
        .then(result => {
            if(result){
                console.log("changes")
                socket.broadcast.to(result.call).emit('changes', data)
            }
        })
        .catch(err => {
            console.log(err);
        })

}