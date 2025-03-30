import React from 'react';

const ErrorModal = ({ errorMessage, onClose }) => {
  return (
    <div className="error-modal">
      <div className="modal-content">
        <h2 style={{color:"green"}}>Submit</h2>
        <hr/>
        <p>{errorMessage}</p>
        <button onClick={onClose} style={{backgroundColor:"green"}}>Submit</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default ErrorModal;
