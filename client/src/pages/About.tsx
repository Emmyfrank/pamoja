import { motion } from "framer-motion";

const About = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-pamoja-purple p-8 text-white mb-12"
      >
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">About Pamoja</h1>
          <p className="text-lg mb-6">
            We're on a mission to provide accessible, accurate, and confidential
            sexual and reproductive health information to everyone.
          </p>
        </div>
      </motion.div>

      {/* Our Story Section */}
      <div className="max-w-4xl mx-auto mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white shadow-md overflow-hidden"
        >
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Our Story</h2>
            <div className="prose max-w-none text-gray-600">
              <p className="mb-4">
                Pamoja Health was founded in 2025 by a team of young developers
                ; who recognized the urgent need for accessible sexual and
                reproductive health information, especially in underserved
                communities.
              </p>
              <p className="mb-4">
                The name "Pamoja" came from a Swahili term "together",
                reflecting our belief that health education is a collaborative
                effort. We started with a simple idea: to create a safe,
                confidential space where people could ask questions about their
                sexual and reproductive health without fear of judgment or
                stigma.
              </p>
              <p>
                Today, <b>Pamoja Health</b> is still growing into a
                comprehensive platform that combines AI technology with
                expert-reviewed content to provide personalized health
                information and support to thousands of users across the globe.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Mission & Values */}
      <div className="max-w-4xl mx-auto mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white shadow-md overflow-hidden"
        >
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Our Mission & Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Our Mission
                </h3>
                <p className="text-gray-600 mb-4">
                  To empower individuals with accurate, accessible, and
                  confidential sexual and reproductive health information,
                  enabling them to make informed decisions about their health
                  and wellbeing.
                </p>
                <div className="flex items-center gap-2 text-pamoja-purple">
                  <span className="font-medium">
                    Empowering through knowledge
                  </span>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Our Vision
                </h3>
                <p className="text-gray-600 mb-4">
                  A world where everyone has access to reliable sexual and
                  reproductive health information, free from stigma and
                  barriers, leading to healthier communities and individuals.
                </p>
                <div className="flex items-center gap-2 text-pamoja-purple">
                  <span className="font-medium">
                    Health information for all
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Our Values */}
      <div className="max-w-4xl mx-auto mb-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
          Our Core Values
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white shadow-md p-6 text-center"
          >
            <div className="w-12 h-12 bg-pamoja-purple/10 rounded-full flex items-center justify-center mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Confidentiality
            </h3>
            <p className="text-gray-600">
              We prioritize user privacy and ensure all interactions remain
              confidential and secure.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white shadow-md p-6 text-center"
          >
            <div className="w-12 h-12 bg-pamoja-purple/10 rounded-full flex items-center justify-center mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Accuracy
            </h3>
            <p className="text-gray-600">
              All information is verified by healthcare professionals and based
              on current medical research.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white shadow-md p-6 text-center"
          >
            <div className="w-12 h-12 bg-pamoja-purple/10 rounded-full flex items-center justify-center mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Inclusivity
            </h3>
            <p className="text-gray-600">
              We serve everyone regardless of background, identity, or
              circumstances.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white shadow-md p-6 text-center"
          >
            <div className="w-12 h-12 bg-pamoja-purple/10 rounded-full flex items-center justify-center mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Accessibility
            </h3>
            <p className="text-gray-600">
              We make health information available to everyone, breaking down
              barriers to access.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Our Approach */}
      <div className="max-w-4xl mx-auto mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white shadow-md overflow-hidden"
        >
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Our Approach
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-pamoja-purple/10 rounded-full flex items-center justify-center flex-shrink-0"></div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Expert-Reviewed Content
                  </h3>
                  <p className="text-gray-600">
                    All our educational materials are reviewed by qualified
                    healthcare professionals to ensure accuracy and reliability.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-pamoja-purple/10 rounded-full flex items-center justify-center flex-shrink-0"></div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    24/7 Availability
                  </h3>
                  <p className="text-gray-600">
                    Our AI-powered chatbot is available around the clock to
                    answer questions and provide information whenever you need
                    it.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-pamoja-purple/10 rounded-full flex items-center justify-center flex-shrink-0"></div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Community-Centered
                  </h3>
                  <p className="text-gray-600">
                    We work closely with local communities and organizations to
                    understand their specific needs and challenges.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-pamoja-purple  p-8 text-white text-center max-w-4xl mx-auto"
      >
        <h2 className="text-2xl font-bold mb-4">Join Us in Our Mission</h2>
        <p className="text-lg mb-6 max-w-2xl mx-auto">
          We believe that access to accurate sexual and reproductive health
          information is a right, not a privilege. Help us reach more people and
          make a difference in their lives.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-pamoja-purple px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
            Partner With Us
          </button>
          <button className="bg-transparent border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors">
            Learn More
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default About;
