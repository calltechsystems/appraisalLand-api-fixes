import { useState } from "react";
import Image from "next/image";
import { FaRedo } from "react-icons/fa";
import { useRef } from "react";
import { useEffect } from "react";

const Captcha = ({ verified, reload, change, setChange }) => {
  const [captcha, setCaptcha] = useState("");
  const [style, setStyle] = useState({
    borderColor: "black",
    borderWidth: "1px",
  });
  const captchaRef = useRef("");

  const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
  const numberChars = "0123456789";
  const specialChars = "@#$%&";

  const allChars = uppercaseChars + lowercaseChars + numberChars + specialChars;

  useEffect(() => {
    const temp = generateString(6);
    setCaptcha(temp);
    setChange(false);
    captchaRef.current.value = "";
  }, [change]);

  function generateString(length) {
    let result = "";
    const charactersLength = allChars.length;
    for (let i = 0; i < length; i++) {
      result += allChars.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  let handleChange = (e) => {
    const inputValue = captchaRef.current.value;
    if (String(inputValue) !== String(captcha)) {
      verified(false);
      setStyle({
        borderColor: "red",
        borderWidth: "2px",
      });
    } else if (reload) {
      const prevState = change;
      captchaRef.current.value = "";
      setChange(!prevState);
      console.log(reload, change);
    } else {
      verified(true);
      setStyle({
        borderColor: "green",
        borderWidth: "2px",
      });
    }
  };

  const refreshHandler = () => {
    const prevState = change;
    captchaRef.current.value = "";
    setStyle({
      borderColor: "black",
      borderWidth: "1px",
    });
    setChange(!prevState);
  };

  return (
    <>
      <div
        className="row"
        style={{
          // paddingLeft: "6%",
          display: "flex",
          flexDirection: "row",
          // marginBottom: "6%",
        }}
      >
        <div className="col-lg-4">
          <h4
            id="captcha"
            className="bg-imgg text-captcha text-center"
            style={{ letterSpacing: "1px", textDecoration: "line-through" }}
          >
            {captcha}
          </h4>
          <Image
            width={40}
            height={45}
            className="w-100 mb-2 mt-0 cap-img"
            src="/assets/images/home/dark-blue.jpg"
          />
        </div>
        <div
          className="col-lg-8 mb-4"
          style={{ display: "flex", flexDirection: "row" }}
        >
          <input
            type="text"
            ref={captchaRef}
            className="form-control mr"
            style={style}
            placeholder="Enter Captcha"
            name="username"
            onChange={handleChange}
            autoComplete="off"
          />
          <button
            type="button"
            id="succesBTN"
            className="input-group-text text-color m-1"
            style={{
              cursor: "pointer",
              border: "1px solid #2e008b",
              borderRadius: "3px",
            }}
            onClick={refreshHandler}
          >
            <FaRedo />
          </button>
        </div>
        <div></div>
      </div>
      <div className="col-lg-2 text-end"></div>

      {/* End input-group */}
    </>
  );
};

export default Captcha;
