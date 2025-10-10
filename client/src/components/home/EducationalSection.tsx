import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const EducationalSection = () => {
  const topics = [
    {
      title: "Sexual Health Basics",
      icon: "📚",
      topics: [
        "Safe Sex Practices",
        "Consent & Communication",
        "Body Knowledge",
      ],
    },
    {
      title: "Reproductive Health",
      icon: "🌱",
      topics: ["Family Planning", "Pregnancy Care", "Fertility Awareness"],
    },
    {
      title: "Mental Health",
      icon: "🧠",
      topics: ["Relationship Support", "Self-esteem", "Anxiety & Depression"],
    },
  ];

  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-sm font-medium text-pamoja-purple uppercase tracking-wider mb-4 block">
              LEARN & GROW
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-pamoja-purple">
              Educational Resources in Your Language
            </h2>
            <p className="text-neutral-600 text-lg mb-8">
              Access reliable, easy-to-understand information about sexual and
              reproductive health in multiple local languages.
            </p>
            <Link
              to="/learn"
              className="inline-flex items-center gap-2 bg-pamoja-purple text-white px-8 py-4 hover:bg-pamoja-purple/90 transition-colors"
            >
              Explore Resources
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
          </div>

          <div className="grid grid-cols-1 gap-6">
            {topics.map((topic, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <span className="text-3xl"></span>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      {topic.title}
                    </h3>
                    <ul className="space-y-2">
                      {topic.topics.map((item, i) => (
                        <li
                          key={i}
                          className="text-neutral-600 flex items-center gap-2"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-pamoja-purple/60" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EducationalSection;
