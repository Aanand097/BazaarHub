import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

console.log("ENV FULL:", import.meta.env);
console.log("URL:", import.meta.env.VITE_SUPABASE_URL);
console.log("KEY:", import.meta.env.VITE_SUPABASE_ANON_KEY);
console.log("Supabase URL:", import.meta.env.VITE_SUPABASE_URL)

createRoot(document.getElementById("root")).render(<App />);