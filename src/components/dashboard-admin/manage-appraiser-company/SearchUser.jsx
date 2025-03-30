const SearchUser = ({ searchInput, setSearchInput }) => {
  return (
    <form className="form-inline d-flex">
      <input
        className="form-control"
        type="search"
        placeholder="Serach Appraiser Company Name or User Id"
        aria-label="Search"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />
      {/* <button className="btn" disabled>
        <span className="flaticon-magnifying-glass"></span>
      </button> */}
    </form>
  );
};

export default SearchUser;
