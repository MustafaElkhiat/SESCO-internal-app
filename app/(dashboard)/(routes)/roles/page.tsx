/**
 * @Project : sescoapp-API-main
 * @File : app/(dashboard)/(routes)/roles/page.tsx
 * @Author : Eng. Mustafa Elkhiat
 * @Date : 12/21/2023
 * @Time : 1:23 PM
 */

"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import { fetcher, PUTAPI } from "@/utities/test";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Heading } from "@/components/heading";
import { UserCheck } from "lucide-react";
import LoadingAnimation from "../../../../components/LoadingAnimation"; // Adjust the path accordingly

export enum Role {
  DEVELOPER = "DEVELOPER",
  ADMIN = "ADMIN",
  VESSEL_OFFICER = "VESSEL_OFFICER",
  WAREHOUSE_OFFICER = "WAREHOUSE_OFFICER",
  ORIENTATION_OFFICER = "ORIENTATION_OFFICER",
}

const functions = [
  {
    group: "Booking",
    functions: [
      "Show Booking List",
      "Add Booking",
      "Edit Booking",
      "Close Booking",
      "Show TruckDriver List",
      "Add TruckDriver",
      "Release TruckDriver",
      "Add Pattern To Booking",
      "Show QR Code",
      "Show Trip Detail List",
    ],
  },
  {
    group: "Contractor",
    functions: [
      "Show Contractor List",
      "Add Contractor",
      "Edit Contractor",
      "Show Truck List",
      "Show Driver List",
      "Add Truck",
      "Add Driver",
      "Return Truck From Maintenance",
    ],
  },
  {
    group: "Vessel",
    functions: [
      "Show Vessel List",
      "Add Vessel",
      "Edit Vessel",
      "Show Voyage List",
      "Add Voyage",
      "Edit Voyage",
    ],
  },
  {
    group: "User",
    functions: ["Show User List", "Add User", "Edit User"],
  },
  {
    group: "Pattern",
    functions: [
      "Show Pattern List",
      "Add Pattern",
      "Edit Pattern",
      "Show checkpoint List",
      "Add checkpoint",
    ],
  },
  {
    group: "Cargo",
    functions: [
      "Show Cargo List",
      "Add Cargo",
      "Edit Cargo",
      "Show SubCargo List",
      "Add SubCargo",
      "Edit SubCargo",
    ],
  },
  {
    group: "Warehouse",
    functions: ["Show Warehouse List", "Add Warehouse", "Edit Warehouse"],
  },
  {
    group: "Berth",
    functions: ["Show Berth List", "Add Berth", "Edit Berth"],
  },
  {
    group: "Transaction",
    functions: ["Add Transaction"],
  },
];

interface RoleFunction {
  _id: string;
  role: string;
  functions: string[];
}

/*const roleFunctions: RoleFunction[] = [
    {
        role: "ADMIN",
        functions: [
            'Show Booking List',
            'Add Booking',
            'Edit Booking',
            'Close Booking',
        ]
    }, {
        role: "VESSEL_OFFICER",
        functions: [
            'Show Booking List',
            'Add Booking',
            'Edit Booking',
            'Close Booking',
        ]
    }, {
        role: "WAREHOUSE_OFFICER",
        functions: [
            'Show Booking List',
            'Add Booking',
            'Edit Booking',
            'Close Booking',
        ]
    }, {
        role: "DEVELOPER",
        functions: [
            'Show Booking List',
            'Add Booking',
            'Edit Booking',
            'Close Booking',
        ]
    },
]*/

export default function RolesMatrixPage() {
  const [roleFunctionList, setRoleFunctionList] = useState([]);

  const { data, error, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_api_url}/api/functions`,
    fetcher
  );

  useEffect(() => {
    setRoleFunctionList(data ?? []);
  }, [data]);

  function getRoleFunction(role: string) {
    return roleFunctionList.find((roleFun) => roleFun.role === role);
  }

  const haveRoleFunction = (role: string, fun: string) => {
    return !!getRoleFunction(role)?.functions.find((func) => func === fun);
  };
  const addFunctionToRole = (roleFunction: RoleFunction, fun: string) => {
    return {
      ...roleFunction,
      functions: [...roleFunction.functions, fun],
    };
  };

  const removeFunctionFromRole = (roleFunction: RoleFunction, fun: string) => {
    roleFunction.functions.splice(roleFunction.functions.indexOf(fun), 1);
    return {
      ...roleFunction,
      functions: roleFunction.functions,
    };
  };

  const toggleFunction = (role: string, fun: string) =>
    haveRoleFunction(role, fun)
      ? updateRole(removeFunctionFromRole(getRoleFunction(role), fun))
      : updateRole(addFunctionToRole(getRoleFunction(role), fun));

  const updateRole = (roleFunction: RoleFunction) =>
    setRoleFunctionList(
      roleFunctionList.map((roleFun) =>
        roleFun.role === roleFunction.role ? roleFunction : roleFun
      )
    );

  const save = async () => {
    const result = await PUTAPI("/api/functions", roleFunctionList);
    if (result.statusCode) {
      console.error(result.message);
    } else {
      toast.success("Roles functions updated successfully!", {
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
  if (isLoading) return <LoadingAnimation />;
  if (data)
    return (
      <div>
        <Heading
          title="Role Management "
          description="Empower your team with role-specific functionalities."
          icon={UserCheck}
          iconColor="text-sky-700"
        />
        {/* <button onClick={save}>Save</button> */}
        <table className="relative table-auto m-auto">
          <thead>
            <tr>
              <th className="sticky top-0 bg-gray-400 p-4 rounded-tl-3xl ">
                Function / Role
                <button
                  className="px-3 py-1 bg-sky-700 hover:bg-sky-400 text-white rounded-lg shadow-xl ml-8"
                  onClick={save}
                >
                  Save
                </button>
              </th>
              {Object.keys(Role).map((role) => (
                <th className="sticky top-0 bg-gray-400 p-4 first:rounded-lt-3xl last:rounded-tr-3xl">
                  {role}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {functions.map((functionObj, index) => (
              <>
                <tr key={index} className="border sticky top-[56px]">
                  <td
                    className=" font-extrabold p-4 bg-gray-200"
                    colSpan={Object.keys(Role).length + 1}
                  >
                    {functionObj.group}
                  </td>
                </tr>
                {functionObj.functions.map((fun, idx) => (
                  <tr key={fun} className="border nth">
                    <td className=" font-medium pl-8 p-4 ">{fun}</td>
                    {Object.keys(Role).map((role) => (
                      <td
                        onClick={() => toggleFunction(role, fun)}
                        className=" font-medium text-end cursor-pointer"
                      >
                        {haveRoleFunction(role, fun) ? (
                          <svg
                            width="30px"
                            height="30px"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                            <g
                              id="SVGRepo_tracerCarrier"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            ></g>
                            <g id="SVGRepo_iconCarrier">
                              <path
                                d="M4 12.6111L8.92308 17.5L20 6.5"
                                stroke="#0dc809"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              ></path>
                            </g>
                          </svg>
                        ) : (
                          <svg
                            width="30px"
                            height="30px"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            stroke="#ea1010"
                          >
                            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                            <g
                              id="SVGRepo_tracerCarrier"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            ></g>
                            <g id="SVGRepo_iconCarrier">
                              <path
                                d="M16 8L8 16M8 8L16 16"
                                stroke="#f51919"
                                strokeWidth="2"
                                strokeLinecap="round"
                              ></path>
                            </g>
                          </svg>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </>
            ))}
          </tbody>
        </table>
        <ToastContainer autoClose={5000} />
      </div>
    );
}
