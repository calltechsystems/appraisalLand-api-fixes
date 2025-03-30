const FilteringBy = ({filterQuery,setFilterQuery}) => {
    return (
      <select className="selectpicker show-tick form-select c_select"
      value={filterQuery} onChange={(e)=>setFilterQuery(e.target.value)}>
        <option value={"city"}>Search By City</option>
        <option value={"state"}>Search By State</option>
        <option value={"zipCode"}> Search By Postal Code</option>
      </select>
    );
  };
  
  export default FilteringBy;
  