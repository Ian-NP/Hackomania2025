import React from 'react';

interface SidebarMenuItemProps {
  icon: React.ComponentType<any>;
  label: string;
  active: boolean;
  onClick: () => void;
}

const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({ icon: Icon, label, active, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-all duration-300 ${
        active ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </div>
  );
};

export default SidebarMenuItem;
