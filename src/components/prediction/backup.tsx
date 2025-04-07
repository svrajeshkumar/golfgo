"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLazyGetWeatherApiQuery } from "../../../lib/redux/golfCourseApi/golfCourseApi";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import DistanceCanvas from "./_DistanceCanvas";

const Prediction = () => {
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [markerPosition, setMarkerPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [showClubPopup, setShowClubPopup] = useState(false);
  const [confirmedStart, setConfirmedStart] = useState(false);
  const [showShotPopup, setShowShotPopup] = useState(false);
  const [showTeeShotForm, setShowTeeShotForm] = useState(false);
  const searchParam = useSearchParams();
  const [showInfoPopup, setShowInfoPopup] = useState(false);
  const [getWeatherApi, { isLoading, data }] = useLazyGetWeatherApiQuery();
  const divRef = useRef(null);
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMarkerPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setShowConfirmPopup(true);
  };

  const handleConfirmYes = () => {
    if (markerPosition) {
      setConfirmedStart(true); // Confirm the location
    }
    setShowConfirmPopup(false);
    setShowConfirmPopup(false);
    setShowClubPopup(true);
    setTimeout(() => {
      setShowShotPopup(true);
    }, 5000);
    const handleConfirmNo = () => {
      setMarkerPosition(null); // Remove marker
      setShowConfirmPopup(false);
    };
    const handleConfirmYes = () => {
      setShowConfirmPopup(false);
      setConfirmedStart(true); // Confirm the location
    };
  };
  const handleShotYes = () => {
    setShowShotPopup(false);
    setTimeout(() => {
      setShowTeeShotForm(true);
    }, 100);
    // Add logic for what happens after confirming the shot
  };
  const handleShotNo = () => {
    setShowShotPopup(false);
  };
  const router = useRouter();
  const handleSubmitTeeShot = () => {
    setShowTeeShotForm(false);
  };
  useEffect(() => {
    const latitude = Number(searchParam.get("latitude"));
    const longitude = Number(searchParam.get("longitude"));
    if (latitude && longitude) {
      getWeatherApi({ coordinates: { latitude, longitude } });
    }
  }, [searchParam]);

  const formatWindDirection = (degree?: number) => {
    if (degree === undefined) return "Unknown";
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const index = Math.round(degree / 45) % 8;
    return directions[index];
  };

  return (
    <div
      ref={divRef}
      className="relative w-full h-screen bg-gray-900 flex flex-col items-center"
    >
      <>
        <div
          onClick={() => setShowInfoPopup(!showInfoPopup)}
          className="absolute flex flex-col items-center justify-center  bg-white border border-gray-100  top-5 right-5 w-[30px] h-[30px]  z-60 rounded-full"
        >
          {showInfoPopup && <IoIosArrowDown size={20} />}
          {!showInfoPopup && <IoIosArrowUp size={20} />}
        </div>
        {showInfoPopup && (
          <>
            <div className="absolute pl-5 pr-15 top-5 left-1/2 -translate-x-1/2 w-full flex gap-2 z-50">
              <div className="bg-black text-white rounded-lg p-3 w-full shadow-lg border border-red-500">
                <h3 className="text-sm font-semibold">
                  {searchParam.get("club_name") || "Unknown Course"}
                </h3>
              </div>
              <div className="bg-black text-white rounded-lg p-3 w-full shadow-lg flex items-center justify-between border border-blue-500">
                <div className="text-center">
                  <p className="text-xs text-gray-400">Hole</p>
                  <p className="text-lg font-semibold">1</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400">Par</p>
                  <p className="text-lg font-semibold">4</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400">Yds</p>
                  <p className="text-lg font-semibold">420</p>
                </div>
              </div>
            </div>
            <div className=" absolute pl-5 pr-5 top-25 left-1/2 -translate-x-1/2 w-full flex gap-2  z-50">
              {data ? (
                <div className="bg-black text-white rounded-lg pb-1 shadow-lg flex-2 border border-green-500">
                  <div className="flex gap-6">
                    <img src="/images/weather.png" />
                    <p className="text-xl text-start pt-4">
                      Temp: {data?.data?.apparentTemperature?.toFixed(1)}°F
                    </p>
                  </div>
                  <div className="flex gap-5 pl-2">
                    <p>
                      <span style={{ color: "#f7d794" }}>W Direction:</span>
                      <span className="bg-gray-700 text-white px-2 py-1 rounded-md">
                        {formatWindDirection(data?.data?.windDirection10m)}
                      </span>
                    </p>
                    <p>
                      <span style={{ color: "#f7d794" }}>W Speed :</span>
                      <span className="bg-gray-700 text-white px-2 py-1 rounded-md">
                        {data?.data?.windSpeed10m?.toFixed(1)}mph
                      </span>
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-white">Loading Weather...</p>
              )}
            </div>
          </>
        )}
      </>

      {/* Map Section */}
      <div
        className="relative flex-1 w-full bg-cover bg-center border border-yellow-500"
        style={{
          backgroundImage: "url('/images/golfcourse.png')",
        }}
        onClick={handleMapClick}
      >
        {/* 📍 Marker */}
        {confirmedStart && markerPosition && (
          <div
            className="absolute text-2xl"
            style={{ top: markerPosition.y - 20, left: markerPosition.x - 10 }}
          >
            📍
          </div>
        )}
      </div>

      {/* Confirm Location Popup */}
      {showConfirmPopup && !confirmedStart && (
        <div className="absolute bottom-30 left-1/2 transform -translate-x-1/2 w-[70%] max-w-lg bg-black text-white p-4 rounded-lg shadow-lg text-center">
          <p>Confirm marked location as start point?</p>
          <div className="flex justify-center gap-4 mt-2">
            <button
              className="bg-green-500 px-4 py-2 rounded"
              onClick={handleConfirmYes}
            >
              Yes
            </button>
            <button
              className="bg-red-500 px-4 py-2 rounded"
              onClick={() => setShowConfirmPopup(false)}
            >
              No
            </button>
          </div>
        </div>
      )}
      {showShotPopup && (
        <div className="absolute bottom-30 left-1/2 transform -translate-x-1/2 w-[70%] max-w-lg bg-black text-white p-4 rounded-lg shadow-lg text-center">
          <p>Have you hit the driver shot?</p>
          <div className="flex justify-center gap-4 mt-2">
            <button
              className="bg-green-500 px-4 py-2 rounded"
              onClick={handleShotYes}
            >
              Yes
            </button>
            <button
              className="bg-red-500 px-4 py-2 rounded"
              onClick={handleShotNo}
            >
              No
            </button>
          </div>
        </div>
      )}
      {showTeeShotForm && (
        <div className="absolute bottom-22 left-1/2 transform -translate-x-1/2 w-[70%] max-w-lg bg-black text-white p-6 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold">Tee-shot Details</h2>
          <p className="text-sm text-gray-400">
            Tap on the fields to change the value
          </p>

          <input
            type="text"
            placeholder="Distance (yds)"
            className="w-full bg-gray-800 text-white p-2 rounded mt-3"
          />
          <input
            type="text"
            placeholder="Club Used"
            className="w-full bg-gray-800 text-white p-2 rounded mt-3"
          />
          <input
            type="text"
            placeholder="Wind (MPH)"
            className="w-full bg-gray-800 text-white p-2 rounded mt-3"
          />
          <textarea
            placeholder="Adjustment Notes"
            className="w-full bg-gray-800 text-white p-2 rounded mt-3 h-20"
          ></textarea>

          <button
            className="w-full bg-blue-600 text-white py-2 rounded mt-4"
            onClick={handleSubmitTeeShot}
          >
            Submit
          </button>
        </div>
      )}
      {/* Club Selection */}
      <div className="absolute bottom-1 left-3 bg-black text-white rounded-2xl p-2 shadow-lg border border-purple-500">
        <p className="text-left text-lg">Select Club Type</p>
        <div className="flex mt-2 mb-2">
          <select className="bg-gray-800 text-white px-6 py-2 rounded-full">
            <option value="driver">Driver</option>
            <option value="iron">Iron</option>
            <option value="putter">Putter</option>
            <option value="wedge">Wedge</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default Prediction;
