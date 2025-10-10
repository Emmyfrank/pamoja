import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { TestimonialsSection } from "../components/home/TestimonialsSection";
import { ImpactSection } from "../components/home/ImpactSection";
import { HowItWorksSection } from "../components/home/HowItWorksSection";
import ChatPreview from "../components/home/ChatPreview";
import SRHServicesSection from "../components/home/SRHServicesSection";
import EducationalSection from "../components/home/EducationalSection";
import { useState } from "react";
import ChatPopup from "../components/chat/ChatPopup";
import Features from "../components/home/Features";
import MobileAppDownload from "../components/MobileAppDownload";
import SuggestionForm from "../components/SuggestionForm";
import AppStore from "../components/home/AppStore";
import WhatsAppAccess from "../components/home/WhatsAppAccess";

const WHATSAPP_NUMBER = "250735497223";

const Home = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[#F8F9FA]" />
          {/* Curved shape */}
          <div className="absolute right-0 w-2/3 h-full">
            <div className="absolute inset-0 bg-white " />
          </div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-sm font-medium text-pamoja-purple uppercase tracking-wider mb-6 block">
                YOUR SAFE SPACE FOR HEALTH
              </span>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl font-bold leading-tight mb-6"
              >
                Access Sexual & Reproductive Healthcare{" "}
                <span className="text-pamoja-purple">Safely & Privately</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-neutral-600 text-lg mb-8"
              >
                Find trusted healthcare services, get anonymous answers to your
                questions, and access reliable information about sexual and
                reproductive health.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link
                  to="/Community"
                  className="bg-pamoja-purple text-white px-8 py-4 rounded-lg hover:bg-pamoja-purple/90 transition-colors"
                >
                  Join the Community Discussion
                </Link>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] text-white px-8 py-4 rounded-lg hover:bg-[#128C7E] transition-colors flex items-center justify-center gap-2"
                >
                  Pamoja AI on WhatsApp
                </a>
                <Link
                  to="/chat"
                  className="text-pamoja-purple hover:text-pamoja-purple/80 flex items-center gap-2"
                >
                  Ask Questions Privately
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </motion.div>
            </div>

            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1655720359248-eeace8c709c5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YWZyaWNhbiUyMHBlb3BsZSUyMHRvZ2V0aGVyfGVufDB8fDB8fHww"
                className="w-full h-auto shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="bg-pamoja-purple/10 p-3 rounded-xl"></div>
                  <div>
                    <p className="font-medium">100% Private</p>
                    <p className="text-2xl font-bold text-pamoja-purple">
                      & Anonymous
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chat Preview Section */}
      <ChatPreview />

      {/* How it works section */}
      <HowItWorksSection />

      {/* Features Section */}
      <Features />

      {/* WhatsApp Section */}
      <section className="py-24 bg-gray-50 relative">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `linear-gradient(rgba(17, 63, 103, 0.7), rgba(52, 105, 154, 0.4)), url('https://images.unsplash.com/photo-1661862649743-2799867c32b0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHdoYXRzYXBwfGVufDB8fDB8fHww')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
            filter: "blur(1px)",
          }}
        />
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <WhatsAppAccess />
          </div>
        </div>
      </section>

      {/* Testimonials section */}
      <TestimonialsSection />

      {/* Impact section */}
      <ImpactSection />

      {/* SRH Services Section */}
      <SRHServicesSection />

      {/* Educational Section */}
      <EducationalSection />

      {/* App Store Section */}
      <AppStore />

      {/* Mobile App Download Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <MobileAppDownload />
        </div>
      </section>

      {/* Suggestion Form Section */}
      <section className="py-24 relative">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `linear-gradient(rgba(17, 63, 103, 0.7), rgba(52, 105, 154, 0.4)), url('https://images.unsplash.com/photo-1576073218292-976931ec70ca?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzZ8fHdvbWVuJTIwY29udHJhY2VwdGlvbnxlbnwwfHwwfHx8MA%3D%3D')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
            filter: "blur(1px)",
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 1 }}
          whileHover={{ y: -5 }}
          className="container mx-auto px-6"
        >
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                Help Us Improve
              </h2>
              <p className="text-lg text-white/60">
                Your feedback helps us make Pamoja Health better for everyone.
                Share your suggestions anonymously.
              </p>
            </div>
            <SuggestionForm />
          </div>
        </motion.div>
      </section>

      <section className="py-24 bg-gradient-to-br from-[#AA60C8] to-[#D69ADE] text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Take Control of Your Health?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of others who have found the support and information
            they need through Pamoja.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/learn"
              className="bg-white text-pamoja-purple px-8 py-4 rounded-lg hover:bg-opacity-90 transition-colors"
            >
              Start Learning
            </Link>
            <Link
              to="/chat"
              className="bg-pamoja-purple text-white px-8 py-4 rounded-lg hover:bg-opacity-90 transition-colors border border-white"
            >
              Start Chat
            </Link>
          </div>
        </div>
      </section>

      <ChatPopup isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

export default Home;
