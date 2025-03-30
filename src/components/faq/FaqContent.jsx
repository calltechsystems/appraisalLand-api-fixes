import Link from "next/link";

const FaqContent = () => {
  return (
    <>
      <div className="accordion" id="accordionExample">
        <div className="card">
          <div id="headingSix">
            <button
              className="btn btn-link accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseSix"
              aria-expanded="false"
              aria-controls="collapseSix"
            >
              Ques1. What is my username?
            </button>
          </div>
          <div
            id="collapseSix"
            className="accordion-collapse collapse"
            aria-labelledby="headingSix"
            data-bs-parent="#accordionExample"
          >
            <div className="card-body">
              <p>
                {" "}
                Ans - Your username is the email address you provided during the
                registration process.
              </p>
            </div>
          </div>
        </div>
        {/* End .card */}
        <div className="card">
          <div id="headingOne">
            <button
              className="btn btn-link accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseOne"
              aria-expanded="false"
              aria-controls="collapseOne"
            >
              Ques2. I forgot my password. How can I reset it?
            </button>
          </div>
          <div
            id="collapseOne"
            className="accordion-collapse collapse"
            aria-labelledby="headingOne"
            data-bs-parent="#accordionExample"
          >
            <div className="card-body">
              <p> Please follow the below steps to reset your password :-</p>
              <ul>
                <li>
                  1. Look for a link or button that says &quot;Forgot
                  Password&quot;.{" "}
                </li>
                <li>
                  2. Provide the email address or username associated with your
                  account.{" "}
                </li>
                <li>
                  3. You will receive a one-time password (OTP) on your
                  registered email address.{" "}
                </li>
                <li>
                  4. Once you have entered the correct OTP, you should be
                  prompted to create a new password.{" "}
                </li>
                <li>
                  5. After resetting your password, use the new password to log
                  in to your account.{" "}
                </li>
              </ul>
            </div>
          </div>
        </div>
        {/* End .card */}

        <div className="card">
          <div id="headingTwo">
            <button
              className="btn btn-link accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseTwo"
              aria-expanded="false"
              aria-controls="collapseTwo"
            >
              Ques3. Why am I not receiving the password reset OTP email?
            </button>
          </div>
          <div
            id="collapseTwo"
            className="accordion-collapse collapse"
            aria-labelledby="headingTwo"
            data-bs-parent="#accordionExample"
          >
            <div className="card-body">
              <p>
                Ans. If you are not receiving the password reset OTP email,
                check your spam folder, verify the correct email address, or
                contact our support team for assistance.{" "}
              </p>
            </div>
          </div>
        </div>
        {/* End .card */}

        <div className="card">
          <div id="headingThree">
            <button
              className="btn btn-link accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseThree"
              aria-expanded="false"
              aria-controls="collapseThree"
            >
              Ques4. I am having trouble logging in. What should I do?
            </button>
          </div>
          <div
            id="collapseThree"
            className="accordion-collapse collapse"
            aria-labelledby="headingThree"
            data-bs-parent="#accordionExample"
          >
            <div className="card-body">
              <p>
                Ans. If you are having trouble logging in, click &quot;Forgot
                Password&quot; for a password reset, or contact our support team
                via the &quot;Contact Us&quot; section on our website.
              </p>
            </div>
          </div>
        </div>
        {/* End .card */}

        <div className="card">
          <div id="headingSeven">
            <button
              className="btn btn-link accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseSeven"
              aria-expanded="false"
              aria-controls="collapseSeven"
            >
              Ques5. I didn&apos;t receive my verification email, what should I
              do?
            </button>
          </div>
          <div
            id="collapseSeven"
            className="accordion-collapse collapse"
            aria-labelledby="headingSeven"
            data-bs-parent="#accordionExample"
          >
            <div className="card-body">
              <p>
                Ans- Check your spam folder or click &quot;Resend Verification
                Email&quot; on the sign-up page.
              </p>
            </div>
          </div>
        </div>
        {/* End .card */}

        <div className="card">
          <div id="headingFour">
            <button
              className="btn btn-link accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseFour"
              aria-expanded="false"
              aria-controls="collapseFour"
            >
              Ques6. Can I use my account login on multiple devices?
            </button>
          </div>
          <div
            id="collapseFour"
            className="accordion-collapse collapse"
            aria-labelledby="headingFour"
            data-bs-parent="#accordionExample"
          >
            <div className="card-body">
              <p>
                Ans. No, your account login is typically restricted to one
                device at a time for security reasons.
              </p>
            </div>
          </div>
        </div>
        {/* End .card */}

        <div className="card">
          <div id="headingFive">
            <button
              className="btn btn-link accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseFive"
              aria-expanded="false"
              aria-controls="collapseFive"
            >
              Ques7. Can I update my profile information after creating an
              account login?
            </button>
          </div>
          <div
            id="collapseFive"
            className="accordion-collapse collapse"
            aria-labelledby="headingFive"
            data-bs-parent="#accordionExample"
          >
            <div className="card-body">
              <p>
                Ans. Yes Please follow the instructions for updating the
                profile.
              </p>
              <ul>
                <li>
                  1. Login to Your Account on the website{" "}
                  <Link href="https://appraisalland.vercel.app/login">
                    appraisalland.vercel.app.
                  </Link>{" "}
                </li>
                <li>2. Navigate to Profile. </li>
                <li>3. Locate the Edit or Update Option. </li>
                <li>4. Update Your Information. </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="card">
          <div id="headingEight">
            <button
              className="btn btn-link accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseEight"
              aria-expanded="false"
              aria-controls="collapseEight"
            >
              Ques8. How can I change my password?
            </button>
          </div>
          <div
            id="collapseEight"
            className="accordion-collapse collapse"
            aria-labelledby="headingEight"
            data-bs-parent="#accordionExample"
          >
            <div className="card-body">
              <p>
                Ans - To change your password, log in to your account, navigate
                to account settings, and choose the &quot;Change Password&quot;
                option.
              </p>
            </div>
          </div>
        </div>
        {/* End .card */}

        <div className="card">
          <div id="headingNine">
            <button
              className="btn btn-link accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseNine"
              aria-expanded="false"
              aria-controls="collapseNine"
            >
              Ques9. How do I contact customer support?
            </button>
          </div>
          <div
            id="collapseNine"
            className="accordion-collapse collapse"
            aria-labelledby="headingNine"
            data-bs-parent="#accordionExample"
          >
            <div className="card-body">
              <p>
                Ans- To contact customer support, visit the &quot;Contact
                Us&quot; section, and use available options such as email, live
                chat, phone.
              </p>
            </div>
          </div>
        </div>
        {/* End .card */}

        <div className="card">
          <div id="headingTen">
            <button
              className="btn btn-link accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseTen"
              aria-expanded="false"
              aria-controls="collapseTen"
            >
              Ques10. How do I subscribe to service?
            </button>
          </div>
          <div
            id="collapseTen"
            className="accordion-collapse collapse"
            aria-labelledby="headingTen"
            data-bs-parent="#accordionExample"
          >
            <div className="card-body">
              <p>
                Ans- To subscribe, visit our website and click on the
                &quot;Subscribe&quot; button. Follow the on-screen instructions
                to complete the registration and payment process.
              </p>
            </div>
          </div>
        </div>
        {/* End .card */}

        <div className="card">
          <div id="headingEleven">
            <button
              className="btn btn-link accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseEleven"
              aria-expanded="false"
              aria-controls="collapseEleven"
            >
              Ques11. Is my payment information secure?
            </button>
          </div>
          <div
            id="collapseEleven"
            className="accordion-collapse collapse"
            aria-labelledby="headingEleven"
            data-bs-parent="#accordionExample"
          >
            <div className="card-body">
              <p>
                Ans- Yes, the security of your payment information is a top
                priority. We employ industry-standard encryption and secure
                payment protocols to safeguard your financial details and ensure
                a secure transaction process.
              </p>
            </div>
          </div>
        </div>
        {/* End .card */}

        <div className="card">
          <div id="headingTwelve">
            <button
              className="btn btn-link accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseTwelve"
              aria-expanded="false"
              aria-controls="collapseTwelve"
            >
              Ques12. Is there a refund policy?
            </button>
          </div>
          <div
            id="collapseTwelve"
            className="accordion-collapse collapse"
            aria-labelledby="headingTwelve"
            data-bs-parent="#accordionExample"
          >
            <div className="card-body">
              <p>
                Ans- Yes, we have a refund policy in place. Please refer to our
                official refund policy document on our website for detailed
                information regarding eligibility, procedures, and terms.
              </p>
            </div>
          </div>
        </div>
        {/* End .card */}

        <div className="card">
          <div id="headingThirteen">
            <button
              className="btn btn-link accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseThirteen"
              aria-expanded="false"
              aria-controls="collapseThirteen"
            >
              Ques13. Can I switch plans?
            </button>
          </div>
          <div
            id="collapseThirteen"
            className="accordion-collapse collapse"
            aria-labelledby="headingThirteen"
            data-bs-parent="#accordionExample"
          >
            <div className="card-body">
              <p>
                Ans- Yes, you can switch subscription plans at any time. Simply
                log in to your account, navigate to the subscription and follow
                the prompts to upgrade or downgrade your plan according to your
                preferences.
              </p>
            </div>
          </div>
        </div>
        {/* End .card */}

        <div className="card">
          <div id="headingFourteen">
            <button
              className="btn btn-link accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseFourteen"
              aria-expanded="false"
              aria-controls="collapseFourteen"
            >
              Ques14. How will I know if my bid is accepted?
            </button>
          </div>
          <div
            id="collapseFourteen"
            className="accordion-collapse collapse"
            aria-labelledby="headingFourteen"
            data-bs-parent="#accordionExample"
          >
            <div className="card-body">
              <p>
                Ans- You will be notified via email of the acceptance or status
                of your bid. You can also view the bid status in your account
                Biding history for real-time updates on the outcome of the bid
                you submitted.
              </p>
            </div>
          </div>
        </div>
        {/* End .card */}

        <div className="card">
          <div id="headingFifteen">
            <button
              className="btn btn-link accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseFifteen"
              aria-expanded="false"
              aria-controls="collapseFifteen"
            >
              Ques15. How will the broker receive confirmation that his
              submitted property has been appraised by the appraiser?
            </button>
          </div>
          <div
            id="collapseFifteen"
            className="accordion-collapse collapse"
            aria-labelledby="headingFifteen"
            data-bs-parent="#accordionExample"
          >
            <div className="card-body">
              <p>
                Ans- The broker will receive confirmation of the property
                appraisal via email and a platform status update.
              </p>
            </div>
          </div>
        </div>
        {/* End .card */}
      </div>
    </>
  );
};

export default FaqContent;
