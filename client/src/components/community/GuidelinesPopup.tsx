import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Shield, Heart, X } from "lucide-react";

interface GuidelinesPopupProps {
  onClose: () => void;
}

export const GuidelinesPopup: React.FC<GuidelinesPopupProps> = ({
  onClose,
}) => {
  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white shadow-xl max-w-md w-full p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-gray-900">
                Community Guidelines
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4 mb-6">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div>
                  <h3 className="font-medium text-gray-900">Be Respectful</h3>
                  <p className="text-sm text-gray-600">
                    Treat others with kindness and respect. No hate speech,
                    discrimination, or harassment.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div>
                  <h3 className="font-medium text-gray-900">Stay Safe</h3>
                  <p className="text-sm text-gray-600">
                    Don't share personal information. Protect your privacy and
                    others'.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div>
                  <h3 className="font-medium text-gray-900">
                    Keep it Relevant
                  </h3>
                  <p className="text-sm text-gray-600">
                    Stay on topic with health-related discussions. No spam or
                    promotional content.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-pamoja-purple/5 p-4">
              <p className="text-sm text-gray-700">
                Remember: Our AI moderates all content to ensure a safe and
                supportive environment. Repeated violations may result in
                restricted access.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-pamoja-purple text-white hover:bg-pamoja-purple/90"
          >
            I Understand
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
