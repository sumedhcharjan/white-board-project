import { FaPencilAlt, FaSquare, FaCircle, FaMinus, FaEllipsisH } from 'react-icons/fa';
import { useState } from 'react';

const DrawingOptions = ({selectedColor,selectedTool,setSelectedColor,setSelectedTool}) => {

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
            </div>


        </div>
    );
};

export default DrawingOptions;