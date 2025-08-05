import React, { useEffect, useState } from 'react';
import Participants from '../../pages/Participants';
import Chats from '../../pages/Chats';
import socket from '/src/lib/socket.js';
import { useAuth0 } from '@auth0/auth0-react';
import { useParams } from 'react-router-dom';
import SaveImageModal from '../../pages/SaveImageModal';
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
    <div className="bg-white p-4 rounded-lg w-full  flex flex-col gap-2">
      <div className="flex flex-col gap-2">
        <button
          onClick={() => setshowchat(prev => !prev)}
          className={`flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 transform hover:scale-105 hover:bg-[#8E8FFA]/10 ${
            showchat ? 'bg-[#C2D9FF]/20 ring-2 ring-[#7752FE]' : 'bg-[#7752FE] text-white hover:bg-[#8E8FFA]'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
          </svg>
          <span className="text-sm font-medium">Chat</span>
        </button>
        <button
          onClick={() => setshowmodal(prev => !prev)}
          className={`flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 transform hover:scale-105 hover:bg-[#8E8FFA]/10 ${
            showmodal ? 'bg-[#C2D9FF]/20 ring-2 ring-[#7752FE]' : 'bg-[#7752FE] text-white hover:bg-[#8E8FFA]'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
          </svg>
          <span className="text-sm font-medium">Save Drawing</span>
        </button>
        <button
          onClick={() => setshowparticipants(prev => !prev)}
          className={`flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 transform hover:scale-105 hover:bg-[#8E8FFA]/10 ${
            showparticipants ? 'bg-[#C2D9FF]/20 ring-2 ring-[#7752FE]' : 'bg-[#7752FE] text-white hover:bg-[#8E8FFA]'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
          </svg>
          <span className="text-sm font-medium">Participants</span>
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
        <SaveImageModal
          onClose={() => {
            setshowmodal(false);
            toast.success('Image saved successfully!');
          }}
        />
      )}
    </div>
  );
};

export default OnlineControls;