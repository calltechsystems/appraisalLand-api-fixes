import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import Seo from "../../components/common/seo";
import CreateListing from "../../components/dashboard/create-listing-1";
import { useEffect, useState } from "react";
import axios from "axios";

const Index = () => {
  const router = useRouter();
  const { item } = router.query;
  const [propertyData, setPropertyData] = useState(null);

  useEffect(() => {
    const url = window.location.pathname;

    const propertyOrderId = url.split("/create-listing-1/")[1];
    console.log(propertyOrderId);
    const fetchPropertyData = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem("user"));
        const response = await axios.get("/api/getPropertiesById", {
          headers: {
            Authorization: `Bearer ${userData.token}`,
            "Content-Type": "application/json",
          },
          params: {
            item: propertyOrderId,
          },
        });
        setPropertyData(response.data.data); // Update state with the fetched data
      } catch (err) {
        alert(err.message);
      }
    };

    // Check if item is defined before making the API call
    if (item) {
      fetchPropertyData(); // Call the fetch function
    }
  }, [item]); // Add item as a dependency to trigger the effect when it changes

  return (
    <>
      <Seo pageTitle="Create Listing" />

      {propertyData && (
        <CreateListing isView={true} propertyData={propertyData.property} />
      )}
    </>
  );
};

export default dynamic(() => Promise.resolve(Index), { ssr: false });
