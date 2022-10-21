import { Link } from 'react-router-dom';
import Item from './Item';

const Profile = ({user, stats, favorites}) => {
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
            <section className="profile-sidebar">
                <section className="profile-info">
                    <h2>INFORMATION</h2>
                    <div><label>Name:</label><span>{user.name ? user.name : 'N/A'}</span></div>
                    <div><label>Age:</label><span>{user.age ? user.age : 'N/A'}</span></div>
                    <div><label>Gender:</label><span>{user.gender ? capitalize(user.gender) : 'N/A'}</span></div>
                    <div><label>Joined:</label><span>{parseISOString(user.joined_at)}</span></div>
                    <div><label>Location:</label><span>{user.location ? user.location : 'N/A'}</span></div>
                    <div><label>About:</label>
                        <div className="about">{user.about ? user.about : null}</div>
                    </div>
                </section>
                <section className="profile-network">
                    <h2>NETWORK</h2>
                    <div><label>Friends:</label><span>{stats.network.friends}</span></div>
                    <div><label>Following:</label><span>{stats.network.following}</span></div>
                    <div><label>Followers:</label><span>{stats.network.followers}</span></div>
                </section>
                <section className="profile-movies">
                    <h2>MOVIES</h2>
                    <div><label>Collected:</label><span>{stats.movies.collected}</span></div>
                    <div><label>Watched:</label><span>{stats.movies.watched}</span></div>
                    <div><label>Ratings:</label><span>{stats.movies.ratings}</span></div>
                </section>
                <section className="profile-shows">
                    <h2>SHOWS</h2>
                    <div><label>Collected:</label><span>{stats.shows.collected}</span></div>
                    <div><label>Watched:</label><span>{stats.shows.watched}</span></div>
                    <div><label>Ratings:</label><span>{stats.shows.ratings}</span></div>
                </section>
                <a href={'https://trakt.tv/users/' + user.ids.slug} target="_blank" rel="noreferrer"><button className="btn">VIEW TRAKT PROFILE</button></a>
            </section>
            {favorites ?
                <section className="favorites">
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
                </section>
            : null}
        </div>
    );
};

export default Profile;