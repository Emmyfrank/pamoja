import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Maximize2, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../../store/auth.store";
import { useMessageStore } from "../../store/message.store";
import ChatMessage from "./ChatMessage";
import SuggestedQuestions from "./SuggestedQuestions";
import { validateContent } from "../../utils/contentValidation";
import { WarningPopup } from "../common/WarningPopup";

const suggestedQuestions = [
  "What prenatal care services do I need?",
  "Where can I find safe abortion services?",
  "I'm experiencing pregnancy complications, what should I do?",
  "How can I access youth-friendly health services?",
  "What should I do if I experience gender-based violence?",
  "Where can I get contraception near me?",
];

const CommunityChatButton = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [warningMessage, setWarningMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { isAuthenticated, isAnonymous, getSessionId } = useAuthStore();
  const { messages, isLoading, error, sendMessage, loadPreviousMessages } =
    useMessageStore();

  useEffect(() => {
    if (isAuthenticated && isPopupOpen) {
      loadPreviousMessages();
    }
  }, [isAuthenticated, isPopupOpen, loadPreviousMessages]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const validationResult = validateContent(inputValue);
    if (!validationResult.isValid) {
      setWarningMessage(validationResult.message);
      return;
    }

    try {
      let sessionId = null;
      if (isAnonymous) sessionId = await getSessionId();
      await sendMessage(inputValue);
      setInputValue("");
      setWarningMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    setInputValue(question);
  };

  const togglePopup = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsPopupOpen(!isPopupOpen);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <WarningPopup
        message={warningMessage}
        isVisible={!!warningMessage}
        onClose={() => setWarningMessage("")}
      />

      <AnimatePresence>
        {isHovered && !isPopupOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute bottom-full mb-2 right-0 bg-white rounded-lg shadow-lg p-2 whitespace-nowrap"
          >
            Ask Health Questions
          </motion.div>
        )}

        {isPopupOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-full right-0 mb-4 w-[380px] bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="bg-pamoja-purple p-4 flex items-center justify-between text-white">
              <div>
                <h3 className="font-semibold">Ask Health Questions</h3>
                <p className="text-xs opacity-90">
                  Your questions remain private and anonymous
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  to="/chat"
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Maximize2 size={18} />
                </Link>
                <button
                  onClick={() => setIsPopupOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="h-[400px] overflow-y-auto p-4 bg-neutral-50">
              {isLoading && messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full space-y-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pamoja-purple"></div>
                  <p className="text-neutral-500">
                    Loading your chat history...
                  </p>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full space-y-4">
                  <p className="text-neutral-500 italic text-center">
                    Start a conversation by typing a message below.
                  </p>
                  <SuggestedQuestions
                    questions={suggestedQuestions}
                    onSelect={handleSuggestedQuestion}
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <ChatMessage
                      key={message.id}
                      message={message.content}
                      isUser={message.isUser}
                      timestamp={(message.timestamp as Date).toLocaleTimeString(
                        [],
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    />
                  ))}
                  {isLoading && (
                    <div className="flex gap-2 text-neutral-500 text-sm">
                      <span>Bot is typing</span>
                      <span className="animate-pulse">...</span>
                    </div>
                  )}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {error && (
              <div className="p-3 text-center text-red-600 bg-red-50 border-t border-red-100">
                {error}
              </div>
            )}

            <div className="p-4 border-t border-neutral-100">
              <div className="flex gap-2">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type your health question here..."
                  className="flex-1 p-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-pamoja-purple focus:border-transparent"
                  rows={1}
                  disabled={isLoading}
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !inputValue.trim()}
                  className="bg-pamoja-purple text-white p-2 rounded-lg hover:bg-pamoja-purple/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={togglePopup}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="flex items-center justify-center w-full py-3 px-4 bg-pamoja-purple hover:bg-pamoja-purple/90 text-white rounded-full shadow-lg transition-transform hover:scale-105"
      >
        <MessageCircle size={24} />
        <span className="hidden md:block">&nbsp; Ask Chat</span>
      </button>
    </div>
  );
};

export default CommunityChatButton;
