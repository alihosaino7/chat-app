import { User, onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { useContext, createContext, useEffect, useState } from "react";
import { auth, db, googleProvider } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";

interface IAuth {
  currentUser: User;
  loginWithGoogle: () => Promise<void>;
  confirmModalOpened: boolean;
  closeConfirmModal: () => void;
  openConfirmModal: () => void;
}

const AuthContext = createContext({} as IAuth);

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [confirmModalOpened, setConfirmModalOpened] = useState(false);

  function openConfirmModal() {
    setConfirmModalOpened(true);
  }

  function closeConfirmModal() {
    setConfirmModalOpened(false);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setCurrentUser(currentUser);
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const navigate = useNavigate();

  async function checkIsEmailExist(email: string): Promise<boolean> {
    const usersSnapshot = await getDocs(
      query(collection(db, "users"), where("email", "==", email))
    );
    return usersSnapshot.size > 0;
  }

  async function loginWithGoogle() {
    const userCredential = await signInWithPopup(auth, googleProvider);
    const isEmailExist = await checkIsEmailExist(
      userCredential.user.email as string
    );

    localStorage.setItem("isAuth", userCredential.user.refreshToken);

    if (isEmailExist) {
      navigate("/");
    } else {
      await setDoc(doc(collection(db, "users"), auth.currentUser?.uid), {
        uid: auth.currentUser?.uid,
        displayName: auth.currentUser?.displayName,
        email: auth.currentUser?.email,
        avatar: auth.currentUser?.photoURL || "",
      });

      navigate("/");
    }
  }

  const value = {
    currentUser,
    loginWithGoogle,
    confirmModalOpened,
    openConfirmModal,
    closeConfirmModal,
  } as IAuth;
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
