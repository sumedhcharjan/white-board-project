import React, { useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react';
import { useParams } from 'react-router-dom';
import axios from '/src/lib/axios.js'
import toast from 'react-hot-toast';
const SaveImageModal = ({onClose}) => {
    const { user } = useAuth0();
    const { roomid } = useParams();
    const [saving , setSaving] = useState(false);
    const [title, setTitle] = useState("")
    const handleSaveDrawing = async () => {
        try {
            const canvas = document.getElementById('Whiteboard');
            if (!canvas) return alert('No canvas Found!');
            const imgdataUrl = canvas.toDataURL('image/png');
            // console.log(imgdataUrl);
            setSaving(true);
            const res = await axios.post('/room/savedrawing', { userid: user.sub, roomid, imgurl: imgdataUrl,title });
            toast.success("Saved Image Successfully")
            setSaving(false);
            onClose();
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div className="fixed inset-0 bg-transperent bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
                <h2 className="text-lg font-semibold mb-4 text-gray-800">Add a Title</h2>
                <input
                    type="text"
                    placeholder="Enter a title for the image"
                    className="w-full border px-4 py-2 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                    <button
                      onClick={handleSaveDrawing}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                      disabled={saving}
                    >
                      {saving ? "Saving.." : "Save"}
                    </button>
    
                </div>
            </div>
        </div>
    )
}

export default SaveImageModal
