const disconnect = require('./Events/disconnect');
const join_room = require('./Events/join_room');
const notification = require('./Events/notification');
const last = require('./Events/last');
const send_message = require('./Events/send_message');
const online = require('./Events/online');
const call = require('./Events/call');
const join_call = require('./Events/join-call');
const leave_call = require('./Events/leave-call');
const decline_call = require('./Events/decline-call');
const busy_call = require('./Events/busy-call');
const cancel_call = require('./Events/cancel-call');
const changes_call = require('./Events/changes-call');

module.exports.socketIO = (io) => {
    io.on("connection", (socket) => {

        socket.on("changes-call", (data) => {
            changes_call(data,socket)
        })

        socket.on("leave-call", (data) => {
            leave_call(data,socket)
        })

        socket.on("cancel-call", (data) => {
            cancel_call(data,socket)
        })

        socket.on("busy-call", (data) => {
            busy_call(data,socket)
        })

        socket.on("decline-call", (data) => {
            decline_call(data,socket)
        })

        socket.on("join-call", (data) => {
            join_call(data,socket, io)
        })

        socket.on("call", (data) => {
            call(data, io)
        })

        socket.on("online", data => {
            online(data, socket)
        })

        socket.on("disconnect", (reason) => {
            disconnect(reason);
        })

        socket.on("join_room", (data) => {
            join_room(data, socket, io.sockets.adapter.rooms, socket.id);
        });

        socket.on("notification", (data) => {
            notification(data, socket)
        })

        socket.on("last", (data) => {
            last(data);
        })

        socket.on("send_message", (data) => {
            send_message(data, io)
        });
    })

} 