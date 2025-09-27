
import React, { useState, useEffect } from "react";
import { X, Youtube, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface YouTubeNotificationPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const YouTubeNotificationPopup = ({ isOpen, onClose }: YouTubeNotificationPopupProps) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Set the target date to July 10th, 2025
  const targetDate = new Date('2025-07-10T20:00:00').getTime();

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const handleSubscribe = () => {
    window.open('https://http://www.youtube.com/@STEVEUPDATE-e8f', '_blank');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md mx-4 rounded-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-yellow-600">
            <Youtube className="w-6 h-6" />
            Join Our YouTube Channel!
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-center">
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-700 text-white p-4 rounded-lg mb-4 animate-pulse">
              <h3 className="text-lg font-bold mb-2">🎉✨ HAPPY NEW MONTH! 🎊🥳</h3>
              <p className="text-sm">💫 Wishing you a month filled with blessings, success, and beautiful moments! ⭐</p>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg mb-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium">Live Event Countdown</span>
              </div>
              
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-white p-2 rounded shadow">
                  <div className="text-lg font-bold text-blue-600">{timeLeft.days}</div>
                  <div className="text-xs text-gray-500">Days</div>
                </div>
                <div className="bg-white p-2 rounded shadow">
                  <div className="text-lg font-bold text-blue-600">{timeLeft.hours}</div>
                  <div className="text-xs text-gray-500">Hours</div>
                </div>
                <div className="bg-white p-2 rounded shadow">
                  <div className="text-lg font-bold text-blue-600">{timeLeft.minutes}</div>
                  <div className="text-xs text-gray-500">Minutes</div>
                </div>
                <div className="bg-white p-2 rounded shadow">
                  <div className="text-lg font-bold text-blue-600">{timeLeft.seconds}</div>
                  <div className="text-xs text-gray-500">Seconds</div>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Don't miss out on exclusive content, updates, and the biggest live event of the year! 
              Subscribe now to get notified and be part of the BluePay community.
            </p>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleSubscribe}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              <Youtube className="w-4 h-4 mr-2" />
              Subscribe Now
            </Button>
            <Button 
              onClick={onClose}
              variant="outline" 
              className="px-4"
            >
              Later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default YouTubeNotificationPopup;
