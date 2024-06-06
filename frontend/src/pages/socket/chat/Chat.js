import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from 'react';

import useAuth from '../../../hooks/auth';
import { Navigate, Link } from 'react-router-dom';
import styles from './Chat.module.css'
import Sidebar from "../../../components/Sidebar"
import axios from "../../../api/axios";
import { SendSVG } from '../../../assets/svg/navigate';
import { CameraSVG } from '../../../assets/svg/call';
import { useDispatch, useSelector } from 'react-redux';

const Chat = () => {

    const dispatch = useDispatch();
    const user = useSelector((state) => state.user)
    const socket = useSelector((state) => state.socket)
    const not = useSelector((state) => state.not)
    const call = useSelector((state) => state.call)
    const peers = useSelector((state) => state.peers)
    const showInvite = useSelector((state) => state.showInvite)

    const { id } = useParams()
    const [message, setMessage] = useState("");
    const [conversation, setConversation] = useState([]);
    const scroll = useRef(null)
    const changeLocationToLogin = <Navigate replace={true} to={`/login`} />
    const [unvalid, setUnvalid] = useState(false);
    const [enter, setEnter] = useState(false);
    const [shift, setShift] = useState(false);
    const [authData, authErr] = useAuth(setUnvalid);
    const [roomData, setRoomData] = useState([]);
    const peerId = useSelector((state) => state.peerId)
    const { id: userIdUse } = user;


    useEffect(() => {
        // pobieranie danych czatu i jego użytkowników
        const auth = async () => {

            try {

                if (userIdUse) {
                    const chatRoomResponse = await axios.post('data/roomData', {
                        userId: userIdUse,
                        roomId: id
                    })

                    setRoomData(chatRoomResponse.data);
                }

            }
            catch (err) {
                console.log(err);
                return null;
            }
        }

        auth();

    }, [userIdUse])

    //nazwa i profil czatu dla dwóch osób, dla gróp będzie inna
    const returnBar = () => {
        if (roomData.length && roomData[0].type == "chat") {
            return (
                <>
                    <img src={roomData[0].users[0].profile}></img>
                    <div className={styles.barUser}>{roomData[0].users[0].username}</div>
                    <div className={styles.barIcon} onClick={MakeCall}>
                        <CameraSVG />
                    </div>
                </>
            )
        }
    }

    ///// wysyłanie wiadomości

    // ustalanie wyskości textarea i resetowanie po wysłaniu wiadomości
    const textareaHeigthAdjust = (event) => {

        setMessage(event.target.value.trim());
        if (enter && !shift) {
            event.target.value = "";
        }

        event.target.style.height = `1px`;
        if (event.target.scrollHeight < 150) {
            event.target.style.height = `${event.target.scrollHeight}px`;
        }
        else {
            event.target.style.height = `150px`;
        }

    }

    //

    const MakeCall = () => {
        if (roomData.length && roomData[0].type == "chat" && id && socket && userIdUse && !call && !showInvite) {

                navigator.mediaDevices.getUserMedia({audio: true, video: true}).then(result => {
                    
                    result.getTracks().forEach(track => {
                        track.stop();
                    })

                    dispatch({ type: 'toggleCall', showCall: true })
                    dispatch({ type: 'showVideo', showVideo: true })
                    dispatch({ type: 'call', call: id })
                    dispatch({type: 'sender', sender: true})
                    dispatch({type: 'showPermissionPopup', showPermissionPopup: false})
                    socket.emit("join-call", {
                        roomId: id,
                        peerId: peerId
                    });
        
                    socket.emit("call", {
                        roomId: id,
                        userId: userIdUse,
                        peerId: peerId
                    });

                })
                .catch(err => {
                    console.log(err);
                    dispatch({type: 'showPermissionPopup', showPermissionPopup: true})
                })

        }
    }

    // nasłuchiwanie enter-a oraz shift-ów

    const removeEnter = (event) => {

        switch (event.which) {
            case 13:
                setEnter(false)
                break;
            case 16:
                setShift(false)
                break;
        }
    }
    // nasłuchiwanie enter-a oraz shift-ów, usuwanie wartości po wciśnięciu Entera  

    const sendMessageByEnter = (event) => {


        switch (event.which) {
            case 13:
                setEnter(true)
                break;
            case 16:
                setShift(true)
                break;
        }



        if (event.which === 13 && !event.shiftKey && message != "") {
            sendMessageSubmitHandler();
            event.target.value = "";
        }
    }

    //wysyłanie wiadomości na serwer

    const sendMessageSubmitHandler = (event) => {
        if (event) {
            event.preventDefault();
        }
        const data = {
            message: message,
            roomId: id,
            userId: user.id
        }
        if (socket) {
            socket.emit("send_message", data);
        }
        setMessage("")
    }

    useEffect(() => {
        if (scroll && conversation.length) {
            scroll.current.scrollTop = scroll.current.scrollHeight;
        }
    }, [conversation])


    /////////

    //dołączanie do czatu

    useEffect(() => {
        if (id && socket && userIdUse) {
            socket.emit("join_room", {
                roomId: id,
                userId: userIdUse,
                call: call
            });
        }
    }, [id, socket, userIdUse])



    useEffect(() => {
        if (socket && userIdUse) {

            //po otrzymaniu wiadomości, wysyłany jest event, że została wyświetlona

            socket.on("receive_message", (data) => {

                setConversation(data.data)
                if (userIdUse != data.senderId) {
                    socket.emit("last", {
                        roomId: id,
                        userId: userIdUse
                    });
                }


            });

            return () => {
                socket.off('receive_message');
            };
        }

    }, [socket, userIdUse])

    return (
        <div className={styles.theme}>
            {unvalid && changeLocationToLogin}
            <Sidebar notification={not} />

            <div className={styles.onMessages}>

                <div className={styles.chatBar}>

                    {returnBar()}

                </div>
                <div className={styles.chat} ref={scroll}>
                    {conversation.map((mess, ife) => {
                        if (mess.userId == user.id) {
                            return <div className={styles.mine} key={ife}>{mess.message}</div>
                        }
                        else {
                            return <div className={styles.else} key={ife}>{mess.message}</div>
                        }

                    })}

                </div>

                <form className={styles.newMessage} onSubmit={sendMessageSubmitHandler}>
                    <textarea onKeyDown={sendMessageByEnter} onKeyUp={removeEnter} onInput={textareaHeigthAdjust} ></textarea>
                    <label htmlFor="send" className={styles.submitButton}>
                        <input id="send" type="submit"></input>
                        <div>
                            <SendSVG />
                        </div>
                    </label>

                </form>
            </div>
        </div>
    )
}

export default Chat;