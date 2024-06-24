import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';

function Stats() {
  const { user } = useOutletContext();
  const [topUsers, setTopUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalCoins, setTotalCoins] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      const usersRef = collection(db, 'users');
      const usersSnap = await getDocs(usersRef);
      
      setTotalUsers(usersSnap.size);
      setTotalCoins(usersSnap.docs.reduce((sum, doc) => sum + doc.data().coins, 0));

      const topUsersQuery = query(usersRef, orderBy('coins', 'desc'), limit(5));
      const topUsersSnap = await getDocs(topUsersQuery);
      setTopUsers(topUsersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchStats();
  }, []);

  return (
    <div className="stats">
      <h2 className="text-xl font-bold mb-4">Statistics</h2>
      <p>Total Users: {totalUsers}</p>
      <p>Total Coins: {totalCoins}</p>
      <h3 className="text-lg font-semibold mt-4 mb-2">Top Users:</h3>
      <ol>
        {topUsers.map((topUser, index) => (
          <li key={topUser.id}>
            {index + 1}. {topUser.id === user.id ? 'You' : `User ${topUser.id.substring(0, 6)}`} - {topUser.coins} coins
          </li>
        ))}
      </ol>
    </div>
  );
}

export default Stats;
