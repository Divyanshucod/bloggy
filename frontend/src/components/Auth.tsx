import { Link, useNavigate } from "react-router-dom";
import { LabelledInput } from "./LabelledInput";
import { useState, useTransition } from "react";
import type { SignInType, SignUpType } from "@dev0000007/medium-web";
import { Button } from "./Button";
import { toast } from "react-toastify";
import axios from "axios";
import { BACKED_URL, BACKED_URL_LOCAL } from "../config";
export const Auth = ({ type }: { type: "signup" | "signin" }) => {
  const navigate = useNavigate();
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
  async function handleSignUp() {
    startTransition(async () => {
      try {
        await axios.post(
          `${BACKED_URL_LOCAL}api/v1/user/signup`,
          signUpDetails
        );
        // call /me endpoint to get userdata
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
          signInDetails
        );
        // call /me endpoint to get userdata use cookies for verification
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
    setSignInDetails({ email: "", password: "" });
  }
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="border border-slate-400 shadow-xl w-[70%] p-5 sm:p-10 rounded-xl">
        <div>
          <div className="text-2xl font-bold">
            {type == "signup" ? "Create an account" : "Welcome back"}
          </div>
          <div>
            {type == "signup" ? (
              <p className="text-gray-500">
                Already have an account{" "}
                <Link className="underline" to="/signin">
                  login
                </Link>
              </p>
            ) : (
              <p>
                Create a new account?{" "}
                <Link className="underline" to="/signup">
                  signup
                </Link>
              </p>
            )}
          </div>
        </div>
        <div className="mt-2.5 w-full">
          {type == "signup" ? (
            <div>
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
                placeholder="dev123@gmail.com.."
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
            </div>
          ) : (
            <div>
              <LabelledInput
                label="Email"
                type="text"
                onChange={(e) =>
                  setSignInDetails((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
                placeholder="dev123@gmail.com.."
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
            </div>
          )}
        </div>
        <div className="mt-3 flex w-full items-center justify-center">
          {type == "signup" ? (
            <Button
              color="#24292F"
              disableButton={isPending}
              onClick={handleSignUp}
            >
              Sign up
            </Button>
          ) : (
            <Button
              color="#24292F"
              disableButton={isPending}
              onClick={handleSignIn}
            >
              Sign in
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
