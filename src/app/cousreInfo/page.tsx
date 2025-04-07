"use client";
import * as React from "react";
import { Box, styled } from "@mui/material";
import GolfCourseList from "@/components/golfcourse/golfcourse";

const StyledCourseInfo = styled(Box)(({ theme }) => ({
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  //   backgroundColor: theme.palette.background.default,
}));

const GolfCourseInfoPage = () => {
  return <GolfCourseList />;
};

export default GolfCourseInfoPage;
