import React, { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import NewTruck from "./truck-new";
import UpdateTruck from "./truck-update";
import ReturnTruckFromMaintenance from "./truck-return-from-maintenance-modal";
import FilterTrucks from "./filter-trucks";
import Filters from "@/components/filteration";

import useSWR from "swr";
import { POSTAPI, PUTAPI } from "/utities/test";
import { contractors } from "@/constants";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TrucksData = ({
  selectedContractor,
  onTruckCreated,
  onUpdateTruck,
  onReturnTruck,
}) => {
  // State for the general filter (search by code, name, type, or license)
  const [generalFilterValue, setGeneralFilterValue] = useState("");

  // State for the specific truck filter (available, not available, maintenance)
  const [truckStatusFilter, setTruckStatusFilter] = useState("");

  // State to store filtered trucks based on both filters
  const [filteredTrucks, setFilteredTrucks] = useState([]);

  const [contractor, setContractor] = useState(null);

  useEffect(() => {
    setContractor(selectedContractor);
    setFilteredTrucks(selectedContractor.truckList);
  }, [selectedContractor]);

  const handleAPIAddTruck = async (newTruck) => {
    try {
      const result = await POSTAPI(
        "/api/contractor/" + contractor.code + "/truck",
        newTruck
      );

      if (result.statusCode == 403) {
        result.message.forEach((message) => {
          toast.error(message.message, {
            position: toast.POSITION.TOP_RIGHT,
            style: {
              background: "#8acaff", // Background color
              color: "#ffffff", // Text color
              boxShadow:
                "0 2px 4px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.1)", // Box shadow
              borderRadius: "12px 0  12px 0",
              width: "96%",
              fontSize: "bold",
              marginTop: "4px",
              marginBottom: "4px",
            },
          });
        });
      } else {
        setContractor(result);
        onTruckCreated(result);
        setFilteredTrucks(result.truckList);
        //setFilteredTrucks([...filteredTrucks, result]);
        //toast
        toast.success("New Truck created successfully!", {
          position: toast.POSITION.TOP_RIGHT,
          style: {
            background: "#8acaff", // Background color
            color: "#ffffff", // Text color
            boxShadow:
              "0 2px 4px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.1)", // Box shadow
            borderRadius: "12px 0  12px 0",
            width: "96%",
            fontSize: "bold",
          },
        });
      }
    } catch (error) {
      // Handle error
      toast.error(message.message, {
        position: toast.POSITION.TOP_RIGHT,
        style: {
          background: "#8acaff", // Background color
          color: "#ffffff", // Text color
          boxShadow:
            "0 2px 4px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.1)", // Box shadow
          borderRadius: "12px 0  12px 0",
          width: "96%",
          fontSize: "bold",
          marginTop: "4px",
          marginBottom: "4px",
        },
      });
    }
  };
  // const handleAPIUpdateTruck = async (updatedTruck) => {
  //   try {
  //     const result = await PUTAPI(
  //       "/api/contractor/" + contractor.code + "/truck",
  //       updatedTruck
  //     );

  //     if (result.statusCode === 400 && result.message.includes("code")) {
  //       // Handle validation error
  //       // toast
  //     } else {
  //       setContractor(result);
  //       setFilteredTrucks(result.truckList);
  //       //setFilteredTrucks([...filteredTrucks, result]);
  //       //toast

  //       toast.success("New Truck created successfully!", {
  //         position: toast.POSITION.TOP_RIGHT,
  //         style: {
  //           background: "#8acaff", // Background color
  //           color: "#ffffff", // Text color
  //           boxShadow:
  //             "0 2px 4px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.1)", // Box shadow
  //           borderRadius: "12px 0  12px 0",
  //           width: "96%",
  //           fontSize: "bold",
  //         },
  //       });
  //     }
  //   } catch (error) {
  //     // Handle error
  //     toast.error(message.message, {
  //       position: toast.POSITION.TOP_RIGHT,
  //       style: {
  //         background: "#8acaff", // Background color
  //         color: "#ffffff", // Text color
  //         boxShadow:
  //           "0 2px 4px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.1)", // Box shadow
  //         borderRadius: "12px 0  12px 0",
  //         width: "96%",
  //         fontSize: "bold",
  //         marginTop: "4px",
  //         marginBottom: "4px",
  //       },
  //     });
  //   }
  // };

  const searchTrucks = (searchValue) => {
    setFilteredTrucks(
      selectedContractor.truckList.filter(
        (truck) =>
          truck.number.toLowerCase().includes(searchValue.toLowerCase()) ||
          truck.truckLicense
            .toLowerCase()
            .includes(searchValue.toLowerCase()) ||
          truck.truckType.toLowerCase().includes(searchValue.toLowerCase()) ||
          truck.truckStatus.toLowerCase().includes(searchValue.toLowerCase())
      )
    );
  };



  const handleReturnTruck = useCallback(
    (truck) => {
      // Callback when a truck is deleted
      onReturnTruck(truck);
    },
    [onReturnTruck]
  );

  const handleGeneralFilterChange = useCallback((value) => {
    // Callback for the general filter (code, name, type, license)
    setGeneralFilterValue(value);
  }, []);

  const handleTruckStatusFilterChange = useCallback((status) => {
    // Callback for the truck status filter (available, not available, maintenance)
    searchTrucks(status);
  }, []);

  return (
    <div className="border-black/5 transition rounded-xl overflow-hidden">
        <div className="px-4 md:px-12 flex flex-col md:flex-row mt-8 justify-start items-center ">
        <div className="flex-1 mb-4 ">
        <NewTruck
            trucks={contractor ? contractor.truckList : []}
            onTruckCreated={handleAPIAddTruck}
          />
        </div>
        <div className="mb-4  cursor-pointer">
          <FilterTrucks onFilterChange={handleTruckStatusFilterChange} />
        </div>
        <div className="mb-4  ">

        <Filters onFilterChange={searchTrucks} />

        </div>
      </div>

      <div className="px-4 md:px-12 mt-4 mb-4 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
        {filteredTrucks.map((truck) => (
          <Card
            key={truck.truckLicense}
            className="p-4 border-black/5 flex flex-col shadow-md hover:shadow-xl transition rounded-2xl"
          >
            <div className="flex items-center justify-end mb-4">
              <div className="w-full  ">
              <div className="flex text-lg  mb-2 bg-gray-100 shadow-lg p-2 items-center justify-center rounded-2xl font-semibold">
                  {/* <div className="text-left  ">code:</div> */}
                  <div className="flex  ">{truck.number || "..........."}</div>
                </div>
                <div
                 className="flex justify-between mb-2 shadow-md p-2">
                  <div className="text-left ">license:</div>
                  <div className="text-right ">
                    {truck.truckLicense || "..........."}
                  </div>
                </div>
                <div className="flex justify-between mb-2 shadow-md p-2">
                  <div className="text-left ">type:</div>
                  <div className="text-right ">
                  {truck.truckType ? truck.truckType.toLowerCase() : "..........."}
                  </div>
                </div>
                <div className="flex justify-between mb-2 shadow-md p-2">
                  <div className="text-left ">status:</div>
                  <div className="text-right ">
                  {truck.truckStatus ? truck.truckStatus.toLowerCase() : "..........."}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center items-center  ">
              {/* <UpdateTruck truck={truck} onUpdateTruck={handleUpdateTruck} /> */}
              {truck.truckStatus === "IN_MAINTENANCE" && (
                <ReturnTruckFromMaintenance
                  returnedTruck={truck}
                  onReturnTruck={() => handleReturnTruck(truck)}
                />
              )}
            </div>
          </Card>
        ))}
      </div>
      <ToastContainer autoClose={3000} />
    </div>
  );
};

export default TrucksData;
