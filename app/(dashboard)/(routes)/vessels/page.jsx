"use client";

import React, { useEffect, useState } from "react";
import { Ship } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/heading";
import { v4 as uuidv4 } from "uuid";
import Link from "next/link";
import Pagination from "@/components/pagination";
import NewVessel from "./components/vessels.new";
import UpdateVessel from "./components/vessel-update";
import DeleteVessel from "./components/vessel-delete-modal";
import Filters from "@/components/filteration";
import SortOptions from "./components/vessel-sort";
import useSWR from "swr";
import { POSTAPI, PUTAPI } from "../../../../utities/test";
import {  toast } from "react-toastify";
import LoadingAnimation from "../../../../components/LoadingAnimation"; // Adjust the path accordingly




export default function VesselsPage() {
  const [filteredVessels, setFilteredVessels] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const vesselsPerPage = 18;
  const [sortOption, setSortOption] = useState("");
  const [originalVessels, setOriginalVessels] = useState([]);
  const [storedVessels, setStoredVessels] = useState([]);

  // useEffect(() => {
  //   const storedVessels = JSON.parse(localStorage.getItem("Vessels")) || [];
  //   setOriginalVessels(storedVessels.map(addSubsCount));
  //   setFilteredVessels(storedVessels.map(addSubsCount));
  // }, []);

  // useEffect(() => {
  //   const storedVessels = JSON.parse(localStorage.getItem("Vessels")) || [];
  //   const updatedVessels = storedVessels.map((vessel) => {
  //     const vesselVoyages =
  //       JSON.parse(localStorage.getItem(`vessels_${vessel.id}`)) || [];
  //     vessel.voyages = vesselVoyages.length;
  //     return vessel;
  //   });
  //   setFilteredVessels(updatedVessels);
  // }, []);

  const fetcher = (url) => fetch(url).then((res) => res.json());

  const { data, error, isLoading } = useSWR(
    "https://10.1.114.43:3030/api/vessel",
    fetcher
  );

  useEffect(() => {
    setStoredVessels(data || []);
    setFilteredVessels(data || []);
  }, [data]);

  const searchVessels = (searchValue) => {
    setFilteredVessels(
      storedVessels.filter(
        (vessel) =>
          vessel.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          vessel.imo.toLowerCase().includes(searchValue.toLowerCase()) ||
          (vessel.grossTonnage &&
            vessel.grossTonnage
              .toString()
              .toLowerCase()
              .includes(searchValue.toLowerCase()))
      )
    );
  };

  const handleAPIAddVessel = async (newVessel) => {
    const vessel = { ...newVessel, grossTonnage: +newVessel.grossTonnage };
    try {
      const result = await POSTAPI("/api/vessel", vessel);
      console.log(result);

      if (result.statusCode === 400 && result.message.includes("code")) {
        // Handle validation error
        // toast
      } else {
        setFilteredVessels([...filteredVessels, result]);
        //toast
        toast.success("New Vessel created successfully!", {
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
      toast.error("Vessel not created.", {
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

  const handleAPIUpdateVessel = async (updatedVessel) => {
    try {
      const { _id, code, ...vessel } = updatedVessel;
      const result = await PUTAPI("/api/vessel/" + _id, vessel);

      if (result.statusCode === 400 && result.message.includes("code")) {
        // Handle validation error
        // toast
      } else {
        setFilteredVessels(
          filteredVessels.map((vessel) =>
            vessel._id === _id ? updatedVessel : vessel
          )
        );
        //toast
        toast.success("Vessel updated successfully!", {
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
    } catch (error) {
      console.error("Error updating vessel:", error);
      // Handle error
      toast.error("Cannot update this vessel.", {
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
  const addSubsCount = (vessel) => {
    const vesselSubs =
      JSON.parse(localStorage.getItem(`subs_${vessel.id}`)) || [];
    vessel.subs = vesselSubs.length;
    return vessel;
  };


  const sortVessels = (option) => {
    let sortedVessels = [...filteredVessels];

    switch (option) {
      case "name":
        sortedVessels.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "IMO":
        sortedVessels.sort((a, b) => a.imo.localeCompare(b.imo));
        break;
      case "tonnage":
        sortedVessels.sort((a, b) => {
          // Convert tonnage values to numbers for numeric comparison
          const tonnageA = parseFloat(a.grossTonnage) || 0;
          const tonnageB = parseFloat(b.grossTonnage) || 0;
          return tonnageB - tonnageA; // Sorting in descending order
        });
        break;

      default:
        // No sorting
        break;
    }

    setFilteredVessels(sortedVessels);
  };

  const handleSortChange = (sortValue) => {
    setSortOption(sortValue);
    sortVessels(sortValue);
  };

  const indexOfLastVessel = currentPage * vesselsPerPage;
  const indexOfFirstVessel = indexOfLastVessel - vesselsPerPage;
  const currentVessels = filteredVessels.slice(
    indexOfFirstVessel,
    indexOfLastVessel
  );
  const totalPages = Math.ceil(filteredVessels.length / vesselsPerPage);

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


  if (isLoading) return <LoadingAnimation />;

  return (
    <div className="">
      <Heading
        title="Vessel Operations"
        description="Navigating Your Vessel Fleet."
        icon={Ship}
        iconColor="text-sky-700"
      />

      <div className="px-4 md:px-12 flex flex-col md:flex-row mt-8 justify-start items-center ">
        <div className="flex-1 mb-4 ">
          <NewVessel
            vessels={filteredVessels}
            onVesselCreated={handleAPIAddVessel}
          />
        </div>
        <div className="mb-4 ml-2">
          <SortOptions
            sortOption={sortOption}
            onSortChange={handleSortChange}
          />
        </div>
        <div className="mb-4">
          <Filters onFilterChange={searchVessels} />
        </div>
      </div>

      <div className="px-4 md:px-12  grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
        {currentVessels.map((vessel, index) => (
          <Card
            key={index}
            className="p-4 border-2 border-gray-900 rounded-2xl flex flex-col mt-4 shadow-md hover:shadow-xl transition "
          >
            <Link href={`/vessels/${vessel._id}`} key={index} legacyBehavior>
              <div className="  flex items-center justify-center mb-4 cursor-pointer ">
                <div className="w-full  ">
                <div className="flex text-lg rounded-xl mb-2 bg-gray-100 shadow-lg p-2 border-2 border-gray-700 items-center justify-center rounded-t-2xl font-semibold">
                    {/* <div className="text-left text-sm ">Name:</div> */}
                    <div className="flex  ">{vessel.name || "..........."}</div>
                  </div>
                  <div className="flex justify-between mb-2 shadow-md p-2">
                    <div className="text-left text-sm">IMO:</div>
                    <div className="text-right ">
                      {vessel.imo || "..........."}
                    </div>
                  </div>
                  <div className="flex justify-between shadow-md p-2">
                    <div className="text-left text-sm">Gross Tonnage:</div>
                    <div className="text-right ">
                      {vessel.grossTonnage || "..........."}
                    </div>
                  </div>
                </div>
              </div>
            </Link>


            <div className="flex justify-center px-1 ">
              <UpdateVessel
                vessel={vessel}
                onUpdateVessel={handleAPIUpdateVessel}
              />
              {/* <DeleteVessel
                vessel={vessel}
                onDeleteVessel={() => handleDeleteVessel(vessel)}
              /> */}
            </div>
          </Card>
        ))}
      </div>

      <Pagination
        currentUsers={currentVessels}
        currentPage={currentPage}
        totalPages={totalPages}
        goToPreviousPage={goToPreviousPage}
        goToNextPage={goToNextPage}
      />
    </div>
  );
}
