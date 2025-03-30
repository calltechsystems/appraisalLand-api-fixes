import React, { useState } from 'react';

function Dropdown() {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const menuStyle = {
    width: '200px', // Initial width
    transition: 'width 0.3s ease', // Add transition for the width property
    backgroundColor: '#3498db',
    color: '#fff',
    padding: '10px',
    position: 'relative', // Required for nested content
    borderColor:"black"
  };

  const contentStyle = {
    opacity: isHovered ? 1 : 0, // Show content when hovered
    transition: 'opacity 0.3s ease', // Add transition for the opacity property
    position: 'absolute',
    top: '100%',
    left: 0,
    width: '1160px',
    height:'80px',
    backgroundColor: '#fff',
    color: '#333',
    padding: '10px',
    borderColor:"black",
    borderWidth:"6px",
    borderStyle:"solid"
  };

  return (
    <div
      style={menuStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span>Hover me to expand</span>
      <div style={contentStyle}>
        {/* Menu content goes here */}
        <ul>
          <li >Item 1</li>
          <li>Item 2</li>
          <li>Item 3</li>
        </ul>
      </div>
    </div>
  );
}

export default Dropdown;
