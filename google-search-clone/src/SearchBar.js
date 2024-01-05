// SearchBar.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import searchIcon from './searchicon-removebg-preview.png';
import doodleIcon from './Doodle_200.png';
import './SearchBar.css';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [isSticky, setIsSticky] = useState(false);
  const [isQueryEntered, setIsQueryEntered] = useState(false);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/search?query=${query}`);
      onSearch(response.data);

      // After the first query, set isSticky and isQueryEntered to true
      setIsSticky(true);
      setIsQueryEntered(true);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  // Add a state variable to control the left margin of the search input
  const [searchInputMargin, setSearchInputMargin] = useState('auto'); // Center the search bar initially

  useEffect(() => {
    // Add event listener for scroll to toggle sticky class
    const handleScroll = () => {
      const shouldSticky = window.scrollY > 0;
      setIsSticky(shouldSticky);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    // Adjust left margin of the search input after the user's first query
    if (isQueryEntered) {
      setSearchInputMargin('0px'); // Adjust the value as needed
    }
  }, [isQueryEntered]);

  return (
    <div className={`search-bar-header ${isSticky ? 'header-sticky' : ''}`}>
      <div className="search-bar-container" style={{ margin: '0 auto', marginLeft: searchInputMargin }}>
        {isQueryEntered && (
          <div className="doodle-icon-container">
            <img src={doodleIcon} alt="Doodle" className="doodle-icon" />
          </div>
        )}
        <div className="search-input-container">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-input"
            placeholder="Search..."
            style={{ marginLeft: searchInputMargin }}
          />
          <button onClick={handleSearch} className="search-button">
            <img src={searchIcon} className="search-icon" alt="Search Icon" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;