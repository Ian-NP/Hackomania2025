"use client";
import React, { useState } from "react";
import Sidebar from "./components/home/SideBar";
import Navbar from "./components/home/Navbar";
import CommunityList from "./components/home/CommunityList";
import BottomActionBar from "./components/home/BottomActionBar";

const ProdigiCommunity = () => {
  const [activeItem, setActiveItem] = useState<string>("home");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const communities = [
    {
      title: "Technology",
      description:
        "Learn programming, web development, and more. Perfect for beginners!",
      members: 5234,
      activePods: 142,
      isSelected: true,
    },
    {
      title: "Academics",
      description:
        "Study groups, academic resources, and peer support for students.",
      members: 3876,
      activePods: 98,
      isSelected: true,
    },
    {
      title: "Arts & Creativity",
      description:
        "Express yourself through art, design, and creative projects.",
      members: 2543,
      activePods: 76,
      isSelected: false,
    },
    {
      title: "Entrepreneurship",
      description:
        "Build your business skills and connect with fellow entrepreneurs.",
      members: 1987,
      activePods: 54,
      isSelected: false,
    },
  ];

  return (
    <div className="min-h-screen h-full bg-gray-50 relative">
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex flex-col lg:flex-row h-[calc(100vh-3.5rem)]">
        <Sidebar
          sidebarOpen={sidebarOpen}
          activeItem={activeItem}
          handleItemClick={setActiveItem}
        />

        <div className="flex-1 flex flex-col">
          <div className="p-6 flex-1 overflow-auto">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white mb-8">
              <h1 className="text-2xl font-bold mb-2">
                Select Your Communities
              </h1>
              <p>
                Choose the communities you'd like to join. You can select
                multiple communities at once.
              </p>
            </div>

            <div className="mb-8">
              <div className="flex items-center space-x-2 mb-4">
                <h2 className="text-xl font-bold">Recommended for You</h2>
              </div>
              <CommunityList communities={communities} />
            </div>
          </div>

          <BottomActionBar selectedCount={2} />
        </div>
      </div>
    </div>
  );
};

export default ProdigiCommunity;
