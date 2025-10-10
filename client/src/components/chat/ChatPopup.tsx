import { useState } from "react";
import { Link } from "react-router-dom";
import { X, Maximize2, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ChatPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatPopup = ({ isOpen, onClose }: ChatPopupProps) => {
  const [message, setMessage] = useState("");

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-4 right-4 w-[380px] z-50"
        >
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-neutral-200">
            <div className="bg-pamoja-purple p-4 flex items-center justify-between text-white">
              <div>
                <h3 className="font-semibold">Community Chat</h3>
                <p className="text-xs opacity-90">Join the conversation</p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  to="/community"
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Maximize2 size={18} />
                </Link>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="h-[400px] overflow-y-auto p-4 bg-neutral-50">
              {/* Messages will be rendered here */}
            </div>

            <div className="p-4 border-t border-neutral-100">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:border-pamoja-purple"
                />
                <button className="bg-pamoja-purple text-white p-2 rounded-lg hover:bg-pamoja-purple/90">
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatPopup;
