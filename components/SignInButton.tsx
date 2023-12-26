import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { stat } from "fs";

export default function SignInButton(props) {
  const { data: session, status } = useSession();
  const [showDropdown, setShowDropdown] = useState(true);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = () => {
    signOut();
    setShowDropdown(false);
  };

  return (
    <div className="flex gap-4 ml-auto items-center relative">
      {!session && status != "loading" && (
        <button
          onClick={() => signIn()}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md"
        >
          Login
        </button>
      )}
      {session && session.user && (
        <div className="relative ">
          <div className="flex items-center cursor-pointer outline-none">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div className="w-10 h-10 absolute right-0 md:right-8 top-[-16px] md:top-0 rounded-full bg-gradient-to-b from-sky-400 via-sky-700 to-sky-900 flex items-center justify-center shadow-md ">
                  <span className="text-white">
                    {session.user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              </DropdownMenuTrigger>
              {showDropdown && (
                <DropdownMenuContent className="bg-gray-200 shadow-xl rounded-xl absolute right-0 top-10">
                  <DropdownMenuLabel>
                    {" "}
                    {session.user.name.charAt(0).toUpperCase() +
                      session.user.name.slice(1).toLowerCase()}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    {" "}
                    {session.user.role.charAt(0).toUpperCase() +
                      session.user.role.slice(1).toLowerCase()}
                  </DropdownMenuItem>
                  <DropdownMenuItem>{session.user.branch}</DropdownMenuItem>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className=" cursor-pointer "
                    onClick={handleLogout}
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              )}
            </DropdownMenu>
          </div>
        </div>
      )}
    </div>
  );
}
