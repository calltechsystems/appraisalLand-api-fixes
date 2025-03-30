const Filtering = ({setFilterQuery}) => {
  return (
    <select className="selectpicker show-tick form-select c_select" onChange={(e)=>setFilterQuery(e.target.value)}>
    <option value={"All"}>All</option>
    <option value={"Last 7 days"}>Last 7 days</option>
      <option value={"Last 30 Days"}>Last 30 Days</option>
      <option value={"Last 3 Month"}>Last 90 Days</option>
    </select>
  );
};

export default Filtering;
