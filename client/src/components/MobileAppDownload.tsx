import { motion } from "framer-motion";
import {
  //   Smartphone,
  Bell,
  CheckCircle,
  Heart,
  MessageCircle,
  BookOpen,
  Calendar,
} from "lucide-react";

const MobileAppDownload = () => {
  return (
    <div className="bg-pamoja-purple overflow-hidden shadow-xl">
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Left side - Content */}
        <div className="p-8 md:p-12 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-block bg-white/20 rounded-full px-4 py-1 mb-6 text-sm font-medium">
              Coming Soon
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Get Pamoja Health on Your Phone
            </h2>
            <p className="text-lg mb-6 opacity-90">
              Access confidential health information and support anytime,
              anywhere. Our mobile app is coming soon!
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <CheckCircle
                  className="text-white mt-1 flex-shrink-0"
                  size={20}
                />
                <span>Chat with our AI health assistant on the go</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle
                  className="text-white mt-1 flex-shrink-0"
                  size={20}
                />
                <span>Access educational content offline</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle
                  className="text-white mt-1 flex-shrink-0"
                  size={20}
                />
                <span>Set reminders for health check-ups</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle
                  className="text-white mt-1 flex-shrink-0"
                  size={20}
                />
                <span>Secure, private, and confidential</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right side - Phone mockup */}
        <div className="relative hidden md:block">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 to-transparent z-10"></div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative h-full flex items-center justify-center p-8"
          >
            <div className="relative">
              {/* Phone frame */}
              <div className="w-64 h-[500px] bg-gray-900 rounded-[40px] border-8 border-gray-800 shadow-2xl overflow-hidden relative">
                {/* Phone notch */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-3xl z-20"></div>

                {/* Screen content */}
                <div className="absolute inset-0 bg-gradient-to-b from-pamoja-purple to-purple-600 p-4 overflow-hidden">
                  {/* App name */}
                  <h3 className="text-white text-center font-bold text-xl mt-7">
                    Pamoja Health
                  </h3>

                  {/* Features preview */}
                  <div className="mt-8 space-y-3">
                    <div className="bg-white/20 rounded-lg p-3 flex items-center gap-3">
                      <div className="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center">
                        <MessageCircle className="text-white" size={16} />
                      </div>
                      <div className="text-white text-sm">
                        <p className="font-medium">
                          Chat with Health Assistant
                        </p>
                        <p className="text-xs opacity-80">
                          Get answers to your questions
                        </p>
                      </div>
                    </div>

                    <div className="bg-white/20 rounded-lg p-3 flex items-center gap-3">
                      <div className="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center">
                        <BookOpen className="text-white" size={16} />
                      </div>
                      <div className="text-white text-sm">
                        <p className="font-medium">Health Library</p>
                        <p className="text-xs opacity-80">
                          Access educational content
                        </p>
                      </div>
                    </div>

                    <div className="bg-white/20 rounded-lg p-3 flex items-center gap-3">
                      <div className="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center">
                        <Calendar className="text-white" size={16} />
                      </div>
                      <div className="text-white text-sm">
                        <p className="font-medium">Health Reminders</p>
                        <p className="text-xs opacity-80">
                          Never miss important check-ups
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Coming soon badge */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1 text-white text-xs font-medium">
                    Coming Soon
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-purple-300 rounded-full opacity-20"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-purple-400 rounded-full opacity-20"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default MobileAppDownload;
