import React, { ReactNode, useState, useEffect, use } from "react";
import { useRouter, usePathname } from "next/navigation";
import { auth } from "lib/firebaseClient";
import Sidebar from "./home/SideBar";
import Navbar from "./home/Navbar";
import BottomActionBar from "./home/BottomActionBar";

interface LayoutProps {
  children: ReactNode;
  defaultActiveItem?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, defaultActiveItem = "home" }) => {
  const [activeItem, setActiveItem] = useState<string>(defaultActiveItem);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname(); // Get current route

  // Update activeItem based on the pathname whenever it changes
  useEffect(() => {
    if (pathname === "/home" || pathname === "/") {
      setActiveItem("home");
    } else if (pathname.includes("community")) {
      setActiveItem("communities");
    }
    // Add more conditions as needed to cover other routes
  }, [pathname]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    console.log('Updating status...');
    const updateStatus = async () => {
      const userData = sessionStorage.getItem("user") ? JSON.parse(sessionStorage.getItem("user") as string) : null;
      if (userData) {
        if (userData.status !== "online"){
          try {
            const response = await fetch(`/api/updateStatus?uid=DIT52qtgvQfD55taKUTjkc0ARBx1`, {
              method: 'PUT', // Specify the PUT method
              headers: {
                'Content-Type': 'application/json', // Indicate that the body is JSON
              },
              body: JSON.stringify({
                status: 'online', // The data you want to send
              }),
            });
        
            if (response.ok) {
              // Handle successful response
              userData.status = 'online';
              sessionStorage.setItem('user', JSON.stringify(userData));
              console.log('Status updated successfully');
            } else {
              // Handle errors
              console.log('Failed to update status:', response.statusText);
            }
          } catch (error) {
            console.log('Error:', error);
          }
        }
      }
    };

    updateStatus();
  }, []);

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
          <div className="p-6 flex-1 overflow-auto">{children}</div>

          {/* {(pathname === "/home" || pathname === "/") && (
            <BottomActionBar selectedCount={2} />
          )} */}
        </div>
      </div>
    </div>
  );
};

export default Layout;
