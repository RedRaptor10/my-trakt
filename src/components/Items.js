import { useState } from 'react';
import Search from './Search';
import Pagination from './Pagination';
import Item from './Item';

const Items = ({category, type, collection, list, page, setPage, items, results, posters, setResults, limit, setLimit, limitDefault, setLimitFromParams, view, setView}) => {
    const [input, setInput] = useState('');
    const totalPages = results.length > 0 ? Math.ceil(results.length / limit) : 1;

    const changeView = newView => {
        if (view === 'grid' && newView === 'list') {
            setView('list');
            setLimit(setLimitFromParams);
        } else if (view === 'list' && newView === 'grid') {
            setView('grid');
            setLimit(limitDefault);
        }
    };

    return (
        <main className="items">
            {items ?
            <div>
                <Search input={input} setInput={setInput} category={category} type={type} collection={collection} list={list} setResults={setResults} setPage={setPage} />
                <Pagination results={results} page={page} setPage={setPage} limit={limit} />
                <div className="pagination-info">
                        <div>
							Page {page} / {totalPages}, Total: {results.length} {
								type === 'movies' ? 'Movies' :
								type === 'shows' ? 'Shows' :
								category === 'lists' ? 'Items' :
								null}, View:&nbsp;
							<span className={'view-type-btn' + (view === 'grid' ? ' view-type-btn-active' : '')} onClick={() => changeView('grid') }>Grid</span>
							&nbsp;|&nbsp;
							<span className={'view-type-btn' + (view === 'list' ? ' view-type-btn-active' : '')} onClick={() => changeView('list') }>List</span>
                        </div>
                </div>
                <h1>
                    {type === 'movies' ? 'Movies'
                    : type === 'shows' ? 'Shows'
                    : category === 'lists' ? 'List - ' + list.name
                    : null}
                </h1>
                <div className={view === 'grid' ? 'items-grid' : 'items-list'}>
                    {items && items.length > 0 ?
                        items.map((item, i) => {
                            let imdb, title, year;

                            if (type === 'movies') {
                                imdb = item.movie.ids.imdb;
                                title = item.movie.title;
                                year = item.movie.year;
                            } else if (type === 'shows') {
                                imdb = item.show.ids.imdb;
                                title = item.show.title;
                                year = item.show.year;
                            } else if (category === 'lists') {
                                imdb = item[item.type].ids.imdb;
                                title = item[item.type].title;
                                year = item[item.type].year;
                            }

                            return (
                                posters && view === 'grid' ?
									<Item key={i} i={i} posters={posters} imdb={imdb} title={title} />
                                :
                                <a key={i} href={'https://www.imdb.com/title/' + imdb} target="_blank" rel="noreferrer">
                                    <div><span>{title} ({year})</span></div>
                                </a>
                            )
                        })
                    : items.length === 0 ?
                        <div className="no-results">No Results</div>
                    : null}
                </div>
                <Pagination results={results} page={page} setPage={setPage} limit={limit} />
            </div>
            : null}
        </main>
    );
}

export default Items;