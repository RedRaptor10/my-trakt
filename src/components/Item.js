import logo from '../assets/trakt-icon-red.svg';

const Item = ({i, posters, imdb, title}) => {
    return (
        <a className="item" href={'https://www.imdb.com/title/' + imdb} target="_blank" rel="noreferrer">
            {posters[i].poster ?
                <img className="item-poster" src={'https://image.tmdb.org/t/p/w300_and_h450_bestv2' + posters[i].poster} alt={title}></img>
            :
                <img className="item-poster item-poster-empty" src={logo} alt=""></img>}
            <div className="item-title"><span>{title}</span></div>
        </a>
    );
};

export default Item;