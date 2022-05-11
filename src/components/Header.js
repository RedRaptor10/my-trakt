import { Link } from 'react-router-dom';
import logo from '../assets/trakt-icon-red.svg';

const Header = () => {
    return (
        <header className="header">
            <div className="header-title">
                <Link to="/">
                    <img src={logo} alt="My Trakt"></img>
                    My Trakt
                </Link>
            </div>
            <div className="header-nav-container">
                <nav className="header-nav">
                    <div className="header-nav-movies"><Link to="/movies">Movies</Link></div>
                    <div className="header-nav-shows"><Link to="/shows">Shows</Link></div>
                </nav>
            </div>
        </header>
    )
};

export default Header;