import { FaPencilAlt, FaSquare, FaCircle, FaMinus, FaEllipsisH } from 'react-icons/fa';
import { useState } from 'react';

const DrawingOptions = ({ selectedColor, selectedTool, setSelectedColor, setSelectedTool, width, setWidth }) => {

    const handleToolChange = (tool) => {
        setSelectedTool(`${tool}`);
    };

    const handleColorChange = (e) => {
        setSelectedColor(e.target.value);
    };


    return (
        <div className="bg-[#1B4242] p-4 h-1/2 rounded-lg flex flex-col gap-4">
            <h3 className="font-semibold mb-2">Tools</h3>
            <div className="grid grid-cols-5 gap-2">
                <button onClick={() => handleToolChange('pencil')} className="aspect-square bg-[#5C8374] text-[#9EC8B9] rounded-lg flex items-center justify-center hover:bg-[#3E6356]">
                    <FaPencilAlt size={20} />
                </button>
                <button onClick={() => handleToolChange('rectangle')} className="aspect-square bg-[#5C8374] text-[#9EC8B9] rounded-lg flex items-center justify-center hover:bg-[#3E6356]">
                    <FaSquare size={20} />
                </button>
                <button onClick={() => handleToolChange('circle')} className="aspect-square bg-[#5C8374] text-[#9EC8B9] rounded-lg flex items-center justify-center hover:bg-[#3E6356]">
                    <FaCircle size={20} />
                </button>
                <button onClick={() => handleToolChange('line')} className="aspect-square bg-[#5C8374] text-[#9EC8B9] rounded-lg flex items-center justify-center hover:bg-[#3E6356]">
                    <FaMinus size={20} />
                </button>
                <button onClick={() => handleToolChange('ellipse')} className="aspect-square bg-[#5C8374] text-[#9EC8B9] rounded-lg flex items-center justify-center hover:bg-[#3E6356]">
                    <FaEllipsisH size={20} />
                </button>
            </div>

            <h3 className="font-semibold mt-4">Colors</h3>
            <div className="grid grid-cols-5 gap-2">
                <label className="aspect-square bg-[#5C8374] rounded-lg cursor-pointer overflow-hidden relative hover:ring-2 ring-offset-2 ring-white">
                    <input
                        type="color"
                        value={selectedColor}
                        onChange={handleColorChange}
                        className="absolute top-0 left-0 opacity-0 w-full h-full cursor-pointer"
                    />
                    <div
                        className="w-full h-full"
                        style={{ backgroundColor: selectedColor }}
                    />
                </label>
                
                <input
                    type="range"
                    min="1"
                    max="30"
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    className="col-span-3 px-4 self-center w-full h-2 bg-[#5C8374] rounded-lg appearance-none cursor-pointer"
                />

                <div
                    className="w-full aspect-square flex items-center justify-center rounded-lg hover:ring-2 ring-offset-2 ring-black bg-white"
                >
                    <div
                        className="rounded-full bg-black"
                        style={{
                            width: `${width}px`,
                            height: `${width}px`,
                            backgroundColor: selectedColor
                        }}
                    />
                </div>
            </div>



        </div>
    );
};

export default DrawingOptions;