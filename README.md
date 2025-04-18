<!-- hello this is a real time white board sharing project using react + vite and expressJS
made by kalp and sumedh 
TRuUqQ


 -->
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import axios from '/src/lib/axios.js';
import Whiteboard from '../Canvas/JoinWhiteboard';
import OnlineControls from './OnlineControls';
import Chats from './Chats';
import socket from '/src/lib/socket.js';
import { toast } from 'react-hot-toast';

const Roomdashboard = () => {
    const navigate = useNavigate();
    const { roomid } = useParams();
    const { user } = useAuth0();
    const [roomDetails, setRoomDetails] = useState(null);
    const [isHost, setIsHost] = useState(false);
    const [canDraw, setCanDraw] = useState(false);
    const [msgs, setmsgs] = useState([]);
    const [showchat, setshowchat] = useState(false);
    const [micEnabled, setMicEnabled] = useState(false);
    const [peers, setPeers] = useState({});
    const localStreamRef = useRef(null);
    const chatRef = useRef(null);

    const handleParticipantsUpdate = useCallback((uparticipants) => {
        console.log('Participants updated:', uparticipants);
        setRoomDetails((prev) => ({ ...prev, participants: uparticipants }));
        const participant = uparticipants.find(p => p.id === user?.sub);
        setCanDraw(participant?.canDraw?.status || false);
    }, [user?.sub]);

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [msgs]);

    const createPeerConnection = (peerUserId) => {
        const peer = new RTCPeerConnection({
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
        });
        peer.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit('voiceIceCandidate', {
                    roomid,
                    candidate: event.candidate,
                    toUserId: peerUserId,
                    fromUserId: user.sub
                });
            }
        };
        peer.ontrack = (event) => {
            const audio = document.createElement('audio');
            audio.srcObject = event.streams[0];
            audio.autoplay = true;
            audio.id = `audio-${peerUserId}`;
            document.body.appendChild(audio);
        };
        return peer;
    };

    const addLocalStream = (peer) => {
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => {
                peer.addTrack(track, localStreamRef.current);
            });
        }
    };

    const initiateCall = async (toUserId) => {
        const peer = createPeerConnection(toUserId);
        addLocalStream(peer);
        try {
            const offer = await peer.createOffer();
            await peer.setLocalDescription(offer);
            socket.emit('voiceOffer', {
                roomid,
                offer,
                toUserId,
                fromUserId: user.sub
            });
            setPeers(prev => ({ ...prev, [toUserId]: peer }));
        } catch (error) {
            console.error('Error initiating call:', error);
        }
    };

    const handleVoiceToggle = async () => {
        if (!micEnabled) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                localStreamRef.current = stream;
                setMicEnabled(true);
                socket.emit('voiceToggle', { roomid, userId: user.sub, enabled: true });
                roomDetails?.participants
                    .filter(p => p.id !== user.sub && p.canSpeak)
                    .forEach(p => initiateCall(p.id));
            } catch (error) {
                console.error('Error accessing mic:', error);
                toast.error('Failed to access microphone');
            }
        } else {
            localStreamRef.current?.getTracks().forEach(track => track.stop());
            localStreamRef.current = null;
            Object.values(peers).forEach(peer => peer.close());
            setPeers({});
            setMicEnabled(false);
            socket.emit('voiceToggle', { roomid, userId: user.sub, enabled: false });
            document.querySelectorAll('audio[id^="audio-"]').forEach(audio => audio.remove());
        }
    };

    const handleRequestDrawPermission = () => {
        socket.emit('requestDrawPermission', {
            roomid,
            userId: user.sub,
            name: user.name || user.nickname || 'Anonymous'
        });
        toast.success('Draw permission requested!', { id: `request-${user.sub}` });
    };

    useEffect(() => {
        if (!user) return;

        const getRoomDetails = async () => {
            try {
                const res = await axios.get(`/room/roomdetails/${roomid}`);
                setRoomDetails(res.data);
                setmsgs(res.data.messages || []);
                setIsHost(user.sub === res.data.hostuser);
                const participant = res.data.participants.find(p => p.id === user.sub);
                setCanDraw(participant?.canDraw?.status || false);
            } catch (error) {
                console.error('Error fetching room details:', error);
                toast.error('Failed to load room details');
            }
        };

        const joinRoom = async () => {
            try {
                const res = await axios.put('/room/join', { roomid, user });
                if (res.data.participants) {
                    handleParticipantsUpdate(res.data.participants);
                    setmsgs(res.data.messages || []);
                }
                if (!res.data.participants?.some(p => p.id === user.sub)) {
                    socket.emit('joinroom', {
                        name: user.name || user.nickname || 'Anonymous',
                        roomid,
                        userId: user.sub,
                    });
                }
            } catch (error) {
                console.error('Error joining room:', error);
                toast.error('Failed to join room');
            }
        };

        getRoomDetails();
        joinRoom();

        socket.on('receiveChat', ({ name, sender, message, timestamp }) => {
            setmsgs((prev) => [...prev, { name, sender, message, timestamp }]);
        });

        socket.on('User Joined', (data) => {
            if (data.userId !== user.sub && micEnabled) {
                initiateCall(data.userId);
            }
            toast.success(`${data.name} has joined the room!`, { id: `join-${data.userId}` });
        });

        socket.on('User Left', (data) => {
            if (data.userId !== user.sub) {
                toast.success(`${data.name} has left the room!`, { id: `leave-${data.userId}` });
            }
        });

        socket.on('participantsUpdate', handleParticipantsUpdate);

        socket.on('User Kicked', (data) => {
            if (data.userId !== user.sub) {
                toast.success(`${data.name} was kicked from the room!`, { id: `kick-${data.userId}` });
            }
        });

        socket.on('kickedOut', ({ roomid: kickedRoomId }) => {
            if (kickedRoomId === roomid) {
                toast.error('You were kicked from the room!');
                navigate('/dashboard');
            }
        });

        socket.on('hostEndedMeeting', ({ message }) => {
            toast.error(message);
            navigate('/dashboard');
        });

        socket.on('drawPermissionRequested', (data) => {
            if (isHost && data.userId !== user.sub) {
                toast(
                    `Drawing permission requested by ${data.name}`,
                    {
                        duration: 10000,
                        id: `request-${data.userId}`,
                        buttons: [
                            {
                                text: 'Grant',
                                onClick: () => {
                                    socket.emit('grantDrawPermission', {
                                        roomid,
                                        userId: data.userId,
                                        granted: true,
                                        hostId: user.sub
                                    });
                                }
                            },
                            {
                                text: 'Deny',
                                onClick: () => {
                                    socket.emit('grantDrawPermission', {
                                        roomid,
                                        userId: data.userId,
                                        granted: false,
                                        hostId: user.sub
                                    });
                                }
                            }
                        ]
                    }
                );
            }
        });

        socket.on('drawPermissionResponse', (data) => {
            if (data.userId === user.sub) {
                setCanDraw(data.granted);
                toast.success(
                    data.granted ? 'Draw permission granted!' : 'Draw permission denied.',
                    { id: `perm-${data.userId}` }
                );
            } else {
                toast.success(
                    `${data.name} ${data.granted ? 'can now draw!' : 'draw permission denied.'}`,
                    { id: `perm-${data.userId}` }
                );
            }
        });

        socket.on('voiceOffer', async ({ offer, fromUserId }) => {
            if (!micEnabled) return;
            const peer = createPeerConnection(fromUserId);
            addLocalStream(peer);
            try {
                await peer.setRemoteDescription(new RTCSessionDescription(offer));
                const answer = await peer.createAnswer();
                await peer.setLocalDescription(answer);
                socket.emit('voiceAnswer', {
                    roomid,
                    answer,
                    toUserId: fromUserId,
                    fromUserId: user.sub
                });
                setPeers(prev => ({ ...prev, [fromUserId]: peer }));
            } catch (error) {
                console.error('Error handling offer:', error);
            }
        });

        socket.on('voiceAnswer', async ({ answer, fromUserId }) => {
            const peer = peers[fromUserId];
            if (peer) {
                try {
                    await peer.setRemoteDescription(new RTCSessionDescription(answer));
                } catch (error) {
                    console.error('Error handling answer:', error);
                }
            }
        });

        socket.on('voiceIceCandidate', async ({ candidate, fromUserId }) => {
            const peer = peers[fromUserId];
            if (peer) {
                try {
                    await peer.addIceCandidate(new RTCIceCandidate(candidate));
                } catch (error) {
                    console.error('Error adding ICE candidate:', error);
                }
            }
        });

        socket.on('voiceStatus', ({ userId, enabled }) => {
            if (userId !== user.sub) {
                setRoomDetails(prev => ({
                    ...prev,
                    participants: prev.participants.map(p =>
                        p.id === userId ? { ...p, canSpeak: enabled } : p
                    )
                }));
            }
        });

        socket.on('voiceMuted', ({ mute }) => {
            if (mute) {
                localStreamRef.current?.getTracks().forEach(track => track.stop());
                localStreamRef.current = null;
                Object.values(peers).forEach(peer => peer.close());
                setPeers({});
                setMicEnabled(false);
                toast.error('You were muted by the host');
            }
        });

        socket.on('voiceDisconnect', ({ userId }) => {
            if (peers[userId]) {
                peers[userId].close();
                setPeers(prev => {
                    const newPeers = { ...prev };
                    delete newPeers[userId];
                    return newPeers;
                });
                const audio = document.getElementById(`audio-${userId}`);
                if (audio) audio.remove();
            }
        });

        return () => {
            socket.emit('leaveroom', {
                name: user.name || user.nickname || 'Anonymous',
                roomid,
                userId: user.sub
            });
            localStreamRef.current?.getTracks().forEach(track => track.stop());
            Object.values(peers).forEach(peer => peer.close());
            socket.off('receiveChat');
            socket.off('User Joined');
            socket.off('User Left');
            socket.off('participantsUpdate');
            socket.off('User Kicked');
            socket.off('kickedOut');
            socket.off('hostEndedMeeting');
            socket.off('drawPermissionRequested');
            socket.off('drawPermissionResponse');
            socket.off('voiceOffer');
            socket.off('voiceAnswer');
            socket.off('voiceIceCandidate');
            socket.off('voiceStatus');
            socket.off('voiceMuted');
            socket.off('voiceDisconnect');
        };
    }, [user, roomid, navigate, isHost, handleParticipantsUpdate, micEnabled, peers]);

    return (
        <div className="min-h-screen bg-[#092635] text-[#9EC8B9] flex flex-col">
            <div className="bg-[#1B4242] px-6 py-3 flex justify-between items-center">
                <h1 className="text-xl font-semibold">Room: {roomid}</h1>
                <div className="flex gap-2">
                    <button
                        onClick={handleVoiceToggle}
                        className={`px-4 py-1 rounded-md transition-all ${
                            micEnabled
                                ? 'bg-green-500 text-white hover:bg-green-600'
                                : 'bg-gray-500 text-white hover:bg-gray-600'
                        }`}
                    >
                        {micEnabled ? 'Mute Mic' : 'Enable Mic'}
                    </button>
                    <button
                        onClick={() => setshowchat(true)}
                        className="bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-600 transition-all"
                    >
                        Chat
                    </button>
                    <button
                        className="bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600 transition-all"
                        onClick={async () => {
                            try {
                                await axios.put('/room/leave', { roomid, user });
                                navigate('/dashboard');
                            } catch (error) {
                                console.error('Error leaving room:', error);
                                toast.error('Failed to leave room');
                            }
                        }}
                    >
                        Leave Room
                    </button>
                </div>
            </div>
            <div className="flex flex-1 flex-col md:flex-row gap-4 p-4">
                <OnlineControls
                    isHost={isHost}
                    hostid={roomDetails?.hostuser}
                    participants={roomDetails?.participants || []}
                    roomid={roomid}
                />
                <div className="flex-1 bg-white rounded-xl shadow-md p-2">
                    <Whiteboard canDraw={canDraw} />
                    {!isHost && !canDraw && (
                        <button
                            onClick={handleRequestDrawPermission}
                            className="mt-2 bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 transition-all"
                        >
                            Request Draw Permission
                        </button>
                    )}
                </div>
                <div className="w-full md:w-[350px] flex flex-col gap-4">
                    <div className="bg-[#1B4242] p-4 rounded-lg flex-1">
                        <h3 className="font-semibold mb-2">Options</h3>
                    </div>
                </div>
                {showchat && <Chats msgs={msgs} setshowchat={setshowchat} chatRef={chatRef} />}
            </div>
        </div>
    );
};

export default Roomdashboard;