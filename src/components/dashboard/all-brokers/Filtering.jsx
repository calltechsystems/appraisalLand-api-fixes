const Filtering = ({setFilterQuery}) => {
  return (
    <select className="selectpicker show-tick form-select c_select" onChange={(e)=>setFilterQuery(e.target.value)}>
    <option>All</option>
      <option>Last 30 Days</option>
      <option>Last 3 month</option>
      <option>Last 6 months</option>
      <option>Last 1 year</option>
    </select>
  );
};

export default Filtering;
