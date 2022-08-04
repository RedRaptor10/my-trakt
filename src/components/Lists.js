import { useParams, Link } from 'react-router-dom';

const Lists = ({lists}) => {
    const { username } = useParams();

    return (
        <div className="lists">
            {lists && lists.length > 0 ?
                lists.map(list => {
                    return (
                        <div key={list.ids.slug} className="list">
                            <Link to={'/' + username + '/lists/' + list.ids.slug}><h1>{list.name}</h1></Link>
                        </div>
                    );
                })
            :
                <div className="no-results">No Results</div>}
        </div>
    );
};

export default Lists;