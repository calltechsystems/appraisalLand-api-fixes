import { useEffect, useState } from "react";
import SmartTable from "./SmartTable";

const headCells = [
  {
    id: "sno",
    numeric: false,
    label: "S. No",
    width: 50,
  },
  {
    id: "id",
    numeric: false,
    label: "Transaction ID / Payment ID",
    width: 150,
  },
  {
    id: "planName",
    numeric: false,
    label: "Selected Plan",
    width: 100,
  },
  {
    id: "planType",
    numeric: false,
    label: "Plan Type",
    width: 100,
  },
  {
    id: "st_date",
    numeric: false,
    label: "Start / Purchase Date",
    width: 140,
  },
  {
    id: "end_date",
    numeric: false,
    label: "End Date",
    width: 140,
  },
  {
    id: "amount",
    numeric: false,
    label: "Amount",
    width: 100,
  },
  {
    id: "status",
    numeric: false,
    label: "Status",
    width: 200,
  },
];

export default function Exemple({
  data,
  dataFetched,
  setDataFetched
}) {
  const [updatedData, setUpdatedData] = useState([]);
  const [properties, setProperties] = useState([]);
  const [show, setShow] = useState(false);
  let tempData = [];

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour12: true, 
    };

    const formattedDate = new Date(dateString).toLocaleString("en-US", options);
    return formattedDate;
  };

  useEffect(() => {
    if (data.result) {
      if ((data?.result?.$values).length === 0) {
        setDataFetched(true);
      }
    }
  }, [data]);

  const sortObjectsByOrderIdDescending = (data) => {
    return data.sort((a, b) => {
      const dateA = new Date(a.status);
      const dateB = new Date(b.status);
      return dateB - dateA;
    });
  };

  const sortFunction = (hisotries) => {
    const data = hisotries;
    data?.sort((a, b) => {
      const startDateA = new Date(a.startDate);
      const startDateB = new Date(b.startDate);

      if (startDateA < startDateB) return -1;
      if (startDateA > startDateB) return 1;

      const endDateA = new Date(a.endDate);
      const endDateB = new Date(b.endDate);

      if (endDateA < endDateB) return -1;
      if (endDateA > endDateB) return 1;

      return 0;
    });
    return data;
  };

  useEffect(() => {
    const getData = () => {
      const date = formatDate(new Date());
      const sortedData = sortFunction(data);
      sortedData?.map((plan, index) => {

        if (true) {
          const updatedRow = {
            sno: index + 1,
            id: plan.paymentid,
            planName: plan?.planName || "N.A.",
            planType: <span>{plan?.planType}</span>,
            amount: plan.planAmount ? `$${plan.planAmount}` : "N.A.",
            st_date:
              plan?.planName === "Top Up"
                ? "N.A."
                : formatDate(plan.startDate),
            end_date: formatDate(plan.endDate),
            remained_prop: `${
              plan.usedProperties === null ? 0 : plan.usedProperties
            } of ${plan.noOfProperties}`,
            status: !plan.isActive ? (
              <span className="btn btn-info">
                Will Be Active on {formatDate(plan.startDate)}
              </span>
            ) : (
              <span className="btn btn-success" style={{ width: "50%" }}>
                Active
              </span>
            ),
          };
          tempData.push(updatedRow);
        }
      });
      setUpdatedData(tempData);
    };
    getData();
  }, [data]);

  return (
    <>
      {updatedData && (
        <SmartTable
          title=""
          properties={updatedData}
          dataFetched={dataFetched}
          data={sortObjectsByOrderIdDescending(updatedData)}
          headCells={headCells}
        />
      )}
    </>
  );
}
