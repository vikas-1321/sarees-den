import { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "../firebase"; // Ensure db is exported from your firebase.js
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Register Logic
  const register = async (email, password, role, fullName) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // Save additional info (role, name) to Firestore
    await setDoc(doc(db, "users", firebaseUser.uid), {
      uid: firebaseUser.uid,
      fullName,
      email,
      role,
      createdAt: new Date(),
    });

    return firebaseUser;
  };

  // 2. Login Logic
  const login = async (email, password) => {
    return await signInWithEmailAndPassword(auth, email, password);
  };

  // 3. Logout Logic
  const logout = () => {
    return signOut(auth);
  };

  // 4. Persistence: Keep user logged in on refresh
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch role from Firestore
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        if (userDoc.exists()) {
          setUser({ ...firebaseUser, ...userDoc.data() });
        } else {
          setUser(firebaseUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);