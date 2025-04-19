import React, { useEffect, useState } from 'react'
import Participants from '../../pages/Participants';
import Chats from '../../pages/Chats';
import socket from '/src/lib/socket.js';

const OnlineControls = ({ isHost, hostid, participants,messages }) => {

    const [showparticipants, setshowparticipants] = useState(false);
    const [showchat, setshowchat] = useState(false);
    const [msgs, setmsgs] = useState(messages);
    const onClose = (params) => {
        setshowparticipants(false);
    }
    useEffect(() => {
        setmsgs(messages);
    }, [messages]);
    
    useEffect(() => {
        socket.on('receiveChat', (umessages) => {
            // console.log('Received message from:', umessages);
            setmsgs(umessages);
        });

        return()=>{
            socket.off('receiveChat');
        }
    }, [])

    return (
        <>
            <div className="bg-[#1B4242] p-4 flex flex-col items-center justify-between w-35 h-fit rounded-lg overflow-y-auto">
                <button onClick={() => setshowchat(prev => !prev)} className="font-semibold mb-2">Chat</button>
                <h3 className="font-semibold mb-2">mic</h3>
                <button onClick={() => setshowparticipants(prev => !prev)} className="font-semibold mb-2">Participants</button>
                {
                    showparticipants && (
                        <Participants
                            participants={participants}
                            onClose={onClose}
                            isHost={isHost}
                            hostid={hostid}
                        ></Participants>
                    )
                }
                {
                    showchat && (
                        <Chats
                            msgs={msgs}
                            setshowchat={setshowchat}
                        ></Chats>
                    )
                }
            </div>
        </>
    )
}

export default OnlineControls