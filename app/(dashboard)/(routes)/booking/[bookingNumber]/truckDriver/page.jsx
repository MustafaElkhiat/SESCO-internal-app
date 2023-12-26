"use client";

import React, { useEffect, useState } from "react";
import { Heading } from "@/components/heading";
import Link from "next/link";
import { CalendarDays, ShieldX, CheckSquare } from "lucide-react";
import { Card } from "@/components/ui/card";
import TruckDriverData from "../../components/truckDriverData";
import { v4 as uuidv4 } from "uuid";
import useSWR from "swr";
import { POSTAPI, PUTAPI } from "/utities/test";
import BookingPattern from "@/app/(dashboard)/(routes)/booking/components/BookingPattern";
import { motion } from "framer-motion";
import LoadingAnimation from "@/components/LoadingAnimation"; // Adjust the path accordingly

const BookingInfo = ({ params }) => {
  const [booking, setBooking] = useState(null);
  const [filteredTrucks, setFilteredTrucks] = useState([]);
  const [showPatterns, setShowPatterns] = useState(true); // Set the default pattern to true
  const [showTrucks, setShowTrucks] = useState(true); // Add this line to define showTrucks

  const bookingNumber = params.bookingNumber;

  const fetcher = (url) => fetch(url).then((res) => res.json());

  const { data, error, isLoading } = useSWR(
    "https://10.1.114.43:3030/api/booking/bookingNumber/" + bookingNumber,
    fetcher
  );

  useEffect(() => {
    setBooking(data);
    setShowPatterns(true); // Set showPatterns to true when data is loaded
  }, [data]);

  const handleAPIAddTruckDriver = async (truckDriver) => {
    try {
      const result = await POSTAPI(
        "/api/booking/" + bookingNumber + "/truckDriver",
        truckDriver
      );

      if (
        result.statusCode === 400 &&
        result.message.includes("bookingNumber")
      ) {
        console.error(result.message);
        // Handle validation error
        // toast
      } else if (result.statusCode === 400) {
        // console.
      } else {
        //toast
        console.log("New Booking Created successfully!", result);
      }
    } catch (error) {
      console.error("Error adding contractor:", error);
      // Handle error
    }
  };

  const onTruckCreated = (booking) => setBooking(booking);

  const handleAPIUpdateBooking = async (updatedBooking) => {
    try {
      const { _id, code, ...booking } = updatedBooking;
      const result = await PUTAPI("/api/booking/" + _id, booking);

      if (result.statusCode === 400 && result.message.includes("code")) {
        // Handle validation error
        // toast
      } else {
        setBooking(result);
        //toast
      }
    } catch (error) {
      console.error("Error booking contractor:", error);
      // Handle error
    }
  };

  if (!booking) return;
  <LoadingAnimation />;

  return (
    <div>
      <Link href="/booking">
        <Heading
          title="Booking Management"
          description="Monitor all bookings in one place."
          icon={CalendarDays}
          iconColor="text-sky-700"
        />
      </Link>

      <motion.div
        initial={{ opacity: 1, x: "-100%" }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: "100%" }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="px-4 md:px-12 lg:px-16 space-y-4 grid xl:grid-cols-1 gap-4"
      >
        <Card className=" p-4 border-black/5 flex flex-col  shadow-md hover:shadow-xl transition rounded-2xl ">
          <div className="  flex  items-center justify-center   ">
            <div className="w-full  ">
              <div className="flex text-lg  mb-2 bg-gray-100 shadow-xl p-2 items-center justify-center rounded-3xl font-semibold">
                <div className="text-left ">Booking Number: </div>
                {booking.bookingNumber || "..........."}
              </div>
              <div className="flex justify-between shadow-md p-2 ">
                <div className="text-left text-sm">Work Order:</div>
                <div className="text-right ">
                  {booking.workOrderNumber || "..........."}
                </div>
              </div>
              <div className="flex justify-between shadow-md p-2 ">
                <div className="text-left text-sm">Vessel:</div>
                <div className="text-right ">
                  {booking.vessel.name || "..........."}
                </div>
              </div>
              <div className="flex justify-between shadow-md p-2 ">
                <div className="text-left text-sm">Cargo:</div>
                <div className="text-right ">
                  {booking.cargo.name || "..........."}
                </div>
              </div>
              <div className="flex justify-between shadow-md p-2 ">
                <div className="text-left text-sm">Sub Cargo:</div>
                <div className="text-right ">
                  {booking.subCargo.name || "..........."}
                </div>
              </div>
              <div className="flex justify-between shadow-md p-2 ">
                <div className="text-left text-sm">IMEX:</div>
                <div className="text-right ">
                  {booking.imex || "..........."}
                </div>
              </div>
              <div className="flex justify-between shadow-md p-2 ">
                <div className="text-left text-sm">Number of Trucks:</div>
                <div className="text-right ">
                  {booking.truckDriverList.length || "..........."}
                </div>
              </div>
              <div className="flex justify-between shadow-md p-2 ">
                <div className="text-left text-sm">Opened At:</div>
                <div className="text-right text-sm ">{booking.openedAt}</div>
              </div>

              <div className="flex justify-between shadow-md p-2 ">
                <div className="text-left text-sm">Status:</div>
                <div className="text-right ">
                  {booking.status === "Closed" ? (
                    <>
                      <span className="text-red-500 flex items-center justify-center font-semibold">
                        <ShieldX className="mr-1" /> Closed
                      </span>
                      <div className="text-sm text-gray-500">
                        {booking.closedAt || "............."}
                      </div>
                    </>
                  ) : (
                    <div className=" flex items-center ">
                      <span className="text-green-700 font-semibold mr-1 ">
                        <CheckSquare />{" "}
                      </span>
                      Open
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-2">
            {/* <UpdateBooking
            booking={booking}
            onUpdateBooking={handleAPIUpdateBooking}
          /> */}
            {/* <CloseBooking
              booking={booking}
              onBookingClosed={handleBookingClosed}
            /> */}
          </div>

          <div className="px-4 md:px-20 flex items-center justify-center font-semibold">
            <button
              className={`py-2 px-4 ml-4 mr-4 mb-2 rounded-lg shadow-xl flex items-center justify-center ${
                showTrucks
                  ? "bg-sky-600 text-white hover:scale-110"
                  : "text-white/10 bg-white hover:bg-sky-4 hover:scale-110 hover:shadow-lg"
              } transition duration-300`}
              onClick={() => {
                setShowTrucks(true);
                setShowPatterns(true); // Add this line to synchronize the state
              }}
            >
              Trucks
            </button>
            <button
              className={`py-2 px-4 mb-2 rounded-md shadow-lg flex items-center justify-center ${
                !showTrucks
                  ? "bg-sky-600 text-white hover:scale-110"
                  : "text-white/10 bg-white hover:bg-sky-4 hover:scale-110 hover:shadow-lg"
              } transition duration-300`}
              onClick={() => {
                setShowTrucks(false);
                setShowPatterns(false); // Add this line to synchronize the state
              }}
            >
              Patterns
            </button>
          </div>
        </Card>
      </motion.div>
      <div className="md:px-12">
        {showPatterns === true && (
          <TruckDriverData
            selectedBooking={booking}
            trucks={filteredTrucks}
            onTruckCreated={onTruckCreated}
          />
        )}
        {showPatterns === false && <BookingPattern booking={booking} />}
      </div>
    </div>
  );
};

export default BookingInfo;
