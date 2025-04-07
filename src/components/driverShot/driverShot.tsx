"use client";
import { useState } from "react";

const DriverShot = () => {
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [showClubPopup, setShowClubPopup] = useState(false);

  const handleMapClick = () => {
    setShowConfirmPopup(true);
  };
  const handleConfirmYes = () => {
    setShowConfirmPopup(false);
    setShowClubPopup(true);
  };

  const handleClosePopup = () => {
    setShowConfirmPopup(false);
  };

  return (
    <div className="relative w-full h-screen bg-gray-900 flex flex-col items-center">
      <div className="absolute top-2 left-4 right-4 flex gap-2">
        {/* Left Box - Course Name */}
        <div className="bg-black text-white rounded-lg p-3 shadow-lg flex-2">
          <h3 className="text-sm font-semibold">Old Cove</h3>
          <p className="text-xs text-white-400">Choose your starting point</p>
        </div>

        {/* Right Box - Hole Info */}
        <div className="bg-black text-white rounded-lg p-3 shadow-lg flex items-center gap-8">
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
      <div className="absolute top-20 left-4 right-4 flex gap-2">
        {/* Left Box - Course Name */}
        <div className="bg-black text-white rounded-lg p-3 shadow-lg flex-2">
          <div className="flex gap-6">
            <img src="/images/weather.png" />
            <p className="text-3xl font-bold text-start pt-4">48°</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 pb-3 pt-3">
              A few passing clouds. Low 48F. Winds SW at 5 to 10 mph
            </p>
          </div>
          <div className="flex gap-[40px]">
            <div className="flex flex-col items-center">
              <img src="/images/Humidity.png"/>
              <p className="text-sm">Humidity</p>
              <b>61%</b>
            </div>
            <div className="flex flex-col items-center">
              <img src="/images/wind.png" />
              <p className="text-sm">Winds</p>
              <b>SW 7MPH</b>
            </div>
          </div>
        </div>
      </div>
      {/* Map Section */}
      <div
        className="flex-1 w-full bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://s3-alpha-sig.figma.com/img/6eb0/0430/381f745255ba91ad7852dc7802a6995f?Expires=1742774400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=pyEsl3ZQv~~HJGvc-d-Y0lLw5wAnDa3yYvdX83UMDaT4XbBA60XauFZYNS38msWYCf~GDkkhSVg59c7QXDougLZ5ZNNbfB50v0WIrHdgU~1qHEFfRH9QH5-b8Qn2VBnjOU9Y6rRv09Nj8D9R7~zU67wIOOjich2SRQZaujGGSRxQgWybQdqKnxma5pWZ~b028CwKbPMgF6YW8Lm2qFWp1C~IJXaA5dZWlSHmRVbptfzSXZz16QrhlGKf93~fufhY~JqvyBHusmQ-Mp8M6XmDw7N2Zdo6MRIPwiwp7WBAV9em7BbnXB8bkPnVL9h4JwXrAIinRyXJABJtOOJxDMHVfg__')",
        }}
        onClick={handleMapClick}
      ></div>

      {/* Bottom Confirmation Popup */}
      {showConfirmPopup && (
        <div className="absolute bottom-0 left-0 right-0 bg-black text-white rounded-t-2xl p-4 shadow-lg">
          <p className="text-center text-lg">
            Confirm marked location as starter point?
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <button
              className="bg-green-500 text-white px-6 py-2 rounded-full"
              onClick={handleConfirmYes}
            >
              Yes
            </button>
            <button
              className="bg-red-500 text-white px-6 py-2 rounded-full"
              onClick={handleClosePopup}
            >
              No
            </button>
          </div>
        </div>
      )}
       {showClubPopup && (
        <div className="absolute bottom-4 left-3 right-50 bg-black text-white rounded-2xl pl-4 shadow-lg">
          <p className="text-left text-lg">Select Club Type</p>
          <div className="flex mt-4 mb-2">
            <select className="bg-gray-800 text-white px-6 py-2 rounded-full">
              <option value="driver">Driver</option>
              <option value="iron" >Iron</option>
              <option value="putter">Putter</option>
              <option value="wedge">Wedge</option>
            </select>
          </div>
          {/* <div className="flex mt-4">
            <button
              className="bg-blue-500 text-white px-6 py-2 rounded-full"
              onClick={handleClosePopup}
            >
              Confirm
            </button>
          </div> */}
        </div>
      )}
    </div>
  );
};

export default DriverShot;
