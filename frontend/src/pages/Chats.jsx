import React, { useEffect, useRef, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate, useParams } from 'react-router-dom';
import socket from '/src/lib/socket.js';

const Chats = ({ msgs, setshowchat }) => {
    const { user } = useAuth0();
    const { roomid } = useParams();
    const navigate = useNavigate();
    const chatRef = useRef(null);
    const [chatinp, setchatinp] = useState('');

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [msgs]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!chatinp.trim()) return;
        socket.emit('sendChat', {
            name: user.name || user.nickname || user.email,
            sender: user.sub,
            message: chatinp,
            roomid: roomid,
        });
        setchatinp('');
    };

    return (
        <div className="fixed right-0 top-0 h-full w-full sm:w-80 bg-white shadow-2xl z-50 p-4 flex flex-col transition-all duration-300 animate-slide-in">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-[#190482] flex items-center gap-2">
                    <svg className="w-6 h-6 text-[#7752FE]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                    </svg>
                    Room Chat
                </h2>
                <button
                    onClick={() => setshowchat((prev) => !prev)}
                    className="text-[#7752FE] hover:text-[#8E8FFA] text-xl font-bold transition-colors duration-200"
                    aria-label="Close chat"
                >
                    ×
                </button>
            </div>
            <div
                ref={chatRef}
                className="flex-1 bg-[#C2D9FF]/10 p-3 rounded-lg overflow-y-auto max-h-[calc(100vh-180px)] scroll-smooth"
            >
                {msgs && msgs.length > 0 ? (
                    msgs.map((m, index) => (
                        <div
                            key={`${m.sender}-${m.timestamp}-${index}`}
                            className={`mb-3 flex ${
                                user.sub === m.sender ? 'justify-end' : 'justify-start'
                            }`}
                        >
                            <div
                                className={`max-w-[70%] p-3 rounded-lg shadow-sm ${
                                    user.sub === m.sender
                                        ? 'bg-[#7752FE] text-white'
                                        : 'bg-[#C2D9FF]/30 text-[#190482]'
                                }`}
                            >
                                <div className="flex justify-between items-baseline gap-2">
                                    <span className="text-xs font-semibold">
                                        {user.sub === m.sender ? 'You' : m.name}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        {new Date(m.timestamps).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </span>
                                </div>
                                <p className="text-sm mt-1">{m.message}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-gray-500 italic text-center">No messages yet. Start chatting!</p>
                )}
            </div>
            <form onSubmit={handleSendMessage} className="mt-3 flex gap-2">
                <input
                    type="text"
                    value={chatinp}
                    onChange={(e) => setchatinp(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-[#C2D9FF]/10 text-[#190482] p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7752FE] transition-all duration-200"
                />
                <button
                    type="submit"
                    className="bg-[#7752FE] text-white px-4 py-2 rounded-lg hover:bg-[#8E8FFA] transition-all duration-200"
                >
                    Send
                </button>
            </form>
        </div>
    );
};

export default Chats;