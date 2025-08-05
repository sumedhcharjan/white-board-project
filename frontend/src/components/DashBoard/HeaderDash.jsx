import React from 'react'
import { useAuth0 } from '@auth0/auth0-react';
import { FaUserCircle } from 'react-icons/fa';
import { Link, Links } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const HeaderDash = () => {
  const {logout}=useAuth0();
  console.log(logout);
  const handleLogout=()=>{
    logout({
      logoutParams:{
        returnTo:window.location.origin,
      },
    })
    
  }
  return (
    <div className="w-full h-18 bg-[#092635] flex flex-row justify-between items-center px-6 py-3">
      <h1 className="text-3xl text-[#9EC8B9] font-bold"> <Link to='/dashboard'>WhiteBoard</Link></h1>
      <div className='flex gap-2 items-center justify-center'>
        <button className='bg-[#1B4242] hover:bg-[#5C8374] text-white font-semibold py-2 px-4 rounded-lg transition duration-300' onClick={handleLogout}  >
          LogOut
        </button>
        <Link to='/profile'>
          <FaUserCircle size={30} color="#9EC8B9" />
        </Link>

      </div>

    </div>)
}

export default HeaderDash