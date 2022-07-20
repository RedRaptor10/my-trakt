import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const User = ({loading, setLoading, user, setUser, errorMsg, setErrorMsg, fetchData}) => {
    const { username } = useParams();
    useEffect( () => {
        if (!user) {
            const fetchUser = async () => {
                const data = await fetchData(username, 'profile');

                if (data) {
                    setErrorMsg();
                    setUser(data);
                } else {
                    setUser();
                    setErrorMsg('User not found.');
                }

                setLoading();
            }

            fetchUser();
        }
    }, [setLoading, user, username, fetchData, setUser, setErrorMsg]);

    return (
        <main className="user">
            {loading ?
            <div className="spinner-container">
                <div className="loading-spinner"></div>
            </div>
            :
            <div>
                {user ?
                    <div>
                        <div>{user.username}</div>
                        <div className="header-nav-container">
                            <nav className="header-nav">
                                <div className="header-nav-movies"><Link to="/movies">Movies</Link></div>
                                <div className="header-nav-shows"><Link to="/shows">Shows</Link></div>
                                <div className="header-nav-lists"><Link to="/lists">Lists</Link></div>
                            </nav>
                        </div>
                    </div>
                : null}
                {errorMsg ?
                    <div>{errorMsg}</div>
                : null}
            </div>}
        </main>
    );
};

export default User;