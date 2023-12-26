import { ShieldPlus } from "lucide-react";
import { useState, useEffect, useRef } from "react";

import {  toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { motion } from "framer-motion";

const NewDriver = ({ drivers, onDriverCreated }) => {
  const [isNewDriverModalOpen, setIsNewDriverModalOpen] = useState(false);
  const [newDriver, setNewDriver] = useState({
    name: "",
    nationalID: "",
    drivingLicense: "",
    driverStatus: "",
  });
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const modalRef = document.getElementById("modal");

      if (modalRef && !modalRef.contains(event.target)) {
        closeModal();
      }
    };

    if (isNewDriverModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNewDriverModalOpen]);

  const openModal = () => {
    setIsNewDriverModalOpen(true);
    setIsButtonClicked(true);
  };

  const closeModal = () => {
    setNewDriver({
      name: "",
      nationalID: "",
      drivingLicense: "",
      driverStatus: "",
    });
    setIsNewDriverModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDriver((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const existingDriver = drivers.find(
      (driver) =>
        driver.nationalID === newDriver.nationalID ||
        driver.drivingLicense === newDriver.drivingLicense
    );
    if (existingDriver) {
      toast.error("The Driver already found!", {
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
      // Driver already exists, handle it
    } else {
      closeModal();
      onDriverCreated(newDriver);
      // Show a success toast when a new cargo is created
    }
  };

  // useEffect(() => {
  //   localStorage.setItem("drivers", JSON.stringify(drivers));
  // }, [drivers]);

  return (
    <div>
      {isNewDriverModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed z-50 inset-0 flex items-center justify-center bg-gray-500 bg-opacity-70"
        >
          <motion.div
            initial={{ scale: 0, x: 0 }} // Initial position from left
            animate={{ scale: 1, x: 0 }} // Animate to the center
            exit={{ scale: 0, x: 0 }} // Exit to the left
            transition={{ duration: 0.05, ease: "easeInOut" }} // Custom transition
            id="modal"
            ref={modalRef}
            className="bg-gradient-to-t from-gray-900 via-sky-900 to-sky-700 p-6 rounded-t-3xl grid border border-sky-700 shadow-md transition duration-500"
          >
            <div className="flex justify-center mb-8 shadow-xl bg-gradient-to-b from-sky-400 via-sky-700 to-sky-900 px-6 py-3 rounded-2xl">
              <h2 className="text-xl text-white drop-shadow-lg font-semibold mr-6">
                New Driver
              </h2>
              <ShieldPlus className="shadow-xl text-white  font-semibold" />
            </div>
            <form onSubmit={handleSubmit} className="">
              <div className="flex justify-between items-center mb-4 shadow-md px-2">
                <span className="text-sm font-semibold mb-1 text-white mr-2">
                  Driver Name
                </span>
                <input
                  className="px-2 py-1 border border-gray-300 rounded-xl mb-2 shadow-md focus:shadow-xl focus:scale-105 transition-all duration-500 outline-none"
                  type="text"
                  name="name"
                  value={newDriver.name}
                  onChange={handleInputChange}
                  placeholder="Driver Name"
                  required
                />
              </div>

              <div className="flex justify-between items-center mb-4 shadow-md px-2">
                <span className="text-sm font-semibold mb-1 text-white mr-2">
                  Driver National ID
                </span>
                <input
                  className="px-2 py-1 border border-gray-300 rounded-xl mb-2 shadow-md focus:shadow-xl focus:scale-105 transition-all duration-500 outline-none"
                  type="text"
                  name="nationalID"
                  value={newDriver.nationalID}
                  onChange={handleInputChange}
                  placeholder="Driver National ID"
                  required
                />
              </div>
              <div className="flex justify-between items-center mb-4 shadow-md px-2">
                <span className="text-sm font-semibold mb-1 text-white mr-2">
                  Driver License
                </span>

                <input
                  className="px-2 py-1 border border-gray-300 rounded-xl mb-2 shadow-md focus:shadow-xl focus:scale-105 transition-all duration-500 outline-none"
                  type="text"
                  name="drivingLicense"
                  value={newDriver.drivingLicense}
                  onChange={handleInputChange}
                  placeholder="Driver License"
                  required
                />
              </div>

              <div className="flex justify-end">
                <button
                  className={`px-4 py-1 bg-sky-600 text-white rounded-lg mr-2 shadow-md ${
                    isButtonClicked
                      ? "hover:bg-sky-500 hover:scale-95"
                      : "hover:scale-95"
                  }`}
                  type="submit"
                >
                  Save
                </button>
                <button
                  className="px-2 py-1 bg-gray-300 rounded-lg shadow-md hover:scale-95"
                  onClick={closeModal}
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      <button
        className={`lg:mr-16 px-2 py-1 bg-sky-700 text-white rounded-lg shadow-md ${
          isButtonClicked
            ? "hover:bg-sky-400"
            : "hover:scale-[95%] hover:bg-sky-500"
        } transition`}
        onClick={openModal}
      >
        New Driver
        <span className="text-xl"> +</span>
      </button>
    </div>
  );
};

export default NewDriver;
