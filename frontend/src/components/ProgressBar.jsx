import React from 'react';
import PropTypes from 'prop-types';
import '../css/ProgressBar.css';

const ProgressBar = ({ progress }) => (
    <div className="progress-bar">
        <div className="progress" style={{ width: `${progress}%` }}></div>
    </div>
);

ProgressBar.propTypes = {
    progress: PropTypes.number.isRequired,
};

export default ProgressBar;
