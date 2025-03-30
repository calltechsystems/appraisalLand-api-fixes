import Image from "next/image";
// import styles from "./LoadingSpinner.module.css";

const LoadingSpinner = () => {
  return (
    <div className="overlayLoader">
      <div className="spinnerContainer">
        {/* Spinner Rings */}
        <div className="loading-container">
          <div className="spinner">
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
            <div className="spinner-center">
              <Image
                width={75}
                height={60}
                className="logo img-fluid"
                src="/assets/images/Appraisal_Land_Logo.png"
                alt="Loading..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
