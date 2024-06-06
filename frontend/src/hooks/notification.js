import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
const useNotification = () => {
    const dispatch = useDispatch();

    const socket = useSelector((state) => state.socket)
    const not = useSelector((state) => state.not)
    const user = useSelector((state) => state.user)
    const { id: userIdUse } = user;

    useEffect(() => {

        let interval;

        if (userIdUse && socket) {
            socket.emit("notification", { userId: userIdUse });
            interval = setInterval(() => {
                socket.emit("notification", { userId: userIdUse });
            }, 2000);
        }


        return () => {

            if (interval !== undefined) {
                clearInterval(interval);
            }
        }

    }, [socket, userIdUse])

    useEffect(() => {

        if (socket) {
            socket.on("count", (data) => {

                if (data.length) {
                    dispatch({ type: 'not', not: data[0].notification })
                }
                else {
                    dispatch({ type: 'not', not: 0 })
                }

            })
        }

        return () => {
            if (socket) {
                socket.off('count');
            }

        }

    }, [socket])


}

export default useNotification;