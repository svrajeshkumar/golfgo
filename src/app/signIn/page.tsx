"use client";
import * as React from "react";
import { Box, styled, Typography } from "@mui/material";
import SignupContainer from "@/components/signup/signup";

const StyledSignUpContainer = styled(Box)(({ theme }) => ({
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  //   backgroundColor: theme.palette.background.default,
}));

const SignUpPage = () => {
  return (
    <StyledSignUpContainer>
      <SignupContainer />;
    </StyledSignUpContainer>
  );
};

export default SignUpPage;
