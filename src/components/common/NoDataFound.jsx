import { FaExclamationTriangle } from "react-icons/fa"; // Importing an icon for better visibility

const NoDataFound = () => {
  return (
    <div className="no-data-container">
      <div className="no-data-message">
        <FaExclamationTriangle className="icon-animated" />
        <h3 className="text-animated">No Data Found</h3>
        <p className="text-animated-para">
          Please check back later or try searching again.
        </p>
      </div>
    </div>
  );
};

export default NoDataFound;
