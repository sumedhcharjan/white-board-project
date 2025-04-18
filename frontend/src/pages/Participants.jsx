import React from 'react'
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate, useParams } from 'react-router-dom';
import axios from '/src/lib/axios.js'
import socket from '/src/lib/socket.js';

const Participants = ({ participants, onClose,hostid, isHost }) => {
    const {user}=useAuth0();
    const {roomid}=useParams();
    const navigate=useNavigate();
    const handleKick=async (userid) => {
        if(!isHost) return;
        try {
            const res=await axios.put('/room/kickout',{
                roomid,
                userid,
                hostid
            })
            console.log(res);
        } catch (error) {
            console.log(error);
            
        }
    }
    const TakePermission=(userid) => {
        socket.emit('grantDrawP',{userid,roomid,hostid,granted:false});  
    }
    return (
        <div className="fixed right-0 top-0 h-full w-64 bg-[#1B4242] text-white shadow-lg z-50 p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Participants</h2>
                <button onClick={onClose} className="text-red-400 hover:text-red-600 text-xl font-bold">×</button>
            </div>
            <ul className="space-y-2 overflow-y-auto max-h-[90vh]">
                {participants.length > 0 ? (
                    participants.map((p, index) => (
                        <div className='bg-[#5C8374] rounded-md flex justify-between'>
                            <li key={index} className="bg-[#5C8374] p-2 rounded-md">
                                {p.id===user.sub?<span className='text-sm opacity-50'>*</span>:''} {p.name}{p.id===hostid?<p className='opacity-60 text-sm'>(Host)</p>:''}
                            </li>
                            {isHost && hostid!==p.id && p.candraw===true ? <button onClick={()=>TakePermission(p.id)} className='p-2 mr-3 cursor-pointer'>Deny</button>:''}
                            {isHost&& p.id!==user.sub && hostid!==p.id ?<button onClick={()=>handleKick(p.id)} className='p-2 mr-3 cursor-pointer'>Kick</button>:''}
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-gray-300">No participants yet.</p>
                )}

            </ul>
        </div>
    )
}

export default Participants
