// DoodleIcon.js
import React from 'react';
import doodleIcon from './DoodleIcon.png'; // Adjust the path based on your project structure
import './DoodleIcon.css'; // Import the CSS file for DoodleIcon component

const DoodleIcon = ({ visible }) => {
  return (
    <div className={`google-icon-container ${visible ? '' : 'hidden'}`}>
      <img src={doodleIcon} alt="Doodle Icon" className="google-icon" />
    </div>
  );
};

export default DoodleIcon;