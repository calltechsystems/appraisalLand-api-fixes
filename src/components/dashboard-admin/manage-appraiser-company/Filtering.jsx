import { FaRedo } from "react-icons/fa";
const Filtering = ({ filterQuery, setFilterQuery, refreshHandler }) => {
  return (
    <div className="col=lg-12">
      <div className="row">
        <div className="col-lg-9">
          <select
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="selectpicker show-tick form-select c_select"
          >
            <option value={"All"}>All</option>
            <option value={"Monthly"}>Monthly</option>
            <option value={"Weekly"}>Weekly</option>
            <option value={"Yearly"}>Yearly</option>
          </select>
        </div>
        <div className="col-lg-3">
          <button
            className="btn btn-color w-100"
            onClick={refreshHandler}
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
