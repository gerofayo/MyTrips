import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import "../styles/components/ThemeToggle.css";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // Check localStorage first, then system preference
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    } else {
      // Use system preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const systemTheme = prefersDark ? "dark" : "light";
      setTheme(systemTheme);
      document.documentElement.setAttribute("data-theme", systemTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      <Icon 
        icon={theme === "dark" ? "ph:sun-fill" : "ph:moon-fill"} 
        width={20} 
        height={20} 
      />
    </button>
  );
}
