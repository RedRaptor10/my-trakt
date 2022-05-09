import { useState, useEffect, useCallback } from 'react';
import Search from './Search';
import Pagination from './Pagination';
import { sortResults } from '../helpers/sort';

// Trakt Documentation: https://trakt.docs.apiary.io
// TMDB Documentation: https://developers.themoviedb.org/3
const trakt_id = 'redraptor10';
const trakt_url = 'https://api.trakt.tv';
const tmdb_url = 'https://api.themoviedb.org/3';
const client_id = process.env.REACT_APP_CLIENT_ID; // Trakt auth
const api_key = process.env.REACT_APP_API_KEY; // TMDB auth

const Items = ({loading, setLoading}) => {
  const [input, setInput] = useState('');
  const [collection, setCollection] = useState();
  const [lists, setLists] = useState();
  const [results, setResults] = useState();
  const [type, setType] = useState('shows');
  const [listId, setListId] = useState();
  const [items, setItems] = useState();
  const [posters, setPosters] = useState();
  const [page, setPage] = useState(1);
  const limit = 25;

  const setDisplayItems = useCallback(async r => {
    setLoading(true);

    // Sort results by title
    sortResults(r, type);

    // Set display items to limit
    const arr = r.slice(limit * (page - 1), limit * page);

    setItems(arr);

    return arr;
  }, [setLoading, type, page, limit]);

  const fetchImages = useCallback(async r => {
    let promises = [];

    r.forEach(result => {
      let methodUrl;
      if (type === 'shows') { methodUrl = '/tv/' + result.show.ids.tmdb }
      else if (type === 'movies') { methodUrl = '/movie/' + result.movie.ids.tmdb }

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

    setPosters(await Promise.all(promises));
  }, [type]);

  useEffect(() => {
    const fetchCollection = () => {
      setLoading(true);

      //let protocol = '/users/' + trakt_id + '/collection/' + type;
      let protocol = '/users/' + trakt_id + '/recommendations';

      const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'trakt-api-version': 2,
          'trakt-api-key': client_id
        }
      };

      // Return fetch results as Promise
      return fetch(trakt_url + protocol, options)
      .then(function(res) { return res.json(); })
      .then(function(res) {
        setCollection({
          ...collection,
          [type]: res
        });

        setResults(res);
        return res;
      });
    };

    const fetchList = () => {
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
      return fetch(trakt_url + protocol, options)
      .then(function(res) { return res.json(); })
      .then(function(res) {
        console.log(res);
        setLists({
          ...lists,
          [listId]: res
        });

        setResults(res);
        return res;
      });
    };

    // Asynchronously fetch collection or lists, set display items, and fetch images
    if (!listId &&
      (!collection || (type === 'shows' && !collection.hasOwnProperty('shows')) || (type === 'movies' && !collection.hasOwnProperty('movies')))) {
      fetchCollection()
      .catch(error => {
        console.log(error);
      });
    } else if (listId && (!lists || !lists.hasOwnProperty(listId))) {
      fetchList()
      .catch(error => {
        console.log(error);
      });
    } else {
      setDisplayItems(results)
      .then(r => {
        fetchImages(r)
        .then(() => {
          setLoading(false);
        });
      })
      .catch(error => {
        console.log(error);
      });
    }

  }, [setLoading, collection, lists, results, type, listId, page, setDisplayItems, fetchImages]);

  // Focus on Search Input field when input or posters change
  useEffect(() => {
    const searchInput = document.getElementById('search-input');
    if (searchInput && input !== '') { searchInput.focus() }
  }, [input, posters]);

  const toggleType = t => {
    if (collection.hasOwnProperty(t)) {
      setResults(collection[t]);
    }
    setInput('');
    setPage(1);
    setListId();
    setType(t);
  };

  const toggleList = (l, t) => {
    if (lists && lists.hasOwnProperty(l)) {
      setResults(lists[l]);
    }
    setInput('');
    setPage(1);
    setListId(l);
    setType(t);
  };

  return (
    <div>
      {loading ?
      <div className="spinner-container">
        <div className="loading-spinner"></div>
      </div>
      :
      collection ?
      <div>
        <Search input={input} setInput={setInput} collection={collection} setResults={setResults} type={type} />
        <Pagination results={results} type={type} page={page} setPage={setPage} limit={limit} />
        <div onClick={() => { toggleType('shows') }}>Shows</div>
        <div onClick={() => { toggleType('movies') }}>Movies</div>
        <div onClick={() => { toggleList('favorites-tv-shows', 'shows') }}>Favorite Shows</div>
        <div onClick={() => { toggleList('favorites-movies', 'movies') }}>Favorite Movies</div>
        <div className="items">
          {items && posters && items.length > 0 ?
            items.map((item, i) => {
              let imdb;
              let title;
              if (type === 'shows' && item.hasOwnProperty('show')) {
                imdb = item.show.ids.imdb;
                title = item.show.title;
              } else if (type === 'movies' && item.hasOwnProperty('movie')) {
                imdb = item.movie.ids.imdb;
                title = item.movie.title;
              }
              return (
                <a key={i} className="item" href={'https://www.imdb.com/title/' + imdb} target="_blank" rel="noreferrer">
                    {posters[i].poster ?
                      <img className="item-poster" src={'https://image.tmdb.org/t/p/w300_and_h450_bestv2' + posters[i].poster} alt={title}></img>
                    :
                      <img className="item-poster" alt=""></img>}
                  <div className="item-title"><span>{title}</span></div>
                </a>
              )
            })
          : items.length === 0 ?
            <div>No Results</div>
          : null}
        </div>
      </div>
      : null}
    </div>
  );
}

export default Items;