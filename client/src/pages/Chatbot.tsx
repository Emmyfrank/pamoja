import { useState, useRef, useEffect } from "react";
import ChatMessage from "../components/chat/ChatMessage";
import SuggestedQuestions from "../components/chat/SuggestedQuestions";
import { Send, AlertCircle, X } from "lucide-react";
import { useAuthStore } from "../store/auth.store";
import { useMessageStore } from "../store/message.store";

const suggestedQuestions = [
  "What prenatal care services do I need?",
  "Where can I find safe abortion services?",
  "I'm experiencing pregnancy complications, what should I do?",
  "How can I access youth-friendly health services?",
  "What should I do if I experience gender-based violence?",
  "Where can I get contraception near me?",
];

const Chatbot = () => {
  const { isAuthenticated, isAnonymous, getSessionId } = useAuthStore();
  const {
    messages,
    isLoading,
    error,
    sendMessage,
    loadPreviousMessages,
    clearHistory,
  } = useMessageStore();

  const [inputValue, setInputValue] = useState("");
  const [showAnonymousWarning, setShowAnonymousWarning] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadPreviousMessages();
    } else {
      const hasSeenWarning = sessionStorage.getItem("hasSeenChatWarning");
      if (!hasSeenWarning) {
        setShowAnonymousWarning(true);
        sessionStorage.setItem("hasSeenChatWarning", "true");
      }
    }
  }, [isAuthenticated, isAnonymous, loadPreviousMessages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    try {
      let sessionId = null;
      if (isAnonymous) sessionId = await getSessionId();
      await sendMessage(inputValue);
      setInputValue("");
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

  const handleClearHistory = () => {
    if (
      window.confirm(
        "Are you sure you want to clear your chat history? This action cannot be undone."
      )
    ) {
      clearHistory();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {showAnonymousWarning && (
          <div className="mb-4 bg-yellow-50 border-l-4 border-yellow-400 p-4 flex items-start justify-between">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-700">
                <p className="font-medium">Anonymous Session</p>
                <p>
                  Your chat messages will not be saved when you reload or close
                  the page. Sign in to keep your chat history.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowAnonymousWarning(false)}
              className="text-yellow-400 hover:text-yellow-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
        <div className="bg-white shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-pamoja-purple p-4 text-white flex justify-between items-center">
            <div>
              <h1 className="text-xl font-semibold">Ask Health Questions</h1>
              <p className="text-sm opacity-90">
                Your questions remain private and anonymous
              </p>
            </div>
            {isAuthenticated && messages.length > 0 && (
              <button
                onClick={handleClearHistory}
                disabled={isLoading}
                className="px-3 py-1 text-sm text-white border border-white rounded hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Clearing..." : "Clear History"}
              </button>
            )}
          </div>

          {/* Chat Messages */}
          <div className="h-[66vh] overflow-y-auto p-4 bg-neutral-50">
            {isLoading && messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full space-y-4">
                <div className="animate-spin h-8 w-8 border-b-2 border-pamoja-purple"></div>
                <p className="text-neutral-500">Loading your chat history...</p>
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
              messages.map((message) => (
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
              ))
            )}
            {isLoading && messages.length > 0 && (
              <div className="flex gap-2 text-neutral-500 text-sm">
                <span>Bot is typing</span>
                <span className="animate-pulse">...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {error && (
            <div className="p-3 text-center text-red-600 bg-red-50 border-t border-red-100">
              {error}
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
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
                className="bg-pamoja-purple text-white p-2 rounded-full hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Suggested Questions */}
        <div className="mt-6">
          <h2 className="text-lg font-medium mb-2">Suggested Questions</h2>
          <SuggestedQuestions
            questions={suggestedQuestions}
            onSelect={handleSuggestedQuestion}
          />
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
