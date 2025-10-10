import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";

const AppStore = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-pamoja-purple mb-4">
            Period Tracker
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Track your menstrual cycle with our simple and private period
            tracker
          </p>

          <div className="bg-pink-50 rounded-xl p-8 mb-8">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="text-left">
                <h3 className="text-xl font-bold text-pamoja-purple">
                  Simple Period Tracking
                </h3>
                <p className="text-gray-600">
                  Track your cycle, predict periods, and monitor symptoms
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Features</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• Calendar view for period tracking</li>
                  <li>• Symptom and mood logging</li>
                  <li>• Cycle length predictions</li>
                  <li>• Data export</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">How to Use</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>1. Click on any date</li>
                  <li>2. Mark if you're on your period</li>
                  <li>3. Add flow intensity</li>
                  <li>4. Record symptoms and mood</li>
                </ul>
              </div>
            </div>
          </div>

          <Link
            to="/apps/period-tracker"
            className="inline-block bg-pamoja-purple text-white px-8 py-3 rounded-lg font-medium hover:bg-purple-500 transition-colors"
          >
            Start Tracking
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AppStore;
