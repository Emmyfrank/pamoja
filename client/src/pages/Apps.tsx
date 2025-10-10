import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Download } from "lucide-react";

const Apps = () => {
  return (
    <div className="min-h-screen bg-gray-50 mx-auto px-4 py-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-pamoja-purple p-8 text-white mb-12"
      >
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">App Store</h1>
          <p className="text-lg mb-6">Feel free to explore our apps</p>
        </div>
      </motion.div>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-md overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Period Tracker
                  </h2>
                  <p className="text-gray-600">
                    Simple and private period tracking
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Features
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-pink-100 flex items-center justify-center mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                      </div>
                      <span className="text-gray-700">
                        Track your period dates
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-pink-100 flex items-center justify-center mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                      </div>
                      <span className="text-gray-700">
                        Record symptoms and mood
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-pink-100 flex items-center justify-center mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                      </div>
                      <span className="text-gray-700">
                        Predict your next period
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-pink-100 flex items-center justify-center mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                      </div>
                      <span className="text-gray-700">Export your data</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    How to Use
                  </h3>
                  <ol className="space-y-3 list-decimal list-inside text-gray-700">
                    <li>Click on any date in the calendar</li>
                    <li>Mark if you're on your period</li>
                    <li>Add your flow intensity</li>
                    <li>Record your mood and symptoms</li>
                    <li>Save your entry</li>
                  </ol>
                </div>
              </div>

              <div className="mt-8 flex justify-center">
                <Link
                  to="/apps/period-tracker"
                  className="bg-pamoja-purple text-white px-8 py-3 rounded-lg font-medium hover:bg-purple-800 transition-colors"
                >
                  Open Period Tracker
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Apps;
