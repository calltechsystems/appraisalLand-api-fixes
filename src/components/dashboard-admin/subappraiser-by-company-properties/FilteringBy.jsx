const FilteringBy = ({ statusSearch, setStatusSearch }) => {
  return (
    <select
      className="selectpicker show-tick form-select c_select"
      value={statusSearch}
      onChange={(e) => setStatusSearch(e.target.value)}
    >
      <option value={"0"}>Search by status</option>
      <option value={"1"}>Accepted</option>
      <option value={"2"}>Completed</option>
      <option value={"3"}>Quote Provided</option>
      <option value={"4"}>In Progress</option>
      <option value={"5"}>Cancelled</option>
      <option value={"6"}>On Hold</option>
    </select>
  );
};

export default FilteringBy;
