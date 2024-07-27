import React from 'react';
import '../css/ProgressBar.css';

interface ProgressBarProps {
    progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
    return (
        <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }}>
                {progress}%
            </div>
            <div className="progress-bar-line" style={{ left: `${progress}%` }}></div>
        </div>
    );
};

export default ProgressBar;
