const FilteringBy = ({setFilterQuery}) => {
    return (
      <select className="selectpicker show-tick form-select c_select" onChange={(e)=>setFilterQuery(e.target.value)}>
        <option value={"city"}>Search By City</option>
        <option value={"state"}>Search By State</option>
        <option value={"zipCode"}> Search By Postal Code</option>
        {/* <option>Search By </option> */}
      </select>
    );
  };
  
  export default FilteringBy;
  