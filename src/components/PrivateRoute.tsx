import { Navigate, Outlet } from "react-router-dom";

export const PrivateRoute = () => {
  const isAuth = localStorage.getItem("isAuth") !== null;
  return isAuth ? <Outlet /> : <Navigate to="/login" />;
};
