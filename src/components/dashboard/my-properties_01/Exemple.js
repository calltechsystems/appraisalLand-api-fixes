import SmartTable from "./SmartTable";
// import "./SmartTable.css";

const headCells = [
  {
    id: "email",
    numeric: false,
    label: "Property Title",
    width: 200,
  },
  {
    id: "name",
    numeric: false,
    label: "Date",
    width: 50,
  },
  {
    id: "phone",
    numeric: false,
    label: "Status",
    width: 80,
  },
  {
    id: "subject",
    numeric: false,
    label: "Bids",
    width: 80,
  },
  {
    id: "message",
    numeric: false,
    label: "Actions",
    width: 100,
  },
];

const data = [
  {
    _id: "6144e83a966145976c75cdfe",
    email: "minagerges123@gmail.com",
    name: "Mina",
    phone: "+96170345114",
    subject: "test",
    message: "ahlannn",
    date: "2021-09-17 19:10:50",
  },
  {
    _id: "61439914086a4f4e9f9d87cd",
    email: "amineamine1996@gmail.com",
    name: "amine amine",
    phone: "+96176466341",
    subject: "12121",
    message: "121212121212121",
    date: "2021-09-16 22:20:52",
  },
  {
    _id: "61439887086a4f4e9f9d87cc",
    email: "as@a.com",
    name: "as",
    phone: "+96176466341",
    subject: "as",
    message: "as",
    date: "2021-09-16 22:18:31",
  },
  {
    _id: "6143985d086a4f4e9f9d87cb",
    email: "amineamine19961996@gmail.com",
    name: "amine amine",
    phone: "+96176466341",
    subject: "1234",
    message: "sdsdsd",
    date: "2021-09-16 22:17:49",
  },
  {
    _id: "614397edcbfc69177da008c8",
    email: "amine@amine.com",
    name: "amine",
    phone: "+334343439393993",
    subject: "1234",
    message: "3434",
    date: "2021-09-16 22:15:57",
  },
  {
    _id: "6144e83a966145976c75cdfe",
    email: "minagerges123@gmail.com",
    name: "Mina",
    phone: "+96170345114",
    subject: "test",
    message: "ahlannn",
    date: "2021-09-17 19:10:50",
  },
  {
    _id: "61439914086a4f4e9f9d87cd",
    email: "amineamine1996@gmail.com",
    name: "amine amine",
    phone: "+96176466341",
    subject: "12121",
    message: "121212121212121",
    date: "2021-09-16 22:20:52",
  },
  {
    _id: "61439887086a4f4e9f9d87cc",
    email: "as@a.com",
    name: "as",
    phone: "+96176466341",
    subject: "as",
    message: "as",
    date: "2021-09-16 22:18:31",
  },
  {
    _id: "6143985d086a4f4e9f9d87cb",
    email: "amineamine19961996@gmail.com",
    name: "amine amine",
    phone: "+96176466341",
    subject: "1234",
    message: "sdsdsd",
    date: "2021-09-16 22:17:49",
  },
  {
    _id: "6144e83a966145976c75cdfe",
    email: "minagerges123@gmail.com",
    name: "Mina",
    phone: "+96170345114",
    subject: "test",
    message: "ahlannn",
    date: "2021-09-17 19:10:50",
  },
  {
    _id: "61439914086a4f4e9f9d87cd",
    email: "amineamine1996@gmail.com",
    name: "amine amine",
    phone: "+96176466341",
    subject: "12121",
    message: "121212121212121",
    date: "2021-09-16 22:20:52",
  },
  {
    _id: "61439887086a4f4e9f9d87cc",
    email: "as@a.com",
    name: "as",
    phone: "+96176466341",
    subject: "as",
    message: "as",
    date: "2021-09-16 22:18:31",
  },
  {
    _id: "6143985d086a4f4e9f9d87cb",
    email: "amineamine19961996@gmail.com",
    name: "amine amine",
    phone: "+96176466341",
    subject: "1234",
    message: "sdsdsd",
    date: "2021-09-16 22:17:49",
  },
  {
    _id: "6144e83a966145976c75cdfe",
    email: "minagerges123@gmail.com",
    name: "Mina",
    phone: "+96170345114",
    subject: "test",
    message: "ahlannn",
    date: "2021-09-17 19:10:50",
  },
  {
    _id: "61439914086a4f4e9f9d87cd",
    email: "amineamine1996@gmail.com",
    name: "amine amine",
    phone: "+96176466341",
    subject: "12121",
    message: "121212121212121",
    date: "2021-09-16 22:20:52",
  },
  {
    _id: "61439887086a4f4e9f9d87cc",
    email: "as@a.com",
    name: "as",
    phone: "+96176466341",
    subject: "as",
    message: "as",
    date: "2021-09-16 22:18:31",
  },
  {
    _id: "6143985d086a4f4e9",
    email: "ppppppp6@gmail.com",
    name: "amine amine",
    phone: "+96176466341",
    subject: "1234",
    message: "sdsdsd",
    date: "2021-09-16 22:17:49",
  },
  {
    _id:"8765",
    email:"deep@gmail.com",
    name: "deep",
    phone: "9898969598",
    subject: "aaaa",
    message: "aaaa",
    date: "2021-12-19 21:00:49",
  }
];

export default function Exemple() {
  return (
    <SmartTable
      title="Emails"
      data={data}
      headCells={headCells}
      // url="/api/admin/emails"
      // searchDebounceTime={800}
      // noPagination
    />
  );
}
