const SearchData = ({data}) => {
  return (
    <table className="table">
      <thead className="thead-light">
        <tr>
          <th scope="col">S.No.</th>
          <th scope="col">Appraiser Name</th>
          {/* <th scope="col">Active Plan</th> */}
          <th scope="col">No. of Bids</th>
          <th scope="col">Pending Bids</th>
          <th scope="col">Completed Bids</th>
          <th scope="col">Status</th>
          {/* <th scope="col">Plan Expiry Date</th> */}
        </tr>
      </thead>
      {/* End thead */}

      <tbody>
        
        { data === true ? data.map((item,index)=>{
          <tr>
          <th scope="row">Free</th>
          <td>0</td>
          <td>3</td>
          <td>8</td>
          {/* <td>2 MB / 20 MB</td> */}
          <td>December 31, 2020</td>
        </tr> 
        }) : ""}
          
       
      </tbody>
    </table>
  );
};

export default SearchData;
