import styles from "./PermissionPopup.module.css"
import { Denied, Allow } from "../../assets/svg/permission";
import { useDispatch } from 'react-redux';
const PermissionPopup = () => {

    const dispatch = useDispatch();

    const close = () => {
        dispatch({type: 'showPermissionPopup', showPermissionPopup: false})
    }

    return (
    <div className={styles.popup}>
        <div className={styles.close} onClick={close}>
            <Denied/>
        </div>
        Permission needed for video calls.
    </div>
    ) 
}

export default PermissionPopup;