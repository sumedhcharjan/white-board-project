import React from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import axios from '/src/lib/axios.js'
const Roomdashboard = () => {
    const navigate=useNavigate();
    const { roomid } = useParams();
    const { user } = useAuth0();
    const handleLeave = async (params) => {
        try {
            const res = await axios.put('/room/leave', { roomid,user });
            console.log(res);
            if (res?.data?.msg === 'Left the room successfully' || res?.data?.msg === 'Host ended the meeting!'  ) navigate('/');
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

                {/* Participants row */}
                <div className="bg-[#5C8374] p-2 overflow-x-auto whitespace-nowrap flex gap-4">
                    <h2>PLayers!</h2>
                    {/* Participants */}
                    {/* {roomDetails?.participants?.length > 0 ? (
                        roomDetails.participants.map((p, i) => (
                            <div key={i} className="bg-[#1B4242] text-[#9EC8B9] px-4 py-2 rounded-lg shadow">
                                {p}
                            </div>
                        ))
                    ) : (
                        <p className="text-[#092635]">No participants yet.</p>
                    )} */}
                </div>

                {/* Main content area */}
                <div className="flex flex-1 flex-col md:flex-row gap-4 p-4">
                    {/* Whiteboard Section */}
                    <div className="flex-1 bg-white rounded-xl shadow-md p-2">
                        {/* <Whiteboard /> */}
                    </div>

                    {/* Right Sidebar */}
                    <div className="w-full md:w-[350px] flex flex-col gap-4">
                        {/* Dashed Word */}
                        <div className="bg-[#1B4242] p-4 rounded-lg text-center text-2xl font-mono tracking-widest">
                            _ _ _ _ _
                        </div>

                        {/* Guess Input */}
                        <div className="flex">
                            <input
                                type="text"
                                placeholder="Your Guess"
                                className="flex-1 px-4 py-2 rounded-l-md text-black outline-none"
                            />
                            <button className="bg-[#5C8374] text-white px-4 py-2 rounded-r-md hover:bg-[#4a6c61] transition-all">
                                Guess
                            </button>
                        </div>

                        {/* Game Options - Extendable */}
                        <div className="bg-[#1B4242] p-4 rounded-lg">
                            <h3 className="font-semibold mb-2">Options</h3>
                            <ul className="list-disc ml-4 text-sm space-y-1">
                                <li>Start New Round</li>
                                <li>Choose Word</li>
                                <li>Mute Player</li>
                            </ul>
                        </div>

                        {/* Chat / Guess History */}
                        <div className="bg-[#1B4242] p-4 rounded-lg flex-1 overflow-y-auto">
                            <h3 className="font-semibold mb-2">Guess History</h3>
                            <div className="space-y-1 text-sm">
                                <p>Alice: Apple 🍎</p>
                                <p>Bob: Angle 📐</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Roomdashboard;
