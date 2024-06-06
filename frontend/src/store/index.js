import { createStore } from 'redux';

const stateObj = {
    socket: null,
    not: 0,
    peer: null,
    peerId: null,
    peers: null,
    showCall: false,
    showInvite: false,
    showVideo: false,
    showPermissionPopup: false,
    callMessage: "",
    call: null,
    sender: null,
    user: {
        id: undefined
    }
}

const userReducer = (state = stateObj, action) => {
    if (action.type === 'login') {
        return {
            ...state,
            user: action.user
        }
    }

    if (action.type === 'socket') {
        return {
            ...state,
            socket: action.socket,

        }
    }

    if (action.type === 'not') {
        return {
            ...state,
            not: action.not
        }
    }

    if (action.type === 'notDec') {
        return {
            ...state,
            not: state.not - action.not
        }
    }

    if (action.type === 'peer') {
        return {
            ...state,
            peer: action.peer
        }
    }

    if (action.type === 'peerId') {
        return {
            ...state,
            peerId: action.peerId
        }
    }

    if (action.type === 'peers') {

        return {
            ...state,
            peers: action.peers
        }
    }


    if (action.type === 'toggleCall') {
        return {
            ...state,
            showCall: action.showCall
        }
    }

    if (action.type === 'call') {
        return {
            ...state,
            call: action.call
        }
    }

    if (action.type === 'showInvite') {
        return {
            ...state,
            showInvite: action.showInvite
        }
    }

    if (action.type === 'showVideo') {
        return {
            ...state,
            showVideo: action.showVideo
        }
    }

    if (action.type === 'sender') {
        return {
            ...state,
            sender: action.sender
        }
    }

    if (action.type === 'showPermissionPopup') {
        return {
            ...state,
            showPermissionPopup: action.showPermissionPopup
        }
    }

    if (action.type === 'callMessage') {
        return {
            ...state,
            callMessage: action.callMessage
        }
    }


    return state;
}

const store = createStore(userReducer);

export default store;