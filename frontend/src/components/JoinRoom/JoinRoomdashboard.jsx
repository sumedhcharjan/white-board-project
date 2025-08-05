import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import axios from '/src/lib/axios.js';
import Whiteboard from "../Canvas/JoinWhiteboard";
import OnlineControls from './OnlineControls';
import socket from '/src/lib/socket.js';
import { toast } from 'react-hot-toast';
import DrawingOptions from '../Canvas/DrawingOptions';

const Roomdashboard = () => {
  const navigate = useNavigate();
  const { roomid } = useParams();
  const { user } = useAuth0();
  const [roomDetails, setroomDetails] = useState(null);
  const [isHost, setisHost] = useState(false);
  const [candraw, setcandraw] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [selectedTool, setSelectedTool] = useState("pencil");
  const [elements, setElements] = useState({});
  const [width, setWidth] = useState("4");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const participantList = Array.isArray(roomDetails?.participants)
      ? roomDetails?.participants
      : [];
    const participant = participantList.find(x => x.id === user?.sub);
    setcandraw(participant?.candraw ?? false);
  }, [roomDetails, user]);

  useEffect(() => {
    if (!user) return;
    setisHost((user.sub === roomDetails?.hostuser));
    const p = roomDetails?.participants?.find(x => x.id === user.sub);
    setcandraw(p?.candraw);
    const getroomdetails = async () => {
      try {
        const res = await axios.get(`/room/roomdetails/${roomid}`);
        setroomDetails(res.data);
        setisHost((user.sub === res.data.hostuser));
        const p = res.data.participants.find(x => x.id === user.sub);
        setcandraw(p.candraw);
      } catch (error) {
        console.log("Error fetching room details", error);
      }
    };
    if (user) getroomdetails();

    if (!socket.connected) {
      socket.connect();
    }
    socket.emit('joinroom', {
      roomid,
      userid: user.sub,
      name: user.name || user.nickname || 'Anonymous',
    });

    socket.on('User Joined', (data) => {
      toast.success(`${data.name} has joined the room!`);
    });
    socket.on('User Left', (data) => {
      toast.success(`${data.name} has left the room!`);
    });
    socket.on('participantsUpdate', (uparticipants) => {
      console.log('Participants updated:', uparticipants);
      setroomDetails((prev) => ({ ...prev, participants: uparticipants }));
    });
    socket.on('Kickout', (data) => {
      console.log(data.name);
      if (data.userid !== user.sub) toast.error(`${data.name} was kicked from the room!`);
      else if (data.userid === user.sub) navigate('/dashboard');
    });
    socket.on('hostEndedMeeting', ({ message }) => {
      toast.error(message);
      navigate('/dashboard');
    });
    socket.on('AskPermission', ({ name, hostid, userid }) => {
      if (user.sub === hostid) {
        console.log('Host');
        console.log(userid);
        showPermissionToast({ name, hostid, userid, roomid });
      } else {
        console.log('Not Host');
      }
    });
    socket.on('PermissionResult', ({ userid, granted }) => {
      console.log(user?.sub, userid);
      if (user?.sub === userid) {
        if (granted) toast.success('Host has given you permission to draw!');
        else toast.error('Host denied permission!');
      }
      console.log('Done!');
    });

    return () => {
      socket.off('User Joined');
      socket.off('User Left');
      socket.off('participantsUpdate');
      socket.off('Kickout');
      socket.off('hostEndedMeeting');
      socket.emit('leaveroom', {
        name: user.name || user.nickname || 'Anonymous',
        roomid,
      });
    };
  }, [user, roomid, navigate]);

  useEffect(() => {
    const fetchDrawingData = async () => {
      try {
        console.log("Fetching drawing data for room:", roomid);
        const response = await axios.get("/room/getelements", { params: { roomid } });
        const data = response.data?.drawingData;
        if (Array.isArray(data)) {
          setElements(data);
        } else {
          console.warn('Received invalid drawing data:', data);
          setElements([]);
        }
      } catch (error) {
        console.error('Error fetching drawing data:', error);
        setElements([]);
        }
    };
    fetchDrawingData();
  }, [roomid]);

  const helper = ({ userid, granted }) => {
    console.log(roomid, userid);
    socket.emit('grantDrawP', { hostid: roomDetails?.hostuser, userid, roomid, granted });
    console.log('Helper!');
  };

  const showPermissionToast = ({ name, userid, hostid, roomid }) => {
    toast.custom((t) => (
      <div className="bg-white shadow-lg border p-4 rounded-xl w-[320px] animate-slide-in">
        <p className="font-semibold mb-3 text-[#190482]">Drawing permission requested by {name}</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              helper({ userid, granted: true });
              toast.dismiss(t.id);
            }}
            className="bg-[#7752FE] text-white px-4 py-2 rounded-md hover:bg-[#8E8FFA] transition"
          >
            Grant
          </button>
          <button
            onClick={() => {
              helper({ userid, granted: false });
              toast.dismiss(t.id);
            }}
            className="bg-gray-300 text-gray-900 px-4 py-2 rounded-md hover:bg-gray-400 transition"
          >
            Deny
          </button>
        </div>
      </div>
    ), {
      id: `permission-${userid}`,
      duration: 10000,
    });
  };

  const handleLeave = async () => {
    try {
      const res = await axios.put('/room/leave', { roomid, user });
      console.log(res);
      if (res?.data?.msg === 'Left the room successfully' || res?.data?.msg === 'Host ended the meeting!') {
        socket.emit('leaveroom', {
          name: user.name || user.nickname || "Anonymous",
          roomid: roomid,
        });
        navigate('/dashboard');
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#C2D9FF]/10 via-white to-[#8E8FFA]/10 font-sans">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(circle_at_center,#7752FE_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-5">
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#8E8FFA]/20 to-transparent"></div>
      </div>

      {/* Header */}
      <header className="bg-gradient-to-r from-[#190482] to-[#7752FE] shadow-lg sticky top-0 z-50">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl sm:text-2xl font-bold text-white">Room: {roomid}</h1>
            <span className="text-[#C2D9FF] text-sm px-3 py-1 bg-white/10 rounded-full">
              {user?.name || user?.nickname || "User"}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              className="md:hidden p-2 rounded-full bg-[#8E8FFA] text-white hover:bg-[#C2D9FF] transition transform hover:scale-105"
              onClick={toggleSidebar}
              title="Toggle Tools"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
            <button
              className="bg-[#7752FE] text-white px-4 py-2 rounded-md hover:bg-[#8E8FFA] transition flex items-center gap-2 transform hover:scale-105"
              onClick={handleLeave}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
              Leave Room
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col 2xl:flex-row gap-6">
        {/* Whiteboard Section */}
        <section className="flex-1 bg-white rounded-xl shadow-2xl p-4 relative overflow-hidden animate-fade-in">
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8E8FFA_1px,transparent_1px),linear-gradient(to_bottom,#8E8FFA_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-5"></div>
          <Whiteboard
            candraw={candraw}
            elements={elements}
            selectedColor={selectedColor}
            width={width}
            selectedTool={selectedTool}
          />
        </section>

        {/* Right Sidebar: Online Controls & Drawing Options */}
        <aside
          className={`w-full md:w-full 2xl:w-80 flex flex-col gap-6 md:bg-transparent md:shadow-none md:p-0 transition-all duration-300 ease-in-out ${
            isSidebarOpen ? 'block' : 'hidden md:block'
          }`}
        >
          {/* Online Controls */}
          <div className="bg-white rounded-xl shadow-lg p-6 animate-slide-in md:animate-none">
            <div>
                
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-[#190482] mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-[#7752FE]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
              Collaboration
            </h3>
            <OnlineControls
              isHost={isHost}
              hostid={roomDetails?.hostuser}
              participants={roomDetails?.participants}
              messages={roomDetails?.messages}
            />
          </div>
          {/* Drawing Options */}
          <div className="bg-white rounded-xl shadow-lg p-6 animate-slide-in md:animate-none mt-3">
            <h3 className="text-lg sm:text-xl font-semibold text-[#190482] mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-[#7752FE]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
              </svg>
              Drawing Tools
            </h3>
            <DrawingOptions
              setSelectedColor={setSelectedColor}
              selectedColor={selectedColor}
              setSelectedTool={setSelectedTool}
              selectedTool={selectedTool}
              width={width}
              setWidth={setWidth}
            />
          </div>
        </aside>
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

export default Roomdashboard;