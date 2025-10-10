import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Send,
  CheckCircle,
  ThumbsUp,
  Lightbulb,
  Shield,
  AlertTriangle,
} from "lucide-react";
import { useSuggestionStore } from "../store/suggestion.store";

const SuggestionForm = () => {
  const [suggestion, setSuggestion] = useState("");
  const [category, setCategory] = useState("IMPROVEMENT");

  const { sendSuggestion, isLoading, error, success, resetSuccess } =
    useSuggestionStore();

  // Reset success state when component unmounts
  useEffect(() => {
    return () => {
      resetSuccess();
    };
  }, [resetSuccess]);

  const categories = [
    {
      id: "FEATURE REQUEST",
      label: "Feature Request",
      icon: <Lightbulb size={18} />,
    },
    { id: "IMPROVEMENT", label: "Improvement", icon: <ThumbsUp size={18} /> },
    {
      id: "BUG REPORT",
      label: "Bug Report",
      icon: <MessageSquare size={18} />,
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestion.trim()) return;

    await sendSuggestion(category, suggestion.trim());
    setSuggestion("");
  };

  return (
    <div className="bg-white shadow-md overflow-hidden">
      <div className="p-8">
        {!success ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-2 mb-6 text-sm text-gray-600 bg-purple-100 p-3 rounded-lg">
              <span>
                Your suggestions are completely anonymous. We don't collect any
                personal information.
              </span>
            </div>

            {error && (
              <div className="flex items-center gap-2 mb-6 text-sm text-red-600 bg-red-100 p-3 rounded-lg">
                <AlertTriangle size={16} className="text-red-600" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What type of suggestion do you have?
                </label>
                <div className="flex flex-wrap gap-3">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                        category === cat.id
                          ? "bg-pamoja-purple text-white border-pamoja-purple"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {cat.icon}
                      <span>{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="suggestion"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Your Suggestion
                </label>
                <textarea
                  id="suggestion"
                  rows={4}
                  value={suggestion}
                  onChange={(e) => setSuggestion(e.target.value)}
                  placeholder="Tell us what you'd like to see improved or added to Pamoja Health..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pamoja-purple focus:border-transparent"
                  required
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading || !suggestion.trim()}
                  className="bg-pamoja-purple text-white px-6 py-3 rounded-lg font-medium hover:bg-pamoja-purple/90 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Suggestion</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="text-green-600" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Thank You!
            </h3>
            <p className="text-gray-600 mb-6">
              Your suggestion has been submitted anonymously. We appreciate your
              feedback and will consider it for future improvements.
            </p>
            <button
              onClick={() => resetSuccess()}
              className="text-pamoja-purple hover:text-pamoja-purple/80 font-medium"
            >
              Submit Another Suggestion
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SuggestionForm;
