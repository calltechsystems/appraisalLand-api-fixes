const FilteringBy = ({filterQuery,setFilterQuery}) => {
    return (
      <select className="selectpicker show-tick form-select c_select" 
      value={filterQuery}
      onChange={(e)=>setFilterQuery(e.target.value)}>
        <option>Search By City</option>
        <option>Search By State</option>
        <option>Search By Postal Code</option>
        {/* <option>Search By </option> */}
      </select>
    );
  };
  
  export default FilteringBy;
  