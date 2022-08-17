import { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import UserHeader from './UserHeader';
import Profile from './Profile';
import Items from './Items';
import Lists from './Lists';
import { sortResults } from '../helpers/sort';

const User = ({loading, setLoading, fetchData, fetchPosters}) => {
    const { username, type, listId } = useParams();
    const [searchParams] = useSearchParams();
    const [user, setUser] = useState();
    const [favorites, setFavorites] = useState();
    const [collection, setCollection] = useState();
    const [lists, setLists] = useState();
    const [list, setList] = useState();
    const [items, setItems] = useState();
    const [listItems, setListItems] = useState();
    const [posters, setPosters] = useState();
    const [results, setResults] = useState();
    const [page, setPage] = useState(1);
    const [view, setView] = useState(searchParams.has('view') ? searchParams.get('view') : 'grid');
    const [foundUser, setFoundUser] = useState();
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

    const resetData = useCallback(() => {
        setResults();
        setItems();
        setListItems();
        setPosters();
        setPage(1);
    }, [setItems, setPosters, setResults, setPage]);

    const fetchPostersData = useCallback(async r => {
        // Set display items to limit
        const i = r.slice(limit * (page - 1), limit * page);
        setItems(i);

        if (view === 'grid' && i.length > 0) {
            const p = await fetchPosters(i, type);
            setPosters(p);
        }
    }, [limit, page, view, type, fetchPosters]);

    // Fetch User
    useEffect(() => {
        const fetchUser = async () => {
            const data = await fetchData(username, 'profile');

            if (data) {
                setUser(data);
                setFoundUser(true);
            } else {
                setUser();
                setFoundUser(false);
                setLoading();
            }

            // Reset data
            setFavorites();
            setCollection();
            setLists();
            setList();
            resetData();
        }

        fetchUser();
    }, [setLoading, username, fetchData, setUser, resetData]);

    // Fetch Favorites
    useEffect(() => {
        if (user && !type && !favorites) {
            resetData();

            const fetchFavorites = async () => {
                const favMovies = await fetchData(username, 'recommendations', 'movies', null, 5);
                const favShows = await fetchData(username, 'recommendations', 'shows', null, 5);
                const pMovies = await fetchPosters(favMovies.slice(0, 5), 'movies');
                const pShows = await fetchPosters(favShows.slice(0, 5), 'shows');

                setFavorites({
                    movies: {
                        items: favMovies.slice(0, 5),
                        posters: pMovies
                    },
                    shows: {
                        items: favShows.slice(0, 5),
                        posters: pShows
                    }
                });
            };

            fetchFavorites()
            .then(setLoading);
        }
    }, [setLoading, user, type, favorites, setFavorites, username, limit, resetData, fetchData, fetchPosters]);

    // Fetch Collection
    useEffect(() => {
        if (type === 'movies' || type === 'shows') {
            if (!collection || (type === 'movies' && !collection.hasOwnProperty('movies')) || (type === 'shows' && !collection.hasOwnProperty('shows'))) {
                resetData();

                const fetchCollection = async () => {
                    let c = await fetchData(username, 'collection', type);

                    setCollection({
                        ...collection,
                        [type]: c
                    });

                    // Sort results by title
                    sortResults(c, type);
                    setResults(c);
                };

                fetchCollection();
            } else if (!results) {
                resetData();

                let r = collection[type].slice(); // Copy list array to prevent modification after sort
                sortResults(r, type);
                setResults(r);
            } else {
                fetchPostersData(results)
                .then(setLoading);
            }
        }
    }, [setLoading, username, collection, setCollection, results, type, page, resetData, fetchData, fetchPostersData]);

    // Fetch List
    useEffect(() => {
        if (type === 'lists' && listId) {
            if (!list || list.ids.slug !== listId) {
                resetData();

                const fetchList = async () => {
                    const l = await fetchData(username, 'list', null, listId);
                    const li = await fetchData(username, 'list-items', null, listId);

                    setList({
                        ...l,
                        items: li
                    });
            
                    // Sort results by title
                    sortResults(li, type);
                    setResults(li);
                };
            
                fetchList();
            } else if (!results) {
                resetData();

                let r = list.items.slice();
                sortResults(r, type);
                setResults(r);
            } else {
                fetchPostersData(results)
                .then(setLoading);
            }
        }
    }, [setLoading, username, list, setList, listId, results, type, page, resetData, fetchData, fetchPostersData]);

    // Fetch Lists
    useEffect(() => {
        if (type === 'lists' && !lists && !listId) {
            const fetchLists = async () => {
                const l = await fetchData(username, 'lists');
                setLists(l);
            }

            fetchLists()
            .then(setLoading);
        }
    }, [setLoading, username, lists, setLists, listId, type, fetchData]);

    return (
        <main className="user">
            {(!user || user.ids.slug !== username) && loading ?
                <div className="spinner-container">
                    <div className="loading-spinner"></div>
                </div>
            :
            user ?
                <div>
                    <UserHeader user={user} resetData={resetData} />
                    {loading ?
                        <div className="spinner-container">
                            <div className="loading-spinner"></div>
                        </div>
                    :
                        !type && favorites ?
                            <Profile user={user} favorites={favorites} />
                        :
                        (type === 'movies' || type === 'shows' || (type === 'lists' && listId)) && items ?
                            <Items collection={collection} list={list} type={type} page={page} setPage={setPage} items={items} results={results}
                                setResults={setResults} limit={limit} setLimit={setLimit} limitDefault={limitDefault} setLimitFromParams={setLimitFromParams}
                                view={view} setView={setView} posters={posters} />
                        : type === 'lists' && lists && !listId ?
                            <Lists setLoading={setLoading} lists={lists} listItems={listItems} setListItems={setListItems} fetchData={fetchData} fetchPosters={fetchPosters} />
                        : null}
                </div>
            : null}
            {foundUser === false ? <div className="no-results">User Not Found</div> : null}
        </main>
    );
};

export default User;