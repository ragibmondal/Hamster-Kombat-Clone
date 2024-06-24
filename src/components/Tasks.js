import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

function Tasks() {
  const { user, setUser } = useOutletContext();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const q = query(collection(db, 'tasks'), where('level', '<=', user.level));
      const querySnapshot = await getDocs(q);
      setTasks(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchTasks();
  }, [user.level]);

  const completeTask = async (taskId) => {
    const taskRef = doc(db, 'tasks', taskId);
    await updateDoc(taskRef, { completed: true });

    const userRef = doc(db, 'users', user.id);
    const updatedUser = { ...user, coins: user.coins + 10 };
    await updateDoc(userRef, updatedUser);
    setUser(updatedUser);

    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: true } : task
    ));
  };

  return (
    <div className="tasks">
      <h2 className="text-xl font-bold mb-4">Tasks</h2>
      {tasks.map(task => (
        <div key={task.id} className="mb-4 p-4 border rounded">
          <h3 className="font-semibold">{task.title}</h3>
          <p>{task.description}</p>
          <button
            className={`mt-2 px-4 py-2 rounded ${task.completed ? 'bg-gray-500' : 'bg-blue-500'} text-white`}
            onClick={() => completeTask(task.id)}
            disabled={task.completed}
          >
            {task.completed ? 'Completed' : 'Complete Task'}
          </button>
        </div>
      ))}
    </div>
  );
}

export default Tasks;
