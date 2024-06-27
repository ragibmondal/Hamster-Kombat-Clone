import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { motion } from 'framer-motion';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        const userRef = doc(db, 'users', authUser.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          setUser({ id: authUser.uid, ...userSnap.data() });
        } else {
          const newUser = {
            id: authUser.uid,
            coins: 0,
            energy: 100,
            level: 1,
            referredBy: null,
          };
          await setDoc(userRef, newUser);
          setUser(newUser);
        }
      } else {
        setUser(null);
        navigate('/');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="app bg-gray-100 min-h-screen">
      <header className="bg-blue-500 text-white p-4">
        <h1 className="text-2xl font-bold">Telegram Web App</h1>
        {user && (
          <div className="mt-2">
            <p>Coins: {user.coins} | Energy: {user.energy} | Level: {user.level}</p>
          </div>
        )}
      </header>
      <main className="p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Outlet context={{ user, setUser }} />
        </motion.div>
      </main>
      {user && (
        <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200 p-4">
          <div className="flex justify-around">
            <Link to="/" className="text-blue-500 hover:text-blue-700">Home</Link>
            <Link to="/referral" className="text-blue-500 hover:text-blue-700">Referral</Link>
            <Link to="/tasks" className="text-blue-500 hover:text-blue-700">Tasks</Link>
            <Link to="/boost" className="text-blue-500 hover:text-blue-700">Boost</Link>
            <Link to="/stats" className="text-blue-500 hover:text-blue-700">Stats</Link>
          </div>
        </nav>
      )}
    </div>
  );
}

export default App;
