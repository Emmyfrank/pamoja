import { motion } from "framer-motion";

export const HowItWorksSection = () => {
  const steps = [
    {
      number: "01",
      title: "Find Services",
      description: "Locate trusted healthcare providers and clinics near you",
    },
    {
      number: "02",
      title: "Get Answers",
      description: "Ask questions privately through our anonymous chatbot",
    },
    {
      number: "03",
      title: "Learn More",
      description: "Access reliable health information in your language",
    },
  ];

  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-pamoja-purple text-center mb-16">
          How Pamoja Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              className="relative"
            >
              <span className="text-8xl font-bold text-pamoja-purple/10 absolute -top-6 -left-4">
                {step.number}
              </span>
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-4">{step.title}</h3>
                <p className="text-neutral-600">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
