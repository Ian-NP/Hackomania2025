// components/PodCard.tsx
import { Users, Star, Filter } from "lucide-react";

interface Mentor {
    name: string | null;
    experience: string | null;
    specialization: string | null;
    rating: number | null;
}
  

interface LeaderboardMember {
  name: string;
  points: number;
}

interface Pod {
  id: string; // ID is now a string, not a number
  title: string;
  size: number;
  currentMembers: number;
  experience: string;
  focusArea: string;
  productivityMetric: number;
  hasMentor: boolean;
  isPrivate: boolean;
  mentor: Mentor | null;
  description: string;
  roadmap: {
    week: string;
    task: string;
    links: string[];
  }[]; // Roadmap updated to an array of objects
  prerequisites: string;
  timeCommitment: string;
  leaderboard: LeaderboardMember[];
}


// Pod Card Component
const PodCard = ({ pod, onClick }: { pod: Pod; onClick: () => void }) => {

    return (
      <div 
        className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm hover:shadow-md transition duration-200 cursor-pointer" 
        onClick={onClick}
      >
        <h2 className="text-xl font-bold mb-3">{pod.title}</h2>
  
        <div className="space-y-2">
          <div className="flex items-center text-gray-600">
            <Users className="h-5 w-5 mr-2" />
            <span>{pod.currentMembers}/{pod.size} members</span>
          </div>
  
          <div className="flex items-center text-gray-600">
            <Star className="h-5 w-5 mr-2" />
            <span>Experience: {pod.experience}</span>
          </div>
  
          <div className="flex items-center text-gray-600">
            <Filter className="h-5 w-5 mr-2" />
            <span>{pod.focusArea}</span>
          </div>
  
          <div className="flex items-center justify-between pt-2">
            <div className="text-gray-700">
              <span className="font-semibold">Productivity: {pod.productivityMetric}%</span>
            </div>
  
            <div>
              {pod.hasMentor && (
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                  Has Mentor
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

export default PodCard;
