import { useState, useCallback } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Header from './Header';
import Home from './Home';
import Items from './Items';

// Trakt Documentation: https://trakt.docs.apiary.io
// TMDB Documentation: https://developers.themoviedb.org/3
const trakt_id = 'redraptor10';
const trakt_url = 'https://api.trakt.tv';
const tmdb_url = 'https://api.themoviedb.org/3';
const client_id = process.env.REACT_APP_CLIENT_ID; // Trakt auth
const api_key = process.env.REACT_APP_API_KEY; // TMDB auth

const App = () => {
    const [loading, setLoading] = useState(false);
    const [collection, setCollection] = useState();
    const [lists, setLists] = useState();

    const fetchCollection = useCallback(async type => {
        setLoading(true);
  
        let protocol = '/users/' + trakt_id + '/collection/' + type;
        //let protocol = '/users/' + trakt_id + '/recommendations';
  
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
    }, [setLoading]);

    const fetchList = useCallback(async listId => {
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
    }, [setLoading]);

    const fetchPosters = useCallback(async (r, t) => {
        let promises = [];
    
        r.forEach(result => {
            let methodUrl;
            if (t === 'movies') { methodUrl = '/movie/' + result.movie.ids.tmdb }
            else if (t === 'shows') { methodUrl = '/tv/' + result.show.ids.tmdb }

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

    return (
        <HashRouter>
            <Header />
            <Routes>
                <Route exact path="/" element={<Home loading={loading} setLoading={setLoading} lists={lists} setLists={setLists}
                    fetchList={fetchList} fetchPosters={fetchPosters} />} />
                <Route exact path="/:path" element={<Items loading={loading} setLoading={setLoading} collection={collection} setCollection={setCollection}
                    lists={lists} setLists={setLists} fetchCollection={fetchCollection} fetchList={fetchList} fetchPosters={fetchPosters} />} />
            </Routes>
        </HashRouter>
    );
};

export default App;