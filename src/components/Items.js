import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import Search from './Search';
import Pagination from './Pagination';
import { sortResults } from '../helpers/sort';
import logo from '../assets/trakt-icon-red.svg';

const Items = ({loading, setLoading, collection, setCollection, lists, setLists, fetchCollection, fetchList, fetchPosters}) => {
  const { path } = useParams();
  const [searchParams] = useSearchParams();
  const [input, setInput] = useState('');
  const [results, setResults] = useState();
  const [type, setType] = useState(() => {
    if (path === 'movies' || path === 'favorites-movies') { return 'movies' }
    else if (path === 'shows' || path === 'favorites-shows') { return 'shows' }
    return 'movies';
  });
  const [listId, setListId] = useState(() => {
    if (path === 'favorites-movies') { return 'favorites-movies' }
    else if (path === 'favorites-shows') { return 'favorites-shows' }
    return false;
  });
  const [items, setItems] = useState();
  const [posters, setPosters] = useState();
  const [page, setPage] = useState(1);
  const [view, setView] = useState(searchParams.has('view') ? searchParams.get('view') : 'grid');
  const limitDefault = 25;

  const setLimitFromParams = () => {
    // Only set limit if view is list
    if (searchParams.has('limit') && (searchParams.get('view') === 'list' || view === 'list')) {
      // If limit is 0, display entire collection
      if (searchParams.get('limit') === '0') {
        setPage(1);
        return 99999999;
      } else {
        return searchParams.get('limit');
      }
    }

    return limitDefault;
  };

  const [limit, setLimit] = useState(setLimitFromParams);

  const changeView = newView => {
    if (view === 'grid' && newView === 'list') {
      setView('list');
      setLimit(setLimitFromParams);
    } else if (view === 'list' && newView === 'grid') {
      setView('grid');
      setLimit(limitDefault);
    }
  };

  // Add active class and toggles to header links on mount
  useEffect(() => {
    const headerMovies = document.querySelector('.header-nav-movies');
    const headerShows = document.querySelector('.header-nav-shows');

    if (type === 'movies') { headerMovies.classList.add('header-active') }
    else if (type === 'shows') { headerShows.classList.add('header-active') }

    const toggleType = t => {
      if (collection && collection.hasOwnProperty(t)) {
        setResults(collection[t]);
      }
      setInput('');
      setPage(1);
      setListId();
      setType(t);
    };

    headerMovies.onclick = () => { toggleType('movies') };
    headerShows.onclick = () => { toggleType('shows') };

    // Remove active class and onclick on unmount
    return () => {
      headerMovies.classList.remove('header-active');
      headerShows.classList.remove('header-active');
      headerMovies.onclick = '';
      headerShows.onclick = '';
    };
  }, [collection, type]);

  useEffect(() => {
    // Reset display items and posters
    setItems();
    setPosters();

    // Fetch collection
    if (!listId &&
      (!collection || (type === 'movies' && !collection.hasOwnProperty('movies')) || (type === 'shows' && !collection.hasOwnProperty('shows')))) {
      const fetchData = async () => {
        try {
          let c = await fetchCollection(type);

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
    }
    // Fetch list
    else if (listId && (!lists || !lists.hasOwnProperty(listId))) {
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
    }
    // If there is a collection or list but there are no results, set results again (ie. revisiting a page after already fetching data)
    else if (!results) {
      const r = listId ? lists[listId].slice() : collection[type]; // Copy list array to prevent modification after sort

      sortResults(r, type);
      setResults(r);
    }
    // Set display items and fetch posters
    else {
      const fetchData = async () => {
        try {
          // Set display items to limit
          const i = results.slice(limit * (page - 1), limit * page);
          setItems(i);

          if (view === 'grid') {
            const p = await fetchPosters(i, type);
            setPosters(p);
          }

          setLoading(false);
        }
        catch (error) {
          console.log(error);
        }
      };

      fetchData();
    }

  }, [path, setLoading, collection, setCollection, lists, setLists, results, type, listId, page, limit, view, fetchCollection, fetchList, fetchPosters]);

  return (
    <div>
      {loading ?
      <div className="spinner-container">
        <div className="loading-spinner"></div>
      </div>
      :
      items ?
      <div>
        <Search input={input} setInput={setInput} collection={collection} lists={lists} setResults={setResults} type={type} listId={listId} setPage={setPage} />
        <Pagination results={results} type={type} page={page} setPage={setPage} limit={limit} view={view} changeView={changeView} />
        <div className={view === 'grid' ? 'items' : 'items-list'}>
          {items && items.length > 0 ?
            items.map((item, i) => {
              let imdb;
              let title;
              let year;
              if (type === 'movies' && item.hasOwnProperty('movie')) {
                imdb = item.movie.ids.imdb;
                title = item.movie.title;
                year = item.movie.year;
              }
              else if (type === 'shows' && item.hasOwnProperty('show')) {
                imdb = item.show.ids.imdb;
                title = item.show.title;
                year = item.show.year;
              }
              return (
                posters && view === 'grid' ?
                <a key={i} className="item" href={'https://www.imdb.com/title/' + imdb} target="_blank" rel="noreferrer">
                    {posters[i].poster ?
                      <img className="item-poster" src={'https://image.tmdb.org/t/p/w300_and_h450_bestv2' + posters[i].poster} alt={title}></img>
                    :
                      <img className="item-poster item-poster-empty" src={logo} alt=""></img>}
                  <div className="item-title"><span>{title}</span></div>
                </a>
                :
                <a key={i} href={'https://www.imdb.com/title/' + imdb} target="_blank" rel="noreferrer">
                  <div><span>{title} ({year})</span></div>
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