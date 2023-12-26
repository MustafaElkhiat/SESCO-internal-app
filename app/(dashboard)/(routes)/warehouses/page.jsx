"use client";

import React, { useEffect, useState } from "react";
import { Store } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/heading";
import Pagination from "@/components/pagination";
import SortOptions from "./components/warehouse-sort";
import NewWarehouse from "./components/warehouse-new";
import UpdateWarehouse from "./components/warehouse-update";
import Filters from "@/components/filteration";
import useSWR from "swr";
import {  toast } from "react-toastify";


import { POSTAPI, PUTAPI } from "../../../../utities/test";

export default function WarehousePage() {
  // States to manage warehouse data, pagination, sorting, and filtering
  const [filteredWarehouses, setFilteredWarehouses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const warehousesPerPage = 18;
  const [sortOption, setSortOption] = useState("");
  const [originalWarehouses, setOriginalWarehouses] = useState([]);

  const [storedWarehouses, setStoredWarehouses] = useState([]);

  const fetcher = (url) => fetch(url).then((res) => res.json());
  // Load warehouses from localStorage on component mount
  // useEffect(() => {
  //   const storedWarehouses = JSON.parse(localStorage.getItem("warehouses")) || [];
  //   setOriginalWarehouses(storedWarehouses.map(addSubsCount));
  //   setFilteredWarehouses(storedWarehouses.map(addSubsCount));
  // }, []);

  const { data, error, isLoading } = useSWR(
    "https://10.1.114.43:3030/api/warehouse",
    fetcher
  );

  useEffect(() => {
    setStoredWarehouses(data || []);
    //setOriginalUsers(storedUsers.map(addSubsCount));
    setFilteredWarehouses(data || []);
  }, [data]);

  const searchWarehouses = (searchValue) => {
    setFilteredWarehouses(
      storedWarehouses.filter(
        (warehouse) =>
          warehouse.number.toLowerCase().includes(searchValue.toLowerCase()) ||
          warehouse.code.toLowerCase().includes(searchValue.toLowerCase()) ||
          warehouse.branch.toLowerCase().includes(searchValue.toLowerCase())
      )
    );
  };
  // Function to add subscription count to warehouses
  const addSubsCount = (warehouse) => {
    const warehouseSubs =
      JSON.parse(localStorage.getItem(`subs_${warehouse.id}`)) || [];
    warehouse.subs = warehouseSubs.length;
    return warehouse;
  };

  // Filter warehouses based on input value
  // const filterWarehouses = (filterValue) => {
  //   if (filterValue === "") {
  //     setFilteredWarehouses(originalWarehouses);
  //     setCurrentPage(1);
  //   } else {
  //     const lowerCaseFilterValue = filterValue.toLowerCase();
  //     const filtered = originalWarehouses.filter((warehouse) => {
  //       return (
  //         warehouse.name.toLowerCase().includes(lowerCaseFilterValue) ||
  //         warehouse.code.toLowerCase().includes(lowerCaseFilterValue) ||
  //         warehouse.branch.toLowerCase().includes(lowerCaseFilterValue) ||
  //         warehouse.location.toLowerCase().includes(lowerCaseFilterValue)
  //       );
  //     });

  //     setFilteredWarehouses(filtered);
  //     setCurrentPage(1);
  //   }
  // };

  // Sort warehouses based on selected option
  const sortWarehouses = (sortValue) => {
    setSortOption(sortValue);

    const sortedWarehouses = [...filteredWarehouses];

    switch (sortValue) {
      case "number":
        sortedWarehouses.sort((a, b) => a.number.localeCompare(b.number));
        break;
      case "code":
        sortedWarehouses.sort((a, b) => a.code.localeCompare(b.code));
        break;
      case "branch":
        sortedWarehouses.sort((a, b) => a.branch.localeCompare(b.branch));
        break;
      default:
        // No sorting
        break;
    }

    setFilteredWarehouses(sortedWarehouses);
    setCurrentPage(1);
  };
  // Handle sort change
  // const handleSortChange = (sortValue) => {
  //   setSortOption(sortValue);
  //   sortWarehouses(sortValue);
  // };

  const handleAPIAddWarehouse = async (newWarehouse) => {
    const warehouse = {
      ...newWarehouse,
      lat: parseInt(newWarehouse.lat),
      long: parseInt(newWarehouse.long),
    };
    const result = await POSTAPI("/api/warehouse", warehouse);
    console.log(result);
    if (result.statusCode === 400) {
      toast.error("Warehouse not created !", {
        position: toast.POSITION.TOP_RIGHT,
        style: {
          background: "#8acaff", // Background color
          color: "#ffffff", // Text color
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.1)", // Box shadow
          borderRadius: "12px 0  12px 0",
          width: "96%",
          fontSize: "bold",
        },
      });
      if (result.message.includes("code")) {
        // toast
        toast.error("New Warehouse code found!", {
          position: toast.POSITION.TOP_RIGHT,
  
          style: {
            background: "#9acaff", // Background color
            color: "#ffffff", // Text color
            boxShadow:
              "0 2px 4px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.1)", // Box shadow
            borderRadius: "12px 0  12px 0",
            width: "98%",
            fontSize: "bold",
          },
        });
      }
    } else {
      setFilteredWarehouses([...filteredWarehouses, result]);
      //toast
      toast.success("New Warehouse created successfully!", {
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
  };



  const handleAPIUpdateWarehouse = async (updatedWarehouse) => {
    const { _id, code, ...warehouse } = updatedWarehouse;
    const wh = { ...warehouse, lat: +warehouse.lat, long: +warehouse.long };
    const result = await PUTAPI("/api/warehouse/" + _id, wh);
    console.log(result);
    if (result.statusCode === 400) {
      if (result.message.includes("code")) {
        // toast
      }
    } else {
      setFilteredWarehouses(
        filteredWarehouses.map((warehouse) =>
          warehouse._id === _id ? updatedWarehouse : warehouse
        )
      );
      //toast
      
    toast.success("Warehouse updated successfully!", {
      position: toast.POSITION.TOP_RIGHT,
      style: {
        background: "#8acaff", // Background color
        color: "#ffffff", // Text color
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.1)", // Box shadow
        borderRadius: "12px 0  12px 0",
        width: "96%",
        fontSize: "bold",
      },
    });
    }
  };

  // Calculate pagination variables
  const indexOfLastWarehouse = currentPage * warehousesPerPage;
  const indexOfFirstWarehouse = indexOfLastWarehouse - warehousesPerPage;
  const currentWarehouses = filteredWarehouses.slice(
    indexOfFirstWarehouse,
    indexOfLastWarehouse
  );
  const totalPages = Math.ceil(filteredWarehouses.length / warehousesPerPage);

  // Pagination functions
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  // JSX content for displaying warehouses, sorting, filters, etc.
  return (
    <div className="">
      {/* Heading for the Warehouse Page */}
      <Heading
        title="Warehouse Logistics"
        description="Streamlining Warehouse Movement."
        icon={Store}
        iconColor="text-sky-700"
      />

      {/* Filtering and sorting options */}
      <div className="px-4 md:px-12 flex flex-col md:flex-row mt-8 justify-start items-center ">
        <div className="flex-1 mb-4 ">
          <NewWarehouse
            warehouses={filteredWarehouses}
            onWarehouseCreated={handleAPIAddWarehouse}
          />
        </div>
        <div className="mb-4 ml-2">
          <SortOptions sortOption={sortOption} onSortChange={sortWarehouses} />
        </div>
        <div className="mb-4 ">
          <Filters onFilterChange={searchWarehouses} />
        </div>
      </div>

      {/* Displaying warehouses */}
      <div className="px-4 md:px-12 mt-4 grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
        {filteredWarehouses.map((warehouse, index) => (
          <Card
            key={warehouse._id} // Make sure to use a unique key for each card
            className="p-4 border-2 border-gray-900 rounded-2xl flex flex-col shadow-md hover:shadow-xl transition "
          >
            {/* Warehouse details */}
            <div className="  flex items-center justify-end mb-4 ">
              <div className="w-full font- ">
              <div className="flex text-lg rounded-xl mb-2 bg-gray-100 shadow-lg p-2 border-2 border-gray-700 items-center justify-center rounded-t-2xl font-semibold">
                  <div className="text-right ">
                    {warehouse.number || ".................."}
                  </div>
                </div>
                <div className="flex justify-between mb-2 shadow-md p-2">
                  <div className="text-left text-md">code:</div>
                  <div className="text-right ">
                    {warehouse.code || ".................."}
                  </div>
                </div>
                <div className="flex justify-between shadow-md p-2">
                  <div className="text-left text-md">lat:</div>
                  <div className="text-right ">
                    {warehouse.lat || ".................."}
                  </div>
                </div>
                <div className="flex justify-between shadow-md p-2">
                  <div className="text-left text-md">long:</div>
                  <div className="text-right ">
                    {warehouse.long || ".................."}
                  </div>
                </div>

                <div className="flex justify-between shadow-md p-2">
                  <div className="text-left text-md">Branch:</div>
                  <div className="text-right ">
                    {warehouse.branch || ".................."}
                  </div>
                </div>
              </div>
            </div>

            {/* UpdateWarehouse component */}
            <div className="flex justify-center ">
              <UpdateWarehouse
                warehouse={warehouse}
                onUpdateWarehouse={handleAPIUpdateWarehouse}
              />
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination component */}
      <Pagination
        currentUsers={currentWarehouses}
        currentPage={currentPage}
        totalPages={totalPages}
        goToPreviousPage={goToPreviousPage}
        goToNextPage={goToNextPage}
      />
    </div>
  );
}
