import React from 'react';

const CircularProgressBar = ({ percentage }) => {
  const circumference = 2 * Math.PI * 20;
  const strokeDashoffset = circumference - (circumference * percentage) / 100;

  return (
    <div className="circular-progress-container" style={{marginTop:"-10%",color:"#2e008b"}} >
      <svg className="circular-progress" width="100" height="100">
        <circle className="background" cx="50" cy="50" r="20" />
        <circle
          className="progress"
          cx="50"
          cy="50"
          r="20"
          style={{ strokeDasharray: circumference, strokeDashoffset }}
        >{  }</circle>
      </svg>
    </div>
  );
};

export default CircularProgressBar;
