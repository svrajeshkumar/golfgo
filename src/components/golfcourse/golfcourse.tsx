"use client";
import { useEffect, useState } from "react";
import { Search, Settings, Home, User } from "lucide-react";
import { useLazyGetAllGolfCoursesQuery } from "../../../lib/redux/golfCourseApi/golfCourseApi";
import { Box, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

function GolfCourseList() {
  const [search, setSearch] = useState("");
  const [showSplash, setShowSplash] = useState(true);
  const router = useRouter();
  const [
    getAllGolfCourses,
    { isLoading, isError, isFetching, data: dataGetAllGolfCourses },
  ] = useLazyGetAllGolfCoursesQuery();

  useEffect(() => {
    // Hide splash screen after 2 seconds
    const timer = setTimeout(() => {
      setShowSplash(false);
      getAllGolfCourses({
        latitude: "25.7163907",
        longitude: "-80.1618256",
        miles: "10",
      });
    }, 2000);
    return () => clearTimeout(timer);
  }, []);
  console.log(dataGetAllGolfCourses);

  if (showSplash) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#000",
          width: "100vw",
          textAlign: "center",
        }}
      >
        <img src="/images/logo.png" alt="Logo" width={100} />
        <Typography variant="h5" sx={{ color: "#fff", mt: 2 }}>
          You’re all set!
        </Typography>
      </Box>
    );
  }

  return (
    <div className="min-h-screen pt-[150px]  min-w-full bg-black text-white px-4 pb-16">
      <div className="fixed top-0 left-0 right-0 bg-black pl-5 pr-5">
        {/* Header */}
        <div className="flex items-center justify-between py-4">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <img src="/images/logo.png" width={50} height={50} alt="Logo" />{" "}
            GOLFGO
          </h1>
          <Settings className="w-6 h-6" />
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search for courses near you"
            className="w-full p-3 rounded-full bg-white text-black pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
        </div>
      </div>
      {/* Course List */}
      <div className="pb-[50px] flex flex-col gap-8">
        {dataGetAllGolfCourses?.data?.map((course, index) => (
          <div
            key={index}
            className="bg-gray-900 rounded-xl overflow-hidden cursor-pointer"
            onClick={() => router.push(`/CourseDetails?latitude=${course?.latitude}&longitude=${course?.longitude}&club_name=${course.club_name}&place_id=${course.place_id}`)}  
          >
            <img
              src={course?.image || "/images/golfcourse1.png"}
              alt={course.club_name}
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <p className="text-gray-400 text-sm">
                {course.number_of_holes} holes • {course?.distance || 4.3} miles
              </p>
              <h2 className="text-lg font-bold">{course.club_name}</h2>
              <p className="text-gray-400 text-sm">{course.state}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-black p-4 flex justify-around items-center rounded-t-2xl border-t border-gray-700">
        <div className="flex flex-col items-center text-white">
          <Home className="w-6 h-6" />
          <span className="text-sm">Home</span>
        </div>
        <div className="flex flex-col items-center text-white">
          <User className="w-6 h-6" />
          <span className="text-sm">Profile</span>
        </div>
      </div>
    </div>
  );
}

export default GolfCourseList;
