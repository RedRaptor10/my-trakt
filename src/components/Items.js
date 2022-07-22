import { useState } from 'react';
import Search from './Search';
import Pagination from './Pagination';
import logo from '../assets/trakt-icon-red.svg';

const Items = ({collection, list, type, page, setPage, items, results, posters, setResults, limit, setLimit, limitDefault, setLimitFromParams, view, setView}) => {
  const [input, setInput] = useState('');

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
        <Search input={input} setInput={setInput} collection={collection} list={list} setResults={setResults} type={type} setPage={setPage} />
        <Pagination results={results} type={type} page={page} setPage={setPage} limit={limit} view={view} changeView={changeView} />
        <h1>
          {type === 'movies' ? 'Movies'
          : type === 'shows' ? 'Shows'
          : type === 'lists' ? 'List - ' + list.name
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
              } else if (type === 'lists') {
                imdb = item[item.type].ids.imdb;
                title = item[item.type].title;
                year = item[item.type].year;
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
    </main>
  );
}

export default Items;