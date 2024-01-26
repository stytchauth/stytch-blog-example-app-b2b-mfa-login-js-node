import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from './App.jsx'
import '../styles/stytch.css'
import Login from './login.jsx';
import Callback from './callback.jsx';
import Discovery from './discovery.jsx';
import Dashboard from './dashboard.jsx';
import MFA from './smsmfa.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/auth/callback",
    element: <Callback />,
  }, 
  {
    path: "/discovery",
    element: <Discovery />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/smsmfa",
    element: <MFA />,
  },
]);


ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
)
