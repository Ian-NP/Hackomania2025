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
  
    // const pods: Pod[] = [
    //     {
    //       id: 1,
    //       name: "Python Fundamentals Pod",
    //       size: 6,
    //       currentMembers: 4,
    //       experience: "Beginner",
    //       focusArea: "Python Programming",
    //       productivityMetric: 85,
    //       hasMentor: true,
    //       isPrivate: false,
    //       mentor: {
    //         name: "Alex Chen",
    //         experience: "5 years",
    //         specialization: "Python Development",
    //         rating: 4.8,
    //       },
    //       description: "A structured learning path to master Python fundamentals and build real projects.",
    //       roadmap: [
    //         "Complete Python for Beginners course from FreeCodeCamp (Week 1-2)",
    //         "Build Desperate Defenders game with basic Python (Week 3-4)",
    //         "Learn Object-Oriented Programming in Python (Week 5-6)",
    //         "Refactor Desperate Defenders using OOP principles (Week 7-8)",
    //         "Advanced Python concepts: Decorators, Generators, etc. (Week 9-10)",
    //       ],
    //       prerequisites: "None - Perfect for complete beginners",
    //       timeCommitment: "10-12 hours per week",
    //       leaderboard: [
    //         { name: "Sarah Smith", points: 2840 },
    //         { name: "John Doe", points: 2650 },
    //         { name: "Maria Garcia", points: 2400 },
    //       ],
    //     },
    //     {
    //       id: 2,
    //       name: "React Mastery Pod",
    //       size: 10,
    //       currentMembers: 8,
    //       experience: "Intermediate",
    //       focusArea: "React Development",
    //       productivityMetric: 92,
    //       hasMentor: true,
    //       isPrivate: false,
    //       mentor: {
    //         name: "Jessica Lee",
    //         experience: "6 years",
    //         specialization: "Frontend Development",
    //         rating: 4.9,
    //       },
    //       description: "Deep dive into React and its ecosystem, building real-world applications.",
    //       roadmap: [
    //         "Master React fundamentals (Week 1-2)",
    //         "Building interactive UI with React hooks (Week 3-4)",
    //         "State management using Redux (Week 5-6)",
    //         "Building apps with Next.js and React Router (Week 7-8)",
    //         "Testing React apps with Jest and React Testing Library (Week 9-10)",
    //       ],
    //       prerequisites: "Basic knowledge of JavaScript and HTML/CSS",
    //       timeCommitment: "12-15 hours per week",
    //       leaderboard: [
    //         { name: "David Thompson", points: 3100 },
    //         { name: "Emma Brown", points: 2950 },
    //         { name: "Lucas White", points: 2750 },
    //       ],
    //     },
    //     {
    //       id: 3,
    //       name: "Machine Learning Bootcamp",
    //       size: 12,
    //       currentMembers: 10,
    //       experience: "Advanced",
    //       focusArea: "Machine Learning",
    //       productivityMetric: 90,
    //       hasMentor: true,
    //       isPrivate: true,
    //       mentor: {
    //         name: "Michael Tan",
    //         experience: "8 years",
    //         specialization: "Artificial Intelligence",
    //         rating: 5.0,
    //       },
    //       description: "Learn machine learning algorithms, data preprocessing, and model evaluation.",
    //       roadmap: [
    //         "Introduction to machine learning concepts (Week 1-2)",
    //         "Supervised learning algorithms (Week 3-4)",
    //         "Unsupervised learning and clustering (Week 5-6)",
    //         "Deep learning with TensorFlow and Keras (Week 7-8)",
    //         "Deploying machine learning models to production (Week 9-10)",
    //       ],
    //       prerequisites: "Solid understanding of Python, Statistics, and Algebra",
    //       timeCommitment: "15-20 hours per week",
    //       leaderboard: [
    //         { name: "Rachel Green", points: 3500 },
    //         { name: "Monica Geller", points: 3300 },
    //         { name: "Phoebe Buffay", points: 3100 },
    //       ],
    //     },
    //     {
    //       id: 4,
    //       name: "Web Development Bootcamp",
    //       size: 10,
    //       currentMembers: 5,
    //       experience: "Beginner",
    //       focusArea: "Full-stack Web Development",
    //       productivityMetric: 80,
    //       hasMentor: false,
    //       isPrivate: false,
    //       mentor: null,
    //       description: "A comprehensive program to master web development with HTML, CSS, JavaScript, and backend technologies.",
    //       roadmap: [
    //         "Learn HTML and CSS (Week 1-2)",
    //         "JavaScript fundamentals (Week 3-4)",
    //         "Building responsive websites with Flexbox and Grid (Week 5-6)",
    //         "Server-side programming with Node.js (Week 7-8)",
    //         "Database integration with MongoDB (Week 9-10)",
    //       ],
    //       prerequisites: "None - Suitable for absolute beginners",
    //       timeCommitment: "8-10 hours per week",
    //       leaderboard: [
    //         { name: "Jack Wilson", points: 2200 },
    //         { name: "Sophia Carter", points: 2100 },
    //         { name: "Liam Turner", points: 2000 },
    //       ],
    //     },
    //     {
    //       id: 5,
    //       name: "Cloud Computing and DevOps Pod",
    //       size: 8,
    //       currentMembers: 5,
    //       experience: "Intermediate",
    //       focusArea: "Cloud Computing & DevOps",
    //       productivityMetric: 88,
    //       hasMentor: true,
    //       isPrivate: true,
    //       mentor: {
    //         name: "Daniel Kim",
    //         experience: "7 years",
    //         specialization: "Cloud Engineering",
    //         rating: 4.7,
    //       },
    //       description: "Master cloud technologies and DevOps practices to scale infrastructure and automate workflows.",
    //       roadmap: [
    //         "Learn AWS basics and EC2 (Week 1-2)",
    //         "Docker for containerization (Week 3-4)",
    //         "CI/CD with Jenkins and GitLab (Week 5-6)",
    //         "Kubernetes for container orchestration (Week 7-8)",
    //         "Terraform for Infrastructure as Code (Week 9-10)",
    //       ],
    //       prerequisites: "Basic knowledge of Linux and networking",
    //       timeCommitment: "12-14 hours per week",
    //       leaderboard: [
    //         { name: "Olivia Parker", points: 2700 },
    //         { name: "Aiden Clark", points: 2550 },
    //         { name: "James Evans", points: 2400 },
    //       ],
    //     },
    //   ];
  
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
                key={pod.id} 
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
