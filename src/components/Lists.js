import { useEffect } from 'react';
import { useParams} from 'react-router-dom';
import { Link } from 'react-router-dom';
import Item from './Item';

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

                                        return (
                                            <Item key={i} i={i} posters={list.posters} imdb={imdb} title={title} />
                                        );
                                    })
                                : null}
                                {list.items && list.items.length > 0 ?
                                    <div className="view-more-btn-container">
                                        <Link to={'/' + username + '/lists/' + list.ids.slug}><button className="btn">View List</button></Link>
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