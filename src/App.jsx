// App.jsx
console.log("🚀 App Starting...");
console.log("Environment:", import.meta.env.MODE);
console.log("All Environment Variables:", import.meta.env);

// Vite uses VITE_ prefix, Create React App uses REACT_APP_ prefix
const API_URL =
  import.meta.env.VITE_API_URL || "https://school-pilot-api.vercel.app";

console.log("API URL:", API_URL);
console.log("Local Storage:", {
  access_token: localStorage.getItem("access_token")
    ? "Present"
    : "Not Present",
  refresh_token: localStorage.getItem("refresh_token")
    ? "Present"
    : "Not Present",
});

import { BrowserRouter as Router } from "react-router-dom";
import { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";

function App() {
  useEffect(() => {
    // CORS check
    console.log("🌍 Checking CORS...");
    fetch(`${API_URL}/api/accounts/register`, {
      method: "OPTIONS",
      mode: "cors",
    })
      .then((response) => {
        console.log("🌍 CORS Check:", {
          url: `${API_URL}`,
          status: response.status,
          ok: response.ok,
          headers: Object.fromEntries(response.headers.entries()),
        });

        // Also check if we can actually reach the API
        return fetch(`${API_URL}`, {
          method: "GET",
          mode: "cors",
        });
      })
      .then((response) => {
        console.log("🌍 API Reachability Check:", {
          status: response.status,
          ok: response.ok,
        });
      })
      .catch((error) => {
        console.error("❌ Network/CORS Error:", {
          message: error.message,
          type: error.name,
        });
      });
  }, []);

  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <AppRoutes />
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
