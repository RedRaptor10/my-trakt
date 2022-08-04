import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <main className="home">
            <div>Welcome to My Trakt. Enter a Trakt username or id in the search bar to view a user's profile.</div>
            <Link to="/RedRaptor10"><button>Example Profile</button></Link>
        </main>
    );
};

export default Home;