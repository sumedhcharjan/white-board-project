import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import axios from '/src/lib/axios.js';
import socket from '/src/lib/socket.js';

const DashBody = () => {
  const { user, logout } = useAuth0();
  const navigate = useNavigate();
  const [joinid, setjoinid] = useState("");
  const [joining, setjoining] = useState(false);
  const [creating, setcreating] = useState(false);
  const [roomid, setroomid] = useState(null);

  const joinRoom = () => {
    setjoining(true);
  };

  const handleCreateRoom = async () => {
    setcreating(true);
    try {
      const res = await axios.post('/room/create', { user });
      console.log(res);
      if (res?.data?.roomid) setroomid(res?.data?.roomid);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateJoin = async () => {
    try {
      const res = await axios.put('/room/joinroom', { user, Rid: roomid });
      console.log(res);
      if (res?.data?.msg === 'Joined room') {
        navigate(`/room/${roomid}`);
        socket.emit('joinroom', {
          name: user.name || user.nickname || "Anonymous",
          roomid: roomid,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleJoinRoom = async () => {
    try {
      const res = await axios.put('/room/joinroom', { user, Rid: joinid });
      console.log(res);
      if (res?.data?.msg === 'Joined room') {
        navigate(`/room/${joinid}`);
        socket.emit('joinroom', {
          name: user.name || user.nickname || "Anonymous",
          roomid: joinid,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(roomid);
    alert("Meeting ID copied to clipboard");
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#C2D9FF]/10 to-white font-sans">
      <div 
        className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#190482_1px,transparent_1px),linear-gradient(to_bottom,#190482_1px,transparent_1px)] bg-[size:6rem_4rem] opacity-20"
        style={{
          backgroundAttachment: 'fixed',
          backgroundPosition: 'center',
        }}
      ></div>

      {/* Header */}
      <header className="bg-[#190482] shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">CollabBoard</h1>
          <div className="flex items-center space-x-3">
            {/* <span className="text-[#C2D9FF] text-sm">{user?.name || user?.nickname || "User"}</span> */}
            <button
              className="p-2 rounded-xl bg-[#7752FE] text-white hover:bg-[#8E8FFA] transition transform hover:scale-105"
              onClick={() => navigate('/profile')}
              title="Profile"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </button>
            <button
              className="p-2 rounded-xl bg-[#7752FE] text-white hover:bg-[#8E8FFA] transition transform hover:scale-105"
              onClick={() => navigate('/')}
              title="Home"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
            </button>
            <button
              className="p-2 rounded-xl bg-[#7752FE] text-white hover:bg-[#8E8FFA] transition transform hover:scale-105"
              onClick={() => logout({ returnTo: window.location.origin })}
              title="Logout"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {joining ? (
          <div className="fixed inset-0 flex justify-center items-center bg-black/50">
            <div className="bg-white p-8 rounded-xl shadow-2xl text-center max-w-md w-full animate-slide-in">
              <h2 className="text-2xl font-bold text-[#190482] mb-4">Join a Whiteboard Session</h2>
              <input
                type="text"
                placeholder="Enter Room Code"
                value={joinid}
                onChange={(e) => setjoinid(e.target.value)}
                className="w-full p-3 border-2 border-[#8E8FFA] rounded-md mb-6 focus:outline-none focus:ring-2 focus:ring-[#7752FE] text-gray-900"
              />
              <div className="flex justify-center gap-4">
                <button
                  className="bg-gray-300 text-gray-900 px-6 py-2 rounded-md hover:bg-gray-400 transition"
                  onClick={() => setjoining(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-[#7752FE] text-white px-6 py-2 rounded-md hover:bg-[#8E8FFA] transition"
                  onClick={handleJoinRoom}
                >
                  Join
                </button>
              </div>
            </div>
          </div>
        ) : creating ? (
          <div className="fixed inset-0 flex justify-center items-center bg-black/50">
            <div className="bg-white p-8 rounded-xl shadow-2xl text-center max-w-md w-full animate-slide-in">
              <h2 className="text-2xl font-bold text-[#190482] mb-4">Your Room Code</h2>
              <input
                type="text"
                value={roomid}
                readOnly
                className="w-full p-3 border-2 border-[#8E8FFA] rounded-md mb-6 bg-gray-100 text-gray-900"
              />
              <div className="flex justify-center gap-4">
                <button
                  className="bg-[#7752FE] text-white px-6 py-2 rounded-md hover:bg-[#8E8FFA] transition"
                  onClick={handleCopy}
                >
                  Copy
                </button>
                <button
                  className="bg-gray-300 text-gray-900 px-6 py-2 rounded-md hover:bg-gray-400 transition"
                  onClick={() => setcreating(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-[#7752FE] text-white px-6 py-2 rounded-md hover:bg-[#8E8FFA] transition"
                  onClick={handleCreateJoin}
                >
                  Join
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Hero Section */}
            <section className="text-center mb-12">
              <h2 className="text-4xl font-extrabold text-[#190482] mb-4 animate-fade-in">
                Welcome to Your CollabBoard
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Create or join a whiteboard session to collaborate with your team in real-time.
              </p>
            </section>

            {/* Action Cards */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all border-t-4 border-[#7752FE]">
                <div className="flex items-center mb-4">
                  <svg className="w-8 h-8 text-[#7752FE] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                  <h3 className="text-2xl font-semibold text-[#190482]">Start a New Session</h3>
                </div>
                <p className="text-gray-600 mb-6">Launch a new whiteboard room and invite your team to collaborate instantly.</p>
                <button
                  className="bg-[#7752FE] text-white px-6 py-3 rounded-md hover:bg-[#8E8FFA] transition w-full"
                  onClick={handleCreateRoom}
                >
                  Create Room
                </button>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all border-t-4 border-[#8E8FFA]">
                <div className="flex items-center mb-4">
                  <svg className="w-8 h-8 text-[#8E8FFA] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                  <h3 className="text-2xl font-semibold text-[#190482]">Join a Session</h3>
                </div>
                <p className="text-gray-600 mb-6">Enter a room code to join an existing whiteboard session.</p>
                <button
                  className="bg-[#7752FE] text-white px-6 py-3 rounded-md hover:bg-[#8E8FFA] transition w-full"
                  onClick={joinRoom}
                >
                  Join Room
                </button>
              </div>
            </section>

            {/* Previous Sessions Section */}
            <section className="bg-white p-8 rounded-xl shadow-lg">
              <h2 className="text-3xl font-bold text-[#190482] mb-6">Your Recent Sessions</h2>
              <div className="bg-[#C2D9FF]/20 p-6 rounded-lg flex items-center justify-center text-gray-600">
                <p>— No recent sessions found. Start or join a room to see your history here. —</p>
              </div>
            </section>
          </>
        )}
      </main>

      {/* Tailwind Animation Keyframes */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fadeIn 1s ease-out;
          }
          @keyframes slideIn {
            from { opacity: 0; transform: translateY(50px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-slide-in {
            animation: slideIn 0.5s ease-out;
          }
        `}
      </style>
    </div>
  );
};

export default DashBody;