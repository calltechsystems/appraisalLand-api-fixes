import {  useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
// import { getSession } from "next-iron-session";
import Captcha from "../Captcha";
import axios from "axios";
import { encryptionData } from "../../../utils/dataEncryption";

const LoginSignup = () => {

  // Registration Show Hide Functionality start

  const [showhide, setShowhide] = useState("");
  const [showRegister,setRegister]=useState(true);
  const [captchaVerfied ,setCaptchaVerified] = useState(false);

  const [passwordLoginVerified,setPasswordLoginVerified] = useState(true)
  const [passwordRegisterVerified,setPasswordRegisterVerified] = useState(true)

  const [passwordVisible, setPasswordVisible] = useState(false); // State variable to toggle password visibility
  const [passwordLogin, setPasswordLogin] = useState(''); // State variable to store the password value
  const [passwordRegister, setPasswordRegister] = useState(''); // State variable to store the password value
  const [passwordReRegister, setPasswordReRegister] = useState(''); // State variable to store the password value


  //defining the variables
  const emailLoginRef = useRef();

  const emailRegisterRef = useRef();
  const userTypeRef = useRef();

  const checkValueRef = useRef();

  const [isLoading , setLoading] = useState(false);

  const router = useRouter();

  const handleshowhide = (event) => {
    const getuser = event.target.value;
    setShowhide(getuser);
    // setUserinput(false);
  };

  // Toggle password visibility hnadler
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible); 
  };



  //login trigger function
  const loginHandler = (event) =>{

    event.preventDefault();
    const email = emailLoginRef.current.value;
    const password = passwordLogin;

    if(!email  || !password ){
      alert("Credentials Can't be empty");
    }
    else if(!captchaVerfied){
      alert("captcha isnt verified");
    }

    const data = {
      email :email,
      password:password
    };

    const encryptedData = encryptionData(data);

    setLoading(true);
    axios.post("/api/login",encryptedData)
    .then(res=>{
      console.log(res);
      alert("Successfully Logged In!");
      localStorage.setItem("user",JSON.stringify(res));
      router.push("/my-profile");
    })
    .catch(err=>{
      alert(err.message);
    })
    .finally(()=>{
      setLoading(false);
    })
  }

  const registerHandler = (event)=>{

          event.preventDefault();
          
          setRegister(false);
        
          const email = emailRegisterRef.current.value;
          const password = passwordRegister;
          const reEnterPassword = passwordReRegister;
          const user = userTypeRef.current.value;
          
          if(password!==reEnterPassword){
            alert("Password are meant to be same ");
          }
          else if(!email){
            alert("Email cant be empty or non valid.");
          }
          else if(!captchaVerfied){
            alert("captcha isnt verified");
          }
          const data = {
            email :email,
            password:password,
            AccountType :user
          };
          
          const encryptedData = encryptionData(data);

          setLoading(true);
          axios.post("/api/register",encryptedData)
          .then(res=>{
            alert("Successfully Signed In!");
            //redirection to login
          })
          .catch(err=>{
           alert(err.message);
          })
          .finally(()=>{
            setLoading(false);
          })
  }

  const checkPasswordLoginHandler = (event,chnage)=>{
    setPasswordLogin(event.target.value);
const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/;
if (passwordRegex.test(event.target.value)) {
  setPasswordLoginVerified(true);
} else {
  setPasswordLoginVerified(false); // Change this to false for invalid passwords
}
  }

  const checkPasswordRegisterHandler = (event)=>{
    setPasswordRegister(event.target.value);
    const passwordRegex = "^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$";
    if(passwordRegex.test(event.target.value)){
      setPasswordRegisterVerified(true);
    }
    else{
      setPasswordRegisterVerified(true);
    }
  }

  // Registration Show Hide Functionality end

  return (
    <div className="modal-content">
      <div className="modal-header">
        <button
          type="button"
          data-bs-dismiss="modal"
          aria-label="Close"
          className="btn-close"
        ></button>
      </div>
      {/* End .modal-header */}

      <div className="modal-body container pb20">
        <div className="row">
          <div className={ showRegister ? "col-lg-12" : "col-lg-24"}>
            <ul className="sign_up_tab nav nav-tabs" id="myTab" role="tablist">
              <li className="nav-item">
                <Link
                  className="nav-link active"
                  id="home-tab"
                  data-bs-toggle="tab"
                  href="#home"
                  role="tab"
                  aria-controls="home"
                  aria-selected="true"
                >
                  Login
                </Link>
              </li>
              {/* End login tab */}

              { showRegister && ( <li className="nav-item">
                <Link
                  className="nav-link"
                  id="profile-tab"
                  data-bs-toggle="tab"
                  href="#profile"
                  role="tab"
                  aria-controls="profile"
                  aria-selected="false"
                >
                  Register
                </Link>
              </li>)
              }
              {/* End Register tab */}
            </ul>
            {/* End .sign_up_tab */}
          </div>
        </div>
        {/* End .row */}

        <div className="tab-content container" id="myTabContent">
          <div
            className="row mt25 tab-pane fade show active"
            id="home"
            role="tabpanel"
            aria-labelledby="home-tab"
          >
            <div className="col-lg-6 col-xl-6">
              <div className="login_thumb">
                <Image
                  width={357}
                  height={494}
                  className="img-fluid w100 h-100 cover"
                  src="/assets/images/home/computer-login.avif"
                  alt="login.jpg"
                />
              </div>
            </div>
            {/* End col */}

            <div className="col-lg-6 col-xl-6">
              <div className="login_form">
                <form  onSubmit={(e)=>loginHandler(e)}>
                  <div className="heading">
                    <h4>Login</h4>
                  </div>
                  {/* End heading */}

                  <div className="input-group mb-2 mr-sm-2">
                    <input
                      type="text"
                      className="form-control"
                      id="inlineFormInputGroupUsername2"
                      placeholder="Email Address"
                      required
                      ref={emailLoginRef}
                    />
                    <div className="input-group-prepend">
                      <div className="input-group-text">
                        <i className="flaticon-user"></i>
                      </div>
                    </div>
                  </div>
                  {/* End input-group */}

                  <div className="input-group form-group">
                  <input
                    type={passwordVisible ? 'text' : 'password'} // Conditionally set the input type
                    className="form-control"
                    id="exampleInputPassword1"
                    placeholder="Password"
                    required
                    value={passwordLogin}
                    onChange={(e)=>checkPasswordLoginHandler(e)}
                    style={{ paddingRight: '40px' }} // Add right padding to accommodate the button
                  />
                    <div className="input-group-prepend">
                      <div className="input-group-text" onClick={togglePasswordVisibility}>
                        <i className="flaticon-password"></i>
                      </div>
                    </div>
                  </div>
                  <div>{!passwordLoginVerified ?  <div>Password not strong</div>:""}</div>
                  {/* End input-group */}

                 {/* <Captcha  verified = {setCaptchaVerified}/>*/} 

                  <div className="form-group form-check custom-checkbox mb-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value=""
                      id="remeberMe"
                      ref={checkValueRef}
                    />
                    <label
                      className="form-check-label form-check-label"
                      htmlFor="remeberMe"
                    >
                      Remember me
                    </label>

                    <Link
                      className="btn-fpswd float-end"
                      href="/forgot-password"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  {/* End remember me checkbox */}

                  <button
                    type="submit"
                    className="btn btn-log w-100 btn-thm"
                    id="login"
                  >
                    Log In
                  </button>
                  {/* End submit button */}

                  <p className="text-center">
                    Dont have an account?{" "}
                    <Link className="text-danger fw-bold" href="#">
                      Register
                    </Link>
                  </p>
                </form>
              </div>6
              {/* End .col .login_form */}
            </div>
          </div>
          {/* End .tab-pane */}

          { showRegister && (<div
            className="row mt25 tab-pane fade"
            id="profile"
            role="tabpanel"
            aria-labelledby="profile-tab"
          >
            <div className="col-lg-6 col-xl-6">
              <div className="regstr_thumb">
                <Image
                  width={357}
                  height={659}
                  className="img-fluid w100 h-100 cover"
                  src="/assets/images/home/mobile-login-concept-illustration_114360-83.avif"
                  alt="regstr.jpg"
                />
              </div>
            </div>
            {/* End . left side image for register */}

           <div className="col-lg-6 col-xl-6">
              <div className="sign_up_form">
                <div className="heading">
                  <h4>Register</h4>
                </div>
                {/* End .heading */}

                <form onSubmit={(e)=>registerHandler(e)}>
                  <div className="form-group ui_kit_select_search mb-3">
                    <select
                      className="form-select"
                      data-live-search="true"
                      data-width="100%"
                      onChange={(e) => handleshowhide(e)}
                      ref={userTypeRef}
                      // disabled={!userinput}
                    >
                      <option data-tokens="SelectRole">Choose User</option>
                      <option data-tokens="Agent/Agency" value="1">
                        Mortgage Broker
                      </option>
                      <option data-tokens="SingleUser" value="2">
                        Mortgage Brokerage
                      </option>
                      <option data-tokens="SingleUser" value="3">
                        Appraiser
                      </option>
                      <option data-tokens="SingleUser" value="4">
                        Appraiser Company
                      </option>
                    </select>
                  </div>
                  {/* End from-group */}

                  {showhide === "1" && (
                    <>
                      <div className="form-group input-group  mb-3">
                        <input
                          ref={emailRegisterRef}
                          type="email"
                          name="email"
                          className="form-control"
                          id="exampleInputEmail2"
                          placeholder="Email Address"
                          required
                        />
                        <div className="input-group-prepend">
                          <div className="input-group-text">
                            <i className="fa fa-envelope-o"></i>
                          </div>
                        </div>
                      </div>
                      {/* End .row */}

                      <div className="input-group form-group">
                      <input
                        type={passwordVisible ? 'text' : 'password'} // Conditionally set the input type
                        className="form-control"
                        id="exampleInputPassword1"
                        placeholder="Password"
                        required
                        value={passwordRegister}
                        onChange={(e) => checkPasswordRegisterHandler(e)}
                        style={{ paddingRight: '40px' }} // Add right padding to accommodate the button
                      />
                        <div className="input-group-prepend">
                          <div className="input-group-text" onClick={togglePasswordVisibility}>
                            <i className="flaticon-password"></i>
                          </div>
                      </div>
                  </div>
                  <div>{!passwordLoginVerified ?  <div>Password not strong</div>:""}</div>
                      {/* End .row */}

                      <div className="input-group form-group">
                        <input
                          type={passwordVisible ? 'text' : 'password'} // Conditionally set the input type
                          className="form-control"
                          id="exampleInputPassword1"
                          placeholder="Password"
                          required
                          value={passwordReRegister}
                          onChange={(e,setPasswordReRegister) => checkPasswordHandler(e,setPasswordReRegister)}
                          style={{ paddingRight: '40px' }} // Add right padding to accommodate the button
                        />
                          <div className="input-group-prepend">
                            <div className="input-group-text" onClick={togglePasswordVisibility}>
                              <i className="flaticon-password"></i>
                            </div>
                        </div>
                  </div>
                      {/* End .row */}

                      {/*<  Captcha verified = {setCaptchaVerified} />*/}
                    </>
                  )}

                  <div className="form-group form-check custom-checkbox mb-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value=""
                      id="terms"
                      required
                      ref={checkValueRef}
                    />
                    <label className="form-check-label" htmlFor="terms">
                      I accept the Terms and Privacy Policy.
                    </label>
                    <Link
                      href="assets/images/Terms & Conditions.pdf"
                      target="_blank"
                      className="form-check-label text-danger"
                    >
                      Terms&Cond.
                    </Link>
                  </div>
                  {/* End from-group */}

                  <button
                   type = "submit"
                    className="btn btn-log w-100 btn-thm"
                    id="signup"
                  >
                    Sign Up
                  </button>
                  {/* End btn */}

                  <p className="text-center">
                    Already have an account?{" "}
                    <Link className="text-thm fw-bold" href="#">
                      Log In
                    </Link>
                  </p>
                </form>
                {/* End .form */}
              </div>
            </div>
            {/* End register content */}
          </div>)}
          {/* End .tab-pane */}
        </div>
      </div>
    </div>
  );
};

export async function getStaticProps(context) {
  const isPreview = context.preview; // Check if in preview mode

  return {
    props: {
      preview: isPreview
    },
  };
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  const decryptionKey = process.env.CRYPTO_SECRET_KEY;

  return {
    props: {
      decryptionKey
    },
  };
}


export default LoginSignup;
