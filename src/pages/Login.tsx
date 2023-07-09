import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";
import { LoadingOverlay } from "../components/LoadingOverlay";
import { Alert } from "../components/Alert";
import { useEffect } from "react";
import { useAuth } from "../context/AuthProvider";

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
      navigate("/chat");
    } catch (error) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }
  const { loginWithGoogle } = useAuth();

  const inputStyle =
    "border-b-2 focus:border-transparent border-gray-200 mb-4 py-2 px-4 outline-blue-400 w-full";
  return (
    <div className="w-full h-full flex items-center justify-center px-4">
      <div className="bg-white rounded-lg w-full sm:w-[400px] py-4 sm:py-6 px-4 sm:px-12 relative">
        {loading && <LoadingOverlay />}
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
        <div className="w-full text-center my-2">OR</div>
        <button
          onClick={loginWithGoogle}
          className="bg-white px-4 py-2 border justify-center w-full flex gap-2 border-slate-200 rounded-lg text-slate-700 hover:border-slate-400 hover:text-slate-900 hover:shadow transition duration-150"
        >
          <img
            className="w-6 h-6"
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            loading="lazy"
            alt="google logo"
          />
          <span>Login with Google</span>
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
