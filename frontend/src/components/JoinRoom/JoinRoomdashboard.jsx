import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import axios from '/src/lib/axios.js';
import Whiteboard from "../Canvas/JoinWhiteboard";
import OnlineControls from './OnlineControls';
import socket from '/src/lib/socket.js';
import { toast } from 'react-hot-toast';
import DrawingOptions from '../Canvas/DrawingOptions';
import { FiCopy } from "react-icons/fi";

const Roomdashboard = () => {
  const navigate = useNavigate();
  const { roomid } = useParams();
  const { user } = useAuth0();
  const [roomDetails, setRoomDetails] = useState(null);
  const [isHost, setIsHost] = useState(false);
  const [candraw, setCandraw] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [selectedTool, setSelectedTool] = useState("pencil");
  const [elements, setElements] = useState([]);
  const [width, setWidth] = useState("4");
  const [loading, setLoading] = useState(true); // New loading state

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        setLoading(true); // Set loading to true at the start

        // Fetch room details
        const roomResponse = await axios.get(`/room/roomdetails/${roomid}`);
        const roomData = roomResponse.data;
        setRoomDetails(roomData);
        setIsHost(user.sub === roomData.hostuser);
        const participant = roomData.participants.find(x => x.id === user.sub);
        setCandraw(participant?.candraw ?? false);

        // Fetch drawing data
        const drawingResponse = await axios.get("/room/getelements", { params: { roomid } });
        const drawingData = drawingResponse.data?.drawingData;
        if (Array.isArray(drawingData)) {
          setElements(drawingData);
        } else {
          console.warn('Received invalid drawing data:', drawingData);
          setElements([]);
        }
      } catch (error) {
        console.error("Error fetching data", error);
        toast.error("Failed to load room data. Please try again.");
        navigate('/dashboard'); // Redirect to dashboard on error
      } finally {
        setLoading(false); // Set loading to false when done
      }
    };

    fetchData();

    // Socket setup
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
    socket.on('participantsUpdate', (updatedParticipants) => {
      console.log('Participants updated:', updatedParticipants);
      setRoomDetails((prev) => ({ ...prev, participants: updatedParticipants }));
      const participant = updatedParticipants.find(x => x.id === user.sub);
      setCandraw(participant?.candraw ?? false);
    });
    socket.on('Kickout', (data) => {
      if (data.userid !== user.sub) {
        toast.error(`${data.name} was kicked from the room!`);
      } else {
        toast.error("You have been kicked from the room!");
        navigate('/dashboard');
      }
    });
    socket.on('hostEndedMeeting', ({ message }) => {
      toast.error(message);
      navigate('/dashboard');
    });
    socket.on('AskPermission', ({ name, hostid, userid }) => {
      if (user.sub === hostid) {
        showPermissionToast({ name, hostid, userid, roomid });
      }
    });
    socket.on('PermissionResult', ({ userid, granted }) => {
      if (user?.sub === userid) {
        if (granted) {
          toast.success('Host has given you permission to draw!');
          setCandraw(true);
        } else {
          toast.error('Host denied permission!');
          setCandraw(false);
        }
      }
    });

    return () => {
      socket.off('User Joined');
      socket.off('User Left');
      socket.off('participantsUpdate');
      socket.off('Kickout');
      socket.off('hostEndedMeeting');
      socket.off('AskPermission');
      socket.off('PermissionResult');
      socket.emit('leaveroom', {
        name: user.name || user.nickname || 'Anonymous',
        roomid,
      });
    };
  }, [user, roomid, navigate]);

  const helper = ({ userid, granted }) => {
    socket.emit('grantDrawP', { hostid: roomDetails?.hostuser, userid, roomid, granted });
  };

  const showPermissionToast = ({ name, userid, hostid, roomid }) => {
    toast.custom((t) => (
      <div className="bg-[#FAFAFA] shadow-lg border p-4 rounded-xl w-[320px] animate-slide-in">
        <p className="font-semibold mb-3 text-[#2D3748]">Drawing permission requested by {name}</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              helper({ userid, granted: true });
              toast.dismiss(t.id);
            }}
            className="bg-[#14B8A6] text-white px-4 py-2 rounded-md hover:bg-[#FBBF24] transition"
          >
            Grant
          </button>
          <button
            onClick={() => {
              helper({ userid, granted: false });
              toast.dismiss(t.id);
            }}
            className="bg-[#FAFAFA] text-[#2D3748] px-4 py-2 rounded-md hover:bg-[#7C3AED]/20 transition border border-[#7C3AED]"
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
      if (res?.data?.msg === 'Left the room successfully' || res?.data?.msg === 'Host ended the meeting!') {
        socket.emit('leaveroom', {
          name: user.name || user.nickname || "Anonymous",
          roomid: roomid,
        });
        navigate('/dashboard');
      }
    } catch (error) {
      console.error("Error leaving room", error);
      toast.error("Failed to leave room. Please try again.");
    }
  };


    const handleCopy = () => {
    navigator.clipboard.writeText(roomid);
    toast.success("Copied!");
  };

  return (
    <div className="relative min-h-screen font-sans">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 -z-10 h-full w-full bg-[#FAFAFA] bg-[linear-gradient(to_right,#2D3748_1px,transparent_1px),linear-gradient(to_bottom,#2D3748_1px,transparent_1px)] bg-[size:6rem_4rem] opacity-20"
        style={{
          backgroundAttachment: 'fixed',
          backgroundPosition: 'center',
        }}
      ></div>
      {/* Header */}
      <header className="bg-[#14B8A6] shadow-lg sticky top-0 z-50">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl sm:text-2xl font-bold text-white">Room:{roomid}</h1>
            <button onClick={()=>handleCopy()} ><FiCopy className="w-4 h-4 text-gray-600 hover:text-[#14B8A6] cursor-pointer" /></button>
            <span className="text-black w-auto text-sm px-3 py-1 bg-[#FAFAFA]/10 rounded-full">
              {user?.name || user?.nickname || "User"}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              className="bg-[#14B8A6] text-white px-4 py-2 rounded-md hover:bg-[#FBBF24] transition flex items-center gap-2"
              onClick={handleLeave}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
              Leave
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      {loading ? (
        <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#7C3AED]"></div>
        </div>
      ) : (
        <main className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col 2xl:flex-row gap-6">
          {/* Whiteboard Section */}
          <section className="flex-1 bg-[#FAFAFA] rounded-xl shadow-2xl p-4 relative overflow-hidden animate-fade-in">
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#7C3AED_1px,transparent_1px),linear-gradient(to_bottom,#7C3AED_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-5"></div>
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
            className={`w-full md:w-full 2xl:w-80 flex flex-col gap-6 md:bg-transparent md:shadow-none md:p-0 transition-all duration-300 ease-in-out`}
          >
            {/* Online Controls */}
            <div className="bg-[#FAFAFA] rounded-xl shadow-lg p-6 animate-slide-in md:animate-none">
              <h3 className="text-lg sm:text-xl font-semibold text-[#2D3748] mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-[#7C3AED]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
            <div className="bg-[#FAFAFA] rounded-xl shadow-lg p-6 animate-slide-in md:animate-none mt-3">
              <h3 className="text-lg sm:text-xl font-semibold text-[#2D3748] mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-[#7C3AED]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
      )}

      {/* Tailwind Animation Keyframes */}
      <style>
        {`
          @keyframes fade zespół {
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