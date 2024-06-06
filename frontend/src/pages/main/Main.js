import { useState } from "react";
import useAuth from "../../hooks/auth";
import { Link, Navigate } from "react-router-dom";
const Main = () => {
    const [unvalid, setUnvalid] = useState(undefined);
    const [authData, authErr] = useAuth(setUnvalid);
    const changeLocationToLogin = <Navigate replace={true} to={`/login`} />
    const changeLocationToContacts = <Navigate replace={true} to={`/contacts`} />

    return (
        <> 
        { unvalid === true ? changeLocationToLogin : ""}
        { unvalid === false ? changeLocationToContacts : ""}
        </>
       
    )

}

export default Main;