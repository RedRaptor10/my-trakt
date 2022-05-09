const Pagination = ({ results, type, page, setPage, limit }) => {
    const totalPages = Math.ceil(results.length / limit);

    return (
    <div className="pagination">
        <div className="pagination-btns">
            {page > 1 ? <div className="pagination-nav-btn" onClick={() => { setPage(1) }}>First</div> : null}
            {page > 1 ? <div className="pagination-nav-btn" onClick={() => { setPage(page - 1) }}>Prev</div> : null}
            { // Create an array of size 9
            [...Array(9)].map((p, i) => {
            return (
                // Render number if current page is within first 4 pages and less than or equal to total pages
                page <= 4 && i + 1 <= totalPages ?
                <div key={i + 1} className={i + 1 !== page ? 'pagination-btn' : 'pagination-current-btn'} onClick={
                    i + 1 !== page ? () => { setPage(i + 1) } : null
                }>{i + 1}</div>
                :
                // Render number if current page is within last 4 pages and there are at least 9 pages
                page > totalPages - 4 && totalPages > 8 ?
                <div key={i + totalPages - 8} className={
                    i + totalPages - 8 !== page ? 'pagination-btn' : 'pagination-current-btn'} onClick={
                    i + totalPages - 8 !== page ? () => { setPage(i + totalPages - 8) } : null
                }>{i + totalPages - 8}</div>
                :
                // Render previous 4 numbers and remaining numbers if there are at least 4 pages
                page > 4 ?
                    <div key={i + page - 4} className={i + page - 4 !== page ? 'pagination-btn' : 'pagination-current-btn'} onClick={
                        i + page - 4 !== page ? () => { setPage(i + page - 4) } : null
                    }>{i + page - 4}</div>
                : null
            )
            })}
            {page < totalPages ? <div className="pagination-nav-btn" onClick={() => { setPage(page + 1) }}>Next</div> : null}
            {page < totalPages ? <div className="pagination-nav-btn" onClick={() => { setPage(totalPages) }}>Last</div> : null}
        </div>
        <div className="pagination-info">
            <div>Page {page} / {totalPages}, Total: {results.length} {type === 'shows' ? 'Shows' : 'Movies'}</div>
        </div>
    </div>
    )
};

export default Pagination;