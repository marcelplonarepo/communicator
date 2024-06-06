import Contacts from './contacts/Contacts';
import Persons from './persons/Persons';
import Chat from './chat/Chat';
import { useState, useRef} from 'react';
import { Routes, Route } from "react-router-dom";
import useSocket from '../../hooks/socket';
import useNotification from '../../hooks/notification';
import useCall_Listening from '../../hooks/call-listening';
import usePeer from '../../hooks/peer';
import AcceptCall from './AcceptCall';
import PermissionPopup from './PermissionPopup';
import CallPopup from './CallPopup';
import Call from './Call';
import { useSelector, useDispatch } from 'react-redux';

const SocketIO = () => {
    const [call_ids, setCall_Ids] = useState(null)
    const validPathname = ['contacts', 'persons'];
    const showCall = useSelector((state) => state.showCall)
    const callMessage = useSelector((state) => state.callMessage)
    const showInvite = useSelector((state) => state.showInvite)
    const showPermissionPopup = useSelector((state) => state.showPermissionPopup)
    const callIdRef = useRef(null);
    callIdRef.current = call_ids;
    useSocket(validPathname);
    usePeer(validPathname)
    useNotification();
    useCall_Listening(setCall_Ids, callIdRef);

    return (
        <>  
            {<Call isOn={showCall}/>}
            {showInvite && <AcceptCall ids={call_ids} remove={setCall_Ids}/>}
            {showPermissionPopup && <PermissionPopup/>}
            {callMessage && <CallPopup/>}
            <Routes>
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/contacts/:id" element={<Chat />} />
                <Route path="/persons" element={<Persons />} />
            </Routes>
        </>

    )
}

export default SocketIO;