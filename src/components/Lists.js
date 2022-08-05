import { useEffect } from 'react';
import { useParams} from 'react-router-dom';
import { Link } from 'react-router-dom';
import logo from '../assets/trakt-icon-red.svg';

const Lists = ({setLoading, lists, listItems, setListItems, fetchData, fetchPosters}) => {
    const { username } = useParams();
    const limit = 5;

    useEffect(() => {
        // Fetch List Items & Posters
        if (!listItems) {
            const fetchListItems = async () => {
                const temp = [];

                for (const list of lists) {
                    const li = await fetchData(username, 'list-items', null, list.ids.slug);
                    const p = await fetchPosters(li.slice(0, limit), 'lists');

                    temp.push({
                        ...list,
                        items: li.slice(0, limit),
                        posters: p,
                    });
                };

                setListItems(temp);
            };

            fetchListItems()
            .then(setLoading);
        } else {
            console.log(listItems);
        }
    }, [setLoading, username, lists, listItems, setListItems, fetchData, fetchPosters]);

    return (
        <div className="lists">
            {listItems && listItems.length > 0 ?
                listItems.map(list => {
                    return (
                        <div key={list.ids.slug} className="list">
                            <Link to={'/' + username + '/lists/' + list.ids.slug}><h1>{list.name}</h1></Link>
                            <div className="list-description">{list.description}</div>
                            <div className="list-items">
                                {list.items && list.items.length > 0 ?
                                    list.items.map((item, i) => {
                                        let imdb = item[item.type].ids.imdb;
                                        let title = item[item.type].title;
                                        let year = item[item.type].year;

                                        return (
                                            <a key={i} className="item" href={'https://www.imdb.com/title/' + imdb} target="_blank" rel="noreferrer">
                                                {list.posters[i].poster ?
                                                    <img className="item-poster" src={'https://image.tmdb.org/t/p/w300_and_h450_bestv2' + list.posters[i].poster} alt={title}></img>
                                                :
                                                    <img className="item-poster item-poster-empty" src={logo} alt=""></img>}
                                                    <div className="item-title"><span>{title}</span></div>
                                            </a>
                                        );
                                    })
                                : null}
                                {list.items && list.items.length > 0 ?
                                    <div className="view-more-btn-container">
                                        <Link to={'/' + username + '/lists/' + list.ids.slug}><button className="btn">View More</button></Link>
                                    </div>
                                : null}
                            </div>
                        </div>
                    );
                })
            : null}
        </div>
    );
};

export default Lists;