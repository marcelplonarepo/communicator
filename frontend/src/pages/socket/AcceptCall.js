import Styles from "./AcceptCall.module.css";
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from "react";

const AcceptCall = ({ ids, remove }) => {
    const [reset, setReset] = useState(false);
    const dispatch = useDispatch();
    const socket = useSelector((state) => state.socket)
    const peerId = useSelector((state) => state.peerId)
    const user = useSelector((state) => state.user)
    const { id: userIdUse } = user;



    const accept = () => {
        navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(result => {

            result.getTracks().forEach(track => {
                track.stop();
            })

            if (socket) {
                dispatch({ type: 'call', call: ids.roomId })
                socket.emit("join-call", {
                    peerId: peerId,
                    roomId: ids.roomId
                })

                dispatch({ type: 'peers', peers: ids.peerId })
                dispatch({ type: 'toggleCall', showCall: true })
                dispatch({ type: 'sender', sender: false })
                dispatch({type: 'showPermissionPopup', showPermissionPopup: false})
                setReset(true)
            }

        })
            .catch(err => {
                dispatch({type: 'showPermissionPopup', showPermissionPopup: true})
                decline();
            })

    }

    useEffect(() => {
        if (reset) {
            remove(null);
            dispatch({ type: 'showInvite', showInvite: false })
        }
    }, [reset])

    const decline = () => {
        if (socket) {
            socket.emit("decline-call", {
                call: ids.roomId,
                userId: userIdUse
            })
        }

        remove(null)
        dispatch({ type: 'showInvite', showInvite: false })
    }


    return (
        <div className={Styles.popup}>
            <div onClick={accept}>Accept</div>
            <div onClick={decline}>Decline</div>
        </div>
    )
}

export default AcceptCall;