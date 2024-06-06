const prisma = require("../../prisma/index");


module.exports = (data, socket) => {
        // console.log(socket.rooms)
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
                        "chats.userId": data.userId
                    }
                },
                {
                    $project: {
                        chats: {
                            $filter: {
                                input: "$chats",
                                as: "chats",
                                cond: {
                                    $eq: ["$$chats.userId", data.userId]
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
                                            $ne: ["$$messages.userId", data.userId],
    
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
            socket.emit("count", (results))
        })
        .catch(err => {
            console.log(err);
        })



}