import { User, Tag, Image, X } from "lucide-react";
import { useState } from "react";

interface QuestionFormProps {
  onSubmit: (content: string, tags: string[]) => void;
  isLoading: boolean;
  maxChars: number;
}

export const QuestionForm = ({
  onSubmit,
  isLoading,
  maxChars,
}: QuestionFormProps) => {
  const [questionContent, setQuestionContent] = useState("");
  const [questionTags, setQuestionTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [showTagInput, setShowTagInput] = useState(false);

  const charsRemaining = maxChars - questionContent.length;
  const isOverLimit = charsRemaining < 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionContent.trim() || questionContent.length > maxChars) return;
    onSubmit(questionContent, questionTags);
    setQuestionContent("");
    setQuestionTags([]);
    setShowTagInput(false);
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newTag.trim()) {
      e.preventDefault();
      if (questionTags.length < 5) {
        setQuestionTags([...questionTags, newTag.trim()]);
        setNewTag("");
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setQuestionTags(questionTags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex gap-3">
        <div className="flex-1">
          <textarea
            value={questionContent}
            onChange={(e) => setQuestionContent(e.target.value)}
            placeholder="What's happening?..."
            rows={questionContent ? 3 : 1}
            className={`w-full p-2 border-3 focus:outline-none text-[15px] resize-none placeholder:text-gray-500 ${
              isOverLimit ? "text-red-500" : ""
            }`}
          />

          {questionTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2 px-1">
              {questionTags.map((tag) => (
                <div
                  key={tag}
                  className="inline-flex items-center gap-1 bg-pamoja-purple/10 text-pamoja-purple px-2 py-1 rounded-full text-xs"
                >
                  #{tag}
                  <X
                    size={12}
                    className="cursor-pointer hover:text-pamoja-purple/70"
                    onClick={() => removeTag(tag)}
                  />
                </div>
              ))}
            </div>
          )}

          {showTagInput && (
            <div className="px-1 mb-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Add tag (press Enter)"
                className="w-full px-3 py-1 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-pamoja-purple focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Add up to 5 tags</p>
            </div>
          )}

          {questionContent && (
            <div className="flex justify-between items-center mt-2 border-t border-gray-100 pt-3">
              <div className="flex gap-2">
                <button
                  type="button"
                  className="text-pamoja-purple hover:bg-pamoja-purple/10 rounded-full p-1"
                  onClick={() => setShowTagInput(!showTagInput)}
                >
                  <Tag size={18} />
                </button>
                <button
                  type="button"
                  className="text-pamoja-purple hover:bg-pamoja-purple/10 rounded-full p-1"
                >
                  <Image size={18} />
                </button>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`text-xs ${
                    isOverLimit ? "text-red-500" : "text-gray-500"
                  }`}
                >
                  {charsRemaining}
                </div>
                <button
                  type="submit"
                  disabled={isLoading || !questionContent.trim() || isOverLimit}
                  className="bg-pamoja-purple text-white px-4 py-1 rounded-full font-medium hover:bg-pamoja-purple/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {isLoading ? "Posting..." : "Post"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </form>
  );
};
