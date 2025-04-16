import { Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import Libros from "../pages/Libros";
import PrivateRoute from "./PrivateRoute";
import Layout from "../components/Layout";

const Router = () => {
  return (
    <Routes>
      {/* Rutas Públicas */}
      <Route path="/login" element={<Login />} />

      {/* Rutas Privadas */}
      <Route element={<PrivateRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/books" element={<Libros />} />
        </Route>
      </Route>

      {/* Redirección por defecto */}
      <Route path="*" element={<Login />} />
    </Routes>
  );
};

export default Router;