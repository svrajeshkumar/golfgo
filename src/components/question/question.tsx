import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
} from "@mui/material";
import SwipeableViews from "react-swipeable-views";
import { useRouter } from "next/navigation";

const questions = [
  {
    key: "dexterity",
    question: "What is your dexterity?",
    options: [
      { value: "right", label: "Right handed" },
      { value: "left", label: "Left handed" },
    ],
    background: "/images/question.png",
  },
  // {
  //   key: "ballFlight",
  //   question: "What is your stock ball flight?",
  //   options: [
  //     { value: "draw", label: "Draw" },
  //     { value: "fade", label: "Fade" },
  //   ],
  //   background: "/images/question.png",
  // },
  {
    key: "tournament",
    question: "Are you preparing for a tournament?",
    options: [
      { value: "yes", label: "✅ Yes" },
      { value: "no", label: "❌ No" },
    ],
    background: "/images/question.png",
  },
  // {
  //   key: "playstyle",
  //   question: "How far do you hit a driver?",
  //   options: [],
  //   background: "/images/question.png",
  // },
];

const GolfQuestions = () => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [index, setIndex] = useState(0);
  const router = useRouter();

  const handleAnswer = (key: string, value: string) => {
    setAnswers({ ...answers, [key]: value });
    if (index < questions.length - 1) {
      setIndex(index + 1);
    }
  };

  return (
    <SwipeableViews index={index} onChangeIndex={setIndex} enableMouseEvents>
      {questions.map((q, i) => (
        <Box
          key={q.key}
          sx={{
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundImage: `url(${q.background})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            color: "white",
            textAlign: "center",
            px: 3,
          }}
        >
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{
              mb: 3,
              backgroundColor: "rgba(0,0,0,0.6)",
              p: 1,
              borderRadius: 2,
            }}
          >
            {q.question}
          </Typography>
          {q.options.length > 0 ? (
            <Box display="flex" gap={2}>
              {q.options.map((option) => (
                <Button
                  key={option.value}
                  variant="contained"
                  onClick={() => handleAnswer(q.key, option.value)}
                  sx={{
                    backgroundColor: "white",
                    color: "black",
                    px: 4,
                    py: 1.5,
                    borderRadius: "25px",
                    fontWeight: 500,
                    "&:hover": {
                      backgroundColor: "lightgray",
                    },
                  }}
                >
                  {option.label}
                </Button>
              ))}
            </Box>
          ) : (
            <TextField
              variant="outlined"
              placeholder="Enter distance (yards)"
              value={answers[q.key] || ""}
              onChange={(e) => handleAnswer(q.key, e.target.value)}
              sx={{
                backgroundColor: "white",
                borderRadius: 2,
                mt: 2,
                width: "80%",
              }}
            />
          )}
          {/* <Box mt={4} display="flex" justifyContent="space-between" width="80%">
            <Button
              onClick={() => setIndex(Math.max(index - 1, 0))}
              disabled={index === 0}
              sx={{ color: "white", backgroundColor: "rgba(0,0,0,0.6)", px: 4 }}
            >
              Previous
            </Button>
          </Box> */}
          {index === questions.length - 1 && (
            <Box textAlign="center">
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "white",
                  color: "black",
                  mt: 20,
                  px: 15,
                  py: 1.5,
                  borderRadius: "25px",
                  fontWeight: 500,
                }}
                onClick={() => router.push("/GolfCourse")}
              >
                Submit
              </Button>
            </Box>
          )}
        </Box>
      ))}
    </SwipeableViews>
  );
};

export default GolfQuestions;
