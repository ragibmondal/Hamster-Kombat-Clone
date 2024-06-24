import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

function Home() {
  const { user, setUser } = useOutletContext();
  const [isMining, setIsMining] = useState(false);

  useEffect(() => {
    let interval;
    if (isMining && user.energy > 0) {
      interval = setInterval(() => {
        setUser(prevUser => ({
          ...prevUser,
          coins: prevUser.coins + 2,
          energy: prevUser.energy - 1
        }));
      }, 1000);
    } else {
      setIsMining(false);
    }
    return () => clearInterval(interval);
  }, [isMining, user.energy, setUser]);

  const handleMining = async () => {
    setIsMining(!isMining);
    if (!isMining) {
      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, {
        coins: user.coins,
        energy: user.energy
      });
    }
  };

  return (
    <div className="home">
      <h2 className="text-xl font-bold mb-4">Mining Dashboard</h2>
      <p>Coins: {user.coins}</p>
      <p>Energy: {user.energy}</p>
      <button
        className={`mt-4 px-4 py-2 rounded ${isMining ? 'bg-red-500' : 'bg-green-500'} text-white`}
        onClick={handleMining}
      >
        {isMining ? 'Stop Mining' : 'Start Mining'}
      </button>
    </div>
  );
}

export default Home;
