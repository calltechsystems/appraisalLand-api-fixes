import Image from "next/image";
import HeroFilter from "./HeroFilter";
import HeroSlider from "./HeroSlider";

const Hero = () => {
  return (
    <section className="home-one home1-overlay home1_bgi1">
      <div className="container">
        <div className="row posr">
          <div className="col-lg-12">
            <HeroFilter />
          </div>
        </div>
      </div>
      {/* End .container */}
    </section>
  );
};

export default Hero;
