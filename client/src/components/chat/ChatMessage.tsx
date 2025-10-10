import { User2, Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp?: string;
}

interface CodeProps extends React.HTMLProps<HTMLElement> {
  inline?: boolean;
  node?: any;
}

const ChatMessage = ({ message, isUser, timestamp }: ChatMessageProps) => {
  return (
    <div
      className={`flex gap-3 mb-4 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? "bg-pamoja-purple" : "bg-neutral-200"
        }`}
      >
        {isUser ? (
          <User2 className="w-5 h-5 text-white" />
        ) : (
          <Bot className="w-5 h-5 text-neutral-600" />
        )}
      </div>
      <div className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`max-w-[80%] px-4 py-2 ${
            isUser
              ? "bg-pamoja-purple text-white"
              : "bg-white border border-neutral-200"
          }`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{message}</p>
          ) : (
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  // Style links
                  a: ({ node, ...props }) => (
                    <a
                      {...props}
                      className="text-pamoja-purple hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  ),
                  // Style code blocks
                  code: ({ node, inline, ...props }: CodeProps) => (
                    <code
                      {...props}
                      className={`${
                        inline
                          ? "bg-neutral-100 rounded px-1"
                          : "block bg-neutral-50 p-2 rounded-lg"
                      }`}
                    />
                  ),
                  // Style lists
                  ul: ({ node, ...props }) => (
                    <ul {...props} className="list-disc pl-4 my-2" />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol {...props} className="list-decimal pl-4 my-2" />
                  ),
                  // Style headings
                  h1: ({ node, ...props }) => (
                    <h1 {...props} className="text-xl font-bold my-2" />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2 {...props} className="text-lg font-bold my-2" />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3 {...props} className="text-base font-bold my-2" />
                  ),
                  // Style paragraphs
                  p: ({ node, ...props }) => <p {...props} className="my-2" />,
                }}
              >
                {message}
              </ReactMarkdown>
            </div>
          )}
        </div>
        {timestamp && (
          <span className="text-xs text-neutral-500 mt-1">{timestamp}</span>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
