import { useRef } from 'react';
import { isAlphaNumeric } from '../helpers/isAlphaNumeric';
import { sortResults } from '../helpers/sort';
import searchIcon from '../assets/search-icon.svg';

const Search = ({input, setInput, collection, lists, setResults, type, listId, setPage}) => {
    let timer = useRef(); // useRef keeps timer after re-render
    const delay = 1000;

    const handleChange = event => {
        setInput(event.target.value);
    };

    const submitSearch = event => {
        // If Enter key is pressed, prevent page refresh from default form event
        if (event.keyCode === 13) {
            event.preventDefault();
        }

        // If a key is pressed again, clear the previous timer
        clearTimeout(timer.current);

        // If key is not alphanumeric [0-9a-z], return
        if (!isAlphaNumeric(event.keyCode)) { return }

        // Set timer for 1 second before searching
        timer.current = setTimeout(() => {
            const items = listId ? lists[listId] : collection[type];

            let searchResults = items.filter(item => {
                const query = event.target.value.toLowerCase();

                let title;
                if (type === 'movies') {
                    title = item.movie.title.toLowerCase();
                }
                else if (type === 'shows') {
                    title = item.show.title.toLowerCase();
                }

                return title.includes(query);
            });

            // Sort results by title
            sortResults(searchResults, type);
            setResults(searchResults);
            setPage(1);
        }, delay);
    };

    return (
        <div className="search">
            <form className="search-box" action="">
                <img className="search-icon" src={searchIcon} alt=""></img>
                <input id="search-input" className="search-input" type="text" placeholder="Search" value={input} onChange={handleChange} onKeyDown={submitSearch}></input>
            </form>
        </div>
    )
}

export default Search;