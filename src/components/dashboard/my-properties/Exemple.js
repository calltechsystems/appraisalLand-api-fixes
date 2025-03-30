import SmartTable from "./SmartTable";
// import "./SmartTable.css";

const headCells = [
  {
    id: "name",
    numeric: false,
    label: "Status",
    width: 200,
  },
  {
    id: "date",
    numeric: false,
    label: "Property Address",
    width: 200,
  },
  {
    id: "subject",
    numeric: false,
    label: "Appraiser",
    width: 200,
  },
  {
    id: "subject",
    numeric: false,
    label: "Quote Amount",
    width: 200,
  },
  {
    id: "date",
    numeric: false,
    label: "Submission Date",
    width: 200,
  },
  {
    id: "date",
    numeric: false,
    label: "Quote Date",
    width: 200,
  },
  {
    id: "message",
    numeric: false,
    label: "Actions",
    width: 200,
  },
];

const data = [
  {
    _id: "6144e83a966145976c75cdfe",
    email: "minagerges123@gmail.com",
    name: "Pending",
    date: "2021-09-17 19:10:50",
    subject: "23456",
    phone: "+96170345114",
    message: "ahlannn",
  },
  {
    _id: "61439914086a4f4e9f9d87cd",
    email: "amineamine1996@gmail.com",
    name: "Completed",
    phone: "+96176466341",
    subject: "12345",
    message: "121212121212121",
    date: "2021-09-16 22:20:52",
  },
  {
    _id: "61439887086a4f4e9f9d87cc",
    email: "as@a.com",
    name: "Progress",
    phone: "+96176466341",
    subject: "54321",
    message: "as",
    date: "2021-09-16 22:18:31",
  },
];

export default function Exemple() {
  return (
    <SmartTable
      title=""
      data={data}
      headCells={headCells}
      // url="/api/admin/emails"
      // searchDebounceTime={800}
      // noPagination
    />
  );
}
