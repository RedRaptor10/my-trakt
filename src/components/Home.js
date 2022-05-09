import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = ({loading, setLoading, fetchList, fetchPosters}) => {
    const [lists, setLists] = useState();
    const [items, setItems] = useState();
    const [posters, setPosters] = useState();
    const limit = 5;
    const favoritesMovies = 'favorites-movies';
    const favoritesShows = 'favorites-tv-shows';

    useEffect(() => {
        // Asynchronously fetch lists, set display items, and fetch images
        if (!lists || !lists.hasOwnProperty(favoritesMovies) || !lists.hasOwnProperty(favoritesShows)) {
            const fetchData = async () => {
                try {
                    const movies = await fetchList(favoritesMovies);
                    const shows = await fetchList(favoritesShows);

                    const tempLists = {
                        [favoritesMovies]: movies,
                        [favoritesShows]: shows
                    };

                    // Set display items to limit
                    const tempItems = {
                        'movies': movies.slice(0, limit),
                        'shows': shows.slice(0, limit)
                    };

                    setLists(tempLists);
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
                catch (error) {
                    console.log(error);
                }
            }

            fetchData();
        }
    }, [setLoading, lists, fetchList, fetchPosters]);

    return (
        <div>
            {loading ?
            <div className="spinner-container">
                <div className="loading-spinner"></div>
            </div>
            :
            items ?
            <div>
                <div>
                    <div><Link to="/shows">Shows</Link></div>
                    <div><Link to="/movies">Movies</Link></div>
                </div>
                <div className="items">
                    {items && posters && items['shows'].length > 0 ?
                    items['shows'].map((item, i) => {
                        let imdb;
                        let title;
                        if (item.type === 'show' && item.hasOwnProperty('show')) {
                            imdb = item.show.ids.imdb;
                            title = item.show.title;
                        } else if (item.type === 'movie' && item.hasOwnProperty('movie')) {
                            imdb = item.movie.ids.imdb;
                            title = item.movie.title;
                        }
                        return (
                            <a key={i} className="item" href={'https://www.imdb.com/title/' + imdb} target="_blank" rel="noreferrer">
                                {posters['shows'][i].poster ?
                                    <img className="item-poster" src={'https://image.tmdb.org/t/p/w300_and_h450_bestv2' + posters['shows'][i].poster} alt={title}></img>
                                :
                                    <img className="item-poster" alt=""></img>}
                                <div className="item-title"><span>{title}</span></div>
                            </a>
                        )
                    })
                    : items['shows'].length === 0 ?
                        <div>No Results</div>
                    : null}
                </div>
            </div>
            : null}
        </div>
    );
}

export default Home;