import { useState, useEffect } from 'react';
import Search from './Search';
import Pagination from './Pagination';
import { sortResults } from '../helpers/sort';

const Items = ({loading, setLoading, fetchCollection, fetchList, fetchPosters}) => {
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

  useEffect(() => {
    setItems();
    setPosters();

    // Asynchronously fetch collection or lists, set display items, and fetch images
    if (!listId &&
      (!collection || (type === 'shows' && !collection.hasOwnProperty('shows')) || (type === 'movies' && !collection.hasOwnProperty('movies')))) {
      const fetchData = async () => {
        try {
          let c = await fetchCollection();

          setCollection({
            ...collection,
            [type]: c
          });

          // Sort results by title
          sortResults(c, type);
          setResults(c);
        }
        catch(error) {
          console.log(error);
        }
      };

      fetchData();
    } else if (listId && (!lists || !lists.hasOwnProperty(listId))) {
      const fetchData = async () => {
        try {
          const l = await fetchList(listId);

          setLists({
            ...lists,
            [listId]: l
          });

          // Sort results by title
          sortResults(l, type);
          setResults(l);
        }
        catch (error) {
          console.log(error);
        }
      };

      fetchData();
    } else {
      const fetchData = async () => {
        // Set display items to limit
        const i = results.slice(limit * (page - 1), limit * page);
        setItems(i);

        const p = await fetchPosters(i, type);
        setPosters(p);
        setLoading(false);
      };

      fetchData();
    }

  }, [setLoading, collection, lists, results, type, listId, page, fetchCollection, fetchList, fetchPosters]);

  return (
    <div>
      {loading ?
      <div className="spinner-container">
        <div className="loading-spinner"></div>
      </div>
      :
      items ?
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