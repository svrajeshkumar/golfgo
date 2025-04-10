import React, { useEffect, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useUpdateUserMutation } from "../../../lib/redux/userApi/userApi";

const options = [
  {
    title: "The Tumbler",
    description:
      "Low-ball hitters who are accurate with above-average short game",
    example: "Example: Viktor Hovland, Matt Fitzpatrick",
    backendValue: {
      type: "TUMBLER",
      characteristics:
        "Low-ball hitters who are accurate with above-average short game",
    },
  },
  {
    title: "The Knucklers",
    description:
      "High ball flight, maximizing distance from tee with average approach and short games",
    example: "Example: Rory McIlroy, Justin Thomas",
    backendValue: {
      type: "KNUCKLER",
      characteristics:
        "High ball flight, maximizing distance off the tee with average approach game and short game",
    },
  },
  {
    title: "The Floaters",
    description:
      "High ball flight, accurate with irons and below average short game.",
    example: "Example: Brooks Koepka, Jon Rahm",
    backendValue: {
      type: "FLOATER",
      characteristics:
        "High ball flight, accurate with irons and below-average short game.",
    },
  },
  {
    title: "The Risers",
    description:
      "Mid ball flight, accurate with irons and above average short game, average with drivers.",
    example: "Example: Brooks Koepka, Jon Rahm",
    backendValue: {
      type: "RISER",
      characteristics:
        "Mid ball flight, accurate with irons and above-average short game, average with drivers.",
    },
  },
];

const GolfSelection: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const router = useRouter();

  const handleSelect = () => {
    if (selectedIndex === null) return;

    const storedUser = localStorage.getItem("user_info");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const userId = user?._id;

    if (!userId) {
      console.error("User ID not found in localStorage");
      return;
    }

    const selectedProfile = options[selectedIndex].backendValue;
    localStorage.setItem(
      "golfProfile",
      JSON.stringify({
        playerType: selectedProfile,
        tournamentPrep: false,
        ballFlight: "DRAW",
        playStyle: "AGGRESSIVE",
        dexterity: "LEFT_HANDED",
      })
    );
    router.push("/GolfQuestions");
    
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "url(/images/question.png) center/cover no-repeat",
        color: "white",
        // backgroundColor:"black",
        textAlign: "center",
        px: 3,
      }}
    >
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        How would you describe yourself?
      </Typography>
      {options.map((option, index) => (
        <Box
          key={option.title}
          sx={{
            mb: 2,
            p: 2,
            backgroundColor: "rgba(0,0,0,0.6)",
            borderRadius: 2,
            justifyContent: "left",
            textAlign: "left",
            alignItems: "left",
            width: "90%",
            border: selectedIndex === index ? "2px solid #4CAF50" : "none",
          }}
          onClick={() => setSelectedIndex(index)}
        >
          <Typography variant="h6" fontWeight="bold">
            {option.title}
          </Typography>
          <Typography variant="body2">{option.description}</Typography>
          <Typography variant="caption">{option.example}</Typography>
        </Box>
      ))}

      <Button
        variant="contained"
        sx={{
          mt: 3,
          borderRadius: "25px",
          width: "80%",
          backgroundColor: "white",
          color: "black",
          fontSize: "16px",
          fontWeight: "bold",
          padding: "10px 0",
          "&:hover": { backgroundColor: "#ddd", color: "black" },
        }}
        onClick={handleSelect}
      >
        Select
      </Button>
    </Box>
  );
};

export default GolfSelection;
