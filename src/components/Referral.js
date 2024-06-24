import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

function Referral() {
  const { user } = useOutletContext();
  const [referrals, setReferrals] = useState([]);

  useEffect(() => {
    const fetchReferrals = async () => {
      const q = query(collection(db, 'users'), where('referredBy', '==', user.id));
      const querySnapshot = await getDocs(q);
      setReferrals(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchReferrals();
  }, [user.id]);

  return (
    <div className="referral">
      <h2 className="text-xl font-bold mb-4">Referrals</h2>
      <p>Your Referral Link: https://your-app.com/ref/{user.id}</p>
      <h3 className="text-lg font-semibold mt-4 mb-2">Your Referrals:</h3>
      {referrals.length > 0 ? (
        <ul>
          {referrals.map(referral => (
            <li key={referral.id}>{referral.id}</li>
          ))}
        </ul>
      ) : (
        <p>You have no referrals yet.</p>
      )}
    </div>
  );
}

export default Referral;
