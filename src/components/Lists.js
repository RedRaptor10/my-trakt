import { useParams} from 'react-router-dom';
import { Link } from 'react-router-dom';

const Lists = ({lists}) => {
    const { username } = useParams();

    return (
        <main className="lists">
            {lists && lists.length > 0 ?
            <div className="lists-list">
                {lists.map(list => {
                    return (
                        <div key={list.ids.trakt}>
                            <Link to={'/' + username + '/lists/' + list.ids.slug}>{list.name}</Link>
                        </div>
                    );
                })}
            </div>
            : null}
        </main>
    );
};

export default Lists;