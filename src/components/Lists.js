import { useEffect } from 'react';

const Lists = ({loading, setLoading, lists, setLists, fetchData}) => {
    useEffect(() => {
        if (!lists) {
            const fetchLists = async () => {
                const l = await fetchData('lists');

                setLists(l);
            };

            fetchLists();
        } else {
            setLoading(false);
        }
    }, [setLoading, lists, setLists, fetchData]);

    return (
        <main className="lists">
            {loading ?
            <div className="spinner-container">
            <div className="loading-spinner"></div>
            </div>
            :
            lists ?
            <div className="lists-list">
                {lists.map(list => {
                    return (
                        <div key={list.ids.trakt}>{list.name}</div>
                    );
                })}
            </div>
            : null}
        </main>
    );
};

export default Lists;