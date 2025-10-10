import { User, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { Question } from "../../types/community";
import { motion, AnimatePresence } from "framer-motion";

interface QuestionDetailProps {
  question: Question;
  onBack: () => void;
  onReply: (questionId: string, content: string) => void;
  isLoading: boolean;
  error?: string | null;
}

export const QuestionDetail: React.FC<QuestionDetailProps> = ({
  question,
  onBack,
  onReply,
  isLoading,
  error,
}) => {
  const [replyContent, setReplyContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;
    onReply(question._id, replyContent);
    setReplyContent("");
  };

  return (
    <div className="bg-white shadow-md p-5">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-pamoja-purple mb-4"
      >
        <ArrowLeft size={20} />
        <span>Back to discussions</span>
      </button>

      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 bg-pamoja-purple/10 rounded-full flex items-center justify-center"></div>
            <span className="text-sm font-medium text-gray-700">
              {question.username}
            </span>
            <span className="text-xs text-gray-500">
              {format(new Date(question.createdAt), "MMM d, yyyy")}
            </span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {question.title}
          </h2>
          <p className="text-gray-700 whitespace-pre-wrap">
            {question.content}
          </p>
        </div>

        <div className="border-t border-gray-100 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {question.answers?.length || 0} Answers
          </h3>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-red-50 text-red-700 px-4 py-2 rounded-xl mb-4"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="mb-6">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write your answer..."
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pamoja-purple focus:border-transparent resize-none"
              rows={4}
              disabled={isLoading}
            />
            <div className="flex justify-end mt-2">
              <button
                type="submit"
                disabled={isLoading || !replyContent.trim()}
                className="bg-pamoja-purple text-white px-4 py-2 rounded-lg hover:bg-pamoja-purple/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Posting..." : "Post Answer"}
              </button>
            </div>
          </form>

          <div className="space-y-6">
            {question.answers?.map((answer) => (
              <motion.div
                key={answer._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border-b border-gray-100 pb-6 last:border-0"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-pamoja-purple/10 rounded-full flex items-center justify-center">
                    <User className="text-pamoja-purple" size={14} />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {answer.username}
                  </span>
                  <span className="text-xs text-gray-500">
                    {format(new Date(answer.createdAt), "MMM d, yyyy")}
                  </span>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap pl-8">
                  {answer.content}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
