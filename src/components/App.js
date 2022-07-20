import { useState, useCallback } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Home from './Home';
import User from './User';
import Items from './Items';
import Lists from './Lists';

// Trakt Documentation: https://trakt.docs.apiary.io
// TMDB Documentation: https://developers.themoviedb.org/3
const trakt_id = 'redraptor10';
const trakt_url = 'https://api.trakt.tv';
const tmdb_url = 'https://api.themoviedb.org/3';
const client_id = process.env.REACT_APP_CLIENT_ID; // Trakt auth
const api_key = process.env.REACT_APP_API_KEY; // TMDB auth
// JavaScript (CORS) Origins: https://redraptor10.github.io

const App = () => {
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState();
    const [collection, setCollection] = useState();
    const [lists, setLists] = useState();
    const [list, setList] = useState();
    const [errorMsg, setErrorMsg] = useState();

    // Note: A limitation to the Trakt API is it cannot return a subset of results.
    // We must fetch the entire collection and set it as a state.
    const fetchData = useCallback(async (userId, resource, type, listId) => {
        setLoading(true);

        let protocol = '';
        if (resource === 'profile') {
            protocol = '/users/' + userId;
        } else if (resource === 'collection' && type) {
            protocol = '/users/' + trakt_id + '/collection/' + type;
        } else if (resource === 'lists') {
            protocol = '/users/' + trakt_id + '/lists';
        } else if (resource === 'list' && listId) {
            protocol = '/users/' + trakt_id + '/lists/' + listId;
        } else if (resource === 'list-items' && listId) {
            protocol = '/users/' + trakt_id + '/lists/' + listId + '/items';
        }

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
        if (data.status === 404) {
            return false;
        } else {
            return data.json();
        }
    }, [setLoading])

    const fetchPosters = useCallback(async (r, t) => {
        setLoading(true);

        let promises = [];
    
        r.forEach(result => {
            let methodUrl;
            if (t === 'movies') { methodUrl = '/movie/' + result.movie.ids.tmdb }
            else if (t === 'shows') { methodUrl = '/tv/' + result.show.ids.tmdb }
            else if (t === 'list') {
                if (result.type === 'movie') { methodUrl = '/movie/' + result.movie.ids.tmdb }
                else if (result.type === 'show') { methodUrl = '/tv/' + result.show.ids.tmdb }
            }

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
                });
            }));
        });
    
        return await Promise.all(promises);
    }, []);

    return (
        <HashRouter>
            <Header setLoading={setLoading} setUser={setUser} setErrorMsg={setErrorMsg} fetchData={fetchData} />
            <Routes>
                <Route exact path="/" element={<Home errorMsg={errorMsg} />} />
                <Route exact path="/:username" element={<User loading={loading} setLoading={setLoading} user={user} setUser={setUser} errorMsg={errorMsg}
                    setErrorMsg={setErrorMsg} fetchData={fetchData} />} />
                <Route exact path="/movies" element={<Items loading={loading} setLoading={setLoading} collection={collection} setCollection={setCollection}
                    list={list} setList={setList} typeProp={'movies'} fetchData={fetchData} fetchPosters={fetchPosters} />} />
                <Route exact path="/shows" element={<Items loading={loading} setLoading={setLoading} collection={collection} setCollection={setCollection}
                    list={list} setList={setList} typeProp={'shows'} fetchData={fetchData} fetchPosters={fetchPosters} />} />
                <Route exact path="/:username/lists" element={<Lists loading={loading} setLoading={setLoading} lists={lists} setLists={setLists}
                    fetchData={fetchData} />} />
                <Route exact path="/lists/:listId" element={<Items loading={loading} setLoading={setLoading} collection={collection} setCollection={setCollection}
                    list={list} setList={setList} typeProp={'list'} fetchData={fetchData} fetchPosters={fetchPosters} />} />
            </Routes>
            <Footer />
        </HashRouter>
    );
};

export default App;