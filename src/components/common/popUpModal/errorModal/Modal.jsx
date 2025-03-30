import React from 'react';

const ErrorModal = ({ errorMessage, onClose }) => {
  return (
    <div className="error-modal">
      <div className="modal-content">
        <h2 style={{color:"orangered"}}>Error</h2>
        <hr/>
        <p>{errorMessage}</p>
        <button onClick={onClose} style={{backgroundColor:"orangered"}}>OK</button>
      </div>
    </div>
  );
};

export default ErrorModal;
