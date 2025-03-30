import Link from "next/link";
import Image from "next/image";

const Form = () => {
  return (
    <>
      <div className="row">
        <div className="col-lg-6">
          <Image
            width={157}
            height={300}
            className="img-fluid w100 h-100 cover"
            src="/assets/images/home/forgot-password.avif"
            alt="login.jpg"
          />
        </div>

        <div className="col-lg-6 pt60 ">
          <form action="#">
            <div className="heading text-center">
              <h3>Reset your password.</h3>
            </div>
            {/* End .heading */}

            <div className="input-group mb-0 mr-sm-2">
              <input
                type="password"
                className="form-control"
                required
                placeholder="Enter New Password"
              />
              <div className="input-group-prepend">
                <div className="input-group-text">
                  <i className="flaticon-password"></i>
                </div>
              </div>
            </div>
            {/* End .input-group */}

            {/* <div className="divide">
        <span className="lf_divider">Or</span>
        <hr />
      </div> */}
            {/* devider */}

            <div className="input-group mb-0 mr-sm-2">
              <input
                type="password"
                className="form-control"
                required
                placeholder="Enter Confirm Password"
              />
              <div className="input-group-prepend">
                <div className="input-group-text">
                  <i className="flaticon-password"></i>
                </div>
              </div>
            </div>
            {/* End .input-group */}

            {/* <div className="mt-0 d-flex justify-content-end mb-4">
              <Link href="#">Resend OTP</Link>
            </div> */}

            <button type="submit" className="btn btn-log w-100 btn-thm">
              Submit
            </button>
            {/* login button */}
            <div
              className="heading text-center"
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                // paddingLeft: "30%",
              }}
            >
              <div>
                <p className="text-center" style={{ fontSize: "16px" }}>
                  Already have an Account?{" "}
                </p>
              </div>
              <div
                style={{
                  // textDecoration: "underline",
                  fontWeight: "bold",
                  lineHeight: "1.5",
                  marginLeft: "5px",
                }}
              >
                <Link href="/login" className="text-thm">
                  Log In!
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Form;
