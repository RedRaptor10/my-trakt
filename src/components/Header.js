import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <div className="header">
            <div className="header-title">Trakt</div>
            <div className="header-nav-container">
                <nav className="header-nav">
                    <div><Link to="/movies">Movies</Link></div>
                    <div><Link to="/shows">Shows</Link></div>
                </nav>
            </div>
        </div>
    )
};

export default Header;