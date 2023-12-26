"use client";

import { Montserrat } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
/*import { useAuth } from "@clerk/nextjs";*/

import { Button } from "@/components/ui/button";

const font = Montserrat({ weight: "600", subsets: ["latin"] });

export const LandingNavbar = () => {
  /*const { isSignedIn } = useAuth();*/

  return (
    <nav className="p-3 bg-transparent flex items-center justify-between">

      <Link href="/" 
           >
          <div
           className="flex items-center justify-center text-white mt-2 md:text-lg p-2 m rounded-full font-semibold shadow-xl  bg-gradient-to-b from-sky-400 via-sky-700 to-sky-900"
           // style={{
          //   backgroundImage:
          //     "linear-gradient(to bottom, #fff, #cbd5e0, #fff)", // Colors adjusted
          //   WebkitBackgroundClip: "text",
          //   color: "transparent",
          // }}
        >
          SESCO Trans
          {/* <Image fill alt="Logo" src="/logo2.png" /> */}
        </div>

        {/* <h1 className={cn("text-2xl font-bold text-white", font.className)}>
          SESCO
        </h1> */}
      </Link>
      <div className="flex items-center gap-x-2">
        <Link href={"/dashboard"}>
          <Button
            variant="outline"
            className="rounded-full bg-[#77AAFD] shadow-xl from-sky-100 to-sky-900"
          >
            Get Started
          </Button>
        </Link>
      </div>
    </nav>
  );
};
