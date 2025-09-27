
import React, { useState, useEffect } from "react";
import { useUserStore } from "../stores/userStore";
import Header from "../components/dashboard/Header";
import UserGreeting from "../components/dashboard/UserGreeting";
import BalanceCard from "../components/dashboard/BalanceCard";
import QuickActions from "../components/dashboard/QuickActions";
import MoreServices from "../components/dashboard/MoreServices";
import RecentTransactions from "../components/dashboard/RecentTransactions";
import BottomNavigation from "../components/dashboard/BottomNavigation";
import OpayNotificationBanner from "../components/dashboard/OpayNotificationBanner";
import ImportantInformation from "../components/dashboard/ImportantInformation";
import WithdrawalNotifications from "../components/dashboard/WithdrawalNotifications";
import YouTubeNotificationPopup from "../components/dashboard/YouTubeNotificationPopup";

const Dashboard = () => {
  const { userData, balance, transactions } = useUserStore();
  const [showYouTubePopup, setShowYouTubePopup] = useState(false);

  useEffect(() => {
    // Show YouTube popup after a short delay when dashboard loads
    const timer = setTimeout(() => {
      setShowYouTubePopup(true);
    }, 2000); // Show after 2 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleCloseYouTubePopup = () => {
    setShowYouTubePopup(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 pb-16 relative">
      <WithdrawalNotifications />
      <OpayNotificationBanner />
      <Header />

      <div className="p-2 space-y-2">
        <UserGreeting userData={userData} />
        <BalanceCard balance={balance} />
        <QuickActions />
        <MoreServices />
        <ImportantInformation />
        <RecentTransactions transactions={transactions} />
      </div>
      
      <BottomNavigation />
      
      <YouTubeNotificationPopup 
        isOpen={showYouTubePopup}
        onClose={handleCloseYouTubePopup}
      />
    </div>
  );
};

export default Dashboard;
