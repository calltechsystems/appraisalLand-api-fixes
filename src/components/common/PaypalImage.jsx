import Image from "next/image";

const PayPalLogo = () => {
  return (
    <div style={{ textAlign: "center", padding: "10px" }}>
        <Image
          src="https://www.paypalobjects.com/webstatic/mktg/logo/AM_SbyPP_mc_vs_dc_ae.jpg"
          alt="PayPal Acceptance Mark"
          width={300} // Adjust width as per your requirements
          height={50} // Adjust height as per your requirements
        />
    </div>
  );
};

export default PayPalLogo;
