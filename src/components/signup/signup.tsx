"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useLogInUserMutation } from "../../../lib/redux/userApi/userApi";

const LoginForm: React.FC = () => {
  const [input, setInput] = useState(""); // Can be email or phone number
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();
  const [logInUser, { isLoading, isError, error }] = useLogInUserMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    logInUser({ input, password })
      .then((response) => {
        if (response?.data?.status === "success" && response?.data?.data?._id) {
          localStorage.setItem(
            "user_info",
            JSON.stringify(response?.data?.data)
          );
          router.push("/yourself");
        } else {
          // alert("Something went to wrong please try again...");
        }
        console.log(response);
      })
      .catch((error) => {
        // alert("Something went wrong please try again....");
      });
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center">
      <div className="max-w-full min-h-screen w-full bg-gray-300 rounded-lg shadow-lg">
        <div
          className="w-full bg-no-repeat h-[250] bg-center bg-black bg-contain"
          style={{ backgroundImage: `url("/images/logo.png")` }}
        ></div>
        <h2 className="text-3xl pl-7 pt-3 font-bold mb-3 text-gray-900">
          Sign In
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6 p-7">
            <div>
              <label
                htmlFor="input"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address/Phone No.
              </label>
              <input
                type="text"
                id="input"
                value={input}
                placeholder="Enter email or phone number"
                onChange={(e) => setInput(e.target.value)}
                className="mt-1 block w-full px-4 py-4 bg-gray-50 border border-gray-300 rounded-md 
                         focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black font-semibold"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                placeholder="Enter Password"
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-4 py-4 bg-gray-50 border border-gray-300 rounded-md 
                         focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black font-semibold"
                required
              />
            </div>

            <div className="flex items-center justify-between w-3/4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember-me"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="text-blue-600 hover:text-blue-500">
                  Forgot Password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-4 px-4 border border-black 
             rounded-lg shadow-sm text-sm font-medium text-white 
             ${isLoading ? "bg-gray-600" : "bg-black hover:bg-gray-900"} 
             focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black`}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>

            {isError && (
              <p className="text-red-600 text-sm mt-2">
                {(error as any)?.data?.message || "Login failed"}
              </p>
            )}
          </div>
        </form>

        <div className="p-7 border-t-5 border-dotted border-gray-400">
          <button
            className="w-full flex justify-center py-4 px-4 border border-black 
             rounded-lg shadow-sm text-sm font-medium text-white 
             bg-black hover:bg-gray-900 focus:outline-none 
             focus:ring-2 focus:ring-offset-2 focus:ring-black"
          >
            Use Academy Account
          </button>
          <button
            className="w-full flex justify-center py-4 px-4 border border-black 
             rounded-lg shadow-sm text-sm font-medium text-white 
             bg-black hover:bg-gray-900 focus:outline-none 
             focus:ring-2 focus:ring-offset-2 focus:ring-black  mt-4"
            onClick={() => router.push("/registerForm")}
          >
            No account? Register Here.
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
