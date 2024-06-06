const prisma = require("../../prisma/index");

module.exports = (data) => {
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
                    "_id": data.roomId,
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
                                        $ne: ['$$messages.userId', data.userId],

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
                        $toObjectId: data.userId,
                    },
                    roomId: {
                        $toObjectId: "$_id",
                    },
                    "_id": 0,
                }
            },
            {
                $set: { time: Date.now() }
            },
            {
                $merge: {
                    into: "chats",
                    on: ["userId", "roomId"]
                }
            }
        ]
    })
        .then(results => {

        })
        .catch(err => {
            console.log(err);
        })
}