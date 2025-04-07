"use client";
import * as React from "react";
import { Box, styled, Typography } from "@mui/material";
import GolfQuestions from "@/components/question/question";

const StyledSGolfQuestionsContainer = styled(Box)(({ theme }) => ({
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  //   backgroundColor: theme.palette.background.default,
}));

const GolfQuestionsPage = () => {
  return (
    <StyledSGolfQuestionsContainer>
     <GolfQuestions/>
    </StyledSGolfQuestionsContainer>
  );
};

export default GolfQuestionsPage;
