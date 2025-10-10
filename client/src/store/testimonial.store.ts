import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../utils/axios";

interface Testimonial {
  _id: string;
  rating: number;
  story: string;
  name?: string;
  location?: string;
  createdAt: string;
}

interface TestimonialState {
  testimonials: Testimonial[];
  isLoadingTestimonials: boolean;
  isAddingTestimonial: boolean;
  getTestimonials: () => Promise<void>;
  addTestimonial: (
    data: Omit<Testimonial, "_id" | "createdAt">
  ) => Promise<void>;
}

export const useTestimonialStore = create<TestimonialState>()(
  persist(
    (set, get) => ({
      testimonials: [],
      isLoadingTestimonials: true,
      isAddingTestimonial: false,
      getTestimonials: async () => {
        try {
          set({ isLoadingTestimonials: true });
          const res = await api.get("/api/v1/testimonials");
          set({ testimonials: res.data.data, isLoadingTestimonials: false });
        } catch (error) {
          set({ isLoadingTestimonials: false });
        }
      },

      addTestimonial: async (data) => {
        try {
          set({ isAddingTestimonial: true });
          await api.post("/api/v1/testimonials", data);
          await get().getTestimonials();
          set({ isAddingTestimonial: false });
        } catch (error) {
          set({ isAddingTestimonial: false });
          throw error;
        }
      },
    }),
    {
      name: "testimonial-storage",
    }
  )
);
