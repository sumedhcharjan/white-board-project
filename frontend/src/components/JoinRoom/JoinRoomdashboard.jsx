import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import axios from '/src/lib/axios.js'
import Whiteboard from "../Canvas/JoinWhiteboard"
import OnlineControls from './OnlineControls';
import socket from '/src/lib/socket.js';
import { toast } from 'react-hot-toast';
import DrawingOptions from '../Canvas/DrawingOptions';
const Roomdashboard = () => {
    const navigate = useNavigate();
    const { roomid } = useParams();
    const { user } = useAuth0();
    const [roomDetails, setroomDetails] = useState(null)
    const [isHost, setisHost] = useState(false);
    const [candraw, setcandraw] = useState(false);
    const [selectedColor, setSelectedColor] = useState("#000000");
    const [selectedTool, setSelectedTool] = useState("pencil");
    const [elements, setElements] = useState({});
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
        const getroomdetails = async (params) => {
            try {
                const res = await axios.get(`/room/roomdetails/${roomid}`)
                setroomDetails(res.data);
                setisHost((user.sub === res.data.hostuser));
                const p = res.data.participants.find(x => x.id === user.sub);
                setcandraw(p.candraw);
            } catch (error) {
                console.log("Error fetching room details", error);
            }

        }
        if (user) getroomdetails();

        // Ensure socket is connected
        if (!socket.connected) {
            socket.connect();
        }
        // Join the room
        socket.emit('joinroom', {
            roomid,
            userid: user.sub,
            name: user.name || user.nickname || 'Anonymous',
        });

        socket.on('User Joined', (data) => {
            toast.success(`${data.name} have Joined the room!`);

        })
        socket.on('User Left', (data) => {
            toast.success(`${data.name} have left the room!`);
        })

        socket.on('participantsUpdate', (uparticipants) => {
            console.log('Participants updated:', uparticipants);
            setroomDetails((prev) => ({ ...prev, participants: uparticipants }));
        });
        socket.on('Kickout', (data) => {
            console.log(data.name);
            if (data.userid !== user.sub) toast.error(`${data.name} was kicked from the room!`);
            else if (data.userid === user.sub) navigate('/dashboard');
        })
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
        })
        socket.on('PermissionResult', ({ userid, granted }) => {
            console.log(user?.sub, userid);
            if (user?.sub === userid) {
                if (granted) toast.success('Host Has Given You permission to Draw!');
                else toast.error('Host Denied permission!')
            }
            console.log('Done!');

        })
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
    }, [user, roomid]);

    useEffect(() => {
        const fetchDrawingData = async () => {
            try {
                console.log("hello hello", roomid);
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
                setElements([]);  // fallback to empty
            }
        };

        fetchDrawingData();
    }, [roomid]);

    const helper = ({ userid, granted }) => {
        console.log(roomid, userid);
        socket.emit('grantDrawP', { hostid: roomDetails?.hostuser, userid, roomid, granted });
        console.log('Helper!');
    }

    const showPermissionToast = ({ name, userid, hostid, roomid }) => {
        toast.custom((t) => (
            <div className="bg-white shadow-md border p-4 rounded-md w-[300px]">
                <p className="font-semibold mb-2">Drawing permission requested by {name}</p>
                <div className="flex justify-end gap-2">
                    <button
                        onClick={() => {
                            helper({ userid, granted: true });
                            toast.dismiss(t.id);
                        }}
                        className="bg-green-500 text-white px-3 py-1 rounded"
                    >
                        Grant
                    </button>
                    <button
                        onClick={() => {
                            helper({ userid, granted: false });
                            toast.dismiss(t.id);

                        }}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                        Deny
                    </button>
                </div>
            </div>
        ), {
            id: `permission-${userid}`,
            duration: 10000
        });
    };
    const handleLeave = async (params) => {
        try {
            const res = await axios.put('/room/leave', { roomid, user });
            console.log(res);
            if (res?.data?.msg === 'Left the room successfully' || res?.data?.msg === 'Host ended the meeting!') {
                socket.emit('leaveroom', {
                    name: user.name || user.nickname || "Ananoymus",
                    roomid: roomid,
                })
                navigate('/dashboard');
            }
        } catch (error) {
            console.log("Error", error);
        }
    }
    return (
        <div>
            <div className="min-h-screen bg-[#092635] text-[#9EC8B9] flex flex-col">
                {/* Header / Top bar with participants */}
                <div className="bg-[#1B4242] px-6 py-3 flex justify-between items-center">
                    <h1 className="text-xl font-semibold">Room: {roomid}</h1>
                    <button
                        className="bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600 transition-all"
                        onClick={handleLeave}
                    >
                        Leave Room
                    </button>
                </div>
                <div className="flex flex-1 flex-col md:flex-row gap-4 p-4">
                    <OnlineControls isHost
                        hostid={roomDetails?.hostuser}
                        participants={roomDetails?.participants}
                        messages={roomDetails?.messages} />

                    {/* Whiteboard Section */}
                    <div className="flex-1 bg-white rounded-xl shadow-md p-2">
                        <Whiteboard candraw={candraw} elements={elements} />
                    </div>

                    {/* Right Sidebar */}
                    <div className="w-full md:w-[350px] flex flex-col gap-4">
                        <DrawingOptions
                            setSelectedColor={setSelectedColor}
                            selectedColor={selectedColor}
                            setSelectedTool={setSelectedTool}
                            selectedTool={selectedTool}
                        />
                        {/* Chat / Guess History */}
                        <div className="bg-[#1B4242] p-4 h-1/2 rounded-lg flex-1 overflow-y-auto">
                            <h3 className="font-semibold mb-2">extra options</h3>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Roomdashboard;
