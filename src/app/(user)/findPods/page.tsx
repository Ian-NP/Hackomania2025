"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "lib/firebaseClient";
import Layout from "app/components/Layout";
import SearchBar from "app/components/findPods/SearchBar";
import FilterSelect from "app/components/findPods/FilterSelect";
import PodCard from "app/components/findPods/PodCard";
import PodDetailsModal from "app/components/findPods/PodDetailsModal";

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


const PodFinder = () => {
    const [activeItem, setActiveItem] = useState("findPods");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedPod, setSelectedPod] = useState<Pod | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    // const [joinedPods, setJoinedPods] = useState<number[]>([]);
    const [pods, setPods] = useState<Pod[]>([]);
    const router = useRouter();
  
    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (!user) {
          router.push("/login");
        }
      });
      return () => unsubscribe();
    }, [router]);
  
    const [filters, setFilters] = useState({
      experience: "all",
      podSize: "all",
      focusArea: "all",
      hasmentor: "all",
    });

    // Fetch pods from API
    useEffect(() => {
      const fetchPods = async () => {
          try {
              const response = await fetch("/api/getAllPods");
              if (!response.ok) {
                  throw new Error("Failed to fetch pods");
              }
              const data = await response.json();
              setPods(data);
          } catch (err) {
              console.error(err);
          } finally {
              setLoading(false);
          }
      };
      fetchPods();
    }, []);
  
    const handleModalClose = () => {
      setSelectedPod(null);
    };
  
    return (
      <Layout defaultActiveItem={activeItem}>
        <div className="w-full mx-auto p-4">
          {/* Title */}
          <h1 className="text-3xl font-semibold mb-6 text-gray-900">Technology Community Pods</h1>
          
          {/* Search Bar and Filters */}
          <div className="flex flex-col md:flex-row gap-3 mb-6">
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
  
            <div className="flex gap-3">
              <FilterSelect options={["All", "Beginner", "Intermediate", "Advanced"]} label="Experience" />
              <FilterSelect options={["Small (≤15)", "Medium (16-30)", "Large (30+)"]} label="Pod Size" />
            </div>
          </div>
  
          {/* Pod Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {pods.map((pod) => (
              <PodCard 
                key={pod.uid} 
                pod={pod} 
                onClick={() => setSelectedPod(pod)} 
              />
            ))}
          </div>
  
          {/* Pod Details Modal */}
          {selectedPod && (
            <PodDetailsModal pod={selectedPod} onClose={handleModalClose} />
          )}
        </div>
      </Layout>
    );
};
  
export default PodFinder;
