import { Link, useNavigate } from "react-router-dom";
import { Button } from "./Button";
import ThemeToggleButton from "./ThemeToggler";
import AccountMenu from "./AvatarWithMenu";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import CreateIcon from '@mui/icons-material/Create';
import { Tooltip } from "@mui/material";
export const AppBar = () => {
  const {user,hasData} = useSelector((state: RootState) => state.UserSlice);
  const navigate = useNavigate();

  return (
    <header className="z-50 fixed top-0 left-0 w-full border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-10 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to='/blogs'>
        <div className="text-xl font-bold text-gray-800 dark:text-white tracking-tight">
          Bloggy
        </div>
        </Link>
        <div className="flex items-center gap-3">
          {!hasData && (
            <div className="flex gap-2">
            <Button onClick={() => navigate("/signup")}>Sign Up</Button>
            <Button onClick={() => navigate("/signin")} color="outline">
            Sign In
          </Button>
          </div>
          )}
          {hasData && (
            <Button onClick={() => navigate("/blog/create")}>
              <Tooltip title='write'>
               <CreateIcon fontSize='small'/>
               </Tooltip>
            </Button>
          )}
          <ThemeToggleButton />
          {hasData && (
            <AccountMenu username={user?.name || ""} email={user?.email || ""} />
          )}
        </div>
      </div>
    </header>
  );
};
