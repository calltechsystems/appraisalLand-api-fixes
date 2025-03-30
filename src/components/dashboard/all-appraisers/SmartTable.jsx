import React, { useCallback, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import SVGArrowDown from "./icons/SVGArrowDown";
import SVGArrowUp from "./icons/SVGArrowUp";
import SVGChevronLeft from "./icons/SVGChevronLeft";
import SVGChevronRight from "./icons/SVGChevronRight";
import { FaDownload, FaRedo } from "react-icons/fa";
import * as XLSX from "xlsx";
import { useReactToPrint } from "react-to-print";
import toast from "react-hot-toast";
import SearchBox from "./SearchBox";
import FilteringBy from "./FilteringBy";
import Filtering from "./Filtering";
import { useRouter } from "next/router";
import Image from "next/image";
import LoadingSpinner from "../../common/LoadingSpinner";
import NoDataFound from "../../common/NoDataFound";
import { getTheDownloadView } from "../../common/UserViewPDFDownload";

function SmartTable(props) {
  const [loading, setLoading] = useState(false);
  const [sortDesc, setSortDesc] = useState({});
  const [tableWidth, setTableWidth] = useState(1000);
  const [data, setData] = useState(props.data);

  const router = useRouter();

  const componentRef = useRef();

  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(props.rowsPerPage ?? 10);
  const [rowsPerPageOptions] = useState(
    props.rowsPerPageOptions ?? [5, 10, 25, 50]
  );
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(props.total ?? 0);
  const [changes, setChanges] = useState(false);

  const generatePDF = () => {
    window.print();
    toast.success("Data added");
  };

  const refreshHandler = () => {
    const refresh = !props.refresh;
    props.setRefresh(refresh);
  };
  const fetchData = useCallback(
    async (queryString) => {
      setLoading(true);

      try {
        const response = await fetch(
          props.url + (queryString ? queryString : ""),
          {
            method: "get",
          }
        );
        const data = await response.json();
        if (data && data.data) {
          setData(data.data.result ?? []);
          setTotal(data.data.total, 0);
        }
      } catch (e) {
        console.log("Fetch error", e.message);
      }
      setLoading(false);
    },
    [props.url]
  );

  const allAppraiser = () => {
    const userData = JSON.parse(localStorage.getItem("user"));
    const isAddingAppraiser = true;
    const newLocalData = {
      user: userData,
      isAddingAppraiser: isAddingAppraiser,
    };

    localStorage.setItem("addAppraiser", JSON.stringify(newLocalData));
    localStorage.removeItem("user");
    router.push("/appraiser-register");
  };

  const handlePrint = async () => {
    const headers = [
      ["sno", "S. No."],
      ["username", "User ID"],
      ["firstname", "First Name"],
      ["lastname", "Last Name"],
      ["phone", "Phone Number"],
      ["email", "Email Address"],
      ["date", "End Date"],
      ["status", "Status"],
    ];

    getTheDownloadView(
      "appraiserCompany_Datails",
      props.data,
      "Sub Appraisers",
      headers
    )
      .then((message) => {
        toast.success(message);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const tableWidthFunc = useCallback(() => {
    let tempTableWidth = 0;
    props.headCells.map((cell) => (tempTableWidth += cell.width));

    if (tempTableWidth) setTableWidth(tempTableWidth);
  }, [props.headCells]);

  useEffect(() => {
    tableWidthFunc();
    if (props.url && !props.data)
      fetchData(`?limit=${props.rowsPerPage ?? 10}`);
  }, [
    props.url,
    props.data,
    props.rowsPerPage,
    props.headCells,
    tableWidthFunc,
    fetchData,
  ]);
  console.log(props.data);

  const buildQueryString = (search, page, rowsPerPage) => {
    const queries = [];

    if (page) queries.push((page = `${page}`));
    if (rowsPerPage) queries.push(`limit=${rowsPerPage}`);
    if (search) queries.push(`search=${search.toLowerCase()}`);

    const queryString = queries.join("&");

    return queryString ? `?${queryString}` : "";
  };

  const debounce = (func, timeout = 300) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, timeout);
    };
  };

  const handleSearch = debounce((event) => {
    const { value } = event.target;
    setSearch(value);
    if (props.url) {
      fetchData(buildQueryString(value, page, rowsPerPage));
    } else {
      let bool = false;
      let tempData = props.data.filter((row) => {
        bool = false;
        Object.keys(row).forEach((key) => {
          if (row[key].toLowerCase().includes(value.toLowerCase())) bool = true;
        });
        return bool;
      });
      setData(tempData);
    }
  }, props.searchDebounceTime ?? 800);

  const [showNoData, setShowNoData] = useState(false);

  useEffect(() => {
    if (props.dataFetched && props.properties.length === 0) {
      const timer = setTimeout(() => {
        setShowNoData(true);
      }, 8000);

      return () => clearTimeout(timer);
    }
  }, [props.dataFetched, props.properties]);

  const sortData = (cell) => {
    let tempData = data.length > 0 ? [...data] : [...props.data];

    tempData.sort((a, b) => {
      const valueA =
        typeof a[cell] === "string" ? a[cell].toLowerCase() : a[cell];
      const valueB =
        typeof b[cell] === "string" ? b[cell].toLowerCase() : b[cell];

      if (sortDesc[cell]) {
        return valueA < valueB ? 1 : -1;
      } else {
        return valueA > valueB ? 1 : -1;
      }
    });
    setSortDesc({ [cell]: !sortDesc[cell] });

    setData(tempData);
  };
  console.log(data.length > 0, data);

  return (
    <div className="col-12 pt-4">
      <div className="smartTable-container row">
        <div className="candidate_revew_select style2 mb30-991">
          <ul className="mb0 text-end_01 mt-2">
            <li className="list-inline-item">
              {loading && (
                <div className="smartTable-loaderContainer text-primary">
                  <div className="spinner-border" role="status"></div>
                </div>
              )}
              <div
                className="btn btn-color w-100 m-1"
                onClick={() => props.setCloseRegisterModal(true)}
                title="adding appraiser"
              >
                Add Appraiser
              </div>
            </li>
            <li className="list-inline-item">
              <div className="d-flex justify-content-center gap-1">
                <button
                  className="btn btn-color w-100"
                  onClick={() => props.refreshHandler()}
                  title="Refresh"
                >
                  <FaRedo />
                </button>
                <button
                  className="btn btn-color w-100"
                  onClick={() => handlePrint()}
                  title="Download Pdf"
                >
                  <FaDownload />
                </button>
              </div>
            </li>
          </ul>
        </div>
        <div className="col-12">
          {props.data.length > 0 ? (
            <div className="row mt-3">
              <div className="smartTable-tableContainer" id="table-container">
                <table
                  className={"smartTable-table table table-striped border"}
                  style={{ minWidth: tableWidth }}
                >
                  <thead className="smartTable-thead">
                    <tr>
                      {props.headCells.map((headCell) => {
                        return (
                          <th
                            id={headCell.id}
                            key={headCell.id}
                            scope="col"
                            style={{
                              width: headCell.width,
                              backgroundColor: "#2e008b",
                              color: "white" ?? "auto",
                            }}
                            className={
                              headCell.sortable !== false
                                ? "smartTable-pointer"
                                : ""
                            }
                            onClick={() =>
                              headCell.sortable !== false
                                ? sortData(headCell.id)
                                : {}
                            }
                          >
                            {headCell.label}
                            {sortDesc[headCell.id] ? (
                              <SVGArrowDown />
                            ) : sortDesc[headCell.id] === undefined ? (
                              ""
                            ) : (
                              <SVGArrowUp />
                            )}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {data.length > 0
                      ? data.map((row, idx) => {
                          // if (idx >= props.start && idx <= props.end) {
                          return (
                            <tr key={"tr_" + idx}>
                              {props.headCells.map((headCell, idxx) => {
                                return (
                                  <td key={"td_" + idx + "_" + idxx}>
                                    {headCell.render
                                      ? headCell.render(row)
                                      : row[headCell.id]}
                                  </td>
                                );
                              })}
                            </tr>
                          );
                          // } else {
                          //   return null; // Skip rendering rows that don't meet the condition
                          // }
                        })
                      : props.data.map((row, idx) => {
                          // if (idx >= props.start && idx <= props.end) {
                          return (
                            <tr key={"tr_" + idx}>
                              {props.headCells.map((headCell, idxx) => {
                                return (
                                  <td key={"td_" + idx + "_" + idxx}>
                                    {headCell.render
                                      ? headCell.render(row)
                                      : row[headCell.id]}
                                  </td>
                                );
                              })}
                            </tr>
                          );
                          // } else {
                          //   return null; // Skip rendering rows that don't meet the condition
                          // }
                        })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="row">
              <div
                className="smartTable-noDataFound col-12"
                style={{ marginTop: "100px", marginBottom: "40px" }}
              >
                {props.dataFetched && props.properties.length === 0 ? (
                  showNoData ? (
                    <NoDataFound />
                  ) : (
                    <LoadingSpinner />
                  )
                ) : (
                  <LoadingSpinner />
                )}
              </div>
            </div>
          )}
          {props.noPagination || data.length === 0 || !props.url ? (
            <div className="row">
              <div className="col-12 text-end p-3">
                {props.data.length > 0 ? props.data.length : 0} Records
              </div>
            </div>
          ) : (
            <div className="row">
              <div className="col-12 text-end p-3">
                <span>
                  Rows per page:{" "}
                  <select
                    name="rowsPerPage"
                    value={rowsPerPage}
                    onChange={(e) => {
                      setRowsPerPage(e.target.value);
                      fetchData(buildQueryString(search, page, e.target.value));
                    }}
                  >
                    {rowsPerPageOptions.map((nbr, idx) => {
                      return (
                        <option key={"rowsPerPageOptions_" + idx} value={nbr}>
                          {nbr}
                        </option>
                      );
                    })}
                  </select>
                </span>
                <span className="ms-4">
                  {(page - 1) * rowsPerPage + 1}-
                  {(page - 1) * rowsPerPage + data.length} of {total}
                </span>
                <span
                  className={page === 1 ? "ms-4" : "smartTable-pointer ms-4"}
                  onClick={(e) => {
                    e.preventDefault();
                    if (page === 1) return;
                    setPage(page - 1);
                    fetchData(buildQueryString(search, page - 1, rowsPerPage));
                  }}
                >
                  <SVGChevronLeft
                    color={page === 1 ? "lightgray" : undefined}
                  />
                </span>
                <span
                  className={
                    page * rowsPerPage >= total
                      ? "ms-4"
                      : "smartTable-pointer ms-4"
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    if ((page - 1) * rowsPerPage > total) return;
                    setPage(page + 1);
                    fetchData(buildQueryString(search, page + 1, rowsPerPage));
                  }}
                >
                  <SVGChevronRight
                    color={
                      page * rowsPerPage >= total ? "lightgray" : undefined
                    }
                  />
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

SmartTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.Object),
  rowsPerPage: PropTypes.number,
  rowsPerPageOptions: PropTypes.arrayOf(PropTypes.number),
  total: PropTypes.number,
  url: PropTypes.string,
  headCells: PropTypes.arrayOf(
    //means Object
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      numeric: PropTypes.bool,
      width: PropTypes.number, //px
      sortable: PropTypes.bool,
      render: PropTypes.func,
    })
  ),
};

export default SmartTable;
