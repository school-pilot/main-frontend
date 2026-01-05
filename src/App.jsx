import { BrowserRouter, useRoutes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";

import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ChangePassword from "./pages/auth/ChangePassword";

const routes = [
  { path: "/", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/change-password", element: <ChangePassword /> },
  {
    path: "/dashboard",
    element: <Dashboard />,
    children: [{ index: true, element: <Dashboard /> }],
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
