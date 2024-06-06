import { useSelector, useDispatch } from "react-redux";
import { useEffect, useRef } from "react";
const useCall_Listening = (setPeerIds, ids) => {
    const dispatch = useDispatch();

    const socket = useSelector((state) => state.socket)
    const call = useSelector((state) => state.call)
    const callRef = useRef(null);
    callRef.current = call;
    const showCall = useSelector((state) => state.showCall)
    const showCallRef = useRef(null);
    showCallRef.current = showCall;
    const showInvite = useSelector((state) => state.showInvite)
    const showInviteRef = useRef(null);
    showInviteRef.current = showInvite;
    const user = useSelector((state) => state.user)
    const { id: userIdUse } = user;
    const userIdRef = useRef(null);
    userIdRef.current = userIdUse;


    useEffect(() => {

        if (socket) {

            socket.on("user-disconnected", (data) => {
                dispatch({type: 'callMessage', callMessage: "Call ended"})
                dispatch({type: 'toggleCall', showCall: false})
                dispatch({type: 'showVideo', showVideo: false })
                dispatch({type: 'peers', peers: null})
                dispatch({type: 'call', call: null})
                dispatch({type: 'showInvite', showInvite: false})
            })

            socket.on("call-invite", (data) => {
                if(!showCallRef.current && !showInviteRef.current){
                    setPeerIds(data)
                    dispatch({type: 'showInvite', showInvite: true})
                }
                else{
                    socket.emit("busy-call", {
                        call: data.roomId,
                        userId: userIdRef.current
                    })
                }
            })

            socket.on("cancel-call", (data) => {
                if(!callRef.current && ids.current && data.roomId == ids.current.roomId && data.roomId){
                    setPeerIds(null)
                    dispatch({type: 'showInvite', showInvite: false})
                }
            })

            socket.on("decline", (data) => {
                dispatch({type: 'callMessage', callMessage: "No successful response"})
                dispatch({type: 'toggleCall', showCall: false})
                dispatch({type: 'showVideo', showVideo: false })
                dispatch({type: 'call', call: null})
            })


            socket.on("busy", (data) => {
                dispatch({type: 'callMessage', callMessage: "Cannot make the call, try later."})
                dispatch({type: 'toggleCall', showCall: false})
                dispatch({type: 'showVideo', showVideo: false })
                dispatch({type: 'call', call: null})
            })
        }

        return () => {
            if (socket) {
                socket.off('call-invite');
                socket.off('cancel-call');
                socket.off('user-disconnected');
                socket.off('decline');
                socket.off('busy');
            }

        }

    }, [socket])


}

export default useCall_Listening;