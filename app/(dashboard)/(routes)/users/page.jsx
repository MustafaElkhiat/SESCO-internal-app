"use client";
// Import necessary modules and components
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Users } from "lucide-react";
// import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/heading";
import NewUser from "./components/new-user-modal";
import UpdateUser from "./components/update-user-modal";
// import DeleteUser from "./components/delete-user-modal";
import Pagination from "@/components/pagination";
import SortOptions from "./components/user-sort-options";
import Filters from "@/components/filteration";
import useSWR from "swr";
import {POSTAPI,PUTAPI} from "../../../../utities/test"
import { toast } from "react-toastify";


const fetcher = (url) => fetch(url).then((res) => res.json());

export default function UserPage() {
  // States for managing users, pagination, and sorting
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [originalUsers, setOriginalUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 15;
  const [sortOption, setSortOption] = useState("");
  const [storedUsers,setStoredUsers] = useState([])

  const { data, error, isLoading } = useSWR(
    "https://10.1.114.43:3030/api/users",
    fetcher
  );

    // Function to add subscription count to users
    const addSubsCount = (user) => {
      // Retrieves subscription data for the user from localStorage or an empty array if none exists
      const userSubs = storedUsers;
      
      // Calculates the number of subscriptions (length of the userSubs array)
      user.subs = userSubs.length; // Adds a new property 'subs' to the user object
      
      return user; // Returns the updated user object with the 'subs' property
    };


    const  searchUsers = (searchValue) =>{
      setFilteredUsers(storedUsers.filter(
        (user) =>
          user.email.toLowerCase().includes(searchValue.toLowerCase()) ||
          user.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        user.branch.toLowerCase().includes(searchValue.toLowerCase()) ||
          user.role.toLowerCase().includes(searchValue.toLowerCase())
      ));
    }


  useEffect(() => {
    setStoredUsers(data || [])
    setOriginalUsers(storedUsers.map(addSubsCount));
    setFilteredUsers(data || [])
  }, [data]);

  if (error) return "An error has occurred.";
  if (isLoading) return "Loading...";


  // Handle sorting users based on selected option
  const handleSortChange = (sortValue) => {
    setSortOption(sortValue);
    const sortedUsers = [...filteredUsers];

    switch (sortValue) {
      case "name":
        sortedUsers.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "role":
        sortedUsers.sort((a, b) => a.role.localeCompare(b.role));
        break;
      case "branch":
        sortedUsers.sort((a, b) => a.branch.localeCompare(b.branch));
        break;
      case "email":
        sortedUsers.sort((a, b) => a.email.localeCompare(b.email));
        break;
      default:
        break;
    }

    setFilteredUsers(sortedUsers);
    setCurrentPage(1);
  };

  // Pagination calculations and functions
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

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


   const  handleAPIAddUser = async (newUser) =>{
    const result  = await POSTAPI('/api/users',newUser);
    if (result.statusCode === 400) {
      toast.error("New User not created !", {
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
      if (result.message.includes('email')) {
          // toast
       
      }
  } else {
    setFilteredUsers([...filteredUsers,result])
    //toast
    toast.success("New User created successfully!", {
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
  
    
  }


  const handleAPIUpdateUser = async(updatedUser) =>{
    const {_id, email,...user} = updatedUser
    const result  = await PUTAPI('/api/users/'+updatedUser._id,user);
    console.log(result)
    if (result.statusCode === 400) {
      if (result.message.includes('email')) {
          // toast
      }
  } else {
    setFilteredUsers(filteredUsers.map(user => user._id === updatedUser._id ? updatedUser : user))
    //toast
    toast.success("User updated successfully!", {
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
  }



  // JSX content for displaying users, sorting, filters, etc.
  return (
    <div className="">
      <Heading
        title="User Management"
        description="Maintain the privacy of your users."
        icon={Users}
        iconColor="text-sky-700"
      />
      {/* Filtering and sorting options */}
      <div className="px-4 md:px-12 mb-4 flex flex-col md:flex-row mt-8 justify-start items-center ">
        <div className="flex-1 mb-4 ">
        <NewUser users={filteredUsers} onUserCreated={handleAPIAddUser} />

        </div>
        <div className="mb-4 ml-2 rounded-full">
          <SortOptions sortOption={sortOption} onSortChange={handleSortChange} />
        </div>
        <div className="mb-4  ">
          <Filters onFilterChange={searchUsers} />

        </div>
      </div>
      {/* Displaying user cards */}
      <div className=" px-4 md:px-12 mt-4 grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredUsers.map((user, index) => (
          <Card
            key={index}
            className="w-1/2 p-4 border-black/5 flex flex-col shadow-md hover:shadow-xl transition rounded-2xl"
          >
            {/* User details */}
            <div className="  flex items-center justify-end mb-4 ">
              <div className="w-full font- ">
                <div 
                  className="flex text-lg  mb-2 bg-gray-100 shadow-lg p-2 items-center justify-center rounded-t-2xl font-semibold">
                  <div className="text-right ">
                    {user.name || ".................."}
                  </div>
                </div>
                <div className="flex justify-between mb-2 shadow-md p-2">
                  <div className="text-left text-md">Role:</div>
                  <div className="text-right ">
                  {user.role ? user.role.toLowerCase() : ".................."}
                  </div>
                </div>
                <div className="flex justify-between shadow-md p-2">
                  <div className="text-left text-md">Email:</div>
                  <div className="text-right text-md ">
                    {user.email || ".................."}
                  </div>
                </div>
                <div className="flex justify-between shadow-md p-2">
                  <div className="text-left text-md">Branch:</div>
                  <div className="text-right ">
                    {user.branch || ".................."}
                  </div>
                </div>
              </div>
            </div>
            {/* Actions for updating and deleting users */}
            <div className="flex justify-center mt-auto">
              <UpdateUser user={user} onUpdateUser={handleAPIUpdateUser} />
              {/* <DeleteUser onDeleteUser={() => handleDeleteUser(user)} /> */}
            </div>
          </Card>
        ))}
      </div>
      {/* Pagination component */}
      <Pagination
        currentUsers={currentUsers}
        currentPage={currentPage}
        totalPages={totalPages}
        goToPreviousPage={goToPreviousPage}
        goToNextPage={goToNextPage}
      />
    </div>
  );
}
