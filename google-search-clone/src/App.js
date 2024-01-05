import React, { useState } from 'react';
import { Routes, Route, Link, BrowserRouter as Router } from 'react-router-dom';
import Home from './Home';
import SearchBar from './SearchBar';
import SearchResults from './SearchResults';
import DoodleIcon from './DoodleIcon';
import './App.css';

const App = () => {
  const [results, setResults] = useState([]);
  const [searchTime, setSearchTime] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [queryEntered, setQueryEntered] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [userQuery, setUserQuery] = useState('');

  const handleSearch = (data) => {
    setResults(data.results.slice(0, 5));
    setSearchTime(data.searchTime);
    setTotalResults(data.totalResults);
    setQueryEntered(true);
    setUserQuery(data.userQuery);
  };

  const handleLoadMore = () => {
    if (!loadingMore) {
      setLoadingMore(true);

      // Simulating an asynchronous API call for loading more results
      fetch(`http://localhost:5000/search?query=${userQuery}&page=${currentPage + 1}`)
        .then(response => response.json())
        .then(data => {
          setResults(prevResults => [...prevResults, ...data.results.slice(0, 5)]);
          setTotalResults(data.totalResults);
          setLoadingMore(false);
          setCurrentPage(prevPage => prevPage + 1);
        })
        .catch(error => {
          console.error('Error fetching more results:', error);
          setLoadingMore(false);
        });
    }
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/app"
          element={
            <div>
              <DoodleIcon visible={!queryEntered} />
              <SearchBar visible={queryEntered} onSearch={handleSearch} />
              {queryEntered && (
                <header className="App-header">
                  {/* Your header content goes here */}
                  <br /><br />
                </header>
              )}
              <SearchResults results={results} searchTime={searchTime} totalResults={totalResults} />
              {results.length < totalResults && (
                <div className="load-more-container">
                  <button className="load-more-button" onClick={handleLoadMore} disabled={loadingMore}>
                    {loadingMore ? 'Loading...' : 'More results'}
                  </button>
                  <div>
                    <br /><br />
                  </div>
                </div>
              )}
            </div>
          }
        />
      </Routes>
    </>
  );
};

export default App;
