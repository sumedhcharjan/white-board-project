import React from 'react';

const Header = () => {
  return (
    <div class="w-full h-18 bg-[#000957] flex flex-row justify-between items-center px-6 py-3">
      <h1 class="text-3xl text-[#FFEB00] font-bold">WhiteBoard</h1>
      <div class="flex justify-between item-center">

      <button class="w-24 mr-5 h-11 bg-[#344CB7] text-white font-medium rounded-md hover:bg-[#577BC1] transition duration-300">
        Login  
      </button>
      <button class="w-24 h-11 mr-2 bg-[#344CB7] text-white font-medium rounded-md hover:bg-[#577BC1] transition duration-300">
        SignUp  
      </button>
      </div>
    </div>
  );
};

export default Header;
