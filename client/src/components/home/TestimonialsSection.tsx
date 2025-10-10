import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Star, X } from "lucide-react";
import { useTestimonialStore } from "../../store/testimonial.store";

export const TestimonialsSection = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<number>(0);
  const { testimonials, getTestimonials, isLoadingTestimonials } =
    useTestimonialStore();

  useEffect(() => {
    getTestimonials();
  }, [getTestimonials]);

  const handleNext = () =>
    setSelectedTestimonial((prev) => (prev + 1) % testimonials.length);

  const handlePrev = () =>
    setSelectedTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );

  return (
    <section className="relative py-24 bg-purple-50/30 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center mb-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-center text-pamoja-purple mb-4 py-2"
          >
            Testimonials
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 text-center max-w-2xl mb-8"
          >
            {testimonials.length === 0
              ? "Be the first to share your experience with Pamoja"
              : "Join users who have found support and guidance through Pamoja, here is what our users said:"}
          </motion.p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-6 py-2 bg-pamoja-purple text-white rounded-full hover:bg-pamoja-purple/90 transition-colors"
          >
            <MessageCircle size={20} />
            Leave a testimony
          </motion.button>
        </div>

        {!isLoadingTestimonials && testimonials.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto text-center bg-white p-8 rounded-2xl shadow-sm"
          >
            <div className="mb-6">
              <Star className="w-16 h-16 text-yellow-400 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold mb-4">
              Be Our First Reviewer!
            </h3>
            <p className="text-gray-600 mb-6">
              Share your experience with Pamoja and help others understand how
              we're making a difference in sexual and reproductive health
              access.
            </p>
          </motion.div>
        ) : (
          testimonials.length > 0 && (
            <div className="relative max-w-4xl mx-auto">
              <div className="relative min-h-[200px] md:min-h-[300px] max-h-[500px] overflow-y-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedTestimonial}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="relative w-full"
                  >
                    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl">
                      <div className="flex gap-1 mb-6">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <motion.div
                            key={star}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: star * 0.1 }}
                          >
                            <Star
                              className={`w-5 h-5 ${
                                star <= testimonials[selectedTestimonial].rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "fill-gray-200 text-gray-200"
                              }`}
                            />
                          </motion.div>
                        ))}
                      </div>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed"
                      >
                        "{testimonials[selectedTestimonial].story}"
                      </motion.p>
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                          <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="font-semibold text-gray-900"
                          >
                            {testimonials[selectedTestimonial].name ||
                              "Anonymous User"}
                          </motion.p>
                          {testimonials[selectedTestimonial].location && (
                            <motion.p
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.5 }}
                              className="text-sm text-gray-500"
                            >
                              {testimonials[selectedTestimonial].location}
                            </motion.p>
                          )}
                        </div>
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.6 }}
                          className="text-sm text-gray-400"
                        >
                          {new Date(
                            testimonials[selectedTestimonial].createdAt
                          ).toLocaleDateString()}
                        </motion.p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="flex justify-center gap-4 mt-8">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handlePrev}
                  className="p-2 rounded-full bg-pamoja-purple text-white hover:bg-pamoja-purple/90 transition-colors"
                >
                  ←
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleNext}
                  className="p-2 rounded-full bg-pamoja-purple text-white hover:bg-pamoja-purple/90 transition-colors"
                >
                  →
                </motion.button>
              </div>
            </div>
          )
        )}
      </div>

      {/* Testimonial Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  Share Your Experience
                </h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <TestimonialForm onClose={() => setShowForm(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

const TestimonialForm = ({ onClose }: { onClose: () => void }) => {
  const [rating, setRating] = useState(5);
  const [story, setStory] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");
  const { addTestimonial, isAddingTestimonial } = useTestimonialStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await addTestimonial({
        rating,
        story,
        name: isAnonymous ? undefined : name,
        location: isAnonymous ? undefined : location,
      });
      onClose();
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
          "Failed to submit testimonial. Please try again."
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-400 rounded">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Rating
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="focus:outline-none"
              disabled={isAddingTestimonial}
            >
              <Star
                className={`w-8 h-8 ${
                  star <= rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-gray-200 text-gray-200"
                } ${isAddingTestimonial ? "opacity-50" : ""}`}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Story
        </label>
        <textarea
          required
          value={story}
          onChange={(e) => setStory(e.target.value)}
          rows={4}
          disabled={isAddingTestimonial}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pamoja-purple focus:border-transparent resize-none disabled:bg-gray-50 disabled:text-gray-500"
          placeholder="Share how Pamoja has helped you..."
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="anonymous"
          checked={isAnonymous}
          onChange={(e) => setIsAnonymous(e.target.checked)}
          disabled={isAddingTestimonial}
          className="rounded border-gray-300 text-pamoja-purple focus:ring-pamoja-purple disabled:opacity-50"
        />
        <label htmlFor="anonymous" className="text-sm text-gray-600">
          Stay anonymous
        </label>
      </div>

      {!isAnonymous && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isAddingTestimonial}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pamoja-purple focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              disabled={isAddingTestimonial}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pamoja-purple focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>
        </motion.div>
      )}

      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={onClose}
          disabled={isAddingTestimonial}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isAddingTestimonial}
          className="flex-1 px-4 py-2 bg-pamoja-purple text-white rounded-lg hover:bg-pamoja-purple/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isAddingTestimonial ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit"
          )}
        </button>
      </div>
    </form>
  );
};
