import { create } from "zustand";
import api from "../utils/axios";

interface LearningMaterial {
  _id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  featured: boolean;
  url?: string;
  readTime?: string;
  status: "DRAFT" | "PUBLISHED";
  author: string;
}

interface LearningMaterialState {
  materials: LearningMaterial[];
  loading: boolean;
  error: string | null;

  fetchMaterials: () => Promise<void>;
  createMaterial: (data: Partial<LearningMaterial>) => Promise<void>;
  updateMaterial: (
    id: string,
    data: Partial<LearningMaterial>
  ) => Promise<void>;
  deleteMaterial: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useLearningMaterialStore = create<LearningMaterialState>(
  (set) => ({
    materials: [],
    loading: false,
    error: null,

    fetchMaterials: async () => {
      try {
        set({ loading: true, error: null });
        const response = await api.get("/api/v1/learning-materials");
        set({ materials: response.data.data, loading: false });
      } catch (error: any) {
        set({
          error: error.response?.data?.message || "Failed to fetch materials",
          loading: false,
        });
      }
    },

    createMaterial: async (data) => {
      try {
        set({ loading: true, error: null });
        console.log(data, "----------- data to create new learning material");

        const response = await api.post("/api/v1/learning-materials", data);
        set((state) => ({
          materials: [...state.materials, response.data.data],
          loading: false,
        }));
      } catch (error: any) {
        set({
          error: error.response?.data?.message || "Failed to create material",
          loading: false,
        });
        throw error;
      }
    },

    updateMaterial: async (id, data) => {
      try {
        set({ loading: true, error: null });
        const response = await api.patch(
          `/api/v1/learning-materials/${id}`,
          data
        );
        set((state) => ({
          materials: state.materials.map((material) =>
            material._id === id ? response.data.data : material
          ),
          loading: false,
        }));
      } catch (error: any) {
        set({
          error: error.response?.data?.message || "Failed to update material",
          loading: false,
        });
        throw error;
      }
    },

    deleteMaterial: async (id) => {
      try {
        set({ loading: true, error: null });
        await api.delete(`/api/v1/learning-materials/${id}`);
        set((state) => ({
          materials: state.materials.filter((material) => material._id !== id),
          loading: false,
        }));
      } catch (error: any) {
        set({
          error: error.response?.data?.message || "Failed to delete material",
          loading: false,
        });
        throw error;
      }
    },

    clearError: () => set({ error: null }),
  })
);
