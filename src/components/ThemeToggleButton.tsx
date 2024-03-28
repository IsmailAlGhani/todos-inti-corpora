import { RiMoonClearFill, RiSunFill } from "react-icons/ri";
import { useTheme } from "./theme-provider";

export default function ThemeToggleButton() {
  const { theme, setTheme } = useTheme();
  const currentTheme = theme === "system" ? "light" : theme;
  const isDark = currentTheme === "dark";
  return (
    <button
      aria-label="Toggle Dark Mode"
      type="button"
      className="flex h-10 w-10 items-center justify-center rounded bg-gray-200 text-gray-800 transition duration-300 ease-in-out hover:bg-gray-300 hover:ring-2 hover:ring-gray-400 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
      onClick={(): void => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <RiSunFill size={20} /> : <RiMoonClearFill size={20} />}
    </button>
  );
}
