const Pagination = ({ results, type, page, setPage, limit, view, changeView }) => {
    const totalPages = results.length > 0 ? Math.ceil(results.length / limit) : 1;
    let pages = [];

    if (totalPages <= 9) {
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
    } else if (page <= 5) {
        for (let i = 1; i <= 9; i++) {
            pages.push(i);
        }
    } else if (page > totalPages - 4) {
        for (let i = totalPages - 8; i <= totalPages; i++) {
            pages.push(i);
        }
    } else {
        for (let i = page - 4; i <= page + 4; i++) {
            pages.push(i);
        }
    }

    return (
    <div className="pagination">
        <div className="pagination-btns">
            {page > 1 ? <div className="pagination-nav-btn" onClick={() => { setPage(1) }}>First</div> : null}
            {page > 1 ? <div className="pagination-nav-btn" onClick={() => { setPage(page - 1) }}>Prev</div> : null}
            {pages.map(p => {
                return (
                    <div key={p} className={p !== page ? 'pagination-btn' : 'pagination-current-btn'} onClick={
                        p !== page ? () => { setPage(p) } : null
                    }>{p}</div>
                );
            })}
            {page < totalPages ? <div className="pagination-nav-btn" onClick={() => { setPage(page + 1) }}>Next</div> : null}
            {page < totalPages ? <div className="pagination-nav-btn" onClick={() => { setPage(totalPages) }}>Last</div> : null}
        </div>
    </div>
    )
};

export default Pagination;