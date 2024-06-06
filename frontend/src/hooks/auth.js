import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from '../api/axios';

//identyfikacja użytkownika na podstawie tokena którym tymczasowo jest email

const useAuth = (setUnvalidated) => {

    const [result, setResult] = useState([null, null]);
    const dispatch = useDispatch();
    useEffect(() => {
        (() => {
            if (!localStorage.getItem('email')) {
                setUnvalidated(true);
                return null;
            }

            const body = {
                email: localStorage.getItem('email')
            }
            const authFetch = async () => {

                try {
                    const data = await axios.post('auth/login', body);
                    
                    if (!data.data) {
                        setUnvalidated(true);
                    }
                    else{
                        setUnvalidated(false);
                        dispatch({ type: 'login', user: data.data })
                    }

                    return [data, null]
                }
                catch (err) {
                    console.log(err);
                    return [null, err]
                }
            }

            authFetch().then(response => {
                setResult(response);
            })
        })();

    }, [setUnvalidated])

    return result;
}

export default useAuth;