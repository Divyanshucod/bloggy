import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks";

export const Protector = ({ children }: { children: React.ReactNode }) => {
  const { isloading } = useAuth();
  const navigate = useNavigate();
  if (isloading === "pending") {
    return <div className="h-screen w-screen bg-white dark:bg-gray-900" />;
  }
  if (isloading === "fail") {
    navigate("/signup");
  }
  return <>{children}</>;
};
