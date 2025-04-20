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
    // console.log(msgs);
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
        <div className="fixed left-0 top-0 h-full w-80 bg-gradient-to-b from-[#1B4242] to-[#092635] text-[#F5F6F5] shadow-2xl z-50 p-4 flex flex-col transition-all duration-300">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-[#9EC8B9] tracking-wide">Room Chat</h2>
                <button
                    onClick={() => setshowchat((prev) => !prev)}
                    className="text-[#9EC8B9] hover:text-red-400 text-2xl font-bold transition-colors duration-200"
                    aria-label="Close chat"
                >
                    ×
                </button>
            </div>
            <div
                ref={chatRef}
                className="flex-1 bg-[#092635]/80 backdrop-blur-sm p-3 rounded-lg overflow-y-auto max-h-[calc(100vh-180px)] scroll-smooth"
            >
                {msgs && msgs.length > 0 ? (
                    msgs.map((m, index) => (
                        <div
                            key={`${m.sender}-${m.timestamp}-${index}`}
                            className={`mb-3 flex ${
                                user.sub === m.sender ? 'justify-end' : 'justify-start'
                            } animate-fade-in`}
                        >
                            <div
                                className={`max-w-[70%] p-3 rounded-lg shadow-sm ${
                                    user.sub === m.sender
                                        ? 'bg-[#5C8374] text-[#F5F6F5]'
                                        : 'bg-[#1B4242] text-[#9EC8B9]'
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
                    <p className="text-sm text-gray-400 italic text-center">No messages yet. Start chatting!</p>
                )}
            </div>
            <form onSubmit={handleSendMessage} className="mt-3 flex gap-2">
                <input
                    type="text"
                    value={chatinp}
                    onChange={(e) => setchatinp(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-[#1B4242] text-[#9EC8B9] p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5C8374] transition-all duration-200"
                />
                <button
                    type="submit"
                    className="bg-[#5C8374] text-[#F5F6F5] px-4 py-2 rounded-lg hover:bg-[#9EC8B9] hover:text-[#092635] transition-all duration-200"
                >
                    Send
                </button>
            </form>
        </div>
    );
};

export default Chats;