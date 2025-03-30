// YourComponent.js

const YourComponent = () => (
    <div className="container">
      <div className="loader">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="loader--dot" />
        ))}
        <div className="loader--text">Loading</div>
      </div>
    </div>
  );
  
  export default YourComponent;
  
  // styles.js
  
  
    
  
  