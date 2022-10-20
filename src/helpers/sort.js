const sortResults = (results, category, type) => {
    results.sort((a, b) => {
        let titleA, titleB;

        if (type === 'movies') {
            titleA = a.movie.title.toLowerCase();
            titleB = b.movie.title.toLowerCase();
        }
        else if (type === 'shows') {
            titleA = a.show.title.toLowerCase();
            titleB = b.show.title.toLowerCase();
        }
        else if (category === 'lists') {
            titleA = a[a.type].title.toLowerCase();
            titleB = b[b.type].title.toLowerCase();
        }

        titleA = removeArticles(titleA);
        titleB = removeArticles(titleB);

        return (titleB < titleA) ? 1 : -1;
    });
};

const removeArticles = str => {
    let words = str.split(" ");

    if (words.length <= 1) { return str }
    if (words[0] === 'a' || words[0] === 'an' || words[0] === 'the') {
        return words.splice(1).join(" ");
    }

    return str;
}

export { sortResults };