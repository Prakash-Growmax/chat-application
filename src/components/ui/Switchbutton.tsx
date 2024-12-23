import React, { useState } from 'react';
import {Table, LineChart } from 'lucide-react';

const IOSSwitch = () => {
  const [isChecked, setIsChecked] = useState(false);

  const toggleSwitch = () => {
    setIsChecked(!isChecked);
  };

  return (
    <div className="inline-flex items-center p-2 bg-gray-100 rounded-full">
      <button
        role="switch"
        aria-checked={isChecked}
        onClick={toggleSwitch}
        className={`
          relative inline-flex items-center 
          h-10 rounded-full w-20
          transition-colors duration-300 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
          ${isChecked ? 'bg-white' : 'bg-white'}
        `}
      >
        {/* Left icon */}
        <span className={`
          absolute left-2 z-10 transition-opacity duration-300
          ${isChecked ? 'opacity-40' : 'opacity-100'}
        `}>
          <Table size={20} />
        </span>

        {/* Right icon */}
        <span className={`
          absolute right-2 z-10 transition-opacity duration-300
          ${isChecked ? 'opacity-100' : 'opacity-40'}
        `}>
          <LineChart size={20} />
        </span>

        {/* Sliding background */}
        <span
          className={`
            absolute h-9 w-10
            transform rounded-full bg-blue-500 shadow-md
            transition-transform duration-300 ease-in-out
            ${isChecked ? 'translate-x-9' : 'translate-x-0'}
          `}
        />
      </button>
    </div>
  );
};

export default IOSSwitch;