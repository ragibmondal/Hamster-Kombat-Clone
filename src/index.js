import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import App from './App';
import Home from './components/Home';
import Referral from './components/Referral';
import Tasks from './components/Tasks';
import Boost from './components/Boost';
import Stats from './components/Stats';
import ErrorBoundary from './components/ErrorBoundary';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'referral', element: <Referral /> },
      { path: 'tasks', element: <Tasks /> },
      { path: 'boost', element: <Boost /> },
      { path: 'stats', element: <Stats /> },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  </React.StrictMode>
);
