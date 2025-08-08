import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import axios from '/src/lib/axios.js';
import socket from '/src/lib/socket.js';
import toast from 'react-hot-toast';

const DashBody = () => {
  const { user, logout } = useAuth0();
  const navigate = useNavigate();
  const [joinid, setjoinid] = useState("");
  const [joining, setjoining] = useState(false);
  const [join, setjoin] = useState(false);
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
      setjoin(true)
      const res = await axios.put('/room/joinroom', { user, Rid: roomid });
      if (res?.data?.msg === 'Joined room') {
        setjoin(false);
        navigate(`/room/${roomid}`);
        socket.emit('joinroom', {
          name: user.name || user.nickname || "Anonymous",
          roomid: roomid,
        });
      }
    } catch (error) {
      setjoin(false)
      console.log(error);
    }
  };

  const handleJoinRoom = async () => {
    try {
      setjoin(true)
      const res = await axios.put('/room/joinroom', { user, Rid: joinid });
      if (res?.data?.msg === 'Joined room') {
        setjoin(false)
        navigate(`/room/${joinid}`);
        socket.emit('joinroom', {
          name: user.name || user.nickname || "Anonymous",
          roomid: joinid,
        });
      }
    } catch (error) {
      console.log(error);
      setjoin(false)
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(roomid);
    toast.success("Copied!");
  };

  return (
    <div className="relative min-h-screen font-sans ">
      {/* Background Grid with Wave Effect */}
      <div 
        className="absolute inset-0 -z-10 h-full w-full bg-[#FAFAFA] bg-[linear-gradient(to_right,#2D3748_1px,transparent_1px),linear-gradient(to_bottom,#2D3748_1px,transparent_1px)] bg-[size:6rem_4rem] opacity-20"
        style={{
          backgroundAttachment: 'fixed',
          backgroundPosition: 'center',
        }}
      ></div>
      <div className="absolute inset-0 -z-10 opacity-10">
        <svg viewBox="0 0 1440 320" className="w-full h-full">
          <path fill="#7C3AED" fillOpacity="0.3" d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,138.7C672,128,768,160,864,186.7C960,213,1056,235,1152,213.3C1248,192,1344,128,1392,96L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>

      {/* Header */}
      <header className="bg-[#14B8A6] shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white tracking-tight">CollabBoard</h1>
          <div className="flex items-center space-x-3">
            <span className="text-white text-sm font-medium">{user?.name || user?.nickname || "User"}</span>
            <button
              className="p-2 rounded-full bg-[#14B8A6] text-white hover:bg-[#FBBF24] transition transform hover:scale-105 border border-white"
              onClick={() => navigate('/profile')}
              title="Profile"
              aria-label="View profile"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </button>
            <button
              className="p-2 rounded-full bg-[#14B8A6] text-white hover:bg-[#FBBF24] transition transform hover:scale-105 border border-white"
              onClick={() => navigate('/')}
              title="Home"
              aria-label="Go to home"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
            </button>
<button
  className="p-2 rounded-full bg-[#14B8A6] text-white hover:bg-[#FBBF24] transition transform hover:scale-105 border border-white"
  onClick={() =>
    logout({
      logoutParams: {
        returnTo: window.location.origin, // Corrected location
      },
    })
  }
  title="Logout"
  aria-label="Log out"
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
            <div className="bg-[#FAFAFA] p-8 rounded-2xl shadow-2xl text-center max-w-md w-full animate-slide-in border border-[#7C3AED]/20">
              <h2 className="text-2xl font-bold text-[#2D3748] mb-4 tracking-tight">Join a Whiteboard Session</h2>
              <input
                type="text"
                placeholder="Enter Room Code"
                value={joinid}
                onChange={(e) => setjoinid(e.target.value)}
                className="w-full p-3 border-2 border-[#7C3AED] rounded-full mb-6 focus:outline-none focus:ring-2 focus:ring-[#14B8A6] text-[#2D3748] bg-white"
                aria-label="Room code input"
              />
              <div className="flex justify-center gap-4">
                <button
                  className="bg-[#FAFAFA] text-[#2D3748] px-6 py-2 rounded-full hover:bg-[#7C3AED]/20 transition border border-[#7C3AED]"
                  onClick={() => setjoining(false)}
                  aria-label="Cancel joining room"
                >
                  Cancel
                </button>
                <button
                  className="bg-[#14B8A6] text-white px-6 py-2 rounded-full hover:bg-[#FBBF24] transition transform hover:scale-105"
                  onClick={handleJoinRoom}
                   disabled={join}
                  aria-label="Join room"
                >
                  {join ? "joining.." : "join"}
                </button>
              </div>
            </div>
          </div>
        ) : creating ? (
          <div className="fixed inset-0 flex justify-center items-center bg-black/50">
            <div className="bg-[#FAFAFA] p-8 rounded-2xl shadow-2xl text-center max-w-md w-full animate-slide-in border border-[#7C3AED]/20">
              <h2 className="text-2xl font-bold text-[#2D3748] mb-4 tracking-tight">Your Room Code</h2>
              <input
                type="text"
                value={roomid || "generating..."}
                readOnly
                className="w-full p-3 border-2 border-[#7C3AED] rounded-full mb-6 bg-white text-[#2D3748]"
                aria-label="Room code (read-only)"
              />
              <div className="flex justify-center gap-4">
                <button
                  className="bg-[#14B8A6] text-white px-6 py-2 rounded-full hover:bg-[#FBBF24] transition transform hover:scale-105"
                  onClick={handleCopy}
                  aria-label="Copy room code"
                >
                  Copy
                </button>
                <button
                  className="bg-[#FAFAFA] text-[#2D3748] px-6 py-2 rounded-full hover:bg-[#7C3AED]/20 transition border border-[#7C3AED]"
                  onClick={() => setcreating(false)}
                  aria-label="Cancel room creation"
                >
                  Cancel
                </button>
                <button
                  className="bg-[#14B8A6] text-white px-6 py-2 rounded-full hover:bg-[#FBBF24] transition transform hover:scale-105"
                  onClick={handleCreateJoin}
                  disabled={join}
                  aria-label="Join created room"
                >
                  {join ? "joining.." : "join"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Hero Section */}
            <section className="text-center mb-12 relative">
              <h2 className="text-4xl font-extrabold text-[#2D3748] mb-4 animate-fade-in tracking-tight">
                Your Creative Workspace Awaits
              </h2>
              <p className="text-lg text-[#2D3748] max-w-2xl mx-auto leading-relaxed">
                Dive into real-time collaboration with your team. Create or join a whiteboard session to bring ideas to life.
              </p>
            </section>

            {/* Action Cards */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <div className="bg-[#FAFAFA] p-8 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all border-t-4 border-[#7C3AED]">
                <div className="flex items-center mb-4">
                  <svg className="w-8 h-8 text-[#7C3AED] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                  <h3 className="text-2xl font-semibold text-[#2D3748]">Start a New Session</h3>
                </div>
                <p className="text-[#2D3748] mb-6 leading-relaxed">Launch a fresh whiteboard room and invite your team to collaborate instantly.</p>
                <button
                  className="bg-[#14B8A6] text-white px-6 py-3 rounded-full hover:bg-[#FBBF24] transition w-full transform hover:scale-105"
                  onClick={handleCreateRoom}
                  aria-label="Create a new room"
                >
                  Create Room
                </button>
              </div>
              <div className="bg-[#FAFAFA] p-8 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all border-t-4 border-[#7C3AED]">
                <div className="flex items-center mb-4">
                  <svg className="w-8 h-8 text-[#7C3AED] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                  <h3 className="text-2xl font-semibold text-[#2D3748]">Join a Session</h3>
                </div>
                <p className="text-[#2D3748] mb-6 leading-relaxed">Enter a room code to join an existing whiteboard session with your team and collab.</p>
                <button
                  className="bg-[#14B8A6] text-white px-6 py-3 rounded-full hover:bg-[#FBBF24] transition w-full transform hover:scale-105"
                  onClick={joinRoom}
                  aria-label="Join an existing room"
                >
                  Join Room
                </button>
              </div>
            </section>

            {/* Previous Sessions Section */}
            <section className="bg-[#FAFAFA] p-8 rounded-2xl shadow-lg">
              <h2 className="text-3xl font-bold text-[#2D3748] mb-6 tracking-tight">Your Recent Sessions</h2>
              <div className="bg-[#7C3AED]/10 p-6 rounded-lg flex flex-col items-center justify-center text-[#2D3748]">
                <svg className="w-16 h-16 text-[#7C3AED] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <p className="text-lg">No recent sessions found. Start or join a room to see your history here.</p>
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
