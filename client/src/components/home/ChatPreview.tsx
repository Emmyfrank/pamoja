import { useNavigate } from "react-router-dom";
import { Send } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const ChatPreview = () => {
  const navigate = useNavigate();
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

  return (
    <section ref={sectionRef} className="py-24 overflow-hidden relative">
      {/* Parallax Background */}
      <motion.div style={{ y }} className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `linear-gradient(rgba(17, 63, 103, 0.7), rgba(52, 105, 154, 0.4)), url('https://images.unsplash.com/photo-1666886573421-d19e546cfc4e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDN8fGFmcmljYW4lMjB5b3V0aCUyMGF0JTIwaG9zcGl0YWx8ZW58MHx8MHx8fDA%3D')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
            filter: "blur(1px)",
          }}
        />
      </motion.div>

      <div className="container mx-auto px-6 relative z-10 text-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-sm font-medium text-pamoja-purple uppercase tracking-wider mb-6 block">
              PRIVATE & ANONYMOUS
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Get Answers to Your Health Questions
            </h2>
            <p className="text-white/60 text-lg mb-8">
              Ask sensitive questions about sexual and reproductive health
              without judgment. Our AI chatbot provides accurate, private
              responses 24/7.
            </p>
            <button
              onClick={() => navigate("/chat")}
              className="bg-pamoja-purple text-white px-8 py-4 hover:bg-pamoja-purple/90 transition-colors"
            >
              Try the Chatbot Now
            </button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="bg-white shadow-xl overflow-hidden max-w-md mx-auto w-full">
              <div className="bg-pamoja-purple p-4 text-white">
                <h3 className="text-lg font-semibold">Sample Conversation</h3>
              </div>
              <div className="p-4 space-y-4">
                {/* Sample messages */}
                <div className="bg-neutral-100 text-neutral-800 p-3 rounded-2xl rounded-bl-none max-w-[80%]">
                  Hello! How can I help you with your health questions today?
                </div>
                <div className="bg-pamoja-purple text-white p-3 rounded-2xl rounded-br-none max-w-[80%] ml-auto">
                  I need information about contraception options.
                </div>
                <div className="bg-neutral-100 text-neutral-800 p-3 rounded-2xl rounded-bl-none max-w-[80%]">
                  I can help you understand different contraception methods.
                  Would you like to learn about:
                  <ul className="mt-2 space-y-1">
                    <li>• Birth control pills</li>
                    <li>• IUDs</li>
                    <li>• Emergency contraception</li>
                  </ul>
                </div>
              </div>
              <div className="p-4 border-t border-neutral-100">
                <div className="flex gap-2">
                  <div className="flex-1 bg-neutral-50 p-3 text-neutral-400">
                    Ask your question privately...
                  </div>
                  <button className="bg-pamoja-purple text-white p-3 opacity-50">
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </div>
            {/* Add decorative elements */}
            <div className="absolute -z-10 -top-10 -right-10 w-40 h-40 bg-[#EABDE6] rounded-full opacity-20 blur-2xl" />
            <div className="absolute -z-10 -bottom-10 -left-10 w-40 h-40 bg-[#AA60C8] rounded-full opacity-20 blur-2xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ChatPreview;
