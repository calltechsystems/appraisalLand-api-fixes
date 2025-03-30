import { useEffect, useState } from "react";

const Form = () => {
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState("");

  useEffect(() => {
    // Extract query parameters from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const emailId = urlParams.get("emailId"); // Extract emailId
    const userType = urlParams.get("UserType"); // Extract UserType

    if (emailId) {
      setEmail(emailId); // Set email state
      console.log
    }
    if (userType) {
      setUserType(userType); // Set userType state
    }
  }, []);

  return (
    <div>
      <h1>Registration Form</h1>
      <form>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            disabled // Disables the input
          />
        </div>

        <div>
          <label>User Type:</label>
          <select
            value={userType}
            disabled // Disables the dropdown
          >
            <option value="">Select User Type</option>
            <option value="1">Mortgage Broker</option>
            <option value="2">Mortgage Brokerage</option>
            <option value="3">Appraiser</option>
            <option value="4">Appraiser Company</option>
          </select>
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Form;
