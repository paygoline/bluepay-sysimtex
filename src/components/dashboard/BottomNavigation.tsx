
import React from "react";
import { Wallet, BarChart2, Plus, MessageCircle, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const BottomNavigation = () => {
  const navigate = useNavigate();

  return (
    <div className="h-16 bg-white border-t border-gray-200 fixed bottom-0 w-full flex justify-around items-center px-4 shadow-md">
      <div 
        className="flex flex-col items-center cursor-pointer"
        onClick={() => navigate("/dashboard")}
      >
        <Wallet size={20} className="text-bluepay-blue" />
        <span className="text-xs font-medium mt-1">Wallet</span>
      </div>
      <div 
        className="flex flex-col items-center cursor-pointer" 
        onClick={() => navigate("/platform")}
      >
        <MessageCircle size={20} className="text-gray-500" />
        <span className="text-xs font-medium mt-1 text-gray-500">Social</span>
      </div>
      <div className="flex flex-col items-center">
        <Button 
          className="rounded-full h-12 w-12 -mt-5 bg-bluepay-blue text-white hover:bg-blue-700 shadow-lg"
          onClick={() => navigate("/buy-bpc")}
        >
          <Plus size={24} />
        </Button>
      </div>
      <div 
        className="flex flex-col items-center cursor-pointer" 
        onClick={() => navigate("/data")}
      >
        <BarChart2 size={20} className="text-gray-500" />
        <span className="text-xs font-medium mt-1 text-gray-500">Data</span>
      </div>
      <div 
        className="flex flex-col items-center cursor-pointer" 
        onClick={() => navigate("/profile")}
      >
        <User size={20} className="text-gray-500" />
        <span className="text-xs font-medium mt-1 text-gray-500">Profile</span>
      </div>
    </div>
  );
};

export default BottomNavigation;
