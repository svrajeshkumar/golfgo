"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Box,
  Button,
  Checkbox,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
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
  // firstName: yup.string().required("First name is required"),
  // lastName: yup.string().required("Last name is required"),
  // gender: yup.string().required("Gender is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  // phoneNumber: yup
  //   .string()
  //   .matches(/^\d{10}$/, "Phone number must be 10 digits")
  //   .required("Phone number is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const SignUp: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [registerNewUser, { isLoading, isError }] =
    useRegisterNewUserMutation();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
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
        console.log(response);
        if (response?.error) {
          alert("User Already Exists!!");
        } else {
          router.push("/yourself");
        }
      })
      .catch((error) => {
        console.log(error);
        alert(error.message);
      })
      .finally(() => {});
  };

  return (
    <Box>
      <Container maxWidth="xs">
        <Box
          display="flex"
          justifyContent="center"
          mb={2}
          sx={{ backgroundColor: "black" }}
        >
          <img src="/images/logo.png" alt="Golf Player" />
        </Box>
        <Typography variant="h5" fontWeight="bold" gutterBottom py={5}>
          Sign Up
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12} py={5}>
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
                }}
              />
            </Grid>
            <Grid item xs={12} py={5}>
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
              />
            </Grid>
            <Grid item xs={12} py={5}>
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
                  InputProps: {
                    endAdornment: (
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        size="small"
                      >
                        {showPassword && <Visibility />}
                        {!showPassword && <VisibilityOff />}
                      </IconButton>
                    ),
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} py={3}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isLoading}
                sx={{
                  backgroundColor: "black",
                  color: "white",
                  borderRadius: "50px",
                  py: 1.5,
                }}
              >
                Submit
              </Button>
            </Grid>
            <Grid item xs={12} py={3}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isLoading}
                sx={{
                  backgroundColor: "black",
                  color: "white",
                  borderRadius: "50px",
                  py: 1.5,
                }}
                onClick={() => router.push("signIn")}

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
