import React, { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react';
import axios from '/src/lib/axios.js'
import { FiEye, FiDownload, FiTrash2 } from 'react-icons/fi';
import UserInfo from '../../pages/UserInfo.jsx';

const ProfilePage = () => {
    const { user, isLoading, isAuthenticated } = useAuth0();
    const [savedD, setsavedD] = useState([]);

    
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
        return <div className="text-center mt-20">Loading your profile...</div>;
    }

    if (!isAuthenticated || !user) {
        return <div className="text-center mt-20 text-red-600">You must be logged in to view this page.</div>;
    }
    const handleDelete = async (drawing) => {
        const confirm = window.confirm(`Are you sure you want to delete "${drawing.title}"?`);
        if (!confirm) return;

        try {
            await axios.delete(`/profile/${user.sub}/deleteDrawing`, {
                params: { roomid: drawing.roomid, id: drawing._id }
            });
            console.log(drawing._id, typeof (drawing._id));
            setsavedD(prev => prev.filter(d => !(d._id === drawing._id && d.roomid === drawing.roomid)));
        } catch (err) {
            console.error("Error deleting drawing:", err);
        }
    };

    return (
        <div>
            <UserInfo user={user}></UserInfo>
            <div className="p-6">
                <h1 className="text-2xl font-bold text-center mb-6">Your Saved Drawings</h1>

                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-md shadow-md border border-gray-200">
                        <thead className="bg-[#1B4242] text-white">
                            <tr>
                                <th className="py-3 px-4 text-left">Title</th>
                                <th className="py-3 px-4 text-left">Room ID</th>
                                <th className="py-3 px-4 text-left">Date</th>
                                <th className="py-3 px-4 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {savedD.map((drawing, idx) => (
                                <tr key={idx} className="border-b hover:bg-gray-100 transition-all">
                                    <td className="py-3 px-4">{drawing.title}</td>
                                    <td className="py-3 px-4">{drawing.roomid}</td>
                                    <td className="py-3 px-4">{new Date(drawing.date).toLocaleDateString()}</td>
                                    <td className="py-3 px-4">
                                        <div className="flex gap-4 text-lg">
                                            {/* View */}
                                            <a
                                                href={drawing.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-800"
                                                title="View"
                                            >
                                                <FiEye />
                                            </a>

                                            {/* Download */}
                                            <a
                                                href={`${drawing.url.replace("/upload/", "/upload/fl_attachment:" + drawing.title + "/")}`}
                                                download
                                                className="text-green-600 hover:text-green-800"
                                                title="Download"
                                            >
                                                <FiDownload />
                                            </a>

                                            {/* Delete */}
                                            <button
                                                onClick={() => handleDelete(drawing)}
                                                className="text-red-600 hover:text-red-800"
                                                title="Delete"
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {savedD.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="text-center py-6 text-gray-500">
                                        No drawings saved yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
