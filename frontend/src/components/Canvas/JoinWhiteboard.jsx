import React, { useEffect, useRef, useState } from 'react';

const Whiteboard = () => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
    const [erasing, setErasing] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        const parent = canvas.parentElement;

        // Function to update canvas size
        const updateCanvasSize = () => {
            const { width, height } = parent.getBoundingClientRect();
            canvas.width = width;
            canvas.height = height;
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
    }, []);

    const startDraw = (e) => {
        setIsDrawing(true);
        setCoordinates({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(coordinates.x, coordinates.y);
        ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 4;
        ctx.stroke();

        setCoordinates({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
    };

    const erase = (e) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(e.nativeEvent.offsetX - 10, e.nativeEvent.offsetY - 10, 20, 20);
    };

    const clearAll = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    const stopDraw = () => {
        setIsDrawing(false);
    };

    return (
        <div className="p-3 w-full h-[350px]">
            <h2>Whiteboard</h2>
            <div className='flex items-center justify-between'>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" onClick={() => setErasing(!erasing)}>
                    Eraser
                </button>
                <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full" onClick={clearAll}>
                    Clear
                </button>
            </div>
            <canvas
                ref={canvasRef}
                onMouseDown={startDraw}
                onMouseMove={erasing ? erase : draw}
                onMouseUp={stopDraw}
                onMouseLeave={stopDraw}
                className={`w-full h-full border-2 border-gray-700 block ${erasing ? 'cursor-pointer' : 'cursor-crosshair'}`}
            ></canvas>
            <div className='flex justify-center items-center p-3'>
                <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full" onClick={clearAll}>
                    Leave Room!
                </button>
            </div>
        </div>
    );
};

export default Whiteboard;
