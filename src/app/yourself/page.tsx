"use client";
import * as React from "react";
import { Box, styled, Typography } from "@mui/material";
import YourSelfContainer from "@/components/yourself/yourself";


const StyledYourSelfContainer = styled(Box)(({ theme }) => ({
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  //   backgroundColor: theme.palette.background.default,
}));

const yourself = () => {
  return (
    <StyledYourSelfContainer>
      <YourSelfContainer  />;
    </StyledYourSelfContainer>
  );
};

export default yourself;
