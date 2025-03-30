const AllStatistics = ({ properties, views, bids, favourites }) => {
  const allStatistics = [
    {
      id: 1,
      blockStyle: "",
      icon: "flaticon-house",
      timer: properties,
      name: "All Properties",
    },
    {
      id: 2,
      blockStyle: "style6",
      icon: "flaticon-invoice",
      timer: views,
      name: "Quotes Provided",
    },
    {
      id: 3,
      blockStyle: "style4",
      icon: "flaticon-tick",
      timer: bids,
      name: "Accepted Quotes",
    },
    // {
    //   id: 4,
    //   blockStyle: "style4",
    //   icon: "flaticon-heart",
    //   timer: favourites,
    //   name: "Favorites",
    // },
  ];

  return (
    <>
      {allStatistics.map((item) => (
        <div className="col-sm-6 col-md-6 col-lg-6 col-xl-4" key={item.id}>
          <div className={`ff_one ${item.blockStyle}`}>
            <div className="detais">
              <div className="timer">{item.timer}</div>
              <p>{item.name}</p>
            </div>
            <div className="icon">
              <span className={item.icon}></span>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default AllStatistics;
