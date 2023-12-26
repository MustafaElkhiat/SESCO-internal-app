/**
 * @Project : Internal Transportation Tracking
 * @File : app/login/LoginForm.tsx
 * @Author : Eng. Mustafa Elkhiat
 * @Date : 10/1/2023
 * @Time : 1:30 AM
 */
"use client";

import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { Smile, HeartHandshake } from "lucide-react";

import { motion } from "framer-motion";
import LoadingAnimation from "../../../../components/LoadingAnimation"; // Adjust the path accordingly

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Credentials {
  email: string;
  password: string;
}

export default function LoginForm() {
  const { status, data: session } = useSession();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [credentials, setCredentials] = useState<Credentials>({
    email: "",
    password: "",
  });
  const router = useRouter();

  const onSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    try {
      const res = await signIn("credentials", {
        email: credentials.email,
        password: credentials.password,
        redirect: false,
      });

      if (res?.error) {
        toast.error("Invalid username or password", {
          position: toast.POSITION.TOP_RIGHT,
          style: {
            // top: "0px",
            right: "-40px",
            background: "#8acaff", // Background color
            color: "#ffffff", // Text color
            boxShadow:
              "0 2px 4px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.1)", // Box shadow
            borderRadius: "12px 0  12px 0",
            width: "96%",
            fontSize: "bold",
          },
        });
        return;
      }
      //router.push("/dashboard")
    } catch (error) {
      console.log(error);
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  if (status === "loading") return <LoadingAnimation />;
  else if (status === "unauthenticated")
    return (
  <div className=" scale-125">
      <motion.form
        initial={{ scale: 0, y: "-0%" }} // Initial position from left
        animate={{ scale: 1, y: 0 }} // Animate to the center
        exit={{ scale: 0, y: "0%" }} // Exit to the left
        transition={{ duration: 0.3, ease: "easeInOut" }} // Custom transition
        onSubmit={onSubmit}
        className=" bg-gradient-to-t from-gray-800 via-sky-900 to-sky-600 p-6 rounded-t-2xl grid border border-sky-700 shadow-md transition duration-500"
      >
        <motion.div
          initial={{ opacity: 0, x: "-200%" }} // Initial position from left
          animate={{ opacity: 1, x: 0 }} // Animate to the center
          exit={{ scale: 0, y: "0%" }} // Exit to the left
          transition={{ duration: 0.5, ease: "easeInOut", delay: 0.7 }} // Custom transition
          className="flex justify-center mb-8 shadow-xl bg-gradient-to-b from-sky-400 via-sky-700 to-sky-900 px-6 py-3 rounded-xl"
        >
          <h2 className="text-xl text-white drop-shadow-lg font-semibold mr-4">
            Welcome back!
          </h2>
          <HeartHandshake  className="shadow-xl text-white  font-semibold" />
        </motion.div>{" "}
        <div className="grid mb-4">
          <span className=" text-sm text-left font-semibold mb-1 text-white mr-2">
            Email
          </span>
          <input
            className="px-2 py-1 border border-gray-300 rounded-lg mb-2 shadow-md focus:shadow-xl focus:scale-105 transition-all duration-500 outline-none"
            type="email"
            name="email"
            value={credentials.email}
            onChange={handleInputChange}
            placeholder="Email"
            required
          />
        </div>
        <div className="grid mb-4">
          <span className=" text-sm text-left font-semibold mb-1 text-white mr-2">
            Password
          </span>
          <input
            className="px-2 py-1 border border-gray-300 rounded-lg mb-2 shadow-md focus:shadow-xl focus:scale-105 transition-all duration-500 outline-none"
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleInputChange}
            placeholder="Password"
            required
          />
        </div>
        <div className="flex gap-4 justify-center">
          <button
            className="px-3 py-1 bg-sky-700 text-white rounded-lg shadow-md hover:bg-sky-400 transition-all"
            type="submit"
          >
            Login
          </button>
        </div>
        {errorMessage}
        <ToastContainer autoClose={5000} />
      </motion.form>
      </div>
    );
  else router.push("/dashboard");
}
