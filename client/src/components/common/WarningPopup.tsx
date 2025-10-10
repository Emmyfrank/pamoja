import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, X } from "lucide-react";

interface WarningPopupProps {
  message: string;
  isVisible?: boolean;
  onClose?: () => void;
}

export const WarningPopup: React.FC<WarningPopupProps> = ({
  message,
  onClose,
}) => {
  if (!message) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full"
      >
        <div className="bg-red-50 border border-red-200 rounded-lg shadow-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-700 flex-grow text-sm">{message}</p>
          {onClose && (
            <button
              onClick={onClose}
              className="text-red-400 hover:text-red-500 transition-colors"
              aria-label="Close warning"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
