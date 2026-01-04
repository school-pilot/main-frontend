import { BrowserRouter, useRoutes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Settings from "./pages/Setting";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";

const routes = [
  { path: "/", element: <Login /> },
  { path: "/register", element: <Register /> },
  {
    path: "/dashboard",
    element: <Dashboard />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "profile", element: <Profile /> },
      { path: "settings", element: <Settings /> },
    ],
  },
  { path: "*", element: <NotFound /> },
];

const AppRoutes = () => useRoutes(routes);

function App() {
  return (
    <BrowserRouter>
    <div className="max-w-[1300px] mx-auto min-h-dvh">
      <AppRoutes />
    </div>
    </BrowserRouter>
  );
}

export default App;
