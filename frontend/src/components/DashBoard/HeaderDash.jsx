import React from 'react'
import { FaUserCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
const HeaderDash = () => {
  return (
    <div className="w-full h-18 bg-[#092635] flex flex-row justify-between items-center px-6 py-3">
    <h1 className="text-3xl text-[#9EC8B9] font-bold">WhiteBoard</h1>
    
    <Link to='/profile'>
        <FaUserCircle size={30} color="#9EC8B9" />
    </Link>

    </div>  )
}

export default HeaderDash