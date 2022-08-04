import { Link } from 'react-router-dom';
import logo from '../assets/trakt-icon-red.svg';

const Home = () => {
    return (
        <main className="home">
            <img src={logo} alt="" />
            <div>
                <b>My Trakt</b> is a web app that displays a user's favorite movies and shows.<br />
                Enter a Trakt username or id in the search bar to view a user's profile.
            </div>
            <Link to="/redraptor10"><button className="btn">PROFILE EXAMPLE</button></Link>
        </main>
    );
};

export default Home;