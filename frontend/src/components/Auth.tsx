/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link, useNavigate } from "react-router-dom";
import { LabelledInput } from "./LabelledInput";
import {useState, useTransition } from "react";
import type { SignInType, SignUpType } from "@dev0000007/medium-web";
import { Button } from "./Button";
import { toast } from "react-toastify";
import axios from "axios";
import { BACKED_URL, BACKED_URL_LOCAL } from "../config";
import { useAppDispatch } from "../hooks";
import { fetchMe } from "../features/User/UserSlice";
export const Auth = ({ type }: { type: "signup" | "signin" }) => {
  const dispatch = useAppDispatch()
  const [signUpDetails, setSignUpDetails] = useState<SignUpType>({
    email: "",
    password: "",
    name: "",
  });
  const [signInDetails, setSignInDetails] = useState<SignInType>({
    email: "",
    password: "",
  });
  const [isPending, startTransition] = useTransition();
  const navigate = useNavigate();
  async function handleSignUp() {
    startTransition(async () => {
      try {
         await axios.post(
          `${BACKED_URL_LOCAL}api/v1/user/signup`,
          signUpDetails,
          {withCredentials:true}
        );
        await dispatch(fetchMe()).unwrap()
        navigate("/blogs");
      } catch (error: any) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Server is unreachable or something went wrong.");
        }
      }
    });
    setSignUpDetails({ email: "", password: "", name: "" });
  }
  async function handleSignIn() {
    startTransition(async () => {
      try {
         await axios.post(
          `${BACKED_URL_LOCAL}api/v1/user/signin`,
          signInDetails,
          {withCredentials:true}
        );
        await dispatch(fetchMe()).unwrap()
        navigate('/blogs')
      } catch (error: any) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Server is unreachable or something went wrong.");
        }
      }
    });
    setSignInDetails({ email: "", password: "" });
  }
  return (
  <div className="h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 transition">
    <div className="border border-slate-300 dark:border-gray-700 shadow-xl w-[90%] sm:w-[80%] md:w-[60%] p-6 sm:p-10 rounded-xl bg-white dark:bg-gray-800">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          {type === "signup" ? "Create an account" : "Welcome back"}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {type === "signup" ? (
            <>
              Already have an account?{" "}
              <Link className="underline text-blue-600" to="/signin">
                Sign in
              </Link>
            </>
          ) : (
            <>
              Don’t have an account?{" "}
              <Link className="underline text-blue-600" to="/signup">
                Sign up
              </Link>
            </>
          )}
        </p>
      </div>

      {/* Form */}
      <div className="space-y-4">
        {type === "signup" ? (
          <>
            <LabelledInput
              label="Username"
              type="text"
              onChange={(e) =>
                setSignUpDetails((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              placeholder="Divyanshu Prajapati.."
              value={signUpDetails.name}
            />
            <LabelledInput
              label="Email"
              type="text"
              onChange={(e) =>
                setSignUpDetails((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
              placeholder="dev123@gmail.com"
              value={signUpDetails.email}
            />
            <LabelledInput
              label="Password"
              type="password"
              onChange={(e) =>
                setSignUpDetails((prev) => ({
                  ...prev,
                  password: e.target.value,
                }))
              }
              placeholder="123456"
              value={signUpDetails.password}
            />
          </>
        ) : (
          <>
            <LabelledInput
              label="Email"
              type="text"
              onChange={(e) =>
                setSignInDetails((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
              placeholder="dev123@gmail.com"
              value={signInDetails.email}
            />
            <LabelledInput
              label="Password"
              type="password"
              onChange={(e) =>
                setSignInDetails((prev) => ({
                  ...prev,
                  password: e.target.value,
                }))
              }
              placeholder="123456"
              value={signInDetails.password}
            />
          </>
        )}
      </div>

      {/* Button */}
      <div className="mt-6 w-full flex justify-center">
        <Button
          disableButton={isPending}
          onClick={type === "signup" ? handleSignUp : handleSignIn}
        >
          {type === "signup" ? "Sign up" : "Sign in"}
        </Button>
      </div>
    </div>
  </div>
);

};
