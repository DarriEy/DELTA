import React, { useState } from 'react';

const AnimatedAvatar = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  return (
    <div className="flex items-center justify-center w-64 h-64">
      <div
        className={`relative transition-all duration-300 ease-in-out cursor-pointer
          ${isPressed ? 'scale-90' : isHovered ? 'scale-110' : 'scale-100'}
          ${isHovered ? 'brightness-110' : 'brightness-100'}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setIsPressed(false);
        }}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
      >
        <img 
          src="/Users/darrieythorsson/compHydro/code/avatar/Droplet_avatar.png" 
          alt="Water drop avatar"
          className="w-full h-full object-contain"
        />
        
        {/* Glow effect */}
        <div 
          className={`absolute inset-0 rounded-full bg-blue-400 blur-xl transition-opacity duration-300
            ${isHovered ? 'opacity-20' : 'opacity-0'}`}
        />
      </div>
    </div>
  );
};

export default AnimatedAvatar;