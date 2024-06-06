import styles from './Contacts.module.css';
import { useState, useEffect } from 'react';
import axios from '../../../api/axios';
import { Navigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import useAuth from '../../../hooks/auth';
import Sidebar from "../../../components/Sidebar"
const Contacts = () => {

    const dispatch = useDispatch();

    const user = useSelector(state => state.user)
    const not = useSelector((state) => state.not)
    const [unvalid, setUnvalid] = useState(false);
    const [loading, setLoading] = useState(false);
    const [contacts, setContacts] = useState([]);
    const [chatRoom, setChatRoom] = useState(false);
    const [chatLink, setChatLink] = useState(null);
    const changeLocationToLogin = <Navigate replace={true} to={`/login`} />
    const { id: userIdUse } = user;

    const [authData, authErr] = useAuth(setUnvalid);

    const chatCheckClickHandler = (chatId, newMessage) => {
        if (newMessage) {
            dispatch({ type: 'notDec', not: newMessage })
        }
        setChatLink(<Navigate to={`/contacts/${chatId}`} />);
    }

    useEffect(() => {
        if (chatLink) {
            setChatRoom(true);
        }
    }, [chatLink])

    //pobieranie czatów po załodowaniu danych użytkownika

    useEffect(() => {
        const auth = async () => {

            try {
                if (userIdUse) {
                    const showResponse = await axios.post('data/showAll', {
                        data: {
                            userId: userIdUse
                        }
                    })
                    setContacts(showResponse.data);
                    setLoading(true)
                }
            }
            catch (err) {
                console.log(err);
                return null;
            }
        }

        auth();

    }, [userIdUse])

    //pobieranie czatów w pętli

    useEffect(() => {

        let interval;

        if (userIdUse) {
            interval = setInterval(async () => {

                try {
                    if (userIdUse) {
                        const showResponse = await axios.post('data/showAll', {
                            data: {
                                userId: userIdUse
                            }
                        })
                        setContacts(showResponse.data);
                        setLoading(true)
                    }
                }
                catch (err) {
                    console.log(err);
                    return null;
                }

            }, 2000);
        }

        return () => {

            if (interval !== undefined) {
                clearInterval(interval);
            }
        }

    }, [userIdUse])


    return (
        <div className={styles.theme}>
            <Sidebar notification={not} selected="contacts"></Sidebar>
            {chatRoom && chatLink}
            {unvalid && changeLocationToLogin}
            <div className={styles.contacts}>
                {(contacts.length != 0 && loading) ? (contacts.map(contact => {

                    if (!contact.message.message) {
                        return null;
                    }

                    return (
                        <div className={styles.cloud} key={contact.roomId} onClick={() => chatCheckClickHandler(contact.roomId, contact.messages)}>

                            {contact.messages != 0 ?
                                (
                                    <div className={styles.notification}>
                                        {contact.messages}
                                    </div>
                                )
                                : null
                            }

                            <div className={styles.profileContainer}>
                                <img src={contact.users[0].profile}></img>
                            </div>
                            <div className={styles.cloudContainer}>
                                <div className={styles.username}>{contact.users[0].username}</div>
                                <div className={styles.message}>{contact.message.username}: {contact.message.message}</div>
                            </div>
                        </div>
                    )
                })) : null}
                {(contacts.length == 0 && loading) ? (<div className={styles.noChats}>No chats available</div>) : null}
            </div>
        </div>
    )
}

export default Contacts;