const SearchData = ({data}) => {
  console.log(data);
  return (
    <table className="table">
      <thead className="thead-light">
        <tr>
          <th scope="col">Package</th>
          <th scope="col">Total Properties</th>
          <th scope="col">Appraised Properties</th>
          <th scope="col">Pending Properties</th>
          {/* <th scope="col">Storage Space</th> */}
          <th scope="col">Expiry Date</th>
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
