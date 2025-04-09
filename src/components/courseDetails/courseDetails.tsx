"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLazyGetGolfCourseByPlaceIdApiQuery } from "../../../lib/redux/golfCourseApi/golfCourseApi";

const CourseDetailsComponent = () => {
  const router = useRouter();
  const searchParam = useSearchParams();
  const placeId = searchParam.get("place_id");
  const latitude = searchParam.get("latitude");
  const longitude = searchParam.get("longitude");
  const club_name = searchParam.get("club_name");

  const [getGolfCourseByPlaceIdApi, { isLoading, data }] =
    useLazyGetGolfCourseByPlaceIdApiQuery();

  useEffect(() => {
    if (placeId) {
      getGolfCourseByPlaceIdApi({
        place_id: placeId,
      });
    }
  }, [placeId]);
  console.log(data);
  const handleStart = () => {
    router.push(
      `/prediction?latitude=${latitude}&longitude=${longitude}&club_name=${club_name}&place_Id=${placeId}`
    );
  };

  return (
    <div className="relative w-full h-screen bg-gray-900 flex flex-col items-center">
      <div
        className="relative flex-1 w-full h-[40%] bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/course.jpg')",
        }}
      ></div>
      <div className="bg-black text-white h-[60%]  rounded-lg p-3 w-full shadow-lg  rounded-t-3xl">
        <div>
          <h2 className="text-2xl font-semibold pb-5 pl-3">
            {data?.data?.course_details?.result?.name}
          </h2>
        </div>

        <div className="flex items-center justify-between pt-5 px-5">
          <div className="text-center">
            <p className="text-xs text-gray-400">Length</p>
            <p className="text-lg font-semibold">1</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-400">Rating/Slope</p>
            <p className="text-lg font-semibold">
              {" "}
              {data?.data?.course_details?.result?.rating}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-400">Scorecard</p>
            <p className="text-lg font-semibold">413</p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center pt-5">
          {/* <span className="text-red-500 mr-2 bg-amber-50 rounded-3xl px-2">
            📍
          </span> */}
          <h2 className="text-lg font-semibold">Location</h2>
        </div>
        <div>
          <p className="text-sm text-gray-500 text-center pt-2">
            {data?.data?.course_details?.result?.formatted_address}
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center p-4">
          {/* Phone Number Section */}
          <div className="flex flex-col items-center md:items-start px-4">
            <h2 className="text-lg font-semibold">Phone No</h2>
            <p className="text-sm text-gray-500 pt-3">
              {data?.data?.course_details?.result?.formatted_phone_number ||
                "N/A"}
            </p>
          </div>

          {/* Website Section */}
          <div className="flex flex-col items-center md:items-start px-4 pt-2">
            <h2 className="text-lg font-semibold">Website</h2>
            <p className="text-sm text-gray-500 pt-3">
              <a
                href={data?.data?.course_details?.result?.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {data?.data?.course_details?.result?.website || "N/A"}
              </a>
            </p>
          </div>
        </div>

        <div className="mt-auto w-full flex justify-center pb-6 pt-20 gap-5">
          <button
            className="bg-white text-black px-15 py-2 rounded-full text-lg font-semibold shadow-md"
            // onClick={() => router.push(`/prediction?latitude=${course?.latitude}&longitude=${course?.longitude}&club_name=${course.club_name}&place_id=${course.place_id}`)}
            onClick={handleStart}
          >
            Start
          </button>
          <button
            className="bg-white text-black px-15 py-2 rounded-full text-lg font-semibold shadow-md"
            onClick={() => router.push("/GolfCourse")}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

const CourseDetails = () => {
  return (
    <Suspense>
      <CourseDetailsComponent />
    </Suspense>
  );
};

export default CourseDetails;
