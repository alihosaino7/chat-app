import { Route, Routes } from "react-router-dom";
import { PrivateRoute } from "./components/PrivateRoute";
import { Suspense, lazy } from "react";
import { Spinner } from "./components/Spinner";

const ChatEntery = lazy(() => import("./pages/ChatEntery"));
const Chat = lazy(() => import("./pages/Chat"));
const Signup = lazy(() => import("./pages/Signup"));
const Login = lazy(() => import("./pages/Login"));

const LoadingPage = () => {
  return (
    <div className="w-full h-screen bg-[#333] flex items-center justify-center">
      <Spinner />
    </div>
  );
};

export default function App() {
  return (
    <>
      <Suspense fallback={<LoadingPage />}>
        <div className="w-full h-screen flex items-center justify-center bg-[#333]">
          <div className="container">
            <Routes>
              <Route element={<PrivateRoute />}>
                <Route path="/" index element={<ChatEntery />} />
                <Route path="/chat/room/:roomName" element={<Chat />} />
              </Route>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </div>
        </div>
      </Suspense>
    </>
  );
}
