import { motion } from "framer-motion";
import { MessageCircle, Shield, Phone } from "lucide-react";

const WHATSAPP_NUMBER = "250735497223";

const WhatsAppAccess = () => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="bg-[#08692b]  shadow-lg overflow-hidden text-white relative"
    >
      <div className="p-8">
        <div className="flex items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold">Pamoja AI on WhatsApp</h2>
            <p className="text-white/90">
              Get health answers privately from our AI Bot to your WhatsApp
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="text-center p-4 bg-white/10 backdrop-blur-sm">
            <MessageCircle className="mx-auto mb-2" size={24} />
            <p className="text-sm font-medium">Private Chat</p>
          </div>
          <div className="text-center p-4 bg-white/10 backdrop-blur-sm">
            <Shield className="mx-auto mb-2" size={24} />
            <p className="text-sm font-medium">Anonymous</p>
          </div>
          <div className="text-center p-4 bg-white/10 backdrop-blur-sm">
            <Phone className="mx-auto mb-2" size={24} />
            <p className="text-sm font-medium">24/7 Access</p>
          </div>
        </div>

        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-white text-[#25D366] text-center px-6 py-3 rounded-lg font-medium hover:bg-white/90 transition-colors"
        >
          Chat with Pamoja AI on WhatsApp
        </a>
      </div>
    </motion.div>
  );
};

export default WhatsAppAccess;
