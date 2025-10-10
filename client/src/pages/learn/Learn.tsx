import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Book,
  Heart,
  Shield,
  Users,
  Search,
  ChevronRight,
  ChevronDown,
  BookOpen,
  Video,
  FileText,
  ExternalLink,
  X,
  Clock,
} from "lucide-react";
import { useLearningMaterialStore } from "../../store/learningMaterial.store";
import { Button } from "../../components/ui/button";
import { CATEGORIES } from "./data";

const Learn = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<any>(null);
  const { materials, loading, error, fetchMaterials } =
    useLearningMaterialStore();

  useEffect(() => {
    fetchMaterials();
  }, [fetchMaterials]);

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "Heart":
        return <Heart size={24} />;
      case "Shield":
        return <Shield size={24} />;
      case "Users":
        return <Users size={24} />;
      case "Book":
        return <Book size={24} />;
      case "BookOpen":
        return <BookOpen size={24} />;
      default:
        return <Book size={24} />;
    }
  };

  const filteredMaterials = materials.filter(
    (material) =>
      material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const materialsByCategory = CATEGORIES.reduce((acc, category) => {
    acc[category.id] = filteredMaterials.filter(
      (material) => material.category === category.id
    );
    return acc;
  }, {} as Record<string, typeof materials>);

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-pamoja-purple p-8 text-white mb-8"
      >
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Learn About Sexual & Reproductive Health
          </h1>
          <p className="text-lg mb-6">
            Access reliable, accurate information about sexual and reproductive
            health. Our educational resources are designed to help you make
            informed decisions about your health.
          </p>
          <div className="relative">
            <input
              type="text"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 bg-white/10 text-white placeholder-white/60 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
            />
            <Search className="absolute right-3 top-2.5 text-white/60" />
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CATEGORIES.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            layout
            className="bg-white shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <motion.div
              className="p-6 cursor-pointer"
              onClick={() =>
                setExpandedCategory(
                  expandedCategory === category.id ? null : category.id
                )
              }
            >
              <motion.div
                layout
                className="flex items-center justify-between mb-4"
              >
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {category.label}
                  </h2>
                </div>
                <motion.div
                  animate={{
                    rotate: expandedCategory === category.id ? 180 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown size={20} />
                </motion.div>
              </motion.div>

              <motion.p layout className="text-gray-600 mb-4">
                {category.description}
              </motion.p>

              <AnimatePresence>
                {expandedCategory === category.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 space-y-3 overflow-hidden"
                  >
                    {materialsByCategory[category.id]?.map((material) => (
                      <motion.div
                        key={material._id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedMaterial(material);
                        }}
                      >
                        <div className="flex items-center gap-3">
                          {material.url?.includes("youtube") ||
                          material.url?.includes("vimeo") ? (
                            <Video size={18} className="text-pamoja-purple" />
                          ) : (
                            <FileText
                              size={18}
                              className="text-pamoja-purple"
                            />
                          )}
                          <div>
                            <h3 className="font-medium text-gray-800">
                              {material.title}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {material.readTime || "5 min read"}
                            </p>
                          </div>
                        </div>
                        <ChevronRight size={18} className="text-gray-400" />
                      </motion.div>
                    ))}
                    {materialsByCategory[category.id]?.length === 0 && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-gray-500 text-center py-2"
                      >
                        No materials available in this category yet.
                      </motion.p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Material Viewer Modal */}
      {selectedMaterial && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full h-full max-w-7xl max-h-[94vh] overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-xl font-semibold">
                {selectedMaterial.title}
              </h3>
              <div className="flex items-center gap-2">
                {selectedMaterial.url && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => window.open(selectedMaterial.url, "_blank")}
                  >
                    Open in new tab
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="border border-red-600"
                  onClick={() => setSelectedMaterial(null)}
                >
                  <X className="w-5 h-5 text-red-600" />
                </Button>
              </div>
            </div>
            <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* Description Section */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">{selectedMaterial.description}</p>
                <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>{selectedMaterial.readTime || "5 min read"}</span>
                </div>
              </div>

              {/* Content Section */}
              <div className="w-full rounded-lg overflow-hidden bg-gray-100">
                <iframe
                  src={selectedMaterial.url}
                  className="w-full min-h-[600px]"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading and Error States */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pamoja-purple"></div>
        </div>
      )}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mt-4">
          {error}
        </div>
      )}
    </div>
  );
};

export default Learn;
