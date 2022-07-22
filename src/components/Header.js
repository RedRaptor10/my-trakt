import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/trakt-icon-red.svg';
import searchIcon from '../assets/search-icon.svg';

const Header = ({setLoading, setUser, setCollection, setLists, setList, setErrorMsg, fetchData}) => {
    const [input, setInput] = useState('');
    const navigate = useNavigate();

    const fetchProfile = async () => {
        const query = input.toLowerCase().split(' ' ).join('-');
        const data = await fetchData(query, 'profile');

        if (data) {
            setErrorMsg();
            setUser(data);
            setCollection();
            setLists();
            setList();
            setInput('');
            navigate('/' + data.ids.slug);
        } else {
            setUser();
            setErrorMsg('User not found.');
            navigate('/');
        }
    };

    const handleChange = event => {
        setInput(event.target.value);
    };

    const submitSearch = event => {
        if (event.keyCode === 13) {
            event.preventDefault();

            if (event.target.value === '') {
                setUser();
                setErrorMsg();
                navigate('/');
            } else {
                fetchProfile()
                .then(setLoading);
            }
        }
    }

    return (
        <header className="header">
            <div className="header-title">
                <Link to="/">
                    <img src={logo} alt="My Trakt"></img>
                    My Trakt
                </Link>
            </div>
            <form className="search-box" action="">
                <img className="search-icon" src={searchIcon} alt=""></img>
                <input id="search-input" className="search-input" type="text" placeholder="Enter username or id" value={input} onChange={handleChange} onKeyDown={submitSearch}></input>
            </form>
        </header>
    )
};

export default Header;