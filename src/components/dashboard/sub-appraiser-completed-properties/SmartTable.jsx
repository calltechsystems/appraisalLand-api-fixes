import React, { useCallback, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import SVGArrowDown from "./icons/SVGArrowDown";
import SVGArrowUp from "./icons/SVGArrowUp";
import SVGChevronLeft from "./icons/SVGChevronLeft";
import SVGChevronRight from "./icons/SVGChevronRight";
import { FaDownload, FaRedo } from "react-icons/fa";
import * as XLSX from "xlsx";
import millify from "millify";
import { useReactToPrint } from "react-to-print";
import toast from "react-hot-toast";
import SearchBox from "./SearchBox";
import FilteringBy from "./FilteringBy";
import Filtering from "./Filtering";
import Image from "next/image";
import LoadingSpinner from "../../common/LoadingSpinner";
import NoDataFound from "../../common/NoDataFound";

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
    setData([props.data]);
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
        //console.log("Fetch error", e.message);
      }
      setLoading(false);
    },
    [props.url]
  );

  function extractTextFromReactElement(element) {
    if (typeof element === "string") {
      return element; // If it's a string, return it directly
    } else if (Array.isArray(element)) {
      // If it's an array of elements, recursively call this function for each element
      return element
        .map((child) => extractTextFromReactElement(child))
        .join("");
    } else if (typeof element === "object" && element !== null) {
      // If it's an object (React element), recursively call this function on its children
      return extractTextFromReactElement(element.props.children);
    } else {
      return ""; // Return an empty string if the element is not recognized
    }
  }

  const handlePrint = async () => {
    try {
      // Fetch data
      const allData = props.properties;

      // Open print window and set up basic structure
      const printWindow = window.open("", "_blank");
      printWindow.document.write(
        "<html><head><title>Appraiser Land</title></head><body>" +
          // Add CSS styles within the <style> tag
          "<style>" +
          // Define your CSS styles here
          "@media print {" +
          "  footer { position: fixed; bottom: 0; width: 100%; text-align: center; }" +
          "}" +
          "table { width: 100%; border-collapse: collapse; font-size:12px; font-family:arial;}" +
          "th, td { border: 1px solid black; padding: 8px; }" +
          "th { background-color:; color:black;  }" +
          "</style>" +
          "</head><body>"
      );
      printWindow.document.write(
        ' <img width="60" height="45" class="logo1 img-fluid" style="" src="/assets/images/Appraisal_Land_Logo.png" alt="header-logo2.png"/> <span style="color: #2e008b font-weight: bold; font-size: 24px;">Appraisal</span><span style="color: #97d700; font-weight: bold; font-size: 24px;">Land</span>'
      );
      printWindow.document.write(
        "<h3>Properties Information</h3>" +
          "<style>" +
          "h3{text-align:center;}" +
          "</style>"
      );
      printWindow.document.write(
        '<button style="display:none;" onclick="window.print()">Print</button>'
      );

      // Create a new table element to hold all data
      const clonedTable = document.createElement("table");

      // Create table headers
      const tableHeaderRow = document.createElement("tr");
      const staticHeaders = [
        ["order_id", "Order Id"],
        ["address", "Property Address"],
        ["status", "Order Status"],
        ["appraisal_status", "Appraisal Status"],
        ["remark", "Remark"],
        ["date", "Submission Date"],
        ["quote_required_by", "Appraisal Report Required By"],
        ["urgency", "Request Type"],
        ["type_of_building", "Property Type"],
        ["estimated_value", "Estimated Property Value ($)"],
        ["purpose", "Purpose"],
        ["type_of_appraisal", "Type Of Appraisal"],
        ["lender_information", "Lender Information"],
      ];
      staticHeaders.forEach((headerText) => {
        const th = document.createElement("th");
        th.textContent = headerText[1];
        tableHeaderRow.appendChild(th);
      });
      clonedTable.appendChild(tableHeaderRow);

      const tableBody = document.createElement("tbody");
      allData.forEach((item) => {
        const row = tableBody.insertRow();
        staticHeaders.forEach((header) => {
          const cell = row.insertCell();
          if (
            header[0].toLowerCase() === "appraisal_status" ||
            header[0].toLowerCase() === "status"
          ) {
            const value = item[header[0].toLowerCase()];
            const className = value.props.className;
            const content =
              header[0].toLowerCase() === "appraisal_status"
                ? extractTextFromReactElement(value.props.children).split(
                    "Current Status"
                  )[0]
                : value.props.children;

            const spanElement = document.createElement("span");
            spanElement.textContent = content;

            if (className.includes("btn-warning")) {
              spanElement.style.backgroundColor = "";
              spanElement.style.color = "#E4A11B";
              spanElement.style.height = "max-content";
              spanElement.style.width = "120px";
              spanElement.style.padding = "8px";
              spanElement.style.fontWeight = "bold";
            } else if (className.includes("btn-danger")) {
              spanElement.style.backgroundColor = "";
              spanElement.style.color = "#DC4C64";
              spanElement.style.height = "max-content";
              spanElement.style.width = "120px";
              spanElement.style.padding = "8px";
              spanElement.style.fontWeight = "bold";
              // Add more styles as needed
            } else if (className.includes("btn-success")) {
              spanElement.style.backgroundColor = "";
              spanElement.style.color = "#14A44D";
              spanElement.style.height = "max-content";
              spanElement.style.width = "120px";
              spanElement.style.padding = "8px";
              spanElement.style.fontWeight = "bold";
              // Add more styles as needed
            } else {
              spanElement.style.backgroundColor = "";
              spanElement.style.color = "#54B4D3";
              spanElement.style.height = "max-content";
              spanElement.style.width = "120px";
              spanElement.style.padding = "8px";
              spanElement.style.fontWeight = "bold";
            }

            // Append the span element to the cell
            cell.appendChild(spanElement);
          } else {
            cell.textContent = item[header[0].toLowerCase()];
          }
        });
      });

      clonedTable.appendChild(tableBody);
      clonedTable.appendChild(tableBody);

      // Write the table to the print window
      printWindow.document.write(clonedTable.outerHTML);
      printWindow.document.write("</body>");
      // Add footer link
      printWindow.document.write("<footer>");
      printWindow.document.write(
        '<p style="text-align:center;"><a href="https://appraisalland.vercel.app/">https://appraisalland.vercel.app/</a></p>'
      );
      printWindow.document.write("</footer>");

      printWindow.document.write("</html>");
      printWindow.document.close();

      // Print and handle post-print actions
      printWindow.print();
      printWindow.onafterprint = () => {
        printWindow.close();
        toast.success("Saved the data");
      };
    } catch (error) {
      console.error("Error handling print:", error);
    }
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
  //console.log(props.data);

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

  // const sortingFunction = (key) =>{
  //     const tempData = props.properties;
  //     tempData.sort((a, b) => {
  //       const valueA = typeof a[key] === 'string' ? a[key].toLowerCase() : a[key];
  //       const valueB = typeof b[key] === 'string' ? b[key].toLowerCase() : b[key];
  //       if (sortDesc[key]) {
  //         return valueA < valueB ? -1 : 1; // Changed comparison direction for descending order
  //       } else {
  //         return valueA > valueB ? -1 : 1; // Changed comparison direction for descending order
  //       }
  //     });
  //     setSortDesc({ ...sortDesc, [key]: !sortDesc[key] });
  //     setData(tempData);
  //   }
  // };

  const getDataFromStatus = (statusValues) => {
    let final = [];

    statusValues?.map((status, index) => {
      data.map((row, idx) => {
        if (String(status.order_id) === String(row.order_id)) {
          final.push(row);
        }
      });
    });

    return final;
  };
  const extractTextContent = (cellValue) => {
    if (typeof cellValue === "number") {
      return cellValue; // If it's a string, return it as is
    } else if (typeof cellValue === "object" && cellValue.$$typeof) {
      // If it's a React element, extract text content recursively from children
      return extractTextContent(cellValue.props.children);
    } else {
      return String(cellValue); // Convert other types to string and return
    }
  };

  const extractTextContentFromDate = (value) => {
    const date = new Date(value);

    if (isNaN(date.getTime())) {
      return null;
    }
    return date;
  };

  const extractNumericValue = (str) => {
    const numericStr = str.replace(/[^0-9]/g, "");
    const numericValue = parseInt(numericStr, 10);

    return numericValue;
  };

  const sortData = (cell) => {
    // Clone props.properties to avoid mutating the original data
    let tempData = [...props.properties];

    // Toggle sorting order for the current cell
    const newSortDesc = { ...sortDesc };
    newSortDesc[cell] = !newSortDesc[cell];

    // Perform sorting
    tempData.sort((a, b) => {
      // Extract text content from cell value (React element or other type)
      let valueA = extractTextContent(a[cell]);
      let valueB = extractTextContent(b[cell]);

      if (String(cell) === "date" || String(cell) === "quote_required_by") {
        valueA = extractTextContentFromDate(a[cell]);
        valueB = extractTextContentFromDate(b[cell]);
      }

      if (String(cell) === "estimated_value") {
        valueA = extractNumericValue(a[cell]);
        valueB = extractNumericValue(b[cell]);
      }
      // Perform comparison based on the sorting order
      if (newSortDesc[cell]) {
        return valueA < valueB ? 1 : -1;
      } else {
        return valueA > valueB ? 1 : -1;
      }
    });

    // Update state with the new sorting order and sorted data
    setSortDesc(newSortDesc);
    setData(tempData);
  };

  useEffect(() => {
    const sortObjectsByOrderIdDescending = (data) => {
      return data.sort((a, b) => b.order_id - a.order_id);
    };

    setData(sortObjectsByOrderIdDescending(props.data));
  }, [props.data]);

  return (
    <div className="col-12 pt-3">
      <div className="smartTable-container row">
        <div className="candidate_revew_select style2 mb30-991">
          <ul className="mb0 mt-0">
            <li className="list-inline-item">
              <Filtering
                searchInput={props.searchInput}
                setFilterQuery={props.setFilterQuery}
              />
            </li>

            <li className="list-inline-item" style={{ marginRight: "15px" }}>
              <div className="candidate_revew_search_box course fn-520">
                <SearchBox
                  filterQuery={props.filterQuery}
                  setSearchInput={props.setSearchInput}
                />
              </div>
            </li>

            <li className="list-inline-item">
              {loading && (
                <div className="smartTable-loaderContainer text-primary">
                  <div className="spinner-border" role="status"></div>
                </div>
              )}
              <div className="col-lg-12">
                <div className="row">
                  <div className="d-flex gap-1">
                    <button
                      className="btn btn-color"
                      onClick={() => handlePrint()}
                      title="Download Pdf"
                    >
                      <FaDownload />
                    </button>
                    <button
                      className="btn btn-color"
                      onClick={() => props.refreshHandler()}
                      title="Refresh"
                    >
                      <FaRedo />
                    </button>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div className="col-12">
          {props.data.length > 0 ? (
            <div className="row mt-3">
              <div
                className="smartTable-tableContainer"
                id="table-container"
                style={{
                  overflow: "auto",
                  position: "relative",
                  maxHeight: "500px",
                }}
              >
                <table
                  className={"smartTable-table table table-striped border"}
                  style={{ minWidth: tableWidth }}
                >
                  <thead className="smartTable-thead">
                    <tr>
                      {props.headCells.map((headCell, index) => {
                        return (
                          <th
                            id={headCell.id}
                            key={headCell.id}
                            scope="col"
                            style={{
                              width: headCell.width,
                              backgroundColor: "#2e008b",
                              color: "white",
                              position: "sticky",
                              top: "0", // Keep the header visible when scrolling vertically
                              left: index === 0 ? "0" : undefined, // Make the first column sticky
                              zIndex: index === 0 ? "3" : "2", // Ensure layering
                            }}
                            className={
                              headCell.sortable !== false
                                ? "smartTable-pointer"
                                : ""
                            }
                            onClick={() =>
                              headCell.sortable !== false &&
                              headCell.id !== "address"
                                ? sortData(headCell.id)
                                : {}
                            }
                          >
                            {headCell.label}
                            {sortDesc[headCell.id] ? (
                              <div></div>
                            ) : sortDesc[headCell.id] === undefined ? (
                              ""
                            ) : (
                              <div></div>
                            )}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {data.length > 0
                      ? data.map((row, idx) => {
                          return (
                            <tr key={"tr_" + idx}>
                              {props.headCells.map((headCell, idxx) => {
                                return (
                                  <td
                                    key={"td_" + idx + "_" + idxx}
                                    className={idxx === 0 ? "sticky-cell" : ""}
                                    style={{
                                      position:
                                        idxx === 0 ? "sticky" : "static",
                                      left: idxx === 0 ? "0" : undefined,
                                      backgroundColor:
                                        idxx === 0 ? "gray" : undefined,
                                      color: idxx === 0 ? "white" : undefined,
                                      zIndex: idxx === 0 ? "2" : "1",
                                    }}
                                  >
                                    {headCell.render
                                      ? headCell.render(row)
                                      : row[headCell.id]}
                                  </td>
                                );
                              })}
                            </tr>
                          );
                        })
                      : null}
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
