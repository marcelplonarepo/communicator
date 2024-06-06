import styles from "./CallPopup.module.css"
import { Denied, Allow } from "../../assets/svg/permission";
import { useSelector, useDispatch } from 'react-redux';
const CallPopup = () => {

    const dispatch = useDispatch();
    const callMessage = useSelector((state) => state.callMessage)

    const close = () => {
        dispatch({type: 'callMessage', callMessage: ""})
    }

    return (
        <div className={styles.popup}>
            <div className={styles.close} onClick={close}>
                <Denied />
            </div>
            {callMessage}
        </div>
    )
}

export default CallPopup;