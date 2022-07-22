import { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import Items from './Items';
import Lists from './Lists';
import { sortResults } from '../helpers/sort';

const User = ({loading, setLoading, user, setUser, errorMsg, setErrorMsg, fetchData, fetchPosters}) => {
    const { username, type, listId } = useParams();
    const [searchParams] = useSearchParams();
    const [collection, setCollection] = useState();
    const [lists, setLists] = useState();
    const [list, setList] = useState();
    const [items, setItems] = useState();
    const [posters, setPosters] = useState();
    const [results, setResults] = useState();
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

    const resetData = useCallback(() => {
        setResults();
        setItems();
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

    useEffect(() => {
        if (!user) {
            const fetchUser = async () => {
                const data = await fetchData(username, 'profile');

                if (data) {
                    setErrorMsg();
                    setUser(data);
                } else {
                    setUser();
                    setErrorMsg('User not found.');
                }

                setLoading();
            }

            fetchUser()
            .then(setLoading);
        }
    }, [setLoading, user, username, fetchData, setUser, setErrorMsg]);

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
    }, [setLoading, username, collection, results, type, page, resetData, fetchData, fetchPostersData]);

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
    }, [setLoading, username, list, listId, results, type, page, resetData, fetchData, fetchPostersData]);

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
    }, [setLoading, username, lists, listId, type, fetchData]);

    return (
        <main className="user">
            {loading ?
            <div className="spinner-container">
                <div className="loading-spinner"></div>
            </div>
            :
            <div>
                {user ?
                    <div>
                        <div>{user.username}</div>
                        <div>
                            <nav>
                                <div><Link to={'/' + username + '/movies'} onClick={resetData}>Movies</Link></div>
                                <div><Link to={'/' + username + '/shows'} onClick={resetData}>Shows</Link></div>
                                <div><Link to={'/' + username + '/lists'} onClick={resetData}>Lists</Link></div>
                            </nav>
                        </div>
                        { (type === 'movies' || type === 'shows' || (type === 'lists' && listId)) && items ?
                            <Items collection={collection} list={list} type={type} page={page} setPage={setPage} items={items} results={results}
                                setResults={setResults} limit={limit} setLimit={setLimit} limitDefault={limitDefault} setLimitFromParams={setLimitFromParams}
                                view={view} setView={setView} posters={posters} />
                        : type === 'lists' && !listId ?
                            <Lists lists={lists} />
                        : null}
                    </div>
                : null}
                {errorMsg ?
                    <div>{errorMsg}</div>
                : null}
            </div>}
        </main>
    );
};

export default User;