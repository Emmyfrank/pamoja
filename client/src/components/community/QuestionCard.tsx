import React, { forwardRef } from "react";
import { motion } from "framer-motion";
import { MessageCircle, ThumbsUp, Clock, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Question } from "../../types/community";
import { useCommunityStore } from "../../store/community.store";

interface QuestionCardProps {
  question: Question;
  onSelect: (id: string) => void;
  onTagClick: (tag: string) => void;
}

export const QuestionCard = forwardRef<HTMLDivElement, QuestionCardProps>(
  ({ question, onSelect, onTagClick }, ref) => {
    const { voteQuestion } = useCommunityStore();

    const handleVote = async (e: React.MouseEvent) => {
      e.stopPropagation();
      try {
        await voteQuestion(question._id);
      } catch (error) {
        console.error("Failed to vote:", error);
      }
    };

    return (
      <motion.div
        ref={ref}
        onClick={() => onSelect(question._id)}
        className="bg-white p-4  border border-neutral-100 hover:border-pamoja-purple/20 transition-colors cursor-pointer group"
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 bg-pamoja-purple/10 rounded-full flex items-center justify-center"></div>
              <span className="text-sm font-medium text-gray-700">
                {question.username}
              </span>
            </div>

            <h3 className="font-medium text-gray-900 group-hover:text-pamoja-purple transition-colors mb-2">
              {question.content}
            </h3>

            <div className="flex flex-wrap gap-2 mb-3">
              {question.tags.map((tag) => (
                <button
                  key={tag}
                  onClick={(e) => {
                    e.stopPropagation();
                    onTagClick(tag);
                  }}
                  className="text-xs px-2 py-1 rounded-full bg-pamoja-purple/5 text-pamoja-purple hover:bg-pamoja-purple/10 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <MessageCircle size={14} />
                <span>{question.answers?.length || 0} answers</span>
              </div>
              <button
                onClick={handleVote}
                className={`flex items-center gap-1 hover:text-pamoja-purple transition-colors ${
                  question.hasVoted ? "text-pamoja-purple" : ""
                }`}
              >
                <ThumbsUp
                  size={14}
                  className={question.hasVoted ? "fill-current" : ""}
                />
                <span>{question.votes} votes</span>
              </button>
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>
                  {formatDistanceToNow(new Date(question.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }
);

QuestionCard.displayName = "QuestionCard";
