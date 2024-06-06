import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from "react";
import Peer from 'peerjs';

const usePeer = (validPathname) => {
    const peer = useSelector((state) => state.peer)
    const dispatch = useDispatch();


    useEffect(() => {
        (() => {

            if (!validPathname.includes(window.location.pathname.split("/")[1]) || peer) {
                return false;
            }

            const newPeer = new Peer();
            dispatch({ type: 'peer', peer: newPeer })


        })();

    }, [])


    useEffect(() => {
        if (peer) {
            peer.on('open', (peerId) => {
                dispatch({ type: 'peerId', peerId: peerId })
            });
        }
    }, [peer])

};

export default usePeer;