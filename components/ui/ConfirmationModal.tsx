"use client";

import { Button } from "@/components/ui/button";
import { X, Loader2 } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isLoading?: boolean;
}

export function ConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message,
  isLoading = false
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in-0 duration-300">
      <div 
        className="relative w-full max-w-md bg-white rounded-lg shadow-xl animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-red-500 text-white rounded-t-lg">
          <h2 className="text-lg font-semibold">{title}</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 hover:bg-red-600">
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <p className="text-gray-700">{message}</p>
        </div>
        
        {/* Footer with Actions */}
        <div className="flex items-center justify-end gap-2 p-4 border-t bg-gray-50 rounded-b-lg">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={onConfirm} disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="mr-2">Processing...</span>
                <Loader2 className="h-4 w-4 animate-spin" />
              </>
            ) : "Confirm"}
          </Button>
        </div>
      </div>
    </div>
  );
}
