import { Link } from 'react-router-dom';

const UserHeader = ({user, resetData}) => {
    return (
        <div className="user-header">
            {user.username}
            <img className="avatar" src={user.images.avatar.full} alt="" referrerpolicy="no-referrer" />
            <nav>
                <div><Link to={'/' + user.username} onClick={resetData}>Profile</Link></div>
                <div><Link to={'/' + user.username + '/movies'} onClick={resetData}>Movies</Link></div>
                <div><Link to={'/' + user.username + '/shows'} onClick={resetData}>Shows</Link></div>
                <div><Link to={'/' + user.username + '/lists'} onClick={resetData}>Lists</Link></div>
            </nav>
        </div>
    );
};

export default UserHeader;