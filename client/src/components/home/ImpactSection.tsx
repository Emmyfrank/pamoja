import { motion } from "framer-motion";
import { CheckCircle2, Clock } from "lucide-react";

export const ImpactSection = () => {
  const stats = [
    {
      number: "100%",
      label: "Private & Anonymous",
      status: "completed",
    },
    {
      number: "24/7",
      label: "Support Available",
      status: "completed",
    },
    {
      number: "1000+",
      label: "Healthcare Providers",
      status: "in-progress",
    },
    {
      number: "50K+",
      label: "Questions Answered",
      status: "in-progress",
    },
  ];

  return (
    <section className="py-24 bg-pamoja-purple text-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-16">Our Impact</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="text-center relative"
            >
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                {stat.status === "completed" ? (
                  <div className="flex items-center gap-1 text-green-400">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="text-sm font-medium">Completed</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Clock className="w-5 h-5 animate-pulse" />
                    <span className="text-sm font-medium">In Progress</span>
                  </div>
                )}
              </div>
              <p className="text-4xl font-bold mb-2">{stat.number}</p>
              <p className="text-sm opacity-90">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
