import { FaRedo } from "react-icons/fa";

const filterOptions = ["All", "Last 7 days", "Last 30 Days", "Last 90 Days"];

const Filtering = ({ setRefresh, filteringType, setFilteringType }) => {
  return (
    <div className="col-lg-12">
      <div className="row">
        <div className="col-lg-9">
          <select
            className="selectpicker show-tick form-select c_select"
            value={filteringType}
            onChange={(e) => setFilteringType(e.target.value)}
          >
            {filterOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="col-lg-3">
          <button
            className="btn btn-color w-100"
            onClick={() => setRefresh(true)}
            title="Refresh"
            style={{ padding: "10px", marginTop: "2px" }}
          >
            <FaRedo />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Filtering;
