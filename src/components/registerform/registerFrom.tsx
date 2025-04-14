"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import TextInputFieldComponent from "../form-fileds/textInputFields";
import FormMobileInput from "../form-fileds/phoneInputField";
import { matchIsValidTel } from "mui-tel-input";
import { parsePhoneNumberWithError } from "libphonenumber-js";
import { useRegisterNewUserMutation } from "../../../lib/redux/userApi/userApi";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const SignUp: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [registerNewUser, { isLoading }] = useRegisterNewUserMutation();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: any) => {
    const phoneNumber = parsePhoneNumberWithError(data?.phoneNumber);
    const payload = {
      ...data,
      phoneNumber: phoneNumber.nationalNumber,
      countryCode: phoneNumber.countryCallingCode,
    };
    registerNewUser(payload)
      .then((response) => {
        if (response?.error) {
          alert("User Already Exists!!");
        } else {
          router.push("/yourself");
        }
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <Box
      sx={{ backgroundColor: "#000", minHeight: "100vh", color: "#fff", py: 4, }}
    >
      <Container maxWidth="xs">
        <Box display="flex" justifyContent="center" mb={2}>
          <img src="/images/logo.png" alt="Golf Player" />
        </Box>
        <Typography
          variant="h5"
          fontWeight="bold"
          gutterBottom
          textAlign="center"
          sx={{marginBottom:5}}
        >
          Sign Up
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <TextInputFieldComponent
                control={control}
                name="email"
                id="email"
                label="Email Address"
                defaultValue=""
                textFieldProps={{
                  fullWidth: true,
                  placeholder: "Email",
                  size: "medium",
                  type: "text",
                  InputLabelProps: {
                    style: { color: "white" },
                  },
                  InputProps: {
                    sx: {
                      backgroundColor: "#1e1e1e",
                      borderRadius: "8px",
                      input: {
                        color: "#fff",
                        fontWeight: 600,
                        "::placeholder": {
                          color: "black",
                        },
                      },
                    },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <FormMobileInput
                name="phoneNumber"
                size="medium"
                rules={{
                  required: "This is a required field",
                  validate: matchIsValidTel,
                }}
                control={control}
                defaultValue=""
                id="form-phone-input"
                placeholder="Enter phone number"
                sx={{
                  input: {
                    color: "#fff",
                    fontWeight: 600,
                    borderRadius: "8px",
                    backgroundColor: "#1e1e1e",
                    "&::placeholder": {
                      color: "white", 
                     
                    },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextInputFieldComponent
                control={control}
                name="password"
                id="password"
                label="Password"
                defaultValue=""
                textFieldProps={{
                  fullWidth: true,
                  placeholder: "Password",
                  size: "medium",
                  type: showPassword ? "text" : "password",
                  InputLabelProps: {
                    style: { color: "white" },
                  },
                  InputProps: {
                    endAdornment: (
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        size="small"
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    ),
                    sx: {
                      backgroundColor: "#1e1e1e",
                      borderRadius: "8px",
                      input: {
                        color: "#fff",
                        fontWeight: 600,
                        "::placeholder": {
                          color: "#aaa",
                        },
                      },
                    },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isLoading}
                sx={{
                  backgroundColor: "#34C759",
                  color: "#000",
                  fontWeight: "bold",
                  borderRadius: "50px",
                  py: 1.5,
                  marginTop:5,
                  "&:hover": {
                    backgroundColor: "#28a745",
                  },
                }}
              >
                Submit
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Button
                type="button"
                variant="contained"
                fullWidth
                disabled={isLoading}
                onClick={() => router.push("signIn")}
                sx={{
                  backgroundColor: "#007AFF",
                  color: "#fff",
                  fontWeight: "bold",
                  borderRadius: "50px",
                  py: 1.5,
                  "&:hover": {
                    backgroundColor: "#005bb5",
                  },
                }}
              >
                Log In
              </Button>
            </Grid>
          </Grid>
        </form>
      </Container>
    </Box>
  );
};

export default SignUp;
