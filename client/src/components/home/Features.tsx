import { motion } from "framer-motion";

const Features = () => {
  const features = [
    {
      icon: "🏥",
      title: "Find Services",
      description: "Locate trusted healthcare providers near you",
    },
    {
      icon: "💭",
      title: "Ask Questions",
      description: "Get private answers to your health questions",
    },
    {
      icon: "📚",
      title: "Learn & Grow",
      description: "Access reliable health information and resources",
    },
  ];
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-4 text-pamoja-purple">
            How We Help You
          </h2>
          <p className="text-neutral-600">
            Access healthcare services and information with complete privacy and
            trust
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="bg-white p-8 shadow-sm border border-neutral-100 hover:shadow-lg transition-shadow"
            >
              <span className="text-4xl mb-6 block">{feature.icon}</span>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-neutral-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
