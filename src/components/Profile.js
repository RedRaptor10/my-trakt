import { Link } from 'react-router-dom';
import Item from './Item';

const Profile = ({user, favorites}) => {
    const parseISOString = s => {
        const d = new Date(s);
        const day = d.getDate();
        const month = d.getMonth() + 1;
        const year = d.getFullYear();
        return month + '/' + day + '/' + year;
    };

    const capitalize = s => {
        return s.charAt(0).toUpperCase() + s.slice(1);
    };

    return (
        <div className="profile">
            <div className="profile-info">
                <h2>INFORMATION</h2>
                <div><label>Name:</label>{user.name ? user.name : 'N/A'}</div>
                <div><label>Age:</label>{user.age ? user.age : 'N/A'}</div>
                <div><label>Gender:</label>{user.gender ? capitalize(user.gender) : 'N/A'}</div>
                <div><label>Joined:</label>{parseISOString(user.joined_at)}</div>
                <div><label>Location:</label>{user.location ? user.location : 'N/A'}</div>
                <div><label>About:</label>
                    <div>{user.about ? user.about : null}</div>
                </div>
                <a href={'https://trakt.tv/users/' + user.ids.slug} target="_blank" rel="noreferrer"><button className="btn">VIEW TRAKT PROFILE</button></a>
            </div>
            {favorites ?
                <div className="favorites">
                    {Object.keys(favorites).map(type => {
                        return (
                            <div key={type} className="list">
                                <Link to={'/' + user.username + '/recommendations/' + type}><h2>FAVORITE {type.toUpperCase()}</h2></Link>
                                <div className="list-row">
                                    <div className="list-items">
                                        {favorites[type].items && favorites[type].items.length > 0 ?
                                            favorites[type].items.map((item, i) => {
                                                let imdb = item[item.type].ids.imdb;
                                                let title = item[item.type].title;

                                                return (
                                                    <Item key={i} i={i} posters={favorites[type].posters} imdb={imdb} title={title} />
                                                );
                                            })
                                        :
                                            <div className="list-empty">This user has not added any favorite {type}.</div>
                                        }
                                    </div>
                                    {favorites[type].items && favorites[type].items.length > 0 ?
                                        <div className="view-more-btn-container">
                                            <Link to={'/' + user.username + '/recommendations/' + type}><button className="btn">VIEW MORE</button></Link>
                                        </div>
                                    : null}
                                </div>
                            </div>
                        );
                    })}
                </div>
            : null}
        </div>
    );
};

export default Profile;