import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const AuthPage = ({ setUser }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // 1. Added 'role' to the form data state
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    pincode: '',
    role: 'user' // Default is user
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isRegistering) {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        
        // 2. Save the chosen role to Firestore
        await setDoc(doc(db, "users", res.user.uid), {
          uid: res.user.uid,
          email: email,
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          pincode: formData.pincode,
          role: formData.role, // Saves either 'user' or 'admin'
          createdAt: new Date()
        });
        
        alert(`Registered successfully as ${formData.role}! Now please Login.`);
        setIsRegistering(false); 
      } else {
        const res = await signInWithEmailAndPassword(auth, email, password);
        const userDoc = await getDoc(doc(db, "users", res.user.uid));
        
        if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({ uid: res.user.uid, ...userData });
            // Redirect based on role
            userData.role === 'admin' ? navigate('/admin') : navigate('/');
        }
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleAuth} className="auth-form">
        <h2 className="text-maroon">{isRegistering ? 'Create Account' : 'Login'}</h2>
        
        {isRegistering && (
          <>
            {/* 3. Role Selection Dropdown */}
            <label style={{fontSize: '0.8rem', color: '#666'}}>Register as:</label>
            <select name="role" value={formData.role} onChange={handleInputChange} className="role-select">
                <option value="user">Customer</option>
                <option value="admin">Store Admin</option>
            </select>

            <input type="text" name="fullName" placeholder="Full Name" onChange={handleInputChange} required />
            <input type="text" name="phone" placeholder="Phone Number" onChange={handleInputChange} required />
            <textarea name="address" placeholder="Address" onChange={handleInputChange} required />
          </>
        )}

        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
        
        <button type="submit" className="btn-primary">
          {isRegistering ? `Join as ${formData.role}` : 'Sign In'}
        </button>
        
        <p onClick={() => setIsRegistering(!isRegistering)} className="toggle-auth">
          {isRegistering ? 'Already have an account? Login' : 'New user? Register here'}
        </p>
      </form>
    </div>
  );
};

export default AuthPage;