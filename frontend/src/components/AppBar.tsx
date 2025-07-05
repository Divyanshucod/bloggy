// import { Button } from "./Button"

import { useNavigate } from "react-router-dom";
import { Button } from "./Button";
import ThemeToggleButton from "./ThemeToggler";
import { MenuBar } from "./Menubar";
import AccountMenu from "./AvatarWithMenu";

export const AppBar = () => {
  const navigate = useNavigate();

  return (
    <header className="z-50 fixed top-0 left-0 w-full border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-10 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="text-xl font-bold text-gray-800 dark:text-white tracking-tight">
          Medium
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          <Button onClick={() => navigate("/signup")}>Sign Up</Button>
          <Button onClick={() => navigate("/signin")} color="outline">
            Sign In
          </Button>
          <ThemeToggleButton />
          <AccountMenu username="Dev" email="prajapatidivyanshu90@gmail.com"/>
        </div>
      </div>
    </header>
  );
};
