import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from '/src/lib/axios.js';
import { FiEye, FiDownload, FiTrash2 } from 'react-icons/fi';
import UserInfo from '../../pages/UserInfo.jsx';
import HeaderDash from '../DashBoard/HeaderDash.jsx';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
    const { user, isLoading, isAuthenticated,logout } = useAuth0();
    const [savedD, setsavedD] = useState([]);
    const navigate=useNavigate();
    

    useEffect(() => {
        const getDrawings = async () => {
            try {
                const res = await axios.get(`/profile/${user?.sub}/savedDrawings`);
                setsavedD(res.data.drawings);
            } catch (error) {
                console.error(error);
            }
        };

        if (user) getDrawings();
    }, [user]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#C2D9FF]/10 via-white to-[#8E8FFA]/10">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-[#7752FE] border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-[#190482] text-lg font-semibold">Loading your profile...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#C2D9FF]/10 via-white to-[#8E8FFA]/10">
                <div className="text-center">
                    <p className="text-red-600 text-lg font-semibold">You must be logged in to view this page.</p>
                    <a href="/login" className="mt-4 inline-block bg-[#7752FE] text-white px-6 py-2 rounded-md hover:bg-[#8E8FFA] transition-all duration-200">Log In</a>
                </div>
            </div>
        );
    }

    const handleDelete = async (drawing) => {
        const confirm = window.confirm(`Are you sure you want to delete "${drawing.title}"?`);
        if (!confirm) return;

        try {
            await axios.delete(`/profile/${user.sub}/deleteDrawing`, {
                params: { roomid: drawing.roomid, id: drawing._id }
            });
            setsavedD(prev => prev.filter(d => !(d._id === drawing._id && d.roomid === drawing.roomid)));
        } catch (err) {
            console.error("Error deleting drawing:", err);
        }
    };

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-[#C2D9FF]/10 via-white to-[#8E8FFA]/10 font-sans">
            {/* Background Pattern */}
            <div className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(circle_at_center,#7752FE_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-5">
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#8E8FFA]/20 to-transparent"></div>
            </div>

            <header className="bg-[#190482] shadow-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-white">CollabBoard</h1>
                    <div className="flex items-center space-x-3">
                        {/* <span className="text-[#C2D9FF] text-sm">{user?.name || user?.nickname || "User"}</span> */}
                        <button
                            className="p-2 rounded-xl bg-[#7752FE] text-white hover:bg-[#8E8FFA] transition transform hover:scale-105"
                            onClick={() => navigate('/profile')}
                            title="Profile"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                        </button>
                        <button
                            className="p-2 rounded-xl bg-[#7752FE] text-white hover:bg-[#8E8FFA] transition transform hover:scale-105"
                            onClick={() => navigate('/dashboard')}
                            title="Home"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                            </svg>
                        </button>
                        <button
                            className="p-2 rounded-xl bg-[#7752FE] text-white hover:bg-[#8E8FFA] transition transform hover:scale-105"
                            onClick={() => logout({ returnTo: window.location.origin })}
                            title="Logout"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </header>


            <UserInfo user={user} />

            <main className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#190482] text-center mb-6 animate-fade-in">Your Saved Drawings</h1>

                <div className="bg-white rounded-xl shadow-2xl overflow-hidden animate-fade-in">
                    <div className="bg-gradient-to-r from-[#190482] to-[#7752FE] text-white p-4">
                        <h2 className="text-lg font-semibold">Drawing Collection</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="bg-[#C2D9FF]/20 text-[#190482]">
                                    <th className="py-3 px-4 text-left text-sm font-semibold">Title</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold">Room ID</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold">Date</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {savedD.map((drawing, idx) => (
                                    <tr
                                        key={idx}
                                        className={`border-b border-[#C2D9FF]/30 hover:bg-[#C2D9FF]/20 transition-all duration-200 animate-slide-in`}
                                        style={{ animationDelay: `${idx * 0.1}s` }}
                                    >
                                        <td className="py-3 px-4 text-[#190482]">{drawing.title}</td>
                                        <td className="py-3 px-4 text-[#190482]">{drawing.roomid}</td>
                                        <td className="py-3 px-4 text-[#190482]">
                                            {new Date(drawing.date).toLocaleDateString()}
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex gap-4 text-lg">
                                                {/* View */}
                                                <a
                                                    href={drawing.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-[#7752FE] hover:text-[#8E8FFA] transform hover:scale-105 transition-all duration-200"
                                                    title="View Drawing"
                                                >
                                                    <FiEye />
                                                </a>
                                                {/* Download */}
                                                <a
                                                    href={`${drawing.url.replace("/upload/", "/upload/fl_attachment:" + drawing.title + "/")}`}
                                                    download
                                                    className="text-[#7752FE] hover:text-[#8E8FFA] transform hover:scale-105 transition-all duration-200"
                                                    title="Download Drawing"
                                                >
                                                    <FiDownload />
                                                </a>
                                                {/* Delete */}
                                                <button
                                                    onClick={() => handleDelete(drawing)}
                                                    className="text-red-500 hover:text-red-600 transform hover:scale-105 transition-all duration-200"
                                                    title="Delete Drawing"
                                                >
                                                    <FiTrash2 />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {savedD.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="text-center py-8 text-gray-500">
                                            <div className="flex flex-col items-center">
                                                <svg
                                                    className="w-16 h-16 text-[#C2D9FF] mb-4"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M12 4v16m8-8H4"
                                                    />
                                                </svg>
                                                <p className="text-lg font-semibold text-[#190482]">
                                                    No drawings saved yet.
                                                </p>
                                                <p className="text-sm">Start creating and save your masterpieces!</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* Tailwind Animation Keyframes */}
            <style>
                {`
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    .animate-fade-in {
                        animation: fadeIn 1s ease-out;
                    }
                    @keyframes slideIn {
                        from { opacity: 0; transform: translateY(50px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    .animate-slide-in {
                        animation: slideIn 0.5s ease-out;
                    }
                `}
            </style>
        </div>
    );
};

export default ProfilePage;