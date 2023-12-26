"use client";
/**
 * @Project : sescoapp-API-main
 * @File : app/(dashboard)/(routes)/transactions/page.tsx
 * @Author : Eng. Mustafa Elkhiat
 * @Date : 12/7/2023
 * @Time : 12:05 PM
 */
import { QrScanner } from "@yudiel/react-qr-scanner";
import { POSTAPI } from "@/utities/test";
import { useEffect, useState } from "react";
import { Heading } from "@/components/heading";
import { ArrowLeftRight } from "lucide-react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingAnimation from "../../../../components/LoadingAnimation"; // Adjust the path accordingly


export default function TransactionPage() {
  const [lat, setLat] = useState<number>(0);
  const [long, setLong] = useState<number>(0);
  const [qrCodeValue, setQrCodeValue] = useState<string>(null);
  const parsedQrCode = JSON.parse(qrCodeValue);
  const [message, setMessage] = useState("");
  const [messageStatus,setMessageStatus]= useState('')

  const messageList = [
    {
      message: "Location is incorrect",
      status: "Error",
    },
    {
      message: "Truck Driver is released",
      status: "Error",
    },
    {
      message: "User is not authorized for this checkpoint",
      status: "Error",
    },
    {
      message: "Checkpoint has been added successfully",
      status: "Success",
    },
  ];

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        setLat(position.coords.latitude);
        setLong(position.coords.longitude);
      },
      (error) => {
        console.log(error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 5000,
      }
    );
  }, []);

  useEffect(() => {
    if (qrCodeValue) {
      const body = {
        lat,
        long,
        truckDriverId: parsedQrCode.truckDriverId,
      };
      console.log(`Scanned : ${qrCodeValue}`, body);
      setMessage("");
      addCheckPointToTrip(body).then((result) => {
        console.log(result.message);
        setMessage(result.message);
        checkMessage(result.message);
      });
    }
  }, [qrCodeValue]);

  const checkMessage = (message) => {
    const status = messageList.find((msg) => msg.message === message).status;
    if (status === "Error") {
        setMessageStatus('Error')
      // toast error
      toast.error(message, {
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
    } else {
        setMessageStatus('Success')
      // toast success
      toast.success(message, {
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

  const addCheckPointToTrip = async (body: any) => {
    return await POSTAPI(
      `/api/booking/${parsedQrCode.bookingNumber}/tripCheckPoint`,
      body
    );
  };

  return (
    <div>
      <Heading
        title="Transaction History"
        description="A Comprehensive View of Your Transactions."
        icon={ArrowLeftRight}
        iconColor="text-sky-700"
      />
      {/*{qrCodeValue && <div className="my-4">{qrCodeValue}</div>}
            {lat && long && <div className="my-4">{lat} , {long}</div>}*/}
      {/* {message.error && <div className="my-4 text-red-400">{message.error.message}</div>}*/}
      {message && <div className="my-4 text-green-400">{message}</div>}

      {lat && long && !qrCodeValue && (
        <div className="w-72 h-72 mx-auto">
          <QrScanner
            onDecode={(result) => setQrCodeValue(result)}
            onError={(error) => console.log(error?.message)}
          />
        </div>
      )}
      {!lat && !long && <LoadingAnimation />
}
      {!message && qrCodeValue && <div>...Loading</div>}
      <ToastContainer autoClose={3000} />

    </div>
  );
}
