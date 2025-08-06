import React from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate, useParams } from 'react-router-dom';
import axios from '/src/lib/axios.js';
import socket from '/src/lib/socket.js';
import { MdPeople } from 'react-icons/md';

const Participants = ({ participants, onClose, hostid, isHost }) => {
    const { user } = useAuth0();
    const { roomid } = useParams();
    const navigate = useNavigate();

    const handleKick = async (userid) => {
        if (!isHost) return;
        try {
            const res = await axios.put('/room/kickout', {
                roomid,
                userid,
                hostid
            });
            console.log(res);
        } catch (error) {
            console.log(error);
        }
    };

    const TakePermission = (userid) => {
        socket.emit('grantDrawP', { userid, roomid, hostid, granted: false });
    };

    return (
        <div className="fixed right-0 top-0 h-full w-full sm:w-[min(90vw,20rem)] md:w-[min(40vw,24rem)] lg:w-[min(30vw,28rem)] bg-white shadow-2xl z-50 p-2 sm:p-3 md:p-4 flex flex-col transition-all duration-300 animate-slide-in">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
                <h2 className="text-base sm:text-lg md:text-xl font-semibold text-[#190482] flex items-center gap-2">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#7752FE]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                    </svg>
                    Participants
                </h2>
                <button
                    onClick={onClose}
                    className="text-[#7752FE] hover:text-[#8E8FFA] text-lg sm:text-xl md:text-2xl font-bold transition-colors duration-200 p-2"
                    aria-label="Close participants"
                >
                    ×
                </button>
            </div>
            <ul className="flex-1 space-y-2 overflow-y-auto max-h-[calc(100vh-8rem)] sm:max-h-[calc(100vh-9rem)] md:max-h-[calc(100vh-10rem)]">
                {participants.length > 0 ? (
                    participants.map((p, index) => (
                        <div key={index} className="bg-[#C2D9FF]/10 rounded-lg flex justify-between items-center p-2 sm:p-3">
                            <li className="flex items-center gap-2 text-[#190482] text-sm sm:text-base">
                                {p.id === user.sub && <span className="text-sm opacity-50">*</span>}
                                <MdPeople size={24} /> {p.name}
                                {p.id === hostid && <span className="text-xs opacity-60">(Host)</span>}
                            </li>
                            <div className="flex gap-2">
                                {isHost && hostid !== p.id && p.candraw && (
                                    <button
                                        onClick={() => TakePermission(p.id)}
                                        className="bg-[#7752FE] text-white px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-md hover:bg-[#8E8FFA] transition-all duration-200"
                                    >
                                        Deny
                                    </button>
                                )}
                                {isHost && p.id !== user.sub && hostid !== p.id && (
                                    <button
                                        onClick={() => handleKick(p.id)}
                                        className="bg-red-500 text-white px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-md hover:bg-red-600 transition-all duration-200"
                                    >
                                        Kick
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-sm sm:text-base text-gray-500 italic">No participants yet.</p>
                )}
            </ul>
        </div>
    );
};

export default Participants;