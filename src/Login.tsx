import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import LoadingLayer from "./components/LoadingOverlay";
import Alert from "./components/Alert";
import { useEffect } from "react";

export default function Login() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (error && email && password) {
      setError("");
    }
  }, [error, email, password]);

  async function handleLogin() {
    if (!email || !password) return setError("All fields are required");

    try {
      setLoading(true);
      const result = await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem("isAuth", result.user.refreshToken);
      navigate("/");
    } catch (error) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }
  const inputStyle =
    "border-b-2 focus:border-transparent border-gray-200 mb-4 py-2 px-4 outline-blue-400 w-full";
  return (
    <div className="w-full bg-[#333] h-screen flex items-center justify-center px-4">
      <div className="bg-white rounded-lg w-full sm:w-[400px] py-4 sm:py-6 px-4 sm:px-12 relative">
        {loading && <LoadingLayer />}
        <h2 className="font-bold mx-auto w-fit text-xl mb-4">Login</h2>
        {error && <Alert text={error} />}
        <input
          type="text"
          placeholder="Email"
          className={inputStyle}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className={inputStyle}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleLogin}
          className="block w-full text-white font-bold py-2 bg-blue-500 hover:bg-blue-600 text-center"
        >
          Sign In
        </button>
        <p className="my-4 text-center">
          You don't have an account?{" "}
          <Link to="/signup" className="text-blue-500 underline cursor-pointer">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
