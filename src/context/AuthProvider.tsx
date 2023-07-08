import { User, onAuthStateChanged } from "firebase/auth";
import React, { useContext, createContext, useEffect, useState } from "react";
import { auth } from "../config/firebase";

interface IAuth {
  currentUser: User;
}

const AuthContext = createContext({} as IAuth);

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
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

  const value = { currentUser } as IAuth;
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
