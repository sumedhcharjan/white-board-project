import { useState } from 'react'
import LandingPage from './pages/landingPage'
import './style/App.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Roomdashboard from './components/Room/Roomdashboard';



function App() {

  const router=createBrowserRouter([
    {
      path: "/",
      element: <LandingPage/>
    },
    {
      path: "/dashboard",
      element: <Dashboard/>
    },
    {
      path:'/room/:roomid',
      element:<Roomdashboard></Roomdashboard>
    }
  ])

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
