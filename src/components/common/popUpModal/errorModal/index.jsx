import React, { useState } from 'react';
import ErrorModal from './Modal';

const App = ({content , close}) => {
  const [error, setError] = useState(null);

  const handleCloseError = () => {
    setError(null);
  };

  // Call this function when an error occurs
  const handleError = (errorMessage) => {
    setError(errorMessage);
  };

  return (
    <div className="app">
      {/* Other components and content */}
      {<ErrorModal errorMessage={content} onClose={close} />}
    </div>
  );
};

export default App;
