import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      setLoading(true);
      if (authUser) {
        try {
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
            };
            await setDoc(userRef, newUser);
            setUser(newUser);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUser(null);
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
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please log in to access this application.</div>;
  }

  return (
    <div className="app">
      <header className="bg-blue-500 text-white p-4">
        <h1 className="text-2xl font-bold">Telegram Web App</h1>
      </header>
      <main className="p-4">
        <Outlet context={{ user, setUser }} />
      </main>
      <nav className="fixed bottom-0 w-full bg-gray-200 p-4">
        {/* Add navigation buttons here */}
      </nav>
    </div>
  );
}

export default App;
