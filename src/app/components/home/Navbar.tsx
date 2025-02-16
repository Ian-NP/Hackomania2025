"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, MessageSquare, ChevronDown, Menu, X, LogOut } from 'lucide-react';
import { useRouter } from "next/navigation";
import { auth } from "lib/firebaseClient";

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header: React.FC<HeaderProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [profileUrl, setProfileUrl] = useState<string | null>(null);

  const router = useRouter(); 

  // Get user profileUrl from sessionStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = sessionStorage.getItem("user");
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setProfileUrl(parsedUser.photoURL || null);
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }
    }
  }, []);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      document.cookie = "auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      sessionStorage.removeItem("user"); // Clear user session
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white border-b px-4 py-3 flex items-center justify-between w-full z-50 sticky top-0 h-14">
      <div className="flex items-center space-x-4">
        <button className="lg:hidden p-2" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
        <h1 className="text-xl font-bold text-blue-600">Prodigi</h1>
        <div className="relative hidden lg:block">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search communities..." 
            className="pl-8 pr-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      
      {/* User profile section with dropdown */}
      <div className="relative" ref={dropdownRef}>
        <div 
          className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition duration-200" 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          {/* Display Profile Picture */}
          {profileUrl ? (
            <img src={profileUrl} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <div className="w-10 h-10 bg-blue-500 rounded-full"></div> // Default avatar
          )}
          <ChevronDown 
            className="h-5 w-5 text-gray-600 transition-transform duration-200" 
            style={{ transform: isDropdownOpen ? "rotate(180deg)" : "rotate(0deg)" }} 
          />
        </div>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 w-44 bg-white border rounded-lg shadow-lg p-2 z-50">
            <button 
              onClick={handleSignOut} 
              className="w-full flex items-center px-4 py-3 text-md font-semibold text-white bg-red-500 hover:bg-red-600 transition-all duration-300 rounded-lg"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Sign Out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;
