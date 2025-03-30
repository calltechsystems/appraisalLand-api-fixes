import React, { useCallback, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import SVGArrowDown from "./icons/SVGArrowDown";
import SVGArrowUp from "./icons/SVGArrowUp";
import SVGChevronLeft from "./icons/SVGChevronLeft";
import SVGChevronRight from "./icons/SVGChevronRight";
import { FaRedo } from "react-icons/fa";
import * as XLSX from "xlsx";

import { useReactToPrint } from "react-to-print";
import toast from "react-hot-toast";
import SearchBox from "./SearchBox";
import FilteringBy from "./FilteringBy";
import Filtering from "./Filtering";

function SmartTable(props) {
 
  const [loading, setLoading] = useState(false);
  const [sortDesc, setSortDesc] = useState({});
  const [tableWidth, setTableWidth] = useState(1000);
  const [data, setData] = useState(props.data);

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

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(
      "<html><head><title>AllBrokerProperties</title></head><body>"
    );
    printWindow.document.write("<h1>" + props.title + "</h1>");
    printWindow.document.write(
      '<button style="display:none;" onclick="window.print()">Print</button>'
    );

    // Clone the table-container and remove the action column
    const tableContainer = document.getElementById("table-container");
    const table = tableContainer.querySelector("table");
    const clonedTable = table.cloneNode(true);
    const rows = clonedTable.querySelectorAll("tr");
    rows.forEach((row) => {
      const lastCell = row.querySelector("td:last-child");
      if (lastCell) {
        row.removeChild(lastCell);
      }
    });

    // Remove the action heading from the table
    const tableHead = clonedTable.querySelector("thead");
    const tableHeadRows = tableHead.querySelectorAll("tr");
    tableHeadRows.forEach((row) => {
      const lastCell = row.querySelector("th:last-child");
      if (lastCell) {
        row.removeChild(lastCell);
      }
    });

    // Make the table responsive for all fields
    const tableRows = clonedTable.querySelectorAll("tr");
    tableRows.forEach((row) => {
      const firstCell = row.querySelector("td:first-child");
      if (firstCell) {
        const columnHeading = tableHeadRows[0].querySelector(
          "th:nth-child(" + (firstCell.cellIndex + 1) + ")"
        ).innerText;
        firstCell.setAttribute("data-th", columnHeading);
      }
    });

    printWindow.document.write(clonedTable.outerHTML);
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.print();
    printWindow.onafterprint = () => {
      printWindow.close();
      toast.success("Saved the data");
    };
  };
  const handleExcelPrint = () => {
    const twoDData = props.data.map((item, index) => {
      return [item.bid, item.date, item.title, item.urgency];
    });

    // Remove empty arrays from twoDData
    const filteredTwoDData = twoDData.filter((row) => row.length > 0);

    // Create a workbook and add a worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(filteredTwoDData);
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // Create a blob from the workbook
    const blob = XLSX.write(wb, {
      bookType: "xlsx",
      bookSST: false,
      type: "blob",
    });

    // Create a new window for downloading Excel
    const excelWindow = window.open("", "_blank");

    // Write the Excel blob to the new window
    excelWindow.document.write(
      "<html><head><title>AllBrokerProperties</title></head><body>"
    );
    excelWindow.document.write("<h1>" + props.title + "</h1>");
    excelWindow.document.write(
      '<a id="download-link" download="your_excel_file.xlsx" href="#">Download Excel</a>'
    );

    // Create a download link and trigger a click event to download the file
    const url = URL.createObjectURL(blob);
    const downloadLink = excelWindow.document.getElementById("download-link");
    downloadLink.href = url;
    downloadLink.click();

    // Close the new window after the file is downloaded
    excelWindow.document.write("</body></html>");
    excelWindow.document.close();
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
    <div className="col-12 p-4">
      <div className="smartTable-container row">
      <div className="candidate_revew_select style2 mb30-991">
                    <ul className="mb0">
                      <li className="list-inline-item">
                        <Filtering setFilterQuery={props.setFilterQuery} />
                      </li>
                      <li className="list-inline-item">
                        <FilteringBy setFilterQuery={props.setSearchQuery} />
                      </li>
                      <li className="list-inline-item">
                        <div className="candidate_revew_search_box course fn-520">
                          <SearchBox setSearchInput={props.setSearchInput} />
                        </div>
                      </li>
                    
                    </ul>
                  </div>
        <div className="col-12">
          {loading && (
            <div className="smartTable-loaderContainer text-primary">
              <div className="spinner-border" role="status"></div>
            </div>
          )}
          <div className="row">
            <div className="col-12">{props.title}</div>
            <div className="col-lg-4 offset-9">
              <div
                className="btn btn-color w-25 m-1"
                onClick={() => handlePrint()}
                title="Download Pdf"
              >
                <span className="flaticon-download "></span>
              </div>
              <button
                className="btn btn-color w-25 h-10 m-1"
                onClick={() => props.refreshHandler()}
                title="Refresh"
              >
                <FaRedo />
              </button>
            </div>
          </div>
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
                        if (idx >= props.start && idx <= props.end) {
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
                        } else {
                          return null; // Skip rendering rows that don't meet the condition
                        }
                      })
                    : props.data.map((row, idx) => {
                        if (idx >= props.start && idx <= props.end) {
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
                        } else {
                          return null; // Skip rendering rows that don't meet the condition
                        }
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="row">
              <div
                className="smartTable-noDataFound col-12"
                style={{ marginTop: "50px", marginBottom: "40px" }}
              >
                <div className="ring">
                  Loading
                  <span className="load"></span>
                </div>
              </div>
            </div>
          )}
          {props.noPagination || data.length === 0 || !props.url ? (
            <div className="row">
              {/* <div className="col-12 text-end p-3">
                {props.data.length > 0 ? props.data.length : 0} Rows
              </div> */}
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
