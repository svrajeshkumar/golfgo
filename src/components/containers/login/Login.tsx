"use client";
import React from "react";
import Box from "@mui/material/Box";
import { Button, Grid2, styled, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

const StyledMainBoxWrapper = styled(Box)(({ theme }) => ({
  minHeight: "100dvh",
  backgroundRepeat: "repeat",
  backgroundSize: "100%",
  backgroundPosition: "top",
  //   "& .gradient-wrapper": {
  //     minHeight: "100dvh",
  //   },
  "& .MuiButton-root": {
    // ✅ Correctly targeting MUI buttons
    backgroundColor: "#303437",
    color: "#fff",
    marginRight: theme.spacing(1),
    "&:hover": {
      backgroundColor: "#50575a",
    },
  },
}));

const LoginContainer = () => {
  const router = useRouter();
  return (
    <StyledMainBoxWrapper style={{ backgroundColor: "black" }}>
      <Box
        component="div"
        className="h-screen pb-20 px-8 bg-gradient-to-b from-transparent  to-black to-95% flex flex-col items-start justify-end"
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh", // Ensures full screen height
            width: "100%", // Ensures full width
            flexDirection: "column",
          }}
        >
          <img
            src="/images/logo.png"
            style={{
              width: 200,
              height: 200,
              objectFit: "contain",
            }}
          />
        </Box>
        <Box mt={1} width="100%">
          <Button
            fullWidth={true}
            size="large"
            sx={{
              borderRadius: 100,
              px: 4,
              textTransform: "none",
              alignItems: "center ",
            }}
            onClick={() => router.push("/signIn")}
          >
            Let's Start
          </Button>
        </Box>
      </Box>
    </StyledMainBoxWrapper>
  );
};

export default LoginContainer;
