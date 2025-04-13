import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import axios from '/src/lib/axios.js'

const DashBody = () => {
    const {user}=useAuth0();
    const navigate = useNavigate();
    const [joinid, setjoinid] = useState("")
    const [joining, setjoining] = useState(false);
    const [creating, setcreating] = useState(false);
    const [roomid, setroomid] = useState(null);
    const joinRoom = () => {
        setjoining(true);
    };

    const handleCreateRoom = async (params) => {
        setcreating(true);
        try {
            const res=await axios.post('/room/create',{user});
            console.log(res);
            if(res?.data?.roomid) setroomid(res?.data?.roomid)
        } catch (error) {
            console.log(error);
        }
    }

    const handleCreateJoin=async (params) => {
        try {
            const res=await axios.put('/room/joinroom',{user,Rid:roomid});
            console.log(res);
            if(res?.data?.msg==='Joined room') navigate(`/room/${roomid}`)
        } catch (error) {
            console.log(error);
        }   
    }
    const handleJoinRoom=async (params) => {
        try {
            const res=await axios.put('/room/joinroom',{user,Rid:joinid});
            console.log(res);
            if(res?.data?.msg==='Joined room') navigate(`/room/${joinid}`)
        } catch (error) {
            console.log(error);
        }
        
    }
    const handleCopy=(e) => {
        navigator.clipboard.writeText(roomid);
        alert("Meeting Id copied to clipboard");
    }

    return (


        joining ? (
            <>
                <div className="absolute inset-0 -z-10 h-full w-full flex-wrap bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]"></div>
                <div className="fixed inset-0 flex justify-center items-center ">
                    <div className="bg-[#092635] p-8 rounded-2xl shadow-2xl text-center max-w-sm w-full">
                        <h2 className="text-2xl font-bold text-white mb-4">Enter Room Code</h2>
                        <input
                            type="text"
                            placeholder="Room Code"
                            value={joinid}
                            onChange={(e)=>setjoinid(e.target.value)}
                            className="bg-white w-full p-3 border-2 border-[#1B4242] rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#5C8374]"
                        />
                        <div className="flex justify-around">
                            <button
                                className="bg-[#1B4242] hover:bg-[#5C8374] text-white font-semibold py-2 px-6 rounded-lg transition duration-300"
                                onClick={() => setjoining(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-[#1B4242] hover:bg-[#5C8374] text-white font-semibold py-2 px-6 rounded-lg transition duration-300" onClick={handleJoinRoom}
                            >
                                Join
                            </button>
                        </div>
                    </div>
                </div>
            </>
        ) : creating ?
            <>
                <div className="absolute inset-0 -z-10 h-full w-full flex-wrap bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]"></div>
                <div className="fixed inset-0 flex justify-center items-center ">
                    <div className="bg-[#092635] p-8 rounded-2xl shadow-2xl text-center max-w-sm w-full">
                        <h2 className="text-2xl font-bold text-white mb-4">Room Code:</h2>
                        <input
                            type="text"
                            placeholder="Room Code"
                            value={roomid}
                            readOnly
                            className="bg-white w-full p-3 border-2 border-[#1B4242] rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#5C8374]"
                        />
                        <div className="flex justify-around">
                            <button
                                className="bg-[#1B4242] hover:bg-[#5C8374] text-white font-semibold py-2 px-6 rounded-lg transition duration-300" onClick={handleCopy}
                            >
                                Copy
                            </button>
                            <button
                                className="bg-[#1B4242] hover:bg-[#5C8374] text-white font-semibold py-2 px-6 rounded-lg transition duration-300"
                                onClick={() => setcreating(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-[#1B4242] hover:bg-[#5C8374] text-white font-semibold py-2 px-6 rounded-lg transition duration-300"onClick={handleCreateJoin}
                            >
                                Join
                            </button>
                        </div>
                    </div>
                </div>
            </>
            : (
                <>
                    <div className="absolute inset-0 -z-10 h-full w-full flex-wrap bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]"></div>

                    <div className="max-w-7xl mx-auto px-4 md:px-8">

                        <div className='flex flex-col md:flex-row justify-around items-stretch w-full h-fit p-10 gap-20'>

                            {/* Create Room Card */}
                            <div className='flex-1 bg-[#092635] text-white p-8 rounded-2xl shadow-lg flex flex-col justify-between'>
                                <div>
                                    <h2 className='text-3xl font-bold mb-4'>✨ Start Your Own Whiteboard Session!</h2>
                                    <p className='mb-6 text-lg text-gray-300'>Create a room and start brainstorming with your team in real-time.</p>
                                </div>
                                <button className='bg-[#1B4242] hover:bg-[#5C8374] text-white font-semibold py-3 px-6 rounded-lg transition duration-300' onClick={handleCreateRoom}>
                                    Create a Room
                                </button>
                            </div>

                            {/* Join Room Card */}
                            <div className='flex-1 bg-[#092635] text-white p-8 rounded-2xl shadow-lg flex flex-col justify-between'>
                                <div>
                                    <h2 className='text-3xl font-bold mb-4'>💡 Join an Ongoing Session!</h2>
                                    <p className='mb-6 text-lg text-gray-300'>Already have a code? Join your friend's whiteboard room and collaborate live.</p>
                                </div>
                                <button onClick={() => joinRoom()} className='bg-[#1B4242] hover:bg-[#5C8374] text-white font-semibold py-3 px-6 rounded-lg transition duration-300'>
                                    Join a Room
                                </button>
                            </div>

                        </div>

                        {/* Previous Sessions Section */}
                        <div className="bg-[#092635] w-full h-fit p-10 mt-10 rounded-2xl shadow-lg">
                            <h2 className="text-3xl text-[#9EC8B9] font-bold mb-6">🗂️ Your Previous Sessions</h2>

                            <div className="bg-[#1B4242] w-full h-32 rounded-xl flex items-center justify-center text-[#5C8374]">
                                {/* Placeholder for previous sessions */}
                                <p>-- Session cards will appear here --</p>
                            </div>
                        </div>

                    </div>
                </>
            )

    );
}

export default DashBody;

