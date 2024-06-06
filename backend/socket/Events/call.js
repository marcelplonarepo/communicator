const prisma = require("../../prisma/index");

module.exports = (data, io, socket) => {
    prisma.rooms.aggregateRaw({
        pipeline: [
            {
                $lookup: {
                    from: "chats",
                    localField: "_id",
                    foreignField: "roomId",
                    as: "chats"
                },

            },
            {
                $project: {
                    "_id": { "$toString": "$_id" },
                    room: 1,
                    type: 1,
                    chats: 1,
                    call: 1
                }
            },
            {
                $match: {
                    _id: data.roomId
                }
            },
            {
                $lookup: {
                    from: "user",
                    localField: "chats.userId",
                    foreignField: "_id",
                    as: "chats.users"
                },
            },
            {
                $project: {
                    "users": {
                        $map: {
                            input: "$chats.users",
                            as: "users",
                            in: {
                                _id: { "$toString": "$$users._id" },
                                status: "$$users.status",
                                socketId: "$$users.socketId",
                            }
                        }
                    },
                    type: 1,
                    call: 1,
                    room: 1
                }
            },
            {
                $project: {
                    users: {
                        $filter: {
                            input: '$users',
                            as: 'users',
                            cond: { $ne: ['$$users._id', data.userId] }
                        }
                    },
                    type: 1,
                    call: 1,
                    room: 1
                }
            }

        ]
    })
    .then(result => {

        if(result.length){
            result[0].users.forEach((user) => {
                // console.log(user.status, user.socketId)
                if(user.status && user.socketId){
                    io.to(user.socketId).emit("call-invite", {peerId: data.peerId, roomId: data.roomId});
                }
            })
        }
    })
    .catch(err => {
        console.log(err);
    })
}