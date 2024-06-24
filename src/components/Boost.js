import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

function Boost() {
  const { user, setUser } = useOutletContext();

  const handleBoost = async (type) => {
    let updatedUser = { ...user };

    switch (type) {
      case 'energy':
        updatedUser.energy = Math.min(user.energy + 50, 100);
        break;
      case 'coins':
        updatedUser.coins += 100;
        break;
      case 'level':
        updatedUser.level += 1;
        break;
      default:
        return;
    }

    const userRef = doc(db, 'users', user.id);
    await updateDoc(userRef, updatedUser);
    setUser(updatedUser);
  };

  return (
    <div className="boost">
      <h2 className="text-xl font-bold mb-4">Boosts</h2>
      <button
        className="mb-2 px-4 py-2 rounded bg-yellow-500 text-white"
        onClick={() => handleBoost('energy')}
      >
        Boost Energy (+50)
      </button>
      <button
        className="mb-2 px-4 py-2 rounded bg-green-500 text-white"
        onClick={() => handleBoost('coins')}
      >
        Boost Coins (+100)
      </button>
      <button
        className="mb-2 px-4 py-2 rounded bg-purple-500 text-white"
        onClick={() => handleBoost('level')}
      >
        Boost Level (+1)
      </button>
    </div>
  );
}

export default Boost;
