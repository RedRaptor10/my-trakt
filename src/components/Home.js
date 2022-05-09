import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

// Trakt Documentation: https://trakt.docs.apiary.io
// TMDB Documentation: https://developers.themoviedb.org/3
const trakt_id = 'redraptor10';
const trakt_url = 'https://api.trakt.tv';
const tmdb_url = 'https://api.themoviedb.org/3';
const client_id = process.env.REACT_APP_CLIENT_ID; // Trakt auth
const api_key = process.env.REACT_APP_API_KEY; // TMDB auth

const favoritesMovies = 'favorites-movies';
const favoritesShows = 'favorites-tv-shows';

const Home = ({loading, setLoading}) => {
    const [lists, setLists] = useState();
    const [items, setItems] = useState();
    const [posters, setPosters] = useState();
    const limit = 5;

    const fetchPosters = useCallback(async (r, t) => {
        let promises = [];
    
        r.forEach(result => {
            let methodUrl;
            if (t === 'shows') { methodUrl = '/tv/' + result.show.ids.tmdb }
            else if (t === 'movies') { methodUrl = '/movie/' + result.movie.ids.tmdb }

            // Multiple asynchronous fetches require pushing all Promises into an array
            promises.push(new Promise((resolve, reject) => {
                fetch(tmdb_url + methodUrl + '/images?api_key=' + api_key + '&include_image_language=en,null')
                .then(function(res, error) {
                    if (error) { reject(error) }
                    return res.json();
                })
                .then(function(res, error) {
                    if (error) { reject(error) }

                    let found = true;
                    if (res.status_code === 34) { found = false }

                    let highest = -1;
                    let highestIndex = 0;

                    if (found && res.posters.length > 0) {
                        res.posters.forEach((p, i) => {
                            if (p.vote_average > highest) {
                                highest = p.vote_average;
                                highestIndex = i;
                            }
                        });
                    }

                    resolve({
                        id: result.id,
                        poster: (found && res.posters.length > 0) ? res.posters[highestIndex].file_path : null
                    });
                })
                .catch(error => {
                    console.log(error);
                });
            }));
        });
    
        return await Promise.all(promises);
      }, []);

    useEffect(() => {
        const fetchList = async listId => {
            setLoading(true);
      
            let protocol = '/users/' + trakt_id + '/lists/' + listId + '/items';
      
            const options = {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'trakt-api-version': 2,
                'trakt-api-key': client_id
              }
            };
      
            // Return fetch results as Promise
            const data = await fetch(trakt_url + protocol, options);
            return data.json();
        };

        // Asynchronously fetch lists, set display items, and fetch images
        if (!lists || !lists.hasOwnProperty(favoritesMovies) || !lists.hasOwnProperty(favoritesShows)) {
            const fetchData = async () => {
                try {
                    const movies = await fetchList(favoritesMovies);
                    const shows = await fetchList(favoritesShows);

                    const tempList = {
                        [favoritesMovies]: movies,
                        [favoritesShows]: shows
                    };

                    // Set display items to limit
                    const tempItems = {
                        [favoritesMovies]: movies.slice(0, limit),
                        [favoritesShows]: shows.slice(0, limit)
                    };

                    setLists(tempList);
                    setItems(tempItems);

                    const moviePosters = await fetchPosters(tempItems[favoritesMovies], 'movies');
                    const showPosters = await fetchPosters(tempItems[favoritesShows], 'shows');

                    const tempPosters = {
                        [favoritesMovies]: moviePosters,
                        [favoritesShows]: showPosters
                    };

                    setPosters(tempPosters);
                    setLoading(false);
                }
                catch (error) {
                    console.log(error);
                }
            }

            fetchData();

/*            fetchList(favoritesMovies)
            .then(movies => {
                fetchList(favoritesShows)
                .then(shows => {
                    const tempList = {
                        [favoritesMovies]: movies,
                        [favoritesShows]: shows
                    };

                    // Set display items to limit
                    const tempItems = {
                        [favoritesMovies]: movies.slice(0, limit),
                        [favoritesShows]: shows.slice(0, limit)
                    };

                    setLists(tempList);
                    setItems(tempItems);

                    fetchPosters(tempItems[favoritesMovies], 'movies')
                    .then(moviePosters => {
                        fetchPosters(tempItems[favoritesShows], 'shows')
                        .then(showPosters => {
                            const tempPosters = {
                                [favoritesMovies]: moviePosters,
                                [favoritesShows]: showPosters
                            };

                            setPosters(tempPosters);
                            setLoading(false);
                        });
                    });
                });
            })
            .catch(error => {
                console.log(error);
            });*/
        } else {
            /*setDisplayItems(results)
            .then(r => {
            fetchPosters(r)
            .then(() => {
                setLoading(false);
            });
            })
            .catch(error => {
                console.log(error);
            });*/
        }
    }, [setLoading, lists, fetchPosters]);

    return (
        <div>
            {loading ?
            <div className="spinner-container">
                <div className="loading-spinner"></div>
            </div>
            :
            lists ?
            <div>
                <div>
                    <div><Link to="/shows">Shows</Link></div>
                    <div><Link to="/movies">Movies</Link></div>
                </div>
                <div className="items">
                    {items && posters && items[favoritesShows].length > 0 ?
                    items[favoritesShows].map((item, i) => {
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
                                {posters[favoritesShows][i].poster ?
                                    <img className="item-poster" src={'https://image.tmdb.org/t/p/w300_and_h450_bestv2' + posters[favoritesShows][i].poster} alt={title}></img>
                                :
                                    <img className="item-poster" alt=""></img>}
                                <div className="item-title"><span>{title}</span></div>
                            </a>
                        )
                    })
                    : items[favoritesShows].length === 0 ?
                        <div>No Results</div>
                    : null}
                </div>
            </div>
            : null}
        </div>
    );
}

export default Home;