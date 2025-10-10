interface SuggestedQuestionProps {
  questions: string[];
  onSelect: (question: string) => void;
}

const SuggestedQuestions = ({
  questions,
  onSelect,
}: SuggestedQuestionProps) => {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {questions.map((question, index) => (
        <button
          key={index}
          onClick={() => onSelect(question)}
          className="text-sm bg-white border border-pamoja-purple/20 text-pamoja-purple px-4 py-2 rounded-full hover:bg-pamoja-purple/5 transition-colors"
        >
          {question}
        </button>
      ))}
    </div>
  );
};

export default SuggestedQuestions;
