import { BadgePlus, ShieldPlus } from "lucide-react";
import { useState, useEffect, useRef } from "react";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { motion } from 'framer-motion';


const NewUser = ({ users, onUserCreated }) => {
  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    role: "",
    branch: "",
    email: "",
    id: "",
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

    if (isNewUserModalOpen) {
      window.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNewUserModalOpen]);

  const openModal = () => {
    setIsNewUserModalOpen(true);
    setIsButtonClicked(true);
  };

  const closeModal = () => {
    setNewUser({
      name: "",
      role: "",
      branch: "",
      email: "",
      id: "",

    });
    setIsNewUserModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // const validateEmail = (email) => {
  //   // Email validation regex pattern
  //   const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   return emailPattern.test(email);
  // };

  const handleSubmit = () => {
    const existingUser = users.find((user) => user.id === newUser.id);

    if (existingUser) {
      alert("The user already exists.");
    } else {
      // Validate email
      // (!validateEmail(newUser.email)) {
      //   toast.error("Please enter a valid email address.", {
      //     position: toast.POSITION.TOP_RIGHT,
      //     style: {
      //       background: "#6acaff", // Background color
      //       color: "#ffffff", // Text color
      //       boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.1)", // Box shadow
      //       borderRadius: "12px 0  12px 0",
      //       width: "96%",
      //       fontSize: "bold",
      //     },
      //   });
      //   return;
      // }

      closeModal();
      onUserCreated(newUser);

  
    }
  };

  return (
    <div>
      {isNewUserModalOpen && (
        <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        
        className="fixed  z-50 inset-0 flex items-center justify-center bg-gray-700 bg-opacity-70"
        >  
          <motion.div
          id="modal"
          ref={modalRef}
          className="bg-gradient-to-t from-gray-900 via-sky-900 to-sky-700 p-6 rounded-t-3xl grid border border-sky-700 shadow-md transition duration-500"
          initial={{ scale: 0, x: "-0%" }}
          animate={{ scale: 1, x: 0 }}
          exit={{ scale: 0, y: "0%" }}
          transition={{ duration: 0.05, ease: "easeInOut" }}
        >
            <div className="flex justify-center mb-8 shadow-xl bg-gradient-to-b from-sky-400 via-sky-700 to-sky-900 px-6 py-3 rounded-2xl">
              <h2 className="text-xl text-white drop-shadow-lg font-semibold mr-6">
              New User
            </h2>
            <ShieldPlus className="shadow-xl text-white  font-semibold" />
          </div>
          <form onSubmit={handleSubmit} className="">
            <div className="flex justify-between items-center mb-4 shadow-md px-2">
              <span className="text-sm font-semibold mb-1 text-white mr-2">
                User Name
              </span>
              <input
                className="px-2 py-1 border border-gray-300 rounded-xl mb-2 shadow-md focus:shadow-xl focus:scale-105 transition-all duration-500 outline-none"
                type="text"
                name="name"
                value={newUser.name}
                onChange={handleInputChange}
                placeholder="Name"
                required
                style={{ width: "233px" }}

              />
            </div>

     
       
            <div className="flex justify-between items-center mb-4 shadow-md px-2">
              <span className="text-sm font-semibold mb-1 text-white mr-2">
                User Role
              </span>

              <select
                  className="px-2 py-1 cursor-pointer text-gray-600 border border-gray-300 rounded-xl mb-2 shadow-md focus:shadow-xl focus:scale-105 transition-all duration-500 outline-none"
                  name="role"
                value={newUser.role}
                onChange={handleInputChange}
                style={{ width: "233px" }} // Set a fixed width (adjust as needed)
                required
              >
                <option value="" hidden>Role</option>
                <option value="ADMIN">Admin</option>
                <option value="VESSEL_OFFICER">Vessel Officer</option>
                <option value="WAREHOUSE_OFFICER">Warehouse Officer</option>
              </select>
            </div>
              <div className="flex justify-between items-center mb-4 shadow-md px-2">
              <span className="text-sm font-semibold mb-1 text-white mr-2">
                Email
                </span>
                <input
                  className="px-2 py-1 border border-gray-300 rounded-xl mb-2 shadow-md focus:shadow-xl focus:scale-105 transition-all duration-500 outline-none"
                  type="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  required
                  style={{ width: "233px" }}

                />
              </div>
            <div className="flex justify-between items-center mb-4 shadow-md px-2">
              <span className="text-sm font-semibold mb-1 text-white mr-2">
                Branch
              </span>
              <select
                  className="px-2 py-1 cursor-pointer text-gray-600 border border-gray-300 rounded-xl mb-2 shadow-md focus:shadow-xl focus:scale-105 transition-all duration-500 outline-none"
                  name="branch"
                value={newUser.branch}
                onChange={handleInputChange}
                style={{ width: "233px" }}
                required
                 // Set a fixed width (adjust as needed)

              >
                <option value="" hidden>Branch</option>
                <option value="Damietta">Damietta</option>
                <option value="El-Dekheila">El-Dekheila</option>
                <option value="Abu Qir">Abu Qir</option>
                <option value="El-Adabia">El-Adabia</option>
                <option value="PortSaid">PortSaid</option>
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
        New User
        <span className="text-xl"> +</span>
        <ToastContainer autoClose={3000} />

      </button>
    </div>
  );
};

export default NewUser;
