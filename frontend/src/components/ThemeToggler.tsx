import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../features/Theme/ThemeSlice";
import { Sun, Moon } from "lucide-react"; // Example icons
import type { RootState } from "../store";

export default function ThemeToggleButton() {
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.ThemeSlice.value);

  const handleToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <button
      onClick={handleToggle}
      className="flex items-center justify-center w-10 h-10 rounded-full 
                 bg-gray-200 dark:bg-gray-700 hover:scale-105 transition 
                 duration-200 ease-in-out text-gray-800 dark:text-gray-100"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
