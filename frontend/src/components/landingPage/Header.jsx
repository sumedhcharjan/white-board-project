import React from 'react'

const Header = () => {
  return (
    <>
      <div class="w-full h-18 bg-cyan-700 flex flex-row justify-between" >
        <h1 class="p-4 text-3xl">WhiteBoard</h1>
        <button class="w-18 h-10 bg-black text-white">sign in</button>
      </div>
    </>
  )
}

export default Header