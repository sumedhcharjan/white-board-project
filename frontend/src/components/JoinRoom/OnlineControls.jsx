import React, { useEffect, useState } from 'react';
import Participants from '../../pages/Participants';
import Chats from '../../pages/Chats';
import socket from '/src/lib/socket.js';
import { useAuth0 } from '@auth0/auth0-react';
import { useParams } from 'react-router-dom';
import SaveImageModal from '../../pages/SaveImageModal';
import { FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

const OnlineControls = ({ isHost, hostid, participants, messages }) => {
  const { user } = useAuth0();
  const { roomid } = useParams();
  const [showparticipants, setshowparticipants] = useState(false);
  const [showchat, setshowchat] = useState(false);
  const [showmodal, setshowmodal] = useState(false);
  const [msgs, setmsgs] = useState(messages);

  const onClose = () => {
    setshowparticipants(false);
  };

  useEffect(() => {
    setmsgs(messages);
  }, [messages]);

  useEffect(() => {
    socket.on('receiveChat', (umessages) => {
      setmsgs(umessages);
    });

    return () => {
      socket.off('receiveChat');
    };
  }, []);

  return (
    <div className="bg-[#FAFAFA] p-4 rounded-lg w-full flex flex-col gap-2">
      <div className="flex flex-col gap-2">
        <button
          onClick={() => setshowchat(prev => !prev)}
          className={`flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 transform hover:scale-105 hover:bg-[#FBBF24]/10 ${
            showchat ? 'bg-[#7C3AED]/20 ring-2 ring-[#7C3AED]' : 'bg-[#14B8A6] text-white hover:bg-[#FBBF24]'
          }`}
        >
          <svg className="w-5 h-5 text-[#2D3748]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
          </svg>
          <span className="text-sm font-medium text-[#2D3748]">Chat</span>
        </button>
        <button
          onClick={() => setshowmodal(prev => !prev)}
          className={`flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 transform hover:scale-105 hover:bg-[#FBBF24]/10 ${
            showmodal ? 'bg-[#7C3AED]/20 ring-2 ring-[#7C3AED]' : 'bg-[#14B8A6] text-white hover:bg-[#FBBF24]'
          }`}
        >
          <svg className="w-5 h-5 text-[#2D3748]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
          </svg>
          <span className="text-sm font-medium text-[#2D3748]">Save Drawing</span>
        </button>
        <button
          onClick={() => setshowparticipants(prev => !prev)}
          className={`flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 transform hover:scale-105 hover:bg-[#FBBF24]/10 ${
            showparticipants ? 'bg-[#7C3AED]/20 ring-2 ring-[#7C3AED]' : 'bg-[#14B8A6] text-white hover:bg-[#FBBF24]'
          }`}
        >
          <svg className="w-5 h-5 text-[#2D3748]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
          </svg>
          <span className="text-sm font-medium text-[#2D3748]">Participants</span>
        </button>
      </div>

      {/* Modals and Sections */}
      {showparticipants && (
        <Participants
          participants={participants}
          onClose={onClose}
          isHost={isHost}
          hostid={hostid}
        />
      )}

      {showchat && (
        <Chats
          msgs={msgs}
          setshowchat={setshowchat}
        />
      )}

      {showmodal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-[#2D3748]/50 backdrop-blur-sm" onClick={() => setshowmodal(false)}></div>
          <div className="relative bg-[#FAFAFA] rounded-lg shadow-2xl p-6 max-w-md w-full">
            <button
              className="absolute top-2 right-2 text-[#2D3748] bg-[#14B8A6] hover:bg-[#FBBF24] rounded-full p-2 transition transform hover:scale-105"
              onClick={() => {
                setshowmodal(false);
                toast.success('Image saved successfully!');
              }}
              aria-label="Close modal"
            >
              <FiX size={20} />
            </button>
            <SaveImageModal
              onClose={() => {
                setshowmodal(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default OnlineControls;