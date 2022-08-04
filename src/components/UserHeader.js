import { Link, useParams } from 'react-router-dom';
import logo from '../assets/trakt-icon-red.svg';

const UserHeader = ({user, resetData}) => {
    const { type } = useParams();

    return (
        <div className="user-header">
            <div className="user-header-top">
                <img className="avatar" src={user.images ? user.images.avatar.full : logo} alt="" referrerPolicy="no-referrer" />
                <span>{user.username}</span>
            </div>
            <nav>
                <div className={!type ? 'user-header-active' : null}><Link to={'/' + user.username} onClick={resetData}>Profile</Link></div>
                <div className={type === 'movies' ? 'user-header-active' : null}><Link to={'/' + user.username + '/movies'} onClick={resetData}>Movies</Link></div>
                <div className={type === 'shows' ? 'user-header-active' : null}><Link to={'/' + user.username + '/shows'} onClick={resetData}>Shows</Link></div>
                <div className={type === 'lists' ? 'user-header-active' : null}><Link to={'/' + user.username + '/lists'} onClick={resetData}>Lists</Link></div>
            </nav>
        </div>
    );
};

export default UserHeader;