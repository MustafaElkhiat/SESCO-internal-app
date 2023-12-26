"use client";

import React, { useState, useEffect } from "react";
import { Truck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/heading";
import SortOptions from "./components/contractors-sorting";
import NewContractor from "./components/contractor-new-modal";
import UpdateContractor from "./components/contractor-update-modal";
import DeleteContractor from "./components/contractor-delete-modal";
import Pagination from "@/components/pagination";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";
import Filters from "@/components/filteration";

import { toast } from "react-toastify";

import useSWR from "swr";
import { POSTAPI, PUTAPI } from "/utities/test";
import LoadingAnimation from "../../../../components/LoadingAnimation"; // Adjust the path accordingly


export default function UserContractor() {
  const [filteredContractors, setFilteredContractors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const contractorsPerPage = 18;
  const [sortOption, setSortOption] = useState("");
  const [originalContractors, setOriginalContractors] = useState([]);
  // const [selectedContractor, setSelectedContractor] = useState(null);
  const [numTrucks, setNumTrucks] = useState(0); // Initialize with 0
  const [numDrivers, setNumDrivers] = useState(0); // Initialize with 0

  const [storedContractors, setStoredContractors] = useState([]);

  const fetcher = (url) => fetch(url).then((res) => res.json());

  const { data, error, isLoading } = useSWR(
    "https://10.1.114.43:3030/api/contractor",
    fetcher
  );

  useEffect(() => {
    setStoredContractors(data || []);
    setFilteredContractors(data || []);
  }, [data]);

  const searchContractors = (searchValue) => {
    setFilteredContractors(
      storedContractors.filter(
        (contractor) =>
          contractor.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          contractor.code.toLowerCase().includes(searchValue.toLowerCase())
      )
    );
  };

  const handleAPIAddContractor = async (newContractor) => {
    try {
      const result = await POSTAPI("/api/contractor", newContractor);

      if (result.statusCode === 400 && result.message.includes("code")) {
        // Handle validation error
        // toast
      } else {
        setFilteredContractors([...filteredContractors, result]);
        //toast
        toast.success("Contractor created successfully!", {
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
      console.error("Error adding contractor:", error);
      // Handle error
      toast.error("Contractor not created!", {
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

  const handleAPIUpdateContractor = async (updatedContractor) => {
    try {
      const { _id, code, ...contractor } = updatedContractor;
      const result = await PUTAPI("/api/contractor/" + _id, contractor);

      if (result.statusCode === 400 && result.message.includes("code")) {
        // Handle validation error
        // toast
      } else {
        setFilteredContractors(
          filteredContractors.map((contractor) =>
            contractor._id === _id ? updatedContractor : contractor
          )
        );
        //toast
        toast.success("Contractor updated successfully!", {
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
      console.error("Error updating contractor:", error);
      // Handle error
    }
  };

  const addSubsCount = (contractor) => {
    const contractorSubs =
      JSON.parse(localStorage.getItem(`subs_${contractor.id}`)) || [];
    contractor.subs = contractorSubs.length;
    return contractor;
  };
  const filterContractors = (filterValue) => {
    console.log("Filter Value:", filterValue);

    if (filterValue === "") {
      setFilteredContractors(originalContractors);
      setCurrentPage(1);
    } else {
      const lowerCaseFilterValue = filterValue.toLowerCase();
      const filtered = originalContractors.filter((contractor) => {
        const nameMatch =
          contractor.name &&
          contractor.name.toLowerCase().includes(lowerCaseFilterValue);
        const codeMatch =
          contractor.code &&
          contractor.code.toLowerCase().includes(lowerCaseFilterValue);

        console.log("Name Match:", nameMatch);
        console.log("Code Match:", codeMatch);

        return nameMatch || codeMatch;
      });

      console.log("Filtered Contractors:", filtered);

      setFilteredContractors(filtered);
      setCurrentPage(1);
    }
  };

  const sortContractors = (option) => {
    let sortedContractors = [...filteredContractors];

    switch (option) {
      case "name":
        sortedContractors.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "code":
        sortedContractors.sort((a, b) => a.code.localeCompare(b.code));
        break;

      default:
        // No sorting
        break;
    }

    setFilteredContractors(sortedContractors);
  };

  const handleSortChange = (sortValue) => {
    setSortOption(sortValue);
    sortContractors(sortValue);
  };

  const indexOfLastContractor = currentPage * contractorsPerPage;
  const indexOfFirstContractor = indexOfLastContractor - contractorsPerPage;
  const currentContractors = filteredContractors.slice(
    indexOfFirstContractor,
    indexOfLastContractor
  );
  const totalPages = Math.ceil(filteredContractors.length / contractorsPerPage);

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

  const handleContractorCreated = (newContractor) => {
    newContractor.id = uuidv4();

    // Debug: Log the sub-contracts associated with the new contractor
    const subContracts =
      JSON.parse(localStorage.getItem(`s_${newContractor.id}`)) || [];
    console.log("Sub-contracts for the new contractor:", subContracts);

    // Calculate the number of trucks and drivers based on sub-contracts
    newContractor.trucks = subContracts.length;
    newContractor.drivers = subContracts.reduce(
      (total, subContract) => total + subContract.drivers,
      0
    );

    const updatedContractors = [...filteredContractors, newContractor];
    setFilteredContractors(updatedContractors);
    localStorage.setItem("contractors", JSON.stringify(updatedContractors));
  };

  const handleUpdateContractor = (updatedContractor) => {
    const contractorIndex = filteredContractors.findIndex(
      (contractor) => contractor.id === updatedContractor.id
    );

    if (contractorIndex !== -1) {
      const updatedContractors = [...filteredContractors];
      updatedContractors[contractorIndex] = updatedContractor;
      setFilteredContractors(updatedContractors);
      localStorage.setItem("contractors", JSON.stringify(updatedContractors));
    }
  };

  const handleDeleteContractor = (contractor) => {
    const updatedContractors = filteredContractors.filter(
      (q) => q.id !== contractor.id
    );
    setFilteredContractors(updatedContractors);
    localStorage.setItem("contractors", JSON.stringify(updatedContractors));
  };

  // const handleCardClick = (contractor) => {
  //   setSelectedContractor(contractor);
  //   router.push(`/contractor/${contractor.id}`);
  // };

  const handleFilterChange = (e) => {
    const filterValue = e.target.value;
    console.log("Filter Value in Filters Component:", filterValue);
    onFilterChange(filterValue);
  };

  if (isLoading) return <LoadingAnimation />;


  return (
    <div className="">
      <Heading
        title="Contractor Management"
        description="Managing Your Contractor Network."
        icon={Truck}
        iconColor="text-sky-700"
      />

      <div className="px-4 md:px-12 flex flex-col md:flex-row mt-8 justify-start items-center ">
        <div className="flex-1 mb-4 ">
          <NewContractor
            contractors={filteredContractors}
            onContractorCreated={handleAPIAddContractor}
          />
        </div>
        <div className="mb-4 ml-2">
          <SortOptions
            sortOption={sortOption}
            onSortChange={handleSortChange}
          />
        </div>
        <div className="mb-4">
          <Filters onFilterChange={searchContractors} />
        </div>
      </div>

      <div className="px-4 md:px-12  grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
        {currentContractors.map((contractor, index) => (
          <Card
            key={index}
            className="p-4 border-2 border-gray-900 rounded-2xl flex flex-col mt-4 shadow-md hover:shadow-xl transition "
          >
            <Link
              href={`/contractors/${contractor._id}`}
              key={index}
              legacyBehavior
            >
              <div className="  flex items-center cursor-pointer justify-end mb-4 ">
                <div className="w-full  ">
                  <div className="flex text-lg rounded-xl mb-2 bg-gray-100 shadow-lg p-2 border-2 border-gray-700 items-center justify-center rounded-t-2xl font-semibold">
                    {/* <div className="text-left text-sm ">Name:</div> */}
                    <div className="flex  ">
                      {contractor.name || "..........."}
                    </div>
                  </div>
                  <div className="flex justify-between shadow-md p-2">
                    <div className="text-left text-sm">Code:</div>
                    <div className="text-right ">
                      {contractor.code || "..........."}
                    </div>
                  </div>
                </div>
              </div>

              {/* <div className="flex flex-col items-center justify-end mb-4 p-1 shadow-md rounded-full cursor-pointer">
                <div className="text-center font-semibold text-xl ">
                  <a>{contractor.name}</a>
              </div>
              <div className="text-center text-sm">Code:  {contractor.code}</div>
            </div> */}
            </Link>

            {/* Display numTrucks and numDrivers */}
            {/* <div className="flex justify-between mb-3">
              <div className="text-sm">
                Number of Trucks: <span className="font-bold">{contractor.trucks}</span>
              </div>
              <TruckIcon className="mr-2" />
            </div> */}

            {/* <div className="flex justify-between mb-3">
              <div className="text-sm">
                Number of Drivers: <span className="font-bold">{contractor.drivers}</span>
              </div>
              <UserCheck className="mr-2" />
            </div> */}

            <div className="flex justify-center px-1 ">
              <UpdateContractor
                contractor={contractor}
                onUpdateContractor={handleAPIUpdateContractor}
              />
              {/* <DeleteContractor
                contractor={contractor}
                onDeleteContractor={() => handleDeleteContractor(contractor)}
              /> */}
            </div>
          </Card>
        ))}
      </div>

      <Pagination
        currentUsers={currentContractors}
        currentPage={currentPage}
        totalPages={totalPages}
        goToPreviousPage={goToPreviousPage}
        goToNextPage={goToNextPage}
      />
    </div>
  );
}
