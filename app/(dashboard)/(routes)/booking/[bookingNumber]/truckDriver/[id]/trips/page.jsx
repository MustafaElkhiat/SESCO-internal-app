"use client";
import React, { useEffect, useState } from "react";
import { Heading } from "@/components/heading";
import Link from "next/link";
import { CalendarDays, ShieldX, CheckSquare } from "lucide-react";
import { Card } from "@/components/ui/card";
import TruckDriverData from "../../../../components/truckDriverData";
import { v4 as uuidv4 } from "uuid";
import useSWR from "swr";
import { fetcher, POSTAPI, PUTAPI } from "/utities/test";
import CheckPoint from "./CheckPoint";
import TripList from "@/app/(dashboard)/(routes)/booking/[bookingNumber]/truckDriver/[id]/trips/TripList";
import LoadingAnimation from "../../../../../../../../components/LoadingAnimation"; // Adjust the path accordingly
import { motion } from "framer-motion";

const TripsInfo = ({ params }) => {
  const [booking, setBooking] = useState(null);
  const [truckDriver, setTruckDriver] = useState(null);
  const [tripList, setTripList] = useState([]);
  const [trucks, setTrucks] = useState([]);
  const [filteredTrucks, setFilteredTrucks] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);

  const bookingNumber = params.bookingNumber;

  //const fetcher = (url) => fetch(url).then((res) => res.json());

  const { data, error, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_api_url}/api/booking/bookingNumber/${bookingNumber}`,
    fetcher
  );

  useEffect(() => {
    if (data) {
      setBooking(data);
      setTruckDriver(
        data.truckDriverList.find((truckDriver) => truckDriver.id == params.id)
      );
    }
  }, [data]);
  useEffect(() => {
    if (truckDriver) setTripList(truckDriver.tripList);
  }, [truckDriver]);

  if (!booking) {
    return <LoadingAnimation />;
  }

  if (truckDriver)
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
          className="flex flex-col md:flex-row justify-between gap-4 px-4 lg:px-16 xl:px-32 space-y-4"
        >
          <Card className="w-full p-4 border-black/5 flex flex-col mt-4 shadow-md hover:shadow-xl transition rounded-2xl">
            <div className="  flex items-center justify-center mb-4  ">
              <div className="w-full ">
                <div className="flex text-lg  mb-2 bg-gray-100 shadow-xl p-2 items-center justify-center rounded-t-2xl font-semibold">
                  <div className="text-left ">Booking Number:</div>

                  {booking.bookingNumber || "..........."}
                </div>
                <div className="flex justify-between mb-2 shadow-md p-2">
                  <div className="text-left text-sm">Work Order:</div>
                  <div className="text-right ">
                    {booking.workOrderNumber || "..........."}
                  </div>
                </div>
                <div className="flex justify-between mb-2 shadow-md p-2">
                  <div className="text-left text-sm">Vessel:</div>
                  <div className="text-right ">
                    {booking.vessel.name || "..........."}
                  </div>
                </div>
                <div className="flex justify-between shadow-md p-2">
                  <div className="text-left text-sm">Cargo:</div>
                  <div className="text-right ">
                    {booking.cargo.name || "..........."}
                  </div>
                </div>
                <div className="flex justify-between shadow-md p-2">
                  <div className="text-left text-sm">Sub Cargo:</div>
                  <div className="text-right ">
                    {booking.subCargo.name || "..........."}
                  </div>
                </div>
                <div className="flex justify-between shadow-md p-2">
                  <div className="text-left text-sm">IMEX:</div>
                  <div className="text-right ">
                    {booking.imex || "..........."}
                  </div>
                </div>
                <div className="flex justify-between shadow-md p-2">
                  <div className="text-left text-sm">Number of Trucks:</div>
                  <div className="text-right ">
                    {booking.truckDriverList.length || "..........."}
                  </div>
                </div>
                <div className="flex justify-between shadow-md p-2">
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
          </Card>

          <Card className="w-full p-4 border-black/5 grid mt-4 shadow-md hover:shadow-xl transition rounded-2xl">
            <div className="flex items-center justify-center mb-4">
              <div className="w-full">
                <div className="w-full">
                  <div className="flex justify-between mb-2 shadow-md p-2">
                    <div className="text-left text-sm">Contractor:</div>
                    <div className="text-right">
                      {truckDriver.contractor.name || ".................."}
                    </div>
                  </div>
                  <div className="flex justify-between mb-2 shadow-md p-2">
                    <div className="text-left text-sm">Driver Name:</div>
                    <div className="text-right">
                      {truckDriver.driver.name || ".................."}
                    </div>
                  </div>

                  <div className="flex justify-between mb-2 shadow-md p-2">
                    <div className="text-left text-sm">Truck Code:</div>
                    <div className="text-right">
                      {truckDriver.truck.number || ".................."}
                    </div>
                  </div>
                  <div className="flex justify-between mb-2 shadow-md p-2">
                    <div className="text-left text-sm">Number Of Trips:</div>
                    <div className="text-right">
                      {truckDriver.tripList.filter((trip) => !trip.isOpened)
                        .length || 0}
                    </div>
                  </div>

                  <div className="flex justify-center mb-2 shadow-md p-2">
                    {truckDriver.truckDriverStatus === "RELEASED" && (
                      <div className="flex justify-center mb-2 text-sm font-semibold">
                        {truckDriver.truckDriverStatusDetails[
                          truckDriver.truckDriverStatusDetails.length - 1
                        ].releaseType && (
                          <span className="block">
                            Released:{" "}
                            {
                              truckDriver.truckDriverStatusDetails[
                                truckDriver.truckDriverStatusDetails.length - 1
                              ].releaseType
                            }
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                {/* ... Other details ... */}
              </div>
            </div>
          </Card>
        </motion.div>
        <TripList tripList={tripList} />
      </div>
    );
};

export default TripsInfo;
