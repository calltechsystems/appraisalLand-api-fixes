const SearchBox = ({ searchInput,setSearchInput }) => {
  return (
    <form className="d-flex flex-wrap align-items-center my-2">
      <input
        className="form-control mr-sm-2"
        type="search"
        placeholder="Search by property id, city, state, postal code"
        aria-label="Search"
        onChange={(e) => setSearchInput(e.target.value)}
      />
      <button className=" my-2 my-sm-0" disabled>
        <span className="flaticon-magnifying-glass"></span>
      </button>
    </form>
  );
};

export default SearchBox;
