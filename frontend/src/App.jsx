import { useState } from 'react'
import LandingPage from './pages/landingPage'
import './style/App.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';



function App() {

  const router=createBrowserRouter([
    {
      path: "/",
      element: <LandingPage/>
    }
  ])

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
