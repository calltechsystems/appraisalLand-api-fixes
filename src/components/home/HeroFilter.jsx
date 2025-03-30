import GlobalHeroFilter from "../common/GlobalHeroFilter";

const HeroFilter = () => {
    return (
        <div className="home_content">
            <div className="home-text text-center">
                <h2 className="fz50">Brokers Paradise for all real estate appraisals</h2>
                <p className="fz18 color-white">
                    From as low as $11 per month for limited time.
                </p>
            </div>
            {/* End .home-text */}

            <GlobalHeroFilter />
        </div>
    );
};

export default HeroFilter;
