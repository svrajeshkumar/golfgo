import { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useUpdateUserMutation } from "../../../lib/redux/userApi/userApi";

const questions = [
  {
    key: "dexterity",
    question: "What is your dexterity?",
    options: [
      { value: "right", label: "Right handed" },
      { value: "left", label: "Left handed" },
    ],
  },
  {
    key: "tournament",
    question: "Are you preparing for a tournament?",
    options: [
      { value: "yes", label: "✅ Yes" },
      { value: "no", label: "❌ No" },
    ],
  },
];

const GolfQuestions = () => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const router = useRouter();
  const [updateUser] = useUpdateUserMutation();

  const handleAnswer = (key: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };



  const handleSubmit = () => {
    const storedUser = localStorage.getItem("user_info");
    const golfProfile = JSON.parse(
      localStorage.getItem("golfProfile") as string
    );
    const user = storedUser ? JSON.parse(storedUser) : null;
    const userId = user?._id;

    if (!userId) {
      console.error("User ID not found in localStorage");
      return;
    }

    updateUser({
      userId,
      golfProfile: {
        ...golfProfile,
        tournamentPrep: answers["tournament"] === "yes",
        dexterity:
          answers["dexterity"] === "right" ? "RIGHT_HANDED" : "LEFT_HANDED",
      },
    }).then(() => {
      router.push("/GolfCourse");
    });
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: "url(/images/question.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "white",
        textAlign: "center",
        px: 3,
      }}
    >
      {questions.map((q) => (
        <Box key={q.key} sx={{ mb: 4, p: 2 }}>
          <Typography
            variant="h6"
            fontWeight="500"
            sx={{ mb: 2, backgroundColor: "rgba(0,0,0,0.6)", borderRadius: 2 }}
          >
            {q.question}
          </Typography>
          <Box display="flex" gap={2} justifyContent="center">
            {q.options.map((option) => (
              <Button
                key={option.value}
                variant={
                  answers[q.key] === option.value ? "contained" : "outlined"
                }
                onClick={() => handleAnswer(q.key, option.value)}
                sx={{
                  px: 2,
                  py: 1.5,
                  borderRadius: "25px",
                  fontWeight: 400,
                  color: answers[q.key] === option.value ? "white" : "black",
                  backgroundColor:
                    answers[q.key] === option.value ? "#1976d2" : "white",
                  "&:hover": {
                    backgroundColor:
                      answers[q.key] === option.value ? "#1565c0" : "lightgray",
                  },
                }}
              >
                {option.label}
              </Button>
            ))}
          </Box>
        </Box>
      ))}
      <Button
        variant="contained"
        sx={{
          backgroundColor: "white",
          color: "black",
          mt: 4,
          px: 15,
          py: 1.5,
          borderRadius: "25px",
          fontWeight: 500,
        }}
        onClick={() => handleSubmit()}
      >
        Submit
      </Button>
    </Box>
  );
};

export default GolfQuestions;
