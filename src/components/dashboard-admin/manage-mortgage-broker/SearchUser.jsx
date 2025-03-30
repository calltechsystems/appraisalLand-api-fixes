const SearchUser = ({searchInput,setSearchInput}) => {
  return (
    <form className="form-inline d-flex">
      <input
        className="form-control"
        type="search"
        placeholder="Serach Broker by name or user Id"
        aria-label="Search"
        required
        value={searchInput}
        onChange={(e)=>setSearchInput(e.target.value)}
      />
      <button className="btn" type="submit">
        <span className="flaticon-magnifying-glass"></span>
      </button>
    </form>
  );
};

export default SearchUser;
