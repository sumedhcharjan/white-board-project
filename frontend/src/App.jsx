import LandingPage from './pages/landingPage'
import './style/App.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Roomdashboard from './components/JoinRoom/JoinRoomdashboard';
import { Toaster } from 'react-hot-toast';
import ProfilePage from './components/Profile/ProfilePage';


function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <LandingPage />
    },
    {
      path: "/dashboard",
      element: <Dashboard />
    },
    {
      path: '/room/:roomid',
      element: <Roomdashboard />
    },
    {
      path:`/profile`,
      element:<ProfilePage></ProfilePage>
    }
  ])

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <RouterProvider router={router} />
    </>
  )
}

export default App
