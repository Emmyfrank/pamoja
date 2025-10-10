import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, CheckCircle, X } from "lucide-react";
import { useCommunityStore } from "../store/community.store";
import { useAppConsent } from "../hooks/useAppConsent";
import { QuestionForm } from "../components/community/QuestionForm";
import { QuestionCard } from "../components/community/QuestionCard";
import { QuestionDetail } from "../components/community/QuestionDetail";
import { SearchAndFilter } from "../components/community/SearchAndFilter";
import { GuidelinesPopup } from "../components/community/GuidelinesPopup";

const MAX_CHARS = 280;
const POSTS_PER_PAGE = 10;

const CommunityChat = () => {
  const {
    questions,
    isSubmitting,
    isFetching,
    error,
    getQuestions,
    createQuestion: createQuestionStore,
    addAnswer: addAnswerStore,
  } = useCommunityStore();

  const { shouldShowGuidelines, handleGuidelinesDismiss } = useAppConsent();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [postSuccess, setPostSuccess] = useState(false);
  const [page, setPage] = useState(1);
  const newPostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getQuestions(1);
  }, []);

  useEffect(() => {
    if (postSuccess && newPostRef.current) {
      newPostRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      const timer = setTimeout(() => setPostSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [postSuccess]);

  const handleCreateQuestion = async (content: string, tags: string[]) => {
    try {
      await createQuestionStore({
        title: content.substring(0, 50),
        content,
        tags,
        isAnonymous: true,
      });
      setPostSuccess(true);
    } catch (error) {
      console.error("Failed to create question:", error);
    }
  };

  const handleReply = async (questionId: string, content: string) => {
    if (!content.trim()) return;

    try {
      await addAnswerStore(questionId, content, true);
    } catch (error) {
      console.error("Failed to add answer:", error);
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    getQuestions(nextPage);
  };

  const filteredQuestions = questions
    .filter((q) => {
      const matchesSearch = searchQuery
        ? q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.content.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      const matchesTag = selectedTag ? q.tags.includes(selectedTag) : true;
      return matchesSearch && matchesTag;
    })
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  const allTags = Array.from(new Set(questions.flatMap((q) => q.tags))).filter(
    Boolean
  );

  const selectedQuestionData = questions.find(
    (q) => q._id === selectedQuestion
  );

  const hasMorePosts = questions.length >= page * POSTS_PER_PAGE;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {shouldShowGuidelines && (
        <GuidelinesPopup onClose={handleGuidelinesDismiss} />
      )}

      <AnimatePresence mode="wait">
        {selectedQuestion && selectedQuestionData ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <QuestionDetail
              question={selectedQuestionData}
              onBack={() => setSelectedQuestion(null)}
              onReply={handleReply}
              isLoading={isSubmitting}
              error={error}
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="bg-white  shadow-md p-5"
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div>
                  <h2 className="text-xl font-bold text-pamoja-purple">
                    Community Discussions
                  </h2>
                  <p className="text-sm text-gray-600">
                    Share your questions and experiences with the community
                  </p>
                </div>
              </div>
            </div>

            <SearchAndFilter
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedTag={selectedTag}
              onTagSelect={setSelectedTag}
              tags={allTags}
            />

            <div className="border-b border-gray-200 pb-4 mb-5">
              <QuestionForm
                onSubmit={handleCreateQuestion}
                isLoading={isSubmitting}
                maxChars={MAX_CHARS}
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 text-red-700 px-4 py-2 rounded-xl mb-4 flex items-center gap-2"
              >
                <X size={16} className="text-red-500" />
                <p className="text-sm">{error}</p>
              </motion.div>
            )}

            {postSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-50 text-green-700 px-4 py-2 rounded-xl mb-4 flex items-center gap-2"
              >
                <CheckCircle size={16} className="text-green-500" />
                <p className="text-sm">Your question has been posted!</p>
              </motion.div>
            )}

            <div className="space-y-4">
              {isFetching && questions.length === 0 ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pamoja-purple"></div>
                </div>
              ) : (
                <>
                  {filteredQuestions.map((question, index) => (
                    <motion.div
                      key={question._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <QuestionCard
                        question={question}
                        onSelect={setSelectedQuestion}
                        onTagClick={setSelectedTag}
                        ref={
                          index === 0 && question.isNew ? newPostRef : undefined
                        }
                      />
                    </motion.div>
                  ))}

                  {hasMorePosts && (
                    <div className="flex justify-center pt-4">
                      <button
                        onClick={handleLoadMore}
                        disabled={isFetching}
                        className="bg-white border border-pamoja-purple text-pamoja-purple px-6 py-2 rounded-lg hover:bg-pamoja-purple/5 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isFetching ? "Loading..." : "Load More"}
                      </button>
                    </div>
                  )}

                  {filteredQuestions.length === 0 && !isFetching && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-12 bg-gray-50 rounded-xl"
                    >
                      <HelpCircle
                        size={32}
                        className="text-gray-400 mx-auto mb-4"
                      />
                      <p className="text-gray-500 font-medium">
                        No discussions found
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        Be the first to start a discussion!
                      </p>
                    </motion.div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CommunityChat;
