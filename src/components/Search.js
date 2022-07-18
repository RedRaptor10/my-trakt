import { sortResults } from '../helpers/sort';
import searchIcon from '../assets/search-icon.svg';

const Search = ({input, setInput, collection, list, setResults, type, listId, setPage}) => {
    const handleChange = event => {
        setInput(event.target.value);
    };

    const submitSearch = event => {
        // If Enter key is pressed, prevent page refresh from default form event
        if (event.keyCode === 13) {
            event.preventDefault();

            const items = listId ? list.items : collection[type];

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
        }
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