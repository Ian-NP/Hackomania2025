"use client";
import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import SidebarMenuItem from "./SidebarMenuItem";
import {
  Home,
  Users,
  Trophy,
  Settings,
  Globe,
  ChevronDown,
  ChevronRight,
  MessageSquare,
  Calendar,
  HeartHandshake,
  X,
} from "lucide-react";
import ModalProdigiCommunitySetup from "../../(user)/ModalProdigiCommunitySetup/page";

interface SidebarProps {
  sidebarOpen: boolean;
  activeItem: string;
  handleItemClick: (item: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  sidebarOpen,
  activeItem,
  handleItemClick,
}) => {
  const [openDropdowns, setOpenDropdowns] = useState<Set<string>>(new Set());
  const [openCommunities, setOpenCommunities] = useState<boolean>(false);
  const [openPods, setOpenPods] = useState<boolean>(false); // New state for Pods dropdown
  const [userPods, setUserPods] = useState<any[]>([]);
  const [showSetupModal, setShowSetupModal] = useState<boolean>(false);
  const router = useRouter();
  let pathname = usePathname(); // Get current route

  // Function to navigate to the given path
  const navigateTo = (path: string, activeMenuItem: string) => {
    router.push(path); // Navigate to the specified path
    if (activeMenuItem === activeItem) return; // If the active item is the same, return
    handleItemClick(activeMenuItem); // Update active item
  };

  // Function to toggle dropdown visibility (only for ChevronDown items)
  const toggleDropdown = (dropdown: string) => {
    setOpenDropdowns((prev) => {
      const newDropdowns = new Set(prev);
      if (newDropdowns.has(dropdown)) {
        newDropdowns.delete(dropdown);
      } else {
        newDropdowns.add(dropdown);
      }
      return newDropdowns;
    });
  };

  // Function to toggle Communities visibility
  const toggleCommunities = () => {
    setOpenCommunities((prev) => !prev);
  };

  // Function to toggle Pods visibility
  const togglePods = () => {
    // console.log(sessionStorage.getItem("user"));
    // console.log(sessionStorage.getItem("userPods"));
    setOpenPods((prev) => !prev);
  };

  useEffect(() => {
    // Check if the current pathname matches /findPods after navigating
    if (pathname.includes("/findPods")) {
      console.log("Setting dropdown to technology");
      toggleCommunities(); // This toggles the visibility of the communities
      toggleDropdown("technology"); // This toggles the visibility of the 'technology' dropdown
    }
  }, [pathname]); // Re-run when pathname or open states change

  useEffect(() => {
    const fetchUserPods = async () => {
      const userData = sessionStorage.getItem("user");
      if (!userData) return;
      const user = JSON.parse(userData);

      try {
        const response = await fetch(`/api/pods?uid=${user.uid}`);
        if (!response.ok) throw new Error("Failed to fetch pods");

        const pods = await response.json();
        console.log(pods);
        sessionStorage.setItem("userPods", JSON.stringify(pods));
        setUserPods(pods);
      } catch (error) {
        console.error("Error fetching user pods:", error);
      }
    };

    // Load pods from sessionStorage if available
    const storedPods = sessionStorage.getItem("userPods");
    if (storedPods) {
      setUserPods(JSON.parse(storedPods));
    } else {
      fetchUserPods();
    }
  }, []);

  // Function to open the Community Setup modal
  const openSetupModal = () => {
    if (sessionStorage.getItem("dontShowModal")) return;
    setShowSetupModal(true);
  };

  return (
    <>
      <div
        className={`w-64 h-full bg-white border-r p-4 transition-transform duration-300 ease-in-out z-50 shadow-lg lg:shadow-none ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:relative lg:block lg:h-auto ${
          sidebarOpen ? "top-14 left-0" : ""
        } lg:top-0 lg:left-0`}
      >
        {/* Sidebar menu options */}
        <div className="space-y-2">
          <SidebarMenuItem
            icon={Home}
            label="Home"
            active={activeItem === "home"}
            onClick={() => navigateTo("/home", "home")}
          />

          {/* Communities Section (acts as a dropdown) */}
          <div>
            <SidebarMenuItem
              icon={Globe}
              label="Communities"
              active={activeItem === "communities"}
              onClick={() => {
                handleItemClick("communities");
                openSetupModal(); // Open the setup modal
                toggleCommunities();
              }}
            />
            {openCommunities && (
              <div className="ml-4 space-y-1">
                {/* Technology Community Dropdown */}
                <SidebarMenuItem
                  icon={
                    openDropdowns.has("technology") ? ChevronDown : ChevronRight
                  }
                  label="Technology"
                  active={activeItem === "technology"}
                  onClick={() => toggleDropdown("technology")}
                />
                {openDropdowns.has("technology") && (
                  <div className="ml-6 space-y-1">
                    <SidebarMenuItem
                      icon={MessageSquare}
                      label="Discussions"
                      active={activeItem === "discussions"}
                      onClick={() => handleItemClick("discussions")}
                    />
                    <SidebarMenuItem
                      icon={Calendar}
                      label="Events"
                      active={activeItem === "events"}
                      onClick={() => handleItemClick("events")}
                    />
                    <SidebarMenuItem
                      icon={Users}
                      label="Find Pods"
                      active={activeItem === "findPods"}
                      onClick={() => navigateTo("/findPods", "findPods")}
                    />
                    <SidebarMenuItem
                      icon={Trophy}
                      label="Challenges"
                      active={activeItem === "challenges"}
                      onClick={() => handleItemClick("challenges")}
                    />
                  </div>
                )}

                {/* Academics Community Dropdown */}
                <SidebarMenuItem
                  icon={
                    openDropdowns.has("academics") ? ChevronDown : ChevronRight
                  }
                  label="Academics"
                  active={activeItem === "academics"}
                  onClick={() => toggleDropdown("academics")}
                />
                {openDropdowns.has("academics") && (
                  <div className="ml-6 space-y-1">
                    <SidebarMenuItem
                      icon={MessageSquare}
                      label="Discussions"
                      active={activeItem === "academics-discussions"}
                      onClick={() => handleItemClick("academics-discussions")}
                    />
                    <SidebarMenuItem
                      icon={Calendar}
                      label="Events"
                      active={activeItem === "academics-events"}
                      onClick={() => handleItemClick("academics-events")}
                    />
                    <SidebarMenuItem
                      icon={Users}
                      label="Find Pods"
                      active={activeItem === "academics-findPods"}
                      onClick={() => handleItemClick("academics-findPods")}
                    />
                    <SidebarMenuItem
                      icon={Trophy}
                      label="Challenges"
                      active={activeItem === "academics-challenges"}
                      onClick={() => handleItemClick("academics-challenges")}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Pods Section (Dropdown) */}
          <div>
            <SidebarMenuItem
              icon={Users}
              label="Pods"
              active={activeItem === "pods"}
              onClick={() => togglePods()}
            />
            {openPods && (
              <div className="ml-4 space-y-1">
                {userPods.filter(pod => pod !== null).length > 0 ? (
                  userPods
                    .filter(pod => pod !== null) // Filter out null values
                    .map((pod) => (
                      <SidebarMenuItem
                        key={pod.id}
                        icon={MessageSquare}
                        label={pod.title}
                        active={activeItem === pod.id}
                        onClick={() => navigateTo(`/pod/${pod.id}`, pod.id)}
                      />
                    ))
                ) : (
                  <p className="text-sm text-gray-500 ml-4">
                    No pods available
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Other navigation items */}
          <SidebarMenuItem
            icon={Trophy}
            label="Leaderboard"
            active={activeItem === "leaderboard"}
            onClick={() => handleItemClick("leaderboard")}
          />
          <SidebarMenuItem
            icon={HeartHandshake}
            label="Mentorship"
            active={activeItem === "mentorship"}
            onClick={() => handleItemClick("mentorship")}
          />
          <SidebarMenuItem
            icon={Settings}
            label="Settings"
            active={activeItem === "settings"}
            onClick={() => handleItemClick("settings")}
          />
          <SidebarMenuItem
            icon={HeartHandshake} // You can choose a different icon if needed
            label="Donations"
            active={activeItem === "donations"}
            onClick={() => navigateTo("/donor", "donations")}
          />
        </div>
      </div>

      {/* Community Setup Modal */}
      {showSetupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-11/12 max-w-4xl max-h-[90vh] overflow-auto relative">
            {/* Close button */}
            <button
              onClick={() => setShowSetupModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Modal Content - Modified ProdigiCommunitySetup */}
            <div className="p-6">
              <ModalProdigiCommunitySetup
                onClose={() => setShowSetupModal(false)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
