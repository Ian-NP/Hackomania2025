"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "lib/firebaseClient";
import { Users, Star, Filter, X, Award, Calendar, BookOpen, Clock } from "lucide-react";

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


// Modal component for Pod details
const PodDetailsModal = ({ pod, onClose }: { pod: Pod; onClose: () => void }) => {
  const [showSuccessModal, setShowSuccessModal] = useState(false); // New state for success modal
  const [userPods, setUserPods] = useState<string[]>([]); // State to track the user's pods
  
  useEffect(() => {
    // Fetch the user's pods when the component mounts
    if (typeof window !== "undefined") {
      const userData = sessionStorage.getItem("user");
      const parsedUser = userData ? JSON.parse(userData) : null;
      if (parsedUser && parsedUser.pods) {
        setUserPods(parsedUser.pods); // Assuming the user object has a pods array
      }

    }
  }, []);

  const handleJoinPod = async (podID: string) => {
    try {
      if (typeof window !== "undefined") {
        const userData = sessionStorage.getItem("user");
        const parsedUser = userData ? JSON.parse(userData) : null;

        if (parsedUser && parsedUser.uid) {
          const uid = parsedUser.uid;

          const response = await fetch("/api/pods", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              uid: uid,
              item: podID,
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            console.error("Error adding item to pod:", data.error);
            alert("Something went wrong while joining the pod.");
          } else {
            console.log("Successfully joined pod:", data.message);
            // update sessionStorage user with the new pods
            parsedUser.pods.push(podID);
            sessionStorage.setItem("user", JSON.stringify(parsedUser));
            setShowSuccessModal(true); // Show the success modal
          }
        } else {
          alert("User data not available");
        }
      }
    } catch (error) {
      console.error("Error while joining the pod:", error);
      alert("Failed to join pod. Please try again later.");
    }
  };

  // Modal for success message after joining the pod
  const SuccessModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-sm p-6 space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-green-600">Success!</h3>
          <p className="text-gray-700">You have successfully joined the pod.</p>
        </div>
        <div className="text-center">
          <button
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-full transition duration-200"
            onClick={() => setShowSuccessModal(false)} // Close the success modal
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white z-10 border-b">
            <div className="flex justify-between items-center p-4">
              <h2 className="text-xl font-bold">{pod.title}</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-700">{pod.description}</p>
            </div>

      {/* Learning Roadmap */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Learning Roadmap</h3>
        <ul className="space-y-6">
          {pod.roadmap.map((item, index) => (
            <li key={index} className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500 hover:shadow-xl transition duration-200">
              <div className="flex items-center mb-3">
                <span className="text-blue-500 text-xl mr-3">→</span>
                <strong className="text-lg font-bold text-gray-800">{item.week}</strong>
              </div>
              <p className="text-gray-700 mb-3">{item.task}</p>
              {item.links && item.links.length > 0 && (
                <div className="text-sm text-blue-600 space-y-2">
                  {item.links.map((link, linkIndex) => (
                    <div key={linkIndex} className="flex items-center">
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline text-blue-600"
                      >
                        {link}
                      </a>
                      <span className="ml-2 text-xs text-gray-500">(external link)</span>
                    </div>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

            {/* Prerequisites */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Prerequisites</h3>
              <div className="flex items-center">
                <BookOpen className="h-5 w-5 text-gray-500 mr-2" />
                <p className="text-gray-700">{pod.prerequisites}</p>
              </div>
            </div>

            {/* Time Commitment */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Time Commitment</h3>
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-gray-500 mr-2" />
                <p className="text-gray-700">{pod.timeCommitment}</p>
              </div>
            </div>

            {/* Pod Mentor */}
            {pod.hasMentor && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Pod Mentor</h3>
                <div className="bg-gray-50 p-4 rounded-lg flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-500">
                    {pod.mentor && pod.mentor.name ? pod.mentor.name.charAt(0) : ''}
                  </div>
                  <div className="ml-4">
                    {pod.mentor && (
                      <>
                        <div className="font-semibold">{pod.mentor.name}</div>
                        <div className="text-gray-600">{pod.mentor.specialization}</div>
                        <div className="text-gray-600">{pod.mentor.experience} of experience</div>
                      </>
                    )}
                  </div>
                  <div className="ml-auto flex items-center">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="ml-1 font-semibold">{pod.mentor ? pod.mentor.rating : 'N/A'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Pod Leaderboard */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Pod Leaderboard</h3>
              <div className="bg-gray-50 rounded-lg overflow-hidden">
                {pod.leaderboard.map((member, index) => (
                  <div
                    key={index}
                    className={`flex items-center p-3 ${index < pod.leaderboard.length - 1 ? 'border-b border-gray-200' : ''}`}
                  >
                    <div className="font-semibold w-8">{index + 1}.</div>
                    <div className="flex-grow">{member.name}</div>
                    <div className="font-semibold">{member.points} pts</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Join Button */}
            <div className="pt-4 text-center">
            <button
              className={`bg-blue-600 text-white font-semibold py-2 px-6 rounded-full transition duration-200 ${userPods.includes(pod.id.toString()) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
              onClick={() => userPods.includes(pod.id) ? null : handleJoinPod(pod.id)}
              disabled={userPods.includes(pod.id)} // Disable if already joined
            >
              {userPods.includes(pod.id) ? 'Already Joined' : 'Join This Pod'}
            </button>
            </div>
          </div>
        </div>
      </div>
      {showSuccessModal && <SuccessModal />} {/* Conditionally render the success modal */}
    </>
  );
};

export default PodDetailsModal;
