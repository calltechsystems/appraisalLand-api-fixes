function extractTextFromReactElement(element) {
  if (typeof element === "string") {
    return element; // Base case: Direct text value
  } else if (Array.isArray(element)) {
    return element.map(extractTextFromReactElement).join(" "); // Handle multiple children
  } else if (element && typeof element === "object" && element.$$typeof) {
    return element.props?.children
      ? extractTextFromReactElement(element.props.children)
      : "";
  }
  return "";
}


const getCreatedByName = (userFieldType) => {
  const userInfo = JSON.parse(localStorage.getItem("user")) || {};
  if (userFieldType === "appraiserCompany_Datails") {
    return `${userInfo?.[userFieldType]?.firstName || "John"} ${
      userInfo?.[userFieldType]?.lastName || "Doe"
    }`;
  }
  if (userFieldType === "broker_Details") {
    return `${userInfo?.[userFieldType]?.firstName || "John"} ${
      userInfo?.[userFieldType]?.lastName || "Doe"
    }`;
  }
  if (userFieldType === "appraiser_Details") {
    return `${userInfo?.[userFieldType]?.firstName || "John"} ${
      userInfo?.[userFieldType]?.lastName || "Doe"
    }`;
  }
  if (userFieldType === "brokerage_Details") {
    return `${userInfo?.[userFieldType]?.assistantFirstName || "John"} ${
      userInfo?.[userFieldType]?.assistantLastName || "Doe"
    }`;
  }
  return `John Doe`;
};

function getFormattedDate() {
  const date = new Date();
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function UserNameLinkData(element) {
  if (!element || typeof element !== "object") return undefined;
  if (element.props?.children) {
    if (typeof element.props.children === "string") {
      return element.props.children;
    } else if (typeof element.props.children === "object") {
      return UserNameLinkData(element.props.children); 
    }
  }

  return undefined;
}


export const getTheDownloadView = (userFieldType, allData, pdfTitle, staticHeaders) => {
  return new Promise((resolve, reject) => {
    try {
      const printContent = `

        <html>
          <head>
            <script>
              document.title = "PDF";
            </script>
            <style>
              @media print {
                @page {
                  size: A4 landscape;
                  margin: 0;
                }
                .footer {
                  position: fixed;
                  left: 0;
                  right: 0;
                  bottom: 0;
                }
                .table-container {
                  margin-bottom: 100px;
                }
              }
              .pdf-container {
                display: flex;
                flex-direction: column;
                align-items: center;
                width: 100%;
              }
              .header {
                width: 100%;
                padding: 10px;
                text-align: center;
              }
              .logo {
                height: 70px;
                width: 80px;
              }
              .table-container {
                width: 100%;
              }
              table {
                width: 100%;
                border-collapse: collapse;
              }
              th, td {
                border: 1px solid #ddd;
                padding: 10px;
                text-align: left;
              }
              .footer {
                width: 100%;
                text-align: center;
                padding-top: 10px;
                font-size: 12px;
              }
            </style>
          </head>
          <body>
            <div class="pdf-container">
              <div class="header">
                <img src="/assets/images/Appraisal_Land_Logo.png" alt="Company Logo" class="logo" />
                <h3>${pdfTitle}</h3>
              </div>
              <div class="table-container">
                <table>
                  <thead>
                    <tr>
                      ${staticHeaders
                        .map((header) => `<th>${header[1]}</th>`)
                        .join("")}
                    </tr>
                  </thead>
                  <tbody>
                    ${allData
                      .map((item) => `
                        <tr>
                          ${staticHeaders
                            .map((header) => {
                              if (
                                header[0].toLowerCase() === "appraisal_status" ||
                                header[0].toLowerCase() === "status" ||
                                header[0]?.toLowerCase() === "assigned_appraiser"
                              ) {
                                const value = item[header[0].toLowerCase()];
                                const className = value.props.className;
                                const content = header[0].toLowerCase() === "appraisal_status" &&
                                  !String(value.props.children).toLowerCase().includes("n.a")
                                  ? extractTextFromReactElement(value.props.children)?.split("Current Status")[0]
                                  : value.props.children;
                                const color = className.includes("btn-warning")
                                  ? "#E4A11B"
                                  : className.includes("btn-danger")
                                  ? "#DC4C64"
                                  : className.includes("btn-success")
                                  ? "#14A44D"
                                  : "#54B4D3";
                                return `<td style="color: ${color};">${content}</td>`;
                              }if (
                                header[0].toLowerCase() === "broker" 
                              ) {
                                const value = item[header[0].toLowerCase()];
                                // const className = value.props.className;
                                const content = UserNameLinkData(value);
                                const color = "#54B4D3";
                                return `<td style="color: ${color};">${content}</td>`;
                              } else {
                                const updatedValue = item[header[0].toLowerCase()];
                                return `<td>${updatedValue == undefined ? "N.A." : updatedValue}</td>`;
                              }
                            })
                            .join("")}
                        </tr>
                      `)
                      .join("")}
                  </tbody>
                </table>
              </div>
              <div class="footer">
                <p>© ${new Date().getFullYear()} 
                  <a href="https://appraisalland.ca/" target="_blank" style="color: #2e008b; text-decoration: none">
                    Appraisal Land
                  </a>. All Rights Reserved. 
                  <span>Created by: ${getCreatedByName(userFieldType)}</span>
                  <span>Created on: ${getFormattedDate()}</span>
                </p>
              </div>
            </div>
          </body>
        </html>
      `;

      const printWindow = window.open("", "", "width=1200,height=800");

      if (!printWindow) {
        reject(new Error("Failed to open print window"));
        return;
      }

      printWindow.document.open();
      printWindow.document.write(printContent);
      printWindow.document.close();

      printWindow.onload = function () {
        printWindow.print();

        // Track when the print dialog is opened
        printWindow.onbeforeprint = () => {
          console.log("Print dialog opened");
        };

        // Track when the print dialog is closed (printed or canceled)
        printWindow.onafterprint = () => {
          console.log("Print dialog closed");
          printWindow.close(); // Close the popup
          resolve("Print dialog closed");
        };

        // Fallback: Close the window if the user cancels manually
        setTimeout(() => {
          if (!printWindow.closed) {
            printWindow.close();
            resolve("Print dialog closed");
          }
        }, 500); // Close after 5 seconds if still open
      };
    } catch (error) {
      console.error({ error });
      reject(new Error("Error handling print"));
    }
  });
};

