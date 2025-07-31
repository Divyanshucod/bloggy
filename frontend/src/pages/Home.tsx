import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export const Home = () => {
  const userData = useSelector((state: RootState) => state.UserSlice);
  const navigate = useNavigate();
  useEffect(() => {
    if (!userData) {
      navigate("/signup");
    } else {
      navigate("/blogs");
    }
  }, []);
  return <div></div>;
};
