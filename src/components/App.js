import { useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Items from './Items';

const App = () => {
    const [loading, setLoading] = useState(false);

    return (
        <HashRouter>
            <Routes>
                <Route exact path="/" element={<Home loading={loading} setLoading={setLoading} />} />
                <Route exact path="/shows" element={<Items loading={loading} setLoading={setLoading} />} />
                <Route exact path="/movies" element={<Items loading={loading} setLoading={setLoading} />} />
            </Routes>
        </HashRouter>
    );
};

export default App;