
const prisma = require("../prisma/index");


module.exports.makeCall = (req, res) => {

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

module.exports.show = (req, res) => {
    prisma.chats.aggregateRaw({
        pipeline: [
            { $match: { userId: { "$oid": req.body.userId } } }, 
            {
                $lookup: { 
                    from: "chats",
                    localField: "roomId",
                    foreignField: "roomId",
                    as: "users"
                }
            },
            {
                $lookup: { 
                    from: "user",
                    localField: "users.userId",
                    foreignField: "_id",
                    as: "users"
                }
            },
            {
                $lookup: { 
                    from: "messages",
                    localField: "roomId",
                    foreignField: "roomId",
                    as: "messages"
                }
            },
            {
                $project: {
                    "roomId": { "$toString": "$roomId" }, "users": {
                        $map: {
                            input: "$users",
                            as: "users",
                            in: {
                                _id: { "$toString": "$$users._id" },
                                username: "$$users.username",
                                profile: "$$users.profile",

                            }
                        }
                    },
                    message: { $last: "$messages.message" },
                    messageUser: { $last: "$messages.userId" },
                    "_id": 0
                }
            },
            {
                $lookup: {
                    from: "user",
                    localField: "messageUser",
                    foreignField: "_id",
                    as: "userData"
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
                    roomId: 1,
                    message: 1,
                    "userData.username": 1

                }
            }

        ],
    })
        .then(result => {
            res.json(result)
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(500)
        })

}




module.exports.receive = (req, res) => {

    prisma.rooms.aggregateRaw({
        pipeline: [
            {
                $lookup: {
                    from: "messages",
                    localField: "_id",
                    foreignField: "roomId",
                    as: "messages"
                },
            },
            {
                $project: {
                    "_id": { "$toString": "$_id" },
                    messages: 1
                }
            },
            {
                $match: {
                    "_id": req.body.data.roomId,
                }
            },
            {
                $project: {
                    "_id": 1,
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
                    "_id": 1,
                    messages: {
                        $filter: {
                            input: '$messages',
                            as: 'messages',
                            cond: {
                                $and: [
                                    {
                                        $ne: ['$$messages.userId', req.body.data.userId],

                                    },

                                ]
                            }
                        }
                    },
                }
            },
            {
                $project: {
                    lastSeen: {
                        $toObjectId: { $last: "$messages._id" },
                    },
                    userId: {
                        $toObjectId: req.body.data.userId,
                    },
                    roomId: {
                        $toObjectId: "$_id",
                    },
                    "_id": 0,
                }
            },
            {
                $set: { time: Date.now() }
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



module.exports.countNew = (req, res) => {
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
                    chats: {
                        $filter: {
                            input: "$chats",
                            as: "chats",
                            cond: {
                                $eq: ["$$chats.userId", req.body.data.userId]
                            }
                        }
                    },
                }
            },
            {
                $project: {
                    time: {
                        $first: "$chats.time",
                    },
                }
            }
            , {
                $lookup: {
                    from: "messages",
                    localField: "_id",
                    foreignField: "roomId",
                    as: "messages"
                },
            },
            {
                $project: {
                    chats: 1,
                    "_id": { "$toString": "$_id" },
                    time: 1,
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
                    time: 1
                }
            },
            {
                $match: {
                    messages: { $ne: [] }
                }
            },
            {
                $unwind: "$messages"
            },
            {
                $count: "notification"
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

}

