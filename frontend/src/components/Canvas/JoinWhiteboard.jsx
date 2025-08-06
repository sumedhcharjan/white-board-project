import { useAuth0 } from '@auth0/auth0-react';
import React, { useEffect, useRef, useState } from 'react';
import socket from '/src/lib/socket.js';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from '/src/lib/axios.js';

const Whiteboard = ({ selectedColor, selectedTool, candraw, elements, width }) => {
    const canvasRef = useRef(null);
    const { roomid } = useParams();
    const { user } = useAuth0();
    const [isDrawing, setIsDrawing] = useState(false);
    const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
    const [erasing, setErasing] = useState(false);
    const [elementsArray, setElementsArray] = useState([]);

    useEffect(() => {
        setElementsArray(elements);
    }, [elements]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const parent = canvas.parentElement;

        // Function to update canvas size and redraw
        const updateCanvasSize = () => {
            const { width, height } = parent.getBoundingClientRect();
            canvas.width = width;
            canvas.height = height * 0.9;
            redrawAll(elementsArray); // Redraw lines after resizing
        };

        // Initialize canvas size
        updateCanvasSize();

        // Create a ResizeObserver to handle resizing
        const resizeObserver = new ResizeObserver(updateCanvasSize);
        resizeObserver.observe(parent);

        // Cleanup on unmount
        return () => {
            resizeObserver.disconnect();
        };
    }, [elementsArray]); // Depend on elementsArray to ensure redraws when it changes

    useEffect(() => {
        const handleDrawElement = (line) => {
            setElementsArray(prev => [...prev, line]);
        };

        socket.on('drawElement', handleDrawElement);
        socket.on('clearCanvas', () => {
            console.log('afsdaf');
            setElementsArray([]); // Clear local state
            redrawAll([]); // Clear canvas
        })

        return () => {
            socket.off('drawElement', handleDrawElement);
        };
    }, []);

    useEffect(() => {
        redrawAll(elementsArray);
    }, [elementsArray]);

    const redrawAll = (lines) => {
        if (!Array.isArray(lines)) {
            console.warn('Invalid lines:', lines);
            return;
        }

        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        lines.forEach(line => {
            if (!line || !line.points || line.points.length < 2) {
                console.warn('Skipped invalid line:', line);
                return;
            }
            ctx.beginPath();
            ctx.moveTo(line.points[0].x, line.points[0].y);
            ctx.lineTo(line.points[1].x, line.points[1].y);
            ctx.strokeStyle = line.color;
            ctx.lineWidth = line.width;
            ctx.stroke();
        });
    };

    const startDraw = (e) => {
        setIsDrawing(true);
        setCoordinates({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
    };

    const handleRequest = async () => {
        try {
            socket.emit('handleReq', { roomid, userid: user?.sub, name: user.name });
            console.log('Sent request to host!');
            toast.success('Draw permission requested!', { id: `request-${user.sub}` });
        } catch (error) {
            console.error('Error requesting permission:', error);
            toast.error('Failed to request permission');
        }
    };

    const draw = (e) => {
        if (!isDrawing) return;

        const newElement = {
            type: selectedTool,
            color: selectedColor || '#000',
            width: width,
            points: [
                { x: coordinates.x, y: coordinates.y },
                { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY }
            ]
        };
        setElementsArray(prev => [...prev, newElement]);
        setCoordinates({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });

        socket.emit('newElement', { roomid, element: newElement });
    };

    const erase = (e) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(e.nativeEvent.offsetX - 10, e.nativeEvent.offsetY - 10, 20, 20);
    };

    const clearAll = async () => {
        try {
            const response = await axios.delete(`/room/clearelements`, {
                params: { roomid }
            });
            console.log('Cleared successfully:', response.data);
            setElementsArray([]); // Clear local state
            redrawAll([]); // Clear canvas
        } catch (error) {
            console.error('Error clearing elements:', error);
            toast.error('Failed to clear whiteboard');
        }
    };

    const stopDraw = () => {
        setIsDrawing(false);
    };
    const comingSoon=()=>{
        toast.success("Coming Soon");
    }

    return (
        <div className="p-3 w-full h-auto">
            <div className="flex items-center justify-between">
                {candraw ? (
                    <div className='flex w-17 justify-between align-middle p-2'>
                        <button className='p-1 mr-1 ' onClick={comingSoon}>↶</button>
                        <button className='p-1 ml-1' onClick={comingSoon}>↷</button>
                    </div>
                ) : null}
                {candraw ? (
                    <button
                        className="bg-red-500 mb-2 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full"
                        onClick={clearAll}
                    >
                        Clear
                    </button>
                ) : null}
                {!candraw ? (
                    <button
                        className="bg-blue-500 mb-2 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                        onClick={handleRequest}
                    >
                        Request Permission
                    </button>
                ) : null}
            </div>
            <canvas
                id="Whiteboard"
                ref={canvasRef}
                onMouseDown={candraw ? startDraw : undefined}
                onMouseMove={candraw ? (erasing ? erase : draw) : undefined}
                onMouseUp={candraw ? stopDraw : undefined}
                onMouseLeave={candraw ? stopDraw : undefined}
                className={`w-full h-full border-2 border-gray-700 block ${erasing ? 'cursor-pointer' : 'cursor-crosshair'}`}
            ></canvas>
        </div>
    );
};

export default Whiteboard;