// SearchResults.js
import React, { useState } from 'react';
import './SearchResults.css'; // Import the CSS file

const SearchResults = ({ results, searchTime, totalResults }) => {
  const [clickedHeading, setClickedHeading] = useState(null);

  const handleHeadingClick = (link) => {
    setClickedHeading(link);
  };

  return (
    <div className="search-results-container">
      {results.length > 0 && (
        <div style={{ marginLeft: '6em', color: 'gray' }}>
          About {totalResults} results ({searchTime} seconds)
          <br /> <br />
        </div>
      )}

      {results.map((result) => (
        <div key={result.link} className="result-card">
          <a
            href={result.link}
            className={`result-heading-link ${clickedHeading === result.link ? 'clicked-heading' : ''}`}
            onClick={() => handleHeadingClick(result.link)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="result-heading" style={{ fontSize: '20px', fontFamily: 'Open Sans' }}>
              {result.h2_heading}
            </div>
          </a>

          <a
            href={result.link}
            className="result-link"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'black', fontSize: '14px' }}
          >
            {result.link}
          </a>{' '}

          <p style={{ color: '#444444', fontSize: '13px' }}>{result.description && ` ${result.description}...`}</p>
        </div>
         //- Frequency: {result.frequency}
      ))}
    </div>
  );
};

export default SearchResults;
