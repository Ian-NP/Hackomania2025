import React from 'react';
import { Check } from 'lucide-react';

interface CommunityCardProps {
  title: string;
  description: string;
  members: number;
  activePods: number;
  isSelected: boolean;
  onClick: () => void; // Prop to handle the card click
}

const CommunityCard: React.FC<CommunityCardProps> = ({ title, description, members, activePods, isSelected, onClick }) => {
  return (
    <div 
      className={`bg-white rounded-lg p-6 cursor-pointer relative ${isSelected ? 'border-2 border-blue-500' : 'border border-gray-300'}`} 
      onClick={onClick} // Attach the onClick handler
    >
      {isSelected && (
        <div className="absolute top-4 right-4 bg-blue-500 text-white p-1 rounded-full">
          <Check className="h-4 w-4" />
        </div>
      )}
      <div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="text-sm text-gray-500">
          <span>{members} members • {activePods} active pods</span>
        </div>
      </div>
    </div>
  );
};

export default CommunityCard;
