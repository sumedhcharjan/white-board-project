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
    <div className="bg-[#FAFAFA] p-4 rounded-lg flex flex-col gap-4">
      <h3 className="text-lg font-semibold text-[#2D3748] flex items-center gap-2">
        <svg className="w-5 h-5 text-[#2D3748]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
        </svg>
        Tools
      </h3>
      <div className="grid grid-cols-5 gap-2">
        <button
          onClick={() => handleToolChange('pencil')}
          className={`aspect-square bg-[#14B8A6] text-white rounded-md flex items-center justify-center hover:bg-[#FBBF24] transition-all duration-200 transform hover:scale-105 ${
            selectedTool === 'pencil' ? 'ring-2 ring-[#7C3AED]' : ''
          }`}
        >
          <FaPencilAlt size={20} />
        </button>
        <button
          onClick={() => handleToolChange('rectangle')}
          className={`aspect-square bg-[#14B8A6] text-white rounded-md flex items-center justify-center hover:bg-[#FBBF24] transition-all duration-200 transform hover:scale-105 ${
            selectedTool === 'rectangle' ? 'ring-2 ring-[#7C3AED]' : ''
          }`}
        >
          <FaSquare size={20} />
        </button>
        <button
          onClick={() => handleToolChange('circle')}
          className={`aspect-square bg-[#14B8A6] text-white rounded-md flex items-center justify-center hover:bg-[#FBBF24] transition-all duration-200 transform hover:scale-105 ${
            selectedTool === 'circle' ? 'ring-2 ring-[#7C3AED]' : ''
          }`}
        >
          <FaCircle size={20} />
        </button>
        <button
          onClick={() => handleToolChange('line')}
          className={`aspect-square bg-[#14B8A6] text-white rounded-md flex items-center justify-center hover:bg-[#FBBF24] transition-all duration-200 transform hover:scale-105 ${
            selectedTool === 'line' ? 'ring-2 ring-[#7C3AED]' : ''
          }`}
        >
          <FaMinus size={20} />
        </button>
        <button
          onClick={() => handleToolChange('ellipse')}
          className={`aspect-square bg-[#14B8A6] text-white rounded-md flex items-center justify-center hover:bg-[#FBBF24] transition-all duration-200 transform hover:scale-105 ${
            selectedTool === 'ellipse' ? 'ring-2 ring-[#7C3AED]' : ''
          }`}
        >
          <FaEllipsisH size={20} />
        </button>
      </div>

      <h3 className="font-semibold text-[#2D3748] mt-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-[#2D3748]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path>
        </svg>
        Colors & Width
      </h3>
      <div className="grid grid-cols-5 gap-2 items-center">
        <label className="aspect-square bg-[#14B8A6] rounded-md cursor-pointer overflow-hidden relative hover:ring-2 ring-offset-2 ring-[#7C3AED]">
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
          className="col-span-3 h-2 bg-[#7C3AED] rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:bg-[#14B8A6] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:hover:bg-[#FBBF24]"
        />
        <div
          className="aspect-square flex items-center justify-center rounded-md bg-[#7C3AED]/20 hover:ring-2 ring-offset-2 ring-[#7C3AED]"
        >
          <div
            className="rounded-full"
            style={{
              width: `${width}px`,
              height: `${width}px`,
              backgroundColor: selectedColor,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default DrawingOptions;