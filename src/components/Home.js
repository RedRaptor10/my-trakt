import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/trakt-icon-red.svg';

const Home = ({loading, setLoading, lists, setLists, fetchList, fetchPosters}) => {
    const [items, setItems] = useState();
    const [posters, setPosters] = useState();
    const limit = 5;
    const favoritesMovies = 'favorites-movies';
    const favoritesShows = 'favorites-shows';

    useEffect(() => {
        // Reset display items and posters
        setItems();
        setPosters();

        // Asynchronously fetch lists, set display items, and fetch images
        if (!lists || !lists.hasOwnProperty(favoritesMovies) || !lists.hasOwnProperty(favoritesShows)) {
            const fetchData = async () => {
                const movies = await fetchList(favoritesMovies);
                const shows = await fetchList(favoritesShows);

                const tempLists = {
                    ...lists,
                    [favoritesMovies]: movies,
                    [favoritesShows]: shows
                };

                setLists(tempLists);
            }

            fetchData();
        }
        // Set display items and fetch posters
        else {
            const fetchData = async () => {
                // Set display items to limit
                const tempItems = {
                    'movies': lists[favoritesMovies].slice(0, limit),
                    'shows': lists[favoritesShows].slice(0, limit)
                };

                setItems(tempItems);

                const moviePosters = await fetchPosters(tempItems['movies'], 'movies');
                const showPosters = await fetchPosters(tempItems['shows'], 'shows');

                const tempPosters = {
                    'movies': moviePosters,
                    'shows': showPosters
                };

                setPosters(tempPosters);
                setLoading(false);
            }

            fetchData();
        }
    }, [setLoading, lists, setLists, fetchList, fetchPosters]);

    return (
        <div>
            {loading ?
            <div className="spinner-container">
                <div className="loading-spinner"></div>
            </div>
            :
            items ?
                <div>
                    <div className="home-items-container">
                    <div className="home-items">
                        <h1 className="home-items-header">Top 5 Movies</h1>
                        {items && posters && items['movies'].length > 0 ?
                        items['movies'].map((item, i) => {
                            let imdb;
                            let title;
                            let year;
                            if (item.type === 'movie' && item.hasOwnProperty('movie')) {
                                imdb = item.movie.ids.imdb;
                                title = item.movie.title;
                                year = item.movie.year;
                            }
                            return (
                                <div key={i} className="home-items-row">
                                    <h1 className="home-item-rank">{i + 1}</h1>
                                    <div className="home-item">
                                        <a className="home-item-poster-container" href={'https://www.imdb.com/title/' + imdb} target="_blank" rel="noreferrer">
                                            {posters['movies'][i].poster ?
                                                <img className="home-item-poster" src={'https://image.tmdb.org/t/p/w300_and_h450_bestv2' + posters['movies'][i].poster} alt={title}></img>
                                            :
                                                <img className="home-item-poster home-item-poster-empty" src={logo} alt=""></img>}
                                        </a>
                                        <div className="home-item-info">
                                            <div className="home-item-title">{title}</div>
                                            <div className="home-item-year">{year}</div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                        : null}
                        <div className="home-view-all-btn">
                            <Link to="/favorites-movies">View More</Link>
                        </div>
                    </div>
                    <div className="home-items">
                        <h1 className="home-items-header">Top 5 Shows</h1>
                        {items && posters && items['shows'].length > 0 ?
                        items['shows'].map((item, i) => {
                            let imdb;
                            let title;
                            let year;
                            if (item.type === 'show' && item.hasOwnProperty('show')) {
                                imdb = item.show.ids.imdb;
                                title = item.show.title;
                                year = item.show.year;
                            }
                            return (
                                <div key={i} className="home-items-row">
                                    <h1 className="home-item-rank">{i + 1}</h1>
                                    <div className="home-item">
                                        <a className="home-item-poster-container" href={'https://www.imdb.com/title/' + imdb} target="_blank" rel="noreferrer">
                                            {posters['shows'][i].poster ?
                                                <img className="home-item-poster" src={'https://image.tmdb.org/t/p/w300_and_h450_bestv2' + posters['shows'][i].poster} alt={title}></img>
                                            :
                                                <img className="home-item-poster home-item-poster-empty" src={logo} alt=""></img>}
                                        </a>
                                        <div className="home-item-info">
                                            <div className="home-item-title">{title}</div>
                                            <div className="home-item-year">{year}</div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                        : null}
                        <div className="home-view-all-btn">
                            <Link to="/favorites-shows">View More</Link>
                        </div>
                    </div>
                    </div>
                </div>
            : null}
            </div>
    );
}

export default Home;