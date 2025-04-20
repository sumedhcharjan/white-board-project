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
        <>
            <div className="bg-[#1B4242] p-4 rounded-lg w-full">
                <div className="flex flex-col h-fit sm:flex-row sm:justify-between sm:items-center lg:flex-row lg:justify-between lg:items-center gap-4">
                    <button
                        onClick={() => setshowchat(prev => !prev)}
                        className="px-4 py-2 bg-[#145353] text-white rounded hover:bg-[#0e3636] transition-all duration-200"
                    >
                        Chat
                    </button>
                    <button
                        onClick={() => setshowmodal(prev => !prev)}
                        className="px-4 py-2 bg-[#145353] text-white rounded hover:bg-[#0e3636] transition-all duration-200"
                    >
                        Save Drawing
                    </button>
                    <button
                        onClick={() => setshowparticipants(prev => !prev)}
                        className="px-4 py-2 bg-[#145353] text-white rounded hover:bg-[#0e3636] transition-all duration-200"
                    >
                        Participants
                    </button>
                </div>
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
        </>
    );
};

export default OnlineControls;
