import { Edit } from "lucide-react";
import { useState, useEffect, useRef } from "react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { motion } from "framer-motion";

const UpdateContractor = ({ contractor, onUpdateContractor }) => {
  const [isUpdateContractorModalOpen, setIsUpdateContractorModalOpen] =
    useState(false);
  const [updateContractor, setUpdateContractor] = useState({
    _id: "",
    name: "",
    code: "",
    truckList: [],
    driverList: [],
  });

  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const modalElement = document.getElementById("modal");
      if (modalElement && !modalElement.contains(event.target)) {
        closeModal();
      }
    };

    if (isUpdateContractorModalOpen) {
      window.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUpdateContractorModalOpen]);

  useEffect(() => {
    setUpdateContractor(contractor);
  }, [contractor]);

  const openModal = () => {
    setIsUpdateContractorModalOpen(true);
    setIsButtonClicked(true);
  };

  const closeModal = () => {
    setIsUpdateContractorModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateContractor((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    const updatedContractorWithId = { ...updateContractor, id: contractor.id };
    onUpdateContractor(updatedContractorWithId);
    closeModal();

    // Show a success toast when a new vessel is created
  };

  return (
    <div>
      {isUpdateContractorModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed z-50 inset-0 flex items-center justify-center bg-gray-500 bg-opacity-70"
        >
          <motion.div
            initial={{ opacity: 0, x: "-100%" }} // Initial position from left
            animate={{ opacity: 1, x: 0 }} // Animate to the center
            exit={{ opacity: 0, y: "-100%" }} // Exit to the left
            transition={{ duration: 0.05, ease: "easeInOut" }} // Custom transition
            id="modal"
            ref={modalRef}
            className="bg-gradient-to-t from-gray-900 via-sky-900 to-sky-700 p-6 rounded-t-3xl grid border border-sky-700 shadow-md transition duration-500"
          >
            <div className="flex justify-center mb-8 shadow-xl bg-gradient-to-b from-sky-400 via-sky-700 to-sky-900 px-6 py-3 rounded-2xl">
              <h2 className="text-xl text-white drop-shadow-lg font-semibold mr-6">
                Update Contractor
              </h2>
              <Edit className="shadow-xl text-white font-semibold" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-4 shadow-md px-2">
                <span className="text-sm font-semibold mb-1 text-white mr-2">
                  Contractor Name
                </span>
                <input
                  className="px-2 py-1 border border-gray-300 rounded-xl mb-2 shadow-md focus:shadow-xl focus:scale-105 transition-all duration-500 outline-none"
                  type="text"
                  name="name"
                  value={updateContractor.name}
                  onChange={handleInputChange}
                  placeholder="name"
                  required
                />
              </div>

              <div className="flex justify-between items-center mb-4 shadow-md px-2">
                <span className="text-sm font-semibold mb-1 text-white mr-2">
                  Contractor Code
                </span>
                <input
                  disabled
                  className=" cursor-not-allowed  bg-sky-900 text-gray-300 px-2 py-1 border border-sky-600 rounded-xl mb-2 shadow-md focus:shadow-xl focus:scale-105 transition-all duration-500 outline-none"
                  type="number"
                  name="code"
                  value={updateContractor.code}
                  onChange={handleInputChange}
                  placeholder="Code"
                  required
                />
              </div>
              {/* <div className="grid ">
                <span className="text-sm drop-shadow-lg mb-1 text-sky-500 mr-2">
                  Number of Trucks
                </span>
                <input
                  className="px-2 py-1 border border-gray-300 rounded-lg mb-2 shadow-md focus:shadow-xl focus:scale-105 transition-all duration-500 outline-none"
                  type="number"
                  name="trucks"
                  value={updateContractor.trucks}
                  onChange={handleInputChange}
                  placeholder="trucks"
                />
              </div>
              <div className="grid ">
                <span className="text-sm drop-shadow-lg mb-1 text-sky-500 mr-2">
                  Number of Drivers
                </span>
                <input
                  className="px-2 py-1 border border-gray-300 rounded-lg mb-2 shadow-md focus:shadow-xl focus:scale-105 transition-all duration-500 outline-none"
                  type="number"
                  name="drivers"
                  value={updateContractor.drivers}
                  onChange={handleInputChange}
                  placeholder="drivers"
                />
              </div> */}
            </div>

            <div className="flex justify-end">
              <button
                className={`px-4 py-1 bg-sky-600 text-white rounded-lg mr-2 shadow-md ${
                  isButtonClicked
                    ? "hover:bg-sky-500 hover:scale-95"
                    : "hover:scale-95"
                }`}
                onClick={handleSubmit}
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
          </motion.div>
        </motion.div>
      )}

      <button
        className={`px-1 py-1 bg-sky-700 text-white rounded-lg shadow-xl mr-1 ${
          isButtonClicked
            ? "hover:bg-sky-600  "
            : "hover:scale-[95%] hover:bg-sky-500"
        } transition`}
        onClick={openModal}
      >
        <div className="flex p-1">
          update
          <Edit className="w-4 ml-2" />
        </div>
      </button>
      <ToastContainer autoClose={3000} />
    </div>
  );
};

export default UpdateContractor;
