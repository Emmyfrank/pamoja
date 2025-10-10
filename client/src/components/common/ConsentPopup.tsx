import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Heart } from "lucide-react";

interface ConsentPopupProps {
  onAccept: () => void;
  onDecline: () => void;
}

export const ConsentPopup: React.FC<ConsentPopupProps> = ({
  onAccept,
  onDecline,
}) => {
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Heart className="text-pamoja-purple" size={28} />
            <h2 className="text-2xl font-bold text-gray-900">
              Welcome to Pamoja
            </h2>
          </div>

          <div className="space-y-4 mb-6">
            <p className="text-gray-700">
              Pamoja is a safe space for discussing health-related topics and
              getting support from the community. Before you continue:
            </p>

            <div className="bg-pamoja-purple/5 p-4 rounded-xl space-y-2">
              <p className="text-gray-700 flex items-start gap-2">
                <AlertCircle
                  className="text-pamoja-purple flex-shrink-0 mt-1"
                  size={16}
                />
                You must be at least 10 years old to use Pamoja!
              </p>
              <p className="text-gray-700 flex items-start gap-2">
                <AlertCircle
                  className="text-pamoja-purple flex-shrink-0 mt-1"
                  size={16}
                />
                All discussions are moderated for safety
              </p>
              <p className="text-gray-700 flex items-start gap-2">
                <AlertCircle
                  className="text-pamoja-purple flex-shrink-0 mt-1"
                  size={16}
                />
                Your privacy and anonymity are protected
              </p>
            </div>

            <p className="text-sm text-gray-500">
              By continuing, you confirm that you meet the age requirement and
              agree to our community guidelines.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onDecline}
              className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              I'm Too Young
            </button>
            <button
              onClick={onAccept}
              className="flex-1 px-4 py-2 bg-pamoja-purple text-white rounded-lg hover:bg-pamoja-purple/90"
            >
              I Have 10+ Years
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
