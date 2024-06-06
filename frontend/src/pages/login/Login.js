import styles from './Login.module.css';
import { useState } from 'react';
import axios from '../../api/axios';
import { Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { EmailSVG, PasswordSVG } from '../../assets/svg/auth';
const Login = () => {

    const dispatch = useDispatch();

    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [verify, setVerify] = useState(false);
    const passwordChangeHandler = (event) => {
        setPassword(event.target.value);
    }

    const emailChangeHandler = (event) => {
        setEmail(event.target.value);
    }

    const changeLocationToContacts = <Navigate replace={true} to={`/contacts`} />



    const registerSubmitHandler = (event) => {

        event.preventDefault();

        const body = {
            email: email,
            password: password
        }

        //logowanie i ustawienie "tokena"

        axios.post('auth/login', body)
            .then((response) => {
                if (response.data.email) {
                    localStorage.setItem('email', response.data.email);
                    dispatch({ type: 'login', user: response.data })
                    setVerify(true)
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    return (
        <div className={styles.login}>

            <form onSubmit={registerSubmitHandler} className={styles.form}>
                <div className={styles.title}>
                    <div>Login</div>
                </div>
                <div className={styles.inputBox}>
                    <div>
                        <EmailSVG/>
                    </div>
                    <input onChange={emailChangeHandler} placeholder="Email" type="text"></input>
                </div>
                <div className={styles.inputBox}>
                    <div>
                        <PasswordSVG/>
                    </div>
                    <input onChange={passwordChangeHandler} placeholder="Password" type="text"></input>
                </div>
                <div className={styles.inputBox}>
                    <input value="Send" type="submit"></input>
                </div>
                <Link to="/register" className={styles.link}>Not register? <span>Sing up</span></Link>
            </form>
            {verify && changeLocationToContacts}
        </div >
    )
}

export default Login;