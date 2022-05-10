import { Link } from 'react-router-dom';
import logo from '../assets/trakt-icon-red.svg';

const Header = () => {
    return (
        <div className="header">
            <div className="header-title">
                <Link to="/">
                    <img src={logo} alt="My Trakt"></img>
                    My Trakt
                </Link>
            </div>
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