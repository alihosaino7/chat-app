import { BrowserRouter, Route, Routes } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import { Suspense, lazy } from "react";
import Spinner from "./components/Spinner";

const ChatEntery = lazy(() => import("./ChatEntery"));
const Chat = lazy(() => import("./Chat"));
const Signup = lazy(() => import("./Signup"));
const Login = lazy(() => import("./Login"));

const LoadingPage = () => {
  return (
    <div className="w-full h-screen bg-[#333] flex items-center justify-center">
      <Spinner />
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingPage />}>
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route path="/" index element={<ChatEntery />} />
            <Route path="/chat/room/:roomName" element={<Chat />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
