import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const isAuth = localStorage.getItem("isAuth") !== null;
  return isAuth ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
