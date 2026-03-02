import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// ✅ Ensure these paths match your folder structure
import { useAuth } from "../context/AuthContext";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { 
  Package, 
  Heart, 
  LogOut, 
  ChevronRight, 
  Coins, 
  Edit2, 
  Check, 
  X 
} from 'lucide-react';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [name, setName] = useState("Not set");
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState("");

  // 1. Fetch existing name from Firestore on load
  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.uid) {
        try {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists() && userSnap.data().name) {
            setName(userSnap.data().name);
            setTempName(userSnap.data().name);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };
    fetchUserData();
  }, [user]);

  // 2. Save the edited name to Firestore
  const handleSaveName = async () => {
    if (!tempName.trim()) return;
    try {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, { name: tempName.trim() }, { merge: true });
      setName(tempName.trim());
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving name:", error);
    }
  };

  const handleCancel = () => {
    setTempName(name);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] pt-32 pb-20 px-4 md:px-6 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm flex items-center justify-between border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#7b1e1e] rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {name !== "Not set" ? name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">{name === "Not set" ? "User" : name}</h2>
              <p className="text-gray-500 text-sm">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button onClick={() => navigate('/my-orders')} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between hover:bg-gray-50 transition group">
            <div className="flex items-center gap-4">
              <Package className="w-6 h-6 text-gray-700 group-hover:text-[#7b1e1e]" />
              <span className="font-semibold text-gray-700 uppercase tracking-widest text-xs">Orders</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>

          <button onClick={() => navigate('/wishlist')} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between hover:bg-gray-50 transition group">
            <div className="flex items-center gap-4">
              <Heart className="w-6 h-6 text-gray-700 group-hover:text-red-500" />
              <span className="font-semibold text-gray-700 uppercase tracking-widest text-xs">Wishlist</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Account Details with EDIT Button */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
            <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest">Account Details</h3>
            {!isEditing && (
              <button 
                onClick={() => setIsEditing(true)}
                className="text-[#7b1e1e] flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest hover:underline"
              >
                <Edit2 className="w-3 h-3" /> Edit Name
              </button>
            )}
          </div>
          
          <div className="p-6 space-y-6">
            <div className="flex flex-col">
              <span className="text-gray-400 text-[10px] uppercase font-bold tracking-widest mb-2">Full Name</span>
              {isEditing ? (
                <div className="flex gap-2 items-center">
                  <input 
                    type="text"
                    className="flex-grow border border-gray-200 p-2 rounded text-sm focus:border-[#7b1e1e] outline-none font-sans"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    placeholder="Enter your name"
                    autoFocus
                  />
                  <button onClick={handleSaveName} className="p-2 bg-green-50 text-green-600 rounded hover:bg-green-100 transition">
                    <Check className="w-4 h-4" />
                  </button>
                  <button onClick={handleCancel} className="p-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <span className="text-gray-800 font-medium">{name}</span>
              )}
            </div>

            <div className="flex flex-col">
              <span className="text-gray-400 text-[10px] uppercase font-bold tracking-widest mb-2">Email Address</span>
              <span className="text-gray-800 font-medium">{user?.email}</span>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button 
          onClick={logout}
          className="w-full py-4 bg-[#7b1e1e] text-white rounded-xl font-bold uppercase tracking-[0.2em] hover:bg-black transition-all duration-300"
        >
          Logout
        </button>

      </div>
    </div>
  );
};

export default Profile;