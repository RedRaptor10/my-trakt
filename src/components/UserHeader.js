import { Link, useParams } from 'react-router-dom';
import logo from '../assets/trakt-icon-red.svg';

const UserHeader = ({user, resetData}) => {
    const { category, type } = useParams();

    return (
        <div className="user-header">
            <div className="user-header-top">
                <img className="avatar" src={user.images ? user.images.avatar.full : logo} alt="" referrerPolicy="no-referrer" />
                <span>{user.username}</span>
            </div>
            {!user.private ?
                <nav>
                    <div className={!category ? 'user-header-active' : null}><Link to={'/' + user.ids.slug} onClick={resetData}>Profile</Link></div>
                    <div className={type === 'movies' ? 'user-header-active' : null}><Link to={'/' + user.ids.slug + '/collection/movies'} onClick={resetData}>Movies</Link></div>
                    <div className={type === 'shows' ? 'user-header-active' : null}><Link to={'/' + user.ids.slug + '/collection/shows'} onClick={resetData}>Shows</Link></div>
                    <div className={category === 'lists' ? 'user-header-active' : null}><Link to={'/' + user.ids.slug + '/lists'} onClick={resetData}>Lists</Link></div>
                </nav>
            : null}
        </div>
    );
};

export default UserHeader;