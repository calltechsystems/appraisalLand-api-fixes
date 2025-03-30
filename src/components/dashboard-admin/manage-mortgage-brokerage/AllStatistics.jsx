const AllStatistics = ({totalBids , acceptedBids}) => {
  console.log(totalBids,acceptedBids)
  const allStatistics = [
    {
      id: 1,
      blockStyle: "",
      icon: "flaticon-home-1",
      timer: totalBids,
      name: "Total Brokerage",
    },
    {
      id: 2,
      blockStyle: "style3",
      icon: "flaticon-house-1",
      timer: acceptedBids,
      name: "Total Active Brokerage",
    }
  ];

  return (
    <>
      {allStatistics.map((item) => (
        // <div className="col-sm-6 col-md-6 col-lg-6 col-xl-3" key={item.id}>
        <div className="col-lg-6" key={item.id}>
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
