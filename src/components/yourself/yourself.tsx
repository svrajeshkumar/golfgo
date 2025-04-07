import React, { useEffect, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import SwipeableViews from "react-swipeable-views";

const options = [
  {
    title: "The Tumbler",
    description:
      "Low-ball hitters who are accurate with above-average short game",
    image: "/images/tumbler.png",
  },
  {
    title: "The Knucklers",
    description:
      "High ball flight, maximizing distance off the tee with average approach game and short game",
    image: "/images/knukler.png",
  },
  {
    title: "The Risers",
    description:
      "Mid ball flight, accurate with irons and above-average short game, average with drivers.",
    image: "/images/Risers.png",
  },
  {
    title: "The Floaters",
    description:
      "High ball flight, accurate with irons and below-average short game.",
    image: "/images/floater.png",
  },
];

const GolfSelection: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [index, setIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#000",
          width: "100vw",
          paddingBottom:"30"
        }}
      >
        <img src="/images/logo.png" alt="Logo" />
        <Typography
          variant="h5"
          sx={{ position: "absolute", textAlign: "center", color: "#fff",  paddingTop:30}}
        >
          Let’s start with
          <br /> a few basic questions.
        </Typography>
      </Box>
    );
  }

  return (
    <SwipeableViews
      index={index}
      onChangeIndex={(i) => setIndex(i)}
      enableMouseEvents
      style={{ height: "100vh" }}
    >
      {options.map((option, i) => (
        <Box
          key={option.title}
          sx={{
            position: "relative",
            width: "100vw",
            height: "100vh",
            background: `url(${option.image}) center/cover no-repeat`,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            alignItems: "center",
            padding: "20px",
          }}
        >
          <Box
            sx={{
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              padding: "16px",
              borderRadius: "10px",
              textAlign: "center",
              color: "white",
              width: "90%",
            }}
          >
            <Typography variant="h5" fontWeight="bold">
              {option.title}
            </Typography>
            <Typography variant="body2">{option.description}</Typography>
          </Box>

          <Button
            variant="contained"
            sx={{
              mt: 2,
              borderRadius: "25px",
              width: "80%",
              backgroundColor: "white",
              color: "black",
              fontSize: "16px",
              fontWeight: "bold",
              padding: "10px 0",
              "&:hover": { backgroundColor: "#ddd" },
            }}
            onClick={() => router.push("/GolfQuestions")}
          >
            Select
          </Button>

          <Box sx={{ display: "flex", gap: "6px", mt: 2 }}>
            {options.map((_, idx) => (
              <Box
                key={idx}
                sx={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: index === idx ? "white" : "gray",
                }}
              />
            ))}
          </Box>
        </Box>
      ))}
    </SwipeableViews>
  );
};

export default GolfSelection;