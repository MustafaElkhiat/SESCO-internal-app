"use client";

import React, { useState, useEffect } from "react";
import { Heading } from "@/components/heading";
import { Combine } from "lucide-react";
import { Card } from "@/components/ui/card";
import useSWR from "swr";
import { POSTAPI, PUTAPI } from "../../../../../utities/test";
import { v4 as uuidv4 } from "uuid";
import SubCargoData from "../components/subcargo-data";
import Link from "next/link";
import UpdateCargo from "../components/cargo-update";

import { toast } from "react-toastify";
import { motion } from "framer-motion";
import LoadingAnimation from "../../../../../components/LoadingAnimation"; // Adjust the path accordingly

const SubCargoPage = ({ params }) => {
  const [cargo, setCargo] = useState(null);
  const [filteredCargos, setFilteredCargos] = useState([]);
  const [filteredSubs, setFilteredSubs] = useState([]);
  const [subs, setSubs] = useState([]);
  const id = params.id;

  const fetcher = (url) => fetch(url).then((res) => res.json());

  const { data, error, isLoading } = useSWR(
    "https://10.1.114.43:3030/api/cargo/" + id,
    fetcher
  );
  useEffect(() => {
    setCargo(data || null);
    console.log(data);
  }, [data]);

  // useEffect(() => {
  //   const cargos = JSON.parse(localStorage.getItem("cargos")) || [];
  //   const foundCargo = cargos.find((c) => c.id === id);

  //   if (foundCargo) {
  //     setCargo(foundCargo);

  //     // Initialize cargo.subs with the value from local storage
  //     const cargoSubs = JSON.parse(localStorage.getItem(`subs_${id}`)) || [];
  //     foundCargo.subs = cargoSubs.length;

  //     setFilteredCargos(cargos);
  //   }

  //   // Retrieve Subs associated with the current Cargo from local storage
  //   const cargoSubs = JSON.parse(localStorage.getItem(`subs_${id}`)) || [];
  //   setSubs(cargoSubs);
  //   setFilteredSubs(cargoSubs);

  //   // Retrieve drivers associated with the current Cargo from local storage
  // }, [id]);

  if (isLoading) {
    return <LoadingAnimation />;
  }

  if (error) {
    return <h1>Error ${error}</h1>;
  }

  const handleAPIUpdateCargo = async (updatedCargo) => {
    try {
      const { _id, code, ...cargo } = updatedCargo;
      const result = await PUTAPI("/api/cargo/" + _id, cargo);

      if (result.statusCode === 400 && result.message.includes("code")) {
        // Handle validation error
        // toast
      } else {
        setCargo(result);
        //toast
      }
    } catch (error) {
      console.error("Error updating cargo:", error);
      // Handle error
    }
  };

  const handleUpdateCargo = (updatedCargo) => {
    setCargo(updatedCargo);

    const cargoIndex = filteredCargos.findIndex(
      (cargo) => cargo.id === updatedCargo.id
    );

    if (cargoIndex !== -1) {
      const updatedCargos = [...filteredCargos];
      updatedCargos[cargoIndex] = updatedCargo;
      setFilteredCargos(updatedCargos);
      localStorage.setItem("Cargos", JSON.stringify(updatedCargos));
    }
  };
  const handleSubCreated = (newSub) => {
    newSub.id = uuidv4();
    const updatedSubs = [...subs, newSub];
    setSubs(updatedSubs);
    localStorage.setItem(`subs_${id}`, JSON.stringify(updatedSubs));

    // Update the count of Subs for the Cargo
    const updatedCargo = {
      ...cargo,
      subs: cargo.subs + 1,
    };
    setCargo(updatedCargo);
    localStorage.setItem(`cargo_${id}`, JSON.stringify(updatedCargo));
  };

  const handleUpdateSub = (updatedSub) => {
    const subIndex = subs.findIndex((sub) => sub.id === updatedSub.id);

    if (subIndex !== -1) {
      const updatedSubs = [...subs];
      updatedSubs[subIndex] = updatedSub;
      setSubs(updatedSubs);

      const filteredSubsIndex = filteredSubs.findIndex(
        (sub) => sub.id === updatedSub.id
      );
      if (filteredSubsIndex !== -1) {
        const updatedFilteredSubs = [...filteredSubs];
        updatedFilteredSubs[filteredSubsIndex] = updatedSub;
        setFilteredSubs(updatedFilteredSubs);
        localStorage.setItem(`subs_${id}`, JSON.stringify(updatedSubs));
      }
    }
  };

  const handleDeleteSub = (sub) => {
    // Filter out the sub to delete from both filteredSubs and Subs
    const updatedFilteredSubs = filteredSubs.filter((t) => t.code !== sub.code);
    const updatedSubs = subs.filter((t) => t.code !== sub.code);

    // Update the states
    setFilteredSubs(updatedFilteredSubs);
    setSubs(updatedSubs);
    localStorage.setItem(`subs_${id}`, JSON.stringify(updatedSubs));

    // Update the count of Subs for the Cargo
    const updatedCargo = {
      ...cargo,
      subs: cargo.subs - 1,
    };
    setCargo(updatedCargo);
    localStorage.setItem(`cargo_${id}`, JSON.stringify(updatedCargo));
  };

  if (cargo)
    return (
      <div>
        <Link href="/cargos">
          <Heading
            title="Cargo Logistics"
            description=" Streamlining Cargo Movement."
            icon={Combine}
            iconColor="text-sky-700"
          />
        </Link>

        <motion.div
          initial={{ opacity: 1, x: "-100%" }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: "100%" }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="px-4 md:px-12 lg:px-16 space-y-4  grid  gap-4"
        >
        <Card className="p-4  border-black/5 flex flex-col mt-4 shadow-md hover:shadow-xl transition rounded-2xl ">
            <div className="  flex items-center justify-center  ">
              <div className="w-full  ">
              <div className="flex text-xl  mb-2 bg-gray-100 shadow-lg p-2 items-center justify-center rounded-2xl font-semibold">
                  {/* <div className="text-left text-sm ">Name:</div> */}
                  <div className="text-right ">
                    {cargo ? cargo.name : "..........."}
                  </div>
                </div>
                <div className="flex justify-between mb-2 shadow-md p-2">
                  <div className="text-left">Code:</div>
                  <div className="text-right ">
                    {cargo ? cargo.code : "..........."}
                  </div>
                </div>
                <div className="flex justify-between shadow-md p-2">
                  <div className="text-left ">Number of Sub:</div>
                  <div className="text-right ">
                    {cargo ? cargo.subCargoList.length : "..........."}
                  </div>
                </div>
              </div>
            </div>

            {/* <div className="flex justify-center">
              <UpdateCargo cargo={cargo} onUpdateCargo={handleAPIUpdateCargo} />{" "}
            </div> */}
          </Card>
        </motion.div>

        <div className="  ">
          <SubCargoData
            selectedCargo={cargo}
            onSubCreated={handleSubCreated}
            onUpdateSub={handleUpdateSub}
            onDeleteSub={handleDeleteSub}
          />
        </div>
      </div>
    );
};

export default SubCargoPage;
