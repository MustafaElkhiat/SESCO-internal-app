"use client";

import React, { useEffect, useState } from "react";
import { Combine, LandPlot } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

import { Card } from "@/components/ui/card";
import { Heading } from "@/components/heading";
import Pagination from "@/components/pagination";
import Filters from "@/components/filteration";
import SortOptions from "./component/berth-sort";
import NewBerth from "./component/berth-new";
import UpdateBerth from "./component/berth-update";
import useSWR from "swr";
import { toast } from "react-toastify";

import { POSTAPI, PUTAPI } from "../../../../utities/test";

export default function BerthPage() {
  const [filteredBerths, setFilteredBerths] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const berthsPerPage = 16;
  const [sortOption, setSortOption] = useState("");
  const [originalBerths, setOriginalBerths] = useState([]);
  const [storedBerths, setStoredBerths] = useState([]);

  const fetcher = (url) => fetch(url).then((res) => res.json());

  const { data, error, isLoading } = useSWR(
    "https://10.1.114.43:3030/api/berth",
    fetcher
  );

  // useEffect(() => {
  //   const storedBerths = JSON.parse(localStorage.getItem("berths")) || [];
  //   setOriginalBerths(storedBerths.map(addSubsCount));
  //   setFilteredBerths(storedBerths.map(addSubsCount));
  // }, []);

  // useEffect(() => {
  //   const storedBerths = JSON.parse(localStorage.getItem("berths")) || [];
  //   const updatedBerths = storedBerths.map(addSubsCount);
  //   setFilteredBerths(updatedBerths);
  // }, []);

  useEffect(() => {
    setStoredBerths(data || []);
    //setOriginalUsers(storedUsers.map(addSubsCount));
    setFilteredBerths(data || []);
  }, [data]);

  const searchBerths = (searchValue) => {
    setFilteredBerths(
      storedBerths.filter(
        (berth) =>
          berth.number.toLowerCase().includes(searchValue.toLowerCase()) ||
          berth.code.toLowerCase().includes(searchValue.toLowerCase()) ||
          berth.branch.toLowerCase().includes(searchValue.toLowerCase())
      )
    );
  };

  // const filterBerths = (filterValue) => {
  //   if (filterValue === "") {
  //     setFilteredBerths(originalBerths);
  //     setCurrentPage(1);
  //   } else {
  //     const lowerCaseFilterValue = filterValue.toLowerCase();
  //     const filtered = originalBerths.filter((berth) => {
  //       return (
  //         berth.name.toLowerCase().includes(lowerCaseFilterValue) ||
  //         berth.code.toLowerCase().includes(lowerCaseFilterValue) |
  //           berth.branch.toLowerCase().includes(lowerCaseFilterValue) ||
  //         berth.location.toLowerCase().includes(lowerCaseFilterValue)
  //       );
  //     });

  //     setFilteredBerths(filtered);
  //     setCurrentPage(1);
  //   }
  // };

  const sortBerths = (sortValue) => {
    setSortOption(sortValue);

    const sortedBerths = [...filteredBerths];

    switch (sortValue) {
      case "number":
        sortedBerths.sort((a, b) => a.number.localeCompare(b.number));
        break;
      case "code":
        sortedBerths.sort((a, b) => a.code.localeCompare(b.code));
        break;
      case "branch":
        sortedBerths.sort((a, b) => a.branch.localeCompare(b.branch));
        break;
      default:
        // No sorting
        break;
    }

    setFilteredBerths(sortedBerths);
    setCurrentPage(1);
  };

  // const handleSortChange = (sortValue) => {
  //   setSortOption(sortValue);
  //   sortBerths(sortValue);
  // };

  const handleBerthCreated = (newBerth) => {
    newBerth.id = uuidv4();
    newBerth.subs = 0;

    const updatedBerths = [...filteredBerths, newBerth];
    setFilteredBerths(updatedBerths);
    setOriginalBerths(updatedBerths);
    localStorage.setItem("berths", JSON.stringify(updatedBerths));
  };

  const handleAPIAddBerth = async (newBerth) => {
    const berth = {
      ...newBerth,
      lat: parseInt(newBerth.lat),
      long: parseInt(newBerth.long),
    };
    const result = await POSTAPI("/api/berth", berth);
    if (result.statusCode === 400) {
      toast.error("Berth not created !", {
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
      if (result.message.includes("code")) {
        // toast
        toast.error("New Berth code found!", {
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
      setFilteredBerths([...filteredBerths, result]);
      //toast
      toast.success("New Berth created successfully!", {
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
  };

  const handleAPIUpdateBerth = async (updatedBerth) => {
    const { _id, code, ...berth } = updatedBerth;
    const wh = { ...berth, lat: +berth.lat, long: +berth.long };
    const result = await PUTAPI("/api/berth/" + _id, wh);
    if (result.statusCode === 400) {
      if (result.message.includes("code")) {
        // toast
      }
    } else {
      setFilteredBerths(
        filteredBerths.map((berth) =>
          berth._id === _id ? updatedBerth : berth
        )
      );
      //toast
      toast.success("Berth updated successfully!", {
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
  };

  // const handleDeleteBerth = (berth) => {
  //   const updatedBerths = filteredBerths.filter(
  //     (q) => q.id !== berth.id
  //   );
  //   setFilteredBerths(updatedBerths);
  //   setOriginalBerths(updatedBerths);
  //   localStorage.setItem("berths", JSON.stringify(updatedBerths));
  // };

  const indexOfLastBerth = currentPage * berthsPerPage;
  const indexOfFirstBerth = indexOfLastBerth - berthsPerPage;
  const currentBerths = filteredBerths.slice(
    indexOfFirstBerth,
    indexOfLastBerth
  );
  const totalPages = Math.ceil(filteredBerths.length / berthsPerPage);

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

  return (
    <div className="">
      <Heading
        title="Berths Managements"
        description="Streamlining Berth Movement."
        icon={LandPlot}
        iconColor="text-sky-700"
      />

      <div className="px-4 md:px-12  flex flex-col md:flex-row mt-8 justify-start items-center ">
        <div className="flex-1 mb-4 ">
          <NewBerth
            berths={filteredBerths}
            onBerthCreated={handleAPIAddBerth}
          />
        </div>
        <div className="mb-4 ml-2">
          <SortOptions sortOption={sortOption} onSortChange={sortBerths} />
        </div>
        <div className="mb-4 ">
          <Filters onFilterChange={searchBerths} />
        </div>
      </div>

      <div className="px-4 md:px-12  grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
        {filteredBerths.map((berth, index) => (
          <Card
            key={berth._id}
            className="p-4 border-2 border-gray-900 rounded-2xl flex flex-col mt-4 shadow-md hover:shadow-xl transition "
          >
            <div className="  flex items-center justify-end mb-4 ">
              <div className="w-full ">
                <div className="flex text-lg rounded-xl mb-2 bg-gray-100 shadow-lg p-2 border-2 border-gray-700 items-center justify-center rounded-t-2xl font-semibold">
                  <div className="text-right ">
                    {berth.number || ".................."}
                  </div>
                </div>
                <div className="flex justify-between mb-2 shadow-md p-2">
                  <div className="text-left text-md">Code:</div>
                  <div className="text-right ">
                    {berth.code || ".................."}
                  </div>
                </div>
                <div className="flex justify-between shadow-md p-2">
                  <div className="text-left text-md">Lat:</div>
                  <div className="text-right ">
                    {berth.lat || ".................."}
                  </div>
                </div>
                <div className="flex justify-between shadow-md p-2">
                  <div className="text-left text-md">Long:</div>
                  <div className="text-right ">
                    {berth.long || ".................."}
                  </div>
                </div>

                <div className="flex justify-between shadow-md p-2">
                  <div className="text-left text-md">Branch:</div>
                  <div className="text-right ">
                    {berth.branch || ".................."}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <UpdateBerth berth={berth} onUpdateBerth={handleAPIUpdateBerth} />
            </div>
          </Card>
        ))}
      </div>

      <Pagination
        currentUsers={currentBerths}
        currentPage={currentPage}
        totalPages={totalPages}
        goToPreviousPage={goToPreviousPage}
        goToNextPage={goToNextPage}
      />
    </div>
  );
}
