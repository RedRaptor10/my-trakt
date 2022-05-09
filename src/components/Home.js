import { Link } from 'react-router-dom';

const Home = (loading, setLoading) => {
    return (
        <div>
            <div>Home</div>
            <div><Link to="/shows">Shows</Link></div>
            <div><Link to="/movies">Movies</Link></div>
        </div>
    );
}

export default Home;