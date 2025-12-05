import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Copy, Check, Building2, Wallet, Smartphone, Banknote, CreditCard, Clock, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface PaymentAccount {
  id: string;
  bank_name: string;
  account_number: string;
  account_name: string;
  icon_name: string;
}

const iconMap: Record<string, LucideIcon> = {
  Building2,
  Wallet,
  Smartphone,
  Banknote,
  CreditCard,
};

const TIMER_DURATION = 30 * 60; // 30 minutes in seconds
const NOTIFICATION_TIME = 25 * 60; // 25 minutes in seconds - when to play sound

const BuyBPCPayment = () => {
  const navigate = useNavigate();
  const [showOpayAlert, setShowOpayAlert] = useState(true);
  const [paymentAccounts, setPaymentAccounts] = useState<PaymentAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<PaymentAccount | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [loading, setLoading] = useState(true);
  const hasPlayedNotification = useRef(false);

  useEffect(() => {
    const fetchAccounts = async () => {
      const { data, error } = await supabase
        .from("payment_accounts")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) {
        toast({ title: "Error", description: "Failed to load payment accounts", variant: "destructive" });
      } else if (data && data.length > 0) {
        setPaymentAccounts(data);
        setSelectedAccount(data[0]);
      }
      setLoading(false);
    };

    fetchAccounts();
  }, []);

  const playNotificationSound = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.type = "sine";
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  useEffect(() => {
    if (timeLeft <= 0) {
      toast({
        title: "Session Expired",
        description: "Your payment session has expired. Please start again.",
        variant: "destructive",
      });
      navigate("/buy-bpc");
      return;
    }

    // Play notification sound at 25 minutes remaining (5 minutes after start)
    if (timeLeft === NOTIFICATION_TIME && !hasPlayedNotification.current) {
      hasPlayedNotification.current = true;
      playNotificationSound();
      toast({
        title: "Time Reminder",
        description: "You have 25 minutes remaining to complete your transfer.",
      });
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, navigate]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getTimerColor = () => {
    if (timeLeft <= 60) return "text-red-600 bg-red-100";
    if (timeLeft <= 300) return "text-orange-600 bg-orange-100";
    return "text-blue-600 bg-blue-100";
  };

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        description: `${type} copied to clipboard!`,
        duration: 2000,
      });
    });
  };

  const handlePaymentConfirm = () => {
    navigate("/buy-bpc/verifying");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 relative">
      {showOpayAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-4 max-w-sm w-full mx-4 text-center">
            <div className="flex flex-col items-center">
              <img
                src="https://i.ibb.co/qLVCfHVK/icon.jpg"
                alt="Opay Logo"
                className="w-10 h-10 mb-2"
              />
              <h2 className="text-green-600 text-lg font-bold mb-2">
                All Services Restored
              </h2>
              <p className="text-gray-700 mb-2 text-sm">
                Opay and all other supported banks are now working perfectly..
              </p>
              <div className="bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded mb-3 text-xs">
                All banking services including Opay are now fully operational and
                available for your payments.
              </div>
              <Button
                className="bg-blue-600 hover:bg-blue-700 w-full py-2 text-white text-sm"
                onClick={() => setShowOpayAlert(false)}
              >
                I Understand
              </Button>
            </div>
          </div>
        </div>
      )}

      <header className="bg-[#222222] text-white py-3 px-4 flex justify-between items-center sticky top-0 z-10">
        <button className="text-lg">
          <span className="sr-only">Menu</span>
        </button>
        <h1 className="text-xl font-semibold">BLUEPAY</h1>
        <div className="w-6 h-6">
          <span className="sr-only">Notifications</span>
        </div>
      </header>

      <div className="bg-gray-200 py-3 px-4 flex items-center justify-between">
        <div className="flex items-center">
          <button onClick={() => navigate(-1)} className="mr-2">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-lg font-bold">Bank Transfer</h2>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="text-red-500 font-medium text-sm"
        >
          Cancel
        </button>
      </div>

      <div className="flex flex-col items-center p-4 mb-2">
        <h1 className="text-3xl font-bold mb-1">NGN 6,200</h1>
        <p className="text-gray-600 text-sm">BPC Code Purchase</p>
        
        {/* Countdown Timer */}
        <div className={`flex items-center gap-2 mt-3 px-4 py-2 rounded-full ${getTimerColor()}`}>
          <Clock size={18} />
          <span className="font-bold text-lg">{formatTime(timeLeft)}</span>
          <span className="text-sm">remaining</span>
        </div>
      </div>

      {/* Bank Selection */}
      <div className="mx-4 mb-3">
        <p className="text-gray-700 text-sm font-medium mb-2">Select Payment Bank:</p>
        {loading ? (
          <p className="text-gray-500 text-sm">Loading accounts...</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {paymentAccounts.map((account) => {
              const Icon = iconMap[account.icon_name] || Building2;
              return (
                <button
                  key={account.id}
                  onClick={() => setSelectedAccount(account)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                    selectedAccount?.id === account.id
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                  }`}
                >
                  {selectedAccount?.id === account.id ? <Check size={16} /> : <Icon size={16} />}
                  {account.bank_name}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="bg-blue-50 mx-4 p-3 rounded-lg">
        <h3 className="text-blue-700 text-base font-semibold mb-2">
          Instructions:
        </h3>
        <ol className="list-decimal pl-4 text-blue-700 space-y-1 text-sm">
          <li>Select your preferred bank above</li>
          <li>Copy the account details below</li>
          <li>Open your bank app and make a transfer</li>
          <li>Return here and click "I have made this bank Transfer"</li>
          <li>Wait for confirmation (usually within 3 minutes)</li>
        </ol>
      </div>

      <div className="bg-white m-4 p-3 rounded-lg border border-gray-200">
        <div className="mb-3">
          <p className="text-gray-500 text-xs">Amount</p>
          <div className="flex justify-between items-center">
            <p className="text-lg font-bold">NGN 6200</p>
            <Button
              variant="default"
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-1"
              onClick={() => handleCopy("6200", "Amount")}
            >
              <Copy size={14} />
              Copy
            </Button>
          </div>
        </div>

        <div className="mb-3 border-t pt-3">
          <p className="text-gray-500 text-xs">Account Number</p>
          <div className="flex justify-between items-center">
            <p className="text-lg font-bold">{selectedAccount?.account_number || "-"}</p>
            <Button
              variant="default"
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-1"
              onClick={() => selectedAccount && handleCopy(selectedAccount.account_number, "Account Number")}
              disabled={!selectedAccount}
            >
              <Copy size={14} />
              Copy
            </Button>
          </div>
        </div>

        <div className="mb-3 border-t pt-3">
          <p className="text-gray-500 text-xs">Bank Name</p>
          <p className="text-lg font-bold">{selectedAccount?.bank_name || "-"}</p>
        </div>

        <div className="mb-3 border-t pt-3">
          <p className="text-gray-500 text-xs">Account Name</p>
          <p className="text-lg font-bold">{selectedAccount?.account_name || "-"}</p>
        </div>
      </div>

      <p className="text-center px-4 mb-3 text-gray-700 text-sm">
        Pay to this specific account and get your BPC code
      </p>

      <div className="px-4 mb-6">
        <Button
          className="bg-blue-600 hover:bg-blue-700 w-full py-4 text-base font-semibold"
          onClick={() => setShowConfirmDialog(true)}
        >
          I have made this bank Transfer
        </Button>
      </div>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Payment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you have completed the bank transfer of NGN 6,200 to {selectedAccount?.bank_name} ({selectedAccount?.account_number})?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, Go Back</AlertDialogCancel>
            <AlertDialogAction onClick={handlePaymentConfirm} className="bg-blue-600 hover:bg-blue-700">
              Yes, I've Paid
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BuyBPCPayment;
