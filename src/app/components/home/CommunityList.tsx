import React, { useState } from 'react';
import CommunityCard from './CommunityCard';

interface CommunityListProps {
  communities: { title: string; description: string; members: number; activePods: number; isSelected: boolean }[];
}

const CommunityList: React.FC<CommunityListProps> = ({ communities }) => {
  const [communityList, setCommunityList] = useState(communities);

  const handleCardClick = (index: number) => {
    const updatedCommunities = [...communityList];
    updatedCommunities[index].isSelected = !updatedCommunities[index].isSelected; // Toggle the selection
    setCommunityList(updatedCommunities); // Update the state with the modified selection
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {communityList.map((community, index) => (
        <CommunityCard 
          key={index}
          title={community.title}
          description={community.description}
          members={community.members}
          activePods={community.activePods}
          isSelected={community.isSelected}
          onClick={() => handleCardClick(index)} // Attach the click handler
        />
      ))}
    </div>
  );
};

export default CommunityList;
