import React, { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface OpayServiceAlertProps {
  isOpen?: boolean;
  onClose?: () => void;
  autoShow?: boolean;
}

const OpayServiceAlert = ({ isOpen, onClose, autoShow = true }: OpayServiceAlertProps) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (autoShow) {
      const hasSeenAlert = sessionStorage.getItem("opay-alert-seen");
      if (!hasSeenAlert) {
        setOpen(true);
      }
    }
  }, [autoShow]);

  useEffect(() => {
    if (isOpen !== undefined) {
      setOpen(isOpen);
    }
  }, [isOpen]);

  const handleClose = () => {
    setOpen(false);
    sessionStorage.setItem("opay-alert-seen", "true");
    onClose?.();
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex justify-center mb-4">
            <div className="w-24 h-24 bg-muted rounded flex items-center justify-center">
              <AlertTriangle className="h-12 w-12 text-destructive" />
            </div>
          </div>
          <AlertDialogTitle className="text-center text-2xl text-destructive">
            Opay Service Down
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-base text-foreground pt-2">
            Please do not use Opay bank for payments at this time.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Alert variant="destructive" className="bg-destructive/10 border-destructive/50">
          <AlertDescription className="text-center text-sm">
            The Opay bank service is currently experiencing issues. Please use other supported banks for your payment.
          </AlertDescription>
        </Alert>

        <AlertDialogFooter className="sm:justify-center">
          <Button 
            onClick={handleClose}
            className="w-full sm:w-auto px-12 bg-primary hover:bg-primary/90"
          >
            I Understand
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default OpayServiceAlert;
