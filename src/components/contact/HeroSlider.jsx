import Slider from "react-slick";

const HeroSlider = () => {
  const settings = {
    dots: false,
    arrow: true,
    arrow: true,
    speed: 1200,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
  };

  return (
    <Slider {...settings} arrows={false}>
      {/* <div className="slide slide-one image-6"></div> */}
      <div className="slide slide-one image-7"></div>
      <div className="slide slide-one image-8"></div>
      {/* <div className="slide slide-one image-9"></div> */}
      <div className="slide slide-one image-10"></div>
    </Slider>
  );
};

export default HeroSlider;
