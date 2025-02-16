// components/BottomActionBar.tsx
import React from 'react';

interface BottomActionBarProps {
  selectedCount: number;
}

const BottomActionBar: React.FC<BottomActionBarProps> = ({ selectedCount }) => {
  return (
    <div className="bg-white border-t shadow-lg w-full">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="font-medium">{selectedCount} communities selected</span>
          <button className="text-gray-600 hover:text-gray-800">Clear selection</button>
        </div>
        <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium">
          Join Communities
        </button>
      </div>
    </div>
  );
};

export default BottomActionBar;
