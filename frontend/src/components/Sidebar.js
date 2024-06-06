import styles from './Sidebar.module.css'
import { Link } from 'react-router-dom';
import { SearchSVG, CloudSVG } from '../assets/svg/navigate';
const Contacts = ({ selected, notification }) => {
    return (
        <div className={styles.sidebar}>

            <Link to="/contacts">
                <div className={selected === 'contacts' ? styles.selected : ""}>
                    <CloudSVG />
                    {notification ?
                        (<div className={styles.notification}>{notification}</div>) : null}
                </div>
            </Link>
            <Link to="/persons">
                <div className={selected === 'persons' ? styles.selected : ""}>
                    <SearchSVG />
                </div>
            </Link>
        </div>
    );
}

export default Contacts;