

const prisma = require("../prisma/index");

module.exports.showAll = (req, res) => {

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
                    type: 1,
                    chats: {
                        $map: {
                            input: "$chats",
                            as: "chats",
                            in: {
                                userId: { "$toString": "$$chats.userId" },
                                time: "$$chats.time"
                            }
                        }
                    },
                }
            },
            {
                $match: {
                    "chats.userId": req.body.data.userId
                }
            },
            {
                $project: {
                    type: 1,
                    chats: {
                        $filter: {
                            input: "$chats",
                            as: "chats",
                            cond: {
                                $eq: ["$$chats.userId", req.body.data.userId]
                            }
                        },


                    },
                }
            },
            {
                $project: {
                    type: 1,
                    time: {
                        $first: "$chats.time",
                    },
                }
            },
            {
                $lookup: {
                    from: "messages",
                    localField: "_id",
                    foreignField: "roomId",
                    as: "messages"
                },
            },
            {
                $match: {
                    messages: { $ne: [] }
                }
            },
            {
                $project: {
                    type: 1,
                    time: 1,
                    message: {
                        $last: "$messages",
                    },
                    messages: {
                        $map: {
                            input: "$messages",
                            as: "messages",
                            in: {
                                _id: { "$toString": "$$messages._id" },
                                userId: { "$toString": "$$messages.userId" },
                                createdAt: "$$messages.createdAt",
                            }
                        }
                    },
                }
            },
            {
                $project: {
                    type: 1,
                    messages: {
                        $filter: {
                            input: "$messages",
                            as: "messages",
                            cond: {
                                $and: [
                                    {
                                        $ne: ["$$messages.userId", req.body.data.userId],

                                    },
                                    {
                                        $gt: ["$$messages.createdAt", "$time"]
                                    }
                                ]

                            }
                        }
                    },
                    message: 1
                }
            },
            {
                $project: {
                    type: 1,
                    message: 1,
                    messages: { $size: "$messages" }
                }
            },
            {
                $lookup: {
                    from: "user",
                    localField: "message.userId",
                    foreignField: "_id",
                    as: "message.user"
                }
            },
            {
                $project: {
                    type: 1,
                    "message.message": 1,
                    "message.user": { $first: "$message.user" },
                    messages: 1
                }
            },
            {
                $lookup: {
                    from: "chats",
                    localField: "_id",
                    foreignField: "roomId",
                    as: "chats"
                },
            },
            {
                $lookup: {
                    from: "user",
                    localField: "chats.userId",
                    foreignField: "_id",
                    as: "chats.usersId"
                },
            },
            {
                $project: {
                    type: 1,
                    "message.username": "$message.user.username",
                    "message.profile": "$message.user.profile",
                    "message.message": "$message.message",
                    messages: 1,
                    "users": {
                        $map: {
                            input: "$chats.usersId",
                            as: "chats",
                            in: {
                                userId: { "$toString": "$$chats._id" },
                                username: "$$chats.username",
                                profile: "$$chats.profile",
                            }
                        }
                    }

                }
            },
            {
                $project: {
                    type: 1,
                    "roomId": { "$toString": "$_id" },
                    message: 1,
                    messages: 1,
                    "users": {
                        $filter: {
                            input: "$users",
                            as: "users",
                            cond: {
                                $ne: ["$$users.userId", req.body.data.userId]
                            }
                        }
                    }

                }
            }

        ]
    })
        .then(results => {
            res.json(results);
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(500)
        })
};


module.exports.roomData = (req, res) => {



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
                    _id: req.body.roomId
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
                                username: "$$users.username",
                                profile: "$$users.profile",
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
                            cond: { $ne: ['$$users._id', req.body.userId] }
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
            res.json(result)
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(500)
        })

}




module.exports.people = (req, res) => {

    prisma.user.findMany({
        where: {
            username: {
                mode: 'insensitive',
                contains: req.body.search
            },
            NOT: {
                id: {
                    equals: req.body.userId
                }
            }
        },
        select: {
            id: true,
            username: true,
            profile: true
        }
    })
        .then(result => {
            res.json(result)
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(500)
        })

}




module.exports.checkRoom = (req, res) => {

    prisma.rooms.aggregateRaw({
        pipeline: [
            {
                $lookup: {
                    from: "chats",
                    localField: "_id",
                    foreignField: "roomId",
                    as: "users"
                },

            },
            {
                $project: {
                    "_id": { "$toString": "$_id" }, "users": {
                        $map: {
                            input: "$users",
                            as: "users",
                            in: {
                                _id: { "$toString": "$$users._id" },
                                userId: { "$toString": "$$users.userId" },
                                roomId: { "$toString": "$$users.roomId" },
                            }
                        }
                    }
                }
            },
            {
                $match: {
                    "users.userId": {
                        $all: [req.body.userId, req.body.personId]
                    }
                }
            }
        ]
    })
        .then(result => {
            // res.json(result)
            if (result.length) {
                res.json(result[0]._id)
            }
            else {

                const results = {}


                if (!req.body.type)

                    prisma.rooms.create({
                        data: {
                            type: "chat"
                        }
                    })
                        .then(roomResult => {
                            results.rooms = roomResult;
                            return prisma.chats.createMany({
                                data: [
                                    {
                                        userId: req.body.userId,
                                        roomId: results.rooms.id
                                    },
                                    {
                                        userId: req.body.personId,
                                        roomId: results.rooms.id
                                    }
                                ]
                            })

                        })
                        .then(chatResult => {
                            results.chats = chatResult

                            res.json(results.rooms.id);
                        })
                        .catch(err => {
                            console.log(err);
                            res.sendStatus(500)
                        })
            }

        })
        .catch(err => {
            console.log(err);
            res.sendStatus(500)
        })

}
