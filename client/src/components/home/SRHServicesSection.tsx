import { motion } from "framer-motion";

const SRHServicesSection = () => {
  const services = [
    {
      icon: "🤰",
      title: "Maternal Health",
      description:
        "Comprehensive care throughout pregnancy, childbirth, and postpartum period. Access prenatal services and support.",
      color: "from-[#EABDE6] to-[#FFDFEF]",
    },
    {
      icon: "🏥",
      title: "Safe Abortion Care",
      description:
        "Access safe, confidential abortion services and post-abortion care with professional support.",
      color: "from-[#AA60C8] to-[#D69ADE]",
    },
    {
      icon: "👥",
      title: "Youth Services",
      description:
        "Youth-friendly healthcare services and counseling designed specifically for ages 10-24.",
      color: "from-[#D69ADE] to-[#EABDE6]",
    },
    {
      icon: "🛡️",
      title: "GBV Support",
      description:
        "Support services and resources for preventing and responding to gender-based violence.",
      color: "from-[#FFDFEF] to-[#EABDE6]",
    },
  ];

  return (
    <section className="py-24 relative">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(17, 63, 103, 0.7), rgba(52, 105, 154, 0.4)), url('https://images.unsplash.com/photo-1632053649882-c21e377176a8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHdvbWVuJTIwY29udHJhY2VwdGlvbnxlbnwwfHwwfHx8MA%3D%3D')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          filter: "blur(1px)",
        }}
      />
      <div className="container mx-auto px-6 text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 1 }}
          whileHover={{ y: -5 }}
          className="relative group text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-2xl font-black text-purple-700 uppercase tracking-wider mb-4 block">
            OUR SERVICES
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Essential Sexual & Reproductive Health Services
          </h2>
          <p className="text-white/60">
            Access comprehensive SRH services through our trusted network of
            healthcare providers
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="relative group grid"
            >
              {/* <div
                className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-10 group-hover:opacity-20 transition-opacity`}
              /> */}
              <div className="relative p-8 bg-white text-black border border-neutral-100">
                <span className="text-4xl mb-6 block">{service.icon}</span>
                <h3 className="text-xl font-semibold text-pamoja-purple mb-3">
                  {service.title}
                </h3>
                <p className="">{service.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SRHServicesSection;
