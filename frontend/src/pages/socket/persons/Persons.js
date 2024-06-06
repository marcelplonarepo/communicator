import styles from './Persons.module.css';
import { useState, useEffect } from 'react';
import axios from '../../../api/axios';
import { Navigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useAuth from '../../../hooks/auth';
import Sidebar from "../../../components/Sidebar"
import { SearchSVG } from '../../../assets/svg/navigate';
const Contacts = () => {

    const user = useSelector(state => state.user)
    const not = useSelector((state) => state.not)
    const {id: userIdUse} = user;
    const [persons, setPersons] = useState([]);
    const [personRoom, setPersonRoom] = useState(false);
    const [personLink, setPersonLink] = useState(null);
    const [unvalid, setUnvalid] = useState(false);
    const changeLocationToLogin = <Navigate replace={true} to={`/login`} />

    const [authData, authErr] = useAuth(setUnvalid);
    const [typing, setTyping] = useState(0)


    //ustala kiedy osoba przestała pisać

    const isTypingHandler = (event) => {

        if (typing) {
            clearTimeout(typing);
        }

        setTyping(
            setTimeout(() => {
                const searchValue = event.target.value;
                showPersons(searchValue);
            }, 400)
        )


    }

    //pokazuje osoby z wartości z textare kiedy osoba przestaje pisać

    const showPersons = async (searchValue) => {

        if (!searchValue) {
            setPersons([])
            return false;
        }

        const body = {
            search: searchValue,
            userId: user.id
        }
        try {
            const response = await axios.post('data/people', body)
            setPersons(response.data)
        }
        catch (err) {
            console.log(err)
        }
    }

    //przechodzenie do czatu do danej osoby

    const personCheckClickHandler = async (checkPersonId) => {
        const body = {
            userId: user.id,
            personId: checkPersonId
        }
        const response = await axios.post('data/checkRoom', body)
        setPersonLink(<Navigate to={`/contacts/${response.data}`} />)
    }

    useEffect(() => {
        if (personLink) {
            setPersonRoom(true);
        }
    }, [personLink])

    return (
        <div className={styles.theme}>
            {personRoom && personLink}
            {unvalid && changeLocationToLogin}
            <Sidebar notification={not} selected="persons" />

            <div className={styles.personList}>
                <form>
                    <div>
                        <textarea onInput={isTypingHandler}></textarea>
                        <div>
                            <SearchSVG/>
                        </div>
                    </div>
                </form>
                <div>
                    {persons.map((person) => {
                        return <div key={person.id} onClick={() => personCheckClickHandler(person.id)}>
                            <img src={person.profile}></img>
                            {person.username}
                        </div>
                    })}
                </div>
            </div>
        </div>
    )
}

export default Contacts;