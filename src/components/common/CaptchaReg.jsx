import { useState } from "react";
import Image from "next/image";

const CaptchaReg = () =>{

const[verify, setVerify] = useState(false);

const [usernew, setUsernew] = useState({
    usernamenew:""
  });
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const specialChars = '@#$%&';

    const allChars = uppercaseChars + lowercaseChars + numberChars + specialChars;
    // const allCharsLength = allChars.length;

  function generateStringnew(length) 
  {
    let result = '';
    const charactersLength = allChars.length;
    for ( let i = 0; i < length; i++ ) {
        result += allChars.charAt(Math.floor(Math.random() * charactersLength));
    }
   return result;
  }
  const captchanew = generateStringnew(6) // Function called here and save in captcha variable
  let handleChange = (e) => {
   let name = e.target.name;
   let value = e.target.value;
   usernew[name] = value;
   setUsernew(usernew);
  
   var element =  document.getElementById("succesBtn");
   var inputData = document.getElementById("inputTypenew");
//    var login = document.getElementById("login")
   var signup = document.getElementById("signup");

   element.style.cursor = "wait";
   element.innerHTML  = "...";
  //  inputData.disabled = true;
   element.disabled = true;
    var myFunctionsnew = function(){
        if(captchanew == usernew.usernamenew)
        {
          element.style.backgroundColor   = "green";
          // element.style.marginTop   = "20px";
          element.innerHTML  = "✔";
          element.disabled = true;
        //   login.disabled = false;
          signup.disabled = false;
          element.style.cursor = "not-allowed";
          // inputData.style.display = "none";

          setVerify(true);
          
        }
        else
        {
          element.style.backgroundColor   = "red";
          element.style.cursor = "not-allowed";
          element.innerHTML  = "✗";
          element.disabled = true;
          //  element.disabled = true;
          var myFunctionnew = function(){
            element.style.backgroundColor   = "#007bff";
            element.style.cursor = "pointer";
            element.innerHTML  = "!";
            element.disabled = false;
            inputData.disabled = false;
            // inputData.value ='';
          };
          setTimeout(myFunctionnew,2000);
        }
      }   
      setTimeout(myFunctionsnew,2000); 
  };

return (
    <>
     <div className="row">
                    <div className="col-lg-6">
                       <h4 id="captchanew" className="bg-imgg text-captcha">{captchanew}</h4>
                       <Image
                             width={60}
                             height={45}
                             className="w-100 mb-2 mt-0 cap-img"
                             src="/assets/images/home/bg.png"
                             />
                    </div>
                  <div className="col-lg-6">
                      <input type="text" id="inputTypenew" className="form-control mr"placeholder="Enter Captcha"
                      name="usernamenew"  onChange={handleChange} autocomplete="off"/><button type="button" id="succesBtn" className="btn btn-primary w-25 btn-captcha">!</button>
                    </div>
           </div>
                  {/* End input-group */}
   </>

  );

};

export default CaptchaReg ;