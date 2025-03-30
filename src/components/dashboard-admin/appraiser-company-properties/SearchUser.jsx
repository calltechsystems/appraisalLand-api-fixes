const SearchUser = ({userNameSearch,setUserNameSearch}) => {
  return (
    <form className="form-inline d-flex">
      <input
        className="form-control"
        type="search"
        placeholder="Search by appraiser company"
        aria-label="Search"
        required
        value={userNameSearch}
        onChange={(e)=>setUserNameSearch(e.target.value)}
      />
      <button className="" disabled>
        <span className="flaticon-magnifying-glass"></span>
      </button>
    </form>
  );
};

export default SearchUser;
