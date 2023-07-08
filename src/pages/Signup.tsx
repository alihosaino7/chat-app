import { useEffect, useState, useRef } from "react";
import { LuImagePlus } from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db, storage } from "../config/firebase";
import { collection, doc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Alert } from "../components/Alert";
import { LoadingOverlay } from "../components/LoadingOverlay";

export default function Signup() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [user, setUser] = useState({
    displayName: "",
    email: "",
    password: "",
  });

  const [file, setFile] = useState<File | null>(null);
  const storageRef = ref(storage, `/avatars/${file?.name}`);

  useEffect(() => {
    if (error && user.displayName && user.email && user.password) {
      setError("");
    }
  }, [error, user]);

  async function handleSignup() {
    const { displayName, email, password } = user;
    if (!(displayName && email && password)) {
      return setError("All fields are required");
    }

    setLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        user.email,
        user.password
      );
      localStorage.setItem("isAuth", result.user.refreshToken);

      const uploadTask = await uploadBytes(storageRef, file as File);
      const photoURL = await getDownloadURL(uploadTask.ref);

      await setDoc(doc(collection(db, "users"), auth.currentUser?.uid), {
        uid: auth.currentUser?.uid,
        displayName: user.displayName,
        email: user.email,
        avatar: photoURL || "",
      });

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
        {loading && <LoadingOverlay />}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={(e) => setFile(e.target.files?.[0] as File)}
        />
        <h2 className="font-bold text-xl mb-4 w-fit mx-auto">Sign up</h2>
        {error && <Alert text={error} />}
        <input
          type="text"
          placeholder="Display name"
          onChange={(e) =>
            setUser((prevUser) => ({
              ...prevUser,
              displayName: e.target.value,
            }))
          }
          className={inputStyle}
        />
        <input
          type="text"
          placeholder="Email"
          onChange={(e) =>
            setUser((prevUser) => ({ ...prevUser, email: e.target.value }))
          }
          className={inputStyle}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) =>
            setUser((prevUser) => ({ ...prevUser, password: e.target.value }))
          }
          className={inputStyle}
        />
        <div className="mb-4 text-blue-400 flex items-center gap-2">
          <span className="text-xl">
            <LuImagePlus />
          </span>
          <button type="button" onClick={() => fileInputRef.current?.click()}>
            Add an avatar
          </button>
        </div>
        <button
          className="block w-full text-white font-bold py-2 bg-blue-500 hover:bg-blue-600 text-center"
          type="button"
          onClick={handleSignup}
        >
          Sign In
        </button>
        <p className="my-4 text-center">
          You do have an account?{" "}
          <Link to="/login" className="text-blue-500 underline cursor-pointer">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
