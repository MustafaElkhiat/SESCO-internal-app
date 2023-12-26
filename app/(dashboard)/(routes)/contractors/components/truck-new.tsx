import { ShieldPlus } from "lucide-react";

import { useState, useEffect, useRef } from "react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { motion } from "framer-motion";

const NewTruck = ({ trucks, onTruckCreated }) => {
  const [isNewTruckModalOpen, setIsNewTruckModalOpen] = useState(false);
  const [newTruck, setNewTruck] = useState({
    number: "",
    truckLicense: "",
    truckType: "",
    truckStatus: "",
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

    if (isNewTruckModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNewTruckModalOpen]);

  const openModal = () => {
    setIsNewTruckModalOpen(true);
    setIsButtonClicked(true);
  };

  const closeModal = () => {
    setNewTruck({
      number: "",
      truckLicense: "",
      truckType: "",
      truckStatus: "",
    });
    setIsNewTruckModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTruck((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Prevent form submission

    const existingTruck = trucks.find(
      (truck) =>
        truck.number === newTruck.number ||
        truck.truckLicense === newTruck.truckLicense
    );
    if (existingTruck) {
      toast.error("The Truck already found!", {
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

      // Truck already exists, handle it
    } else {
      closeModal();
      onTruckCreated(newTruck);

      //  // Show a success toast when a new cargo is created

    }
  };

  // useEffect(() => {
  //   // Save data to local storage whenever trucks is updated
  //   localStorage.setItem("trucks", JSON.stringify(trucks));
  // }, [trucks]);

  return (
    <div>
      {isNewTruckModalOpen && (
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
                New Truck
              </h2>
              <ShieldPlus className="shadow-xl text-white  font-semibold" />
            </div>
            <form onSubmit={handleSubmit} className="">
            <div className="flex justify-between items-center mb-4 shadow-md px-2">
                <span className="text-sm font-semibold mb-1 text-white mr-2">
                  Truck code
                </span>
                <input
                  className="px-2 py-1 border border-gray-300 rounded-xl mb-2 shadow-md focus:shadow-xl focus:scale-105 transition-all duration-500 outline-none"
                  type="text"
                  name="number"
                  value={newTruck.number}
                  onChange={handleInputChange}
                  placeholder="truck code"
                  required
                />
              </div>

              <div className="flex justify-between items-center mb-4 shadow-md px-2">
                <span className="text-sm font-semibold mb-1 text-white mr-2">
                  Truck license
                </span>
                <input
                  className="px-2 py-1 border border-gray-300 rounded-xl mb-2 shadow-md focus:shadow-xl focus:scale-105 transition-all duration-500 outline-none"
                  type="type"
                  name="truckLicense"
                  value={newTruck.truckLicense}
                  onChange={handleInputChange}
                  placeholder="Truck license"
                  required
                />
              </div>
              <div className="flex justify-between items-center mb-4 shadow-md px-2">
                <span className="text-sm font-semibold mb-1 text-white mr-2">
                  Truck type
                </span>

                <select
                  className="cursor-pointer px-2 py-1 border border-gray-300 rounded-xl mb-2 shadow-md focus:shadow-xl focus:scale-105 transition-all duration-500 outline-none"
                  name="truckType"
                  value={newTruck.truckType}
                  onChange={handleInputChange}
                  style={{ width: "200px" }} 
                  required

                >
                  <option value="" hidden>type</option>
                  <option value="FLIPPER">قلاب</option>
                  <option value="TRELLA">تريلا </option>
                  <option value="TRELLA_FARSH">تريلا فرش</option>
                  <option value="TRELLA_FLIPPER">تريلا قلاب</option>
                  <option value="FLIPPER_LASEH">قلاب لاسية</option>
                </select>
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
        New Truck
        <span className="text-xl"> +</span>
      </button>
    </div>
  );
};

export default NewTruck;
