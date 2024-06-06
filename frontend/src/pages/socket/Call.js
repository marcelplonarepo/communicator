import { useSelector, useDispatch } from 'react-redux';
import styles from "./Call.module.css";
import { useState, useEffect, useRef } from "react"
import { EndCall, Screen, Camera, CameraOff, CameraSVG } from '../../assets/svg/call';

const Call = () => {
    const peers = useSelector((state) => state.peers)
    const peersRef = useRef(null);
    peersRef.current = peers;
    const peerId = useSelector((state) => state.peerId)
    const showCall = useSelector((state) => state.showCall)
    const showVideo = useSelector((state) => state.showVideo)
    const peer = useSelector((state) => state.peer)
    const socket = useSelector((state) => state.socket)
    const call = useSelector((state) => state.call)
    const sender = useSelector((state) => state.sender)
    const rem = useRef(null);
    const cur = useRef(null);
    const myStream = useRef(null);
    const notMyStream = useRef(null);
    const callRef = useRef(null);
    callRef.current = call;
    const [peersConn, setPeersConn] = useState(null)
    const [first, setFirst] = useState(true)
    const [myc, setMyc] = useState(0)
    const [nomyc, setNoMyc] = useState(0)
    const user = useSelector((state) => state.user)
    const { id: userIdUse } = user;
    const cancelCall = useRef(null);
    const conRef = useRef(null);
    const clkd = useRef(null);
    const [mediaType, setMediaType] = useState('camera');
    const [toggleCamera, setToggleCamera] = useState(false);
    const [mediaOptions, setMediaOptions] = useState({ video: true, audio: false })
    const [streamType, setStreamType] = useState(null)
    const [getStream, setGetStream] = useState(null)
    const [getStream2, setGetStream2] = useState(null)

    const dispatch = useDispatch();

    useEffect(() => {
        if (showCall) {

            cancelCall.current = setTimeout(() => {
                if (!peersRef.current) {
                    if (socket) {
                        socket.emit("leave-call", {
                            call: call,
                            peerId: peerId
                        })

                        socket.emit("cancel-call", {
                            roomId: call,
                            userId: userIdUse
                        })
                    }

                    dispatch({ type: 'toggleCall', showCall: false })
                    dispatch({ type: 'showVideo', showVideo: false })
                    cancelCall.current = null;
                }
            }, 5000)
            setStreamType('camera')
            userMedia('camera');

        }
        else {
            setMyc(0);
            setToggleCamera(false)
            if (!peers) {

                if (socket) {


                    socket.emit("cancel-call", {
                        roomId: call,
                        userId: userIdUse
                    })
                }

                dispatch({ type: 'toggleCall', showCall: false })
                dispatch({ type: 'showVideo', showVideo: false })

            }

            if (call) {
                socket.emit("leave-call", {
                    call: call,
                    peerId: peerId
                })
            }

            if (cancelCall.current) {
                clearTimeout(cancelCall.current);
            }


            if (myStream.current) {
                myStream.current.getTracks().forEach((track) => {
                    track.stop();
                });


            }

            if (cur.current) {
                cur.current.srcObject = null;
            }

            if (notMyStream.current && cur.current) {
                notMyStream.current.getTracks().forEach((track) => {
                    track.stop();
                });
            }

            if (rem.current) {
                rem.current.srcObject = null;
            }

            if (peersConn) {
                peersConn.close();
                setPeersConn(null);
            }
            dispatch({ type: 'call', call: null })
            dispatch({ type: 'peers', peers: null })
            setStreamType(null);
            setToggleCamera(false)
        }
    }, [showCall])


    useEffect(() => {
        if (socket) {
            socket.on("changes", (data) => {
                if (conRef.current) {
                    const gg5 = conRef.current;
                    if (data.mute) {
                        gg5(true);
                    }
                    else {
                        gg5(false)
                    }
                }

            })
        }
    }, [socket])


    useEffect(() => {

        if (peer && myc > 0 && rem && first && socket) {
            peer.on('call', (peerCall) => {
                if (peerCall.metadata == callRef.current && callRef.current) {
                    peerCall.answer(myStream.current)
                    setPeersConn(peerCall)
                    dispatch({ type: 'peers', peers: peerCall.peer })
                    peerCall.on('stream', function (remoteStream) {

                        const giveMe = () => {
                            return remoteStream;
                        }

                        setGetStream(giveMe)

                        notMyStream.current = remoteStream;
                        setNoMyc(2);

                        rem.current.srcObject = remoteStream


                    });
                }
                else {
                    socket.emit("decline-call", {
                        call: peerCall.metadata,
                        userId: userIdUse
                    })
                }

            })
            setFirst(false)
        }

    }, [peer, myc, rem, first, socket])

    useEffect(() => {


        if (showCall && myc > 0 && peer && peers && rem) {
            const peerCall = peer.call(peers, myStream.current, { metadata: call })
            setPeersConn(peerCall)

            peerCall.on('stream', (remoteStream) => {
                dispatch({ type: 'showVideo', showVideo: true })

                const giveMe = () => {
                    return remoteStream;
                }

                setGetStream2(giveMe)

                setNoMyc(2);
                notMyStream.current = remoteStream;
                rem.current.srcObject = remoteStream



            });



        }



    }, [showCall, myc, peer, peers, rem, socket])


    const disconnect = () => {

        if (socket) {
            socket.emit("leave-call", {
                call: call,
                peerId: peerId
            })
        }


        dispatch({ type: 'toggleCall', showCall: false })
        dispatch({ type: 'showVideo', showVideo: false })
    }

    const switchScreen = () => {
        if (myStream.current) {
            stopStream();
            setStreamType('screen')
            userMedia('screen')
        }
    }


    const switchCamera = () => {
        if (myStream.current) {
            stopStream();
            setStreamType('camera')
            userMedia('camera')
        }
    }


    const stopStream = (sendEmit) => {
        myStream.current.getTracks().forEach((track) => {
            track.stop();
        });
        if (sendEmit && peersConn && peersConn.peerConnection) {
            socket.emit("changes-call", {
                call: peersConn.metadata,
                userId: userIdUse,
                mute: true
            })
        }
    }

    const userMedia = (mt) => {

        const getUserMedia = async () => {
            if (mt === 'camera') {
                return await navigator.mediaDevices.getUserMedia(mediaOptions);
            }
            else if (mt === 'screen') {
                return await navigator.mediaDevices.getDisplayMedia(mediaOptions);
            }

        }

        getUserMedia().then((mediaStream) => {
            cur.current.srcObject = mediaStream
            myStream.current = mediaStream

            myStream.current.getVideoTracks()[0].onended = () => {
                if(socket){
                    socket.emit("changes-call", {
                        call: peersConn.metadata,
                        userId: userIdUse,
                        mute: false
                    })
                }
            }
        })
    }

    const toggleCall = () => {
        if (toggleCamera) {
            if (myStream.current) {
                setToggleCamera(false);
                stopStream('change')

            }
        }
        else {
            if (myStream.current) {
                setToggleCamera(true);
                userMedia(streamType)
            }
        }
    }


    const con = (mute) => {

        if (mute) {
            notMyStream.current = null;
            rem.current.srcObject = null;
            return null
        }

        let hh;
        if (sender === false) {
            hh = getStream
        }
        else if (sender === true) {
            hh = getStream2
        }
        notMyStream.current = hh;
        rem.current.srcObject = hh;

    }

    conRef.current = con;

    const loadedDataHnadler = () => {
        cur.current.play();
        setMyc(2);
        setToggleCamera(true);
        if (peersConn && peersConn.peerConnection) {
            peersConn.peerConnection.getSenders()[0].replaceTrack(myStream.current.getVideoTracks()[0])
            socket.emit("changes-call", {
                call: peersConn.metadata,
                userId: userIdUse,
                mute: false
            })
        }
    }

    const remLoadedDataHnadler = () => {
        rem.current.play();
    }

    return (
        <>

            <div className={`${styles.call} ${!showVideo && styles.hide}`}>
                <div className={styles.my}>
                    <video ref={cur} onLoadedData={loadedDataHnadler} />
                </div>

                <div className={styles.notMy}>
                    <video ref={rem} onLoadedData={remLoadedDataHnadler} />
                </div>

                <div className={styles.toggleVisibility}>
                    <div className={styles.callBar}>

                        <div onClick={switchScreen} className={styles.disconnect}>
                            <Screen />
                        </div>
                        <div onClick={switchCamera} className={styles.disconnect}>
                            <Camera />
                        </div>
                        <div onClick={disconnect} className={styles.disconnect}>
                            <EndCall />
                        </div>
                        <div onClick={toggleCall} className={styles.disconnect}>
                            {toggleCamera ? <CameraOff /> : <CameraSVG />}
                        </div>
                        <div onClick={con} className={styles.disconnect}>
                            CON
                        </div>
                    </div>
                </div>




            </div>

        </>


    )
}

export default Call;

