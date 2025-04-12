import React from 'react';
import { useAuth0 } from "@auth0/auth0-react";


const Header = () => {

  const { loginWithRedirect } = useAuth0();


  return (
    <div className="w-full h-18 bg-[#092635] flex flex-row justify-between items-center px-6 py-3">
      <h1 className="text-3xl text-[#9EC8B9] font-bold">WhiteBoard</h1>
      
      <div className="flex justify-between items-center" >
        <button 
          className="w-24 mr-5 h-11 bg-[#1B4242] text-white font-medium rounded-md hover:bg-[#5C8374] transition duration-300"
          onClick={() => loginWithRedirect()}>
          Login
        </button>
        <button 
          className="w-24 h-11 mr-2 bg-[#1B4242] text-white font-medium rounded-md hover:bg-[#5C8374] transition duration-300"
          onClick={() => loginWithRedirect()}>
          SignUp
        </button>
      </div>
    </div>
  );
};

export default Header;
