import styles from './Register.module.css';
import { useState } from 'react';
import axios from '../../api/axios';
import { Link, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { UserSVG, EmailSVG, PasswordSVG } from '../../assets/svg/auth';
const Register = () => {
    const dispatch = useDispatch();

    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [success, setSuccess] = useState(false);
    const changeLocationToContacts = <Navigate replace={true} to={`/contacts`} />
    const passwordChangeHandler = (event) => {
        setPassword(event.target.value);
    }

    const emailChangeHandler = (event) => {
        setEmail(event.target.value);
    }

    const usernameChangeHandler = (event) => {
        setUsername(event.target.value);
    }

    const registerSubmitHandler = (event) => {

        event.preventDefault();

        const body = {
            email: email,
            password: password,
            username: username
        }

        //rejestra i ustawienie "tokena"

        axios.post('auth/register', body)
            .then((response) => {
                if(response.data){
                    localStorage.setItem('email', response.data.email);
                    dispatch({ type: 'login', user: response.data })
                    setSuccess(true);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    return (
        <div className={styles.register}>
            {success && changeLocationToContacts}
            <form onSubmit={registerSubmitHandler} className={styles.form}>
                <div className={styles.title}>
                    <div>Register</div>
                </div>
                <div className={styles.inputBox}>
                    <div>
                        <UserSVG />
                    </div>
                    <input onChange={usernameChangeHandler} placeholder="Username" type="text"></input>
                </div>
                <div className={styles.inputBox}>
                    <div>
                        <EmailSVG />
                    </div>
                    <input onChange={emailChangeHandler} placeholder="Email" type="text"></input>
                </div>
                <div className={styles.inputBox}>
                    <div>
                        <PasswordSVG />
                    </div>

                    <input onChange={passwordChangeHandler} placeholder="Password" type="text"></input>
                </div>

                <div className={styles.inputBox}>
                    <input value="Send" type="submit"></input>
                </div>
                <Link to="/login" className={styles.link}>Have an account? <span>Sign in</span></Link>
            </form>
        </div>
    )
}

export default Register;