import { useState, useEffect } from "react";
import io from 'socket.io-client'
import { useSelector, useDispatch } from 'react-redux';

const useSocket = (validPathname) => {
    const socket = useSelector(state => state.socket);
    const user = useSelector((state) => state.user)
    const { id: userIdUse } = user;

    const dispatch = useDispatch();

    //tworzenie połaczenia do socket jeśli jest poprawne url

    useEffect(() => {
        (() => {

            if (!validPathname.includes(window.location.pathname.split("/")[1]) || (socket && socket.connected) || !userIdUse) {
                return false;
            }

            const newSocket = io("http://localhost:5000");
            newSocket.emit("online", userIdUse)
            dispatch({ type: 'socket', socket: newSocket });
            return () => newSocket.close()

        })();

    }, [userIdUse])

};

export default useSocket;