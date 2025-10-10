import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "../../components/ui/button";

type Category =
  | "MATERNAL_HEALTH"
  | "SAFE_ABORTION"
  | "YOUTH_HEALTH"
  | "GBV_SUPPORT"
  | "CONTRACEPTION"
  | "SEXUAL_HEALTH"
  | "REPRODUCTIVE_HEALTH"
  | "MENTAL_HEALTH"
  | "RELATIONSHIPS";

type Icon = "Heart" | "Shield" | "Users" | "Book" | "BookOpen";

interface LearningMaterial {
  title: string;
  description: string;
  category: Category;
  icon: Icon;
  featured: boolean;
  url?: string;
  readTime?: string;
  status: "DRAFT" | "PUBLISHED";
}

interface LearningMaterialFormProps {
  onSubmit: (data: LearningMaterial) => Promise<void>;
  initialData?: Partial<LearningMaterial>;
  onCancel: () => void;
}

const categories = [
  { value: "MATERNAL_HEALTH", label: "Maternal Health" },
  { value: "SAFE_ABORTION", label: "Safe Abortion" },
  { value: "YOUTH_HEALTH", label: "Youth Health" },
  { value: "GBV_SUPPORT", label: "GBV Support" },
  { value: "CONTRACEPTION", label: "Contraception" },
  { value: "SEXUAL_HEALTH", label: "Sexual Health" },
  { value: "REPRODUCTIVE_HEALTH", label: "Reproductive Health" },
  { value: "MENTAL_HEALTH", label: "Mental Health" },
  { value: "RELATIONSHIPS", label: "Relationships" },
];

const icons = [
  { value: "Heart", label: "Heart" },
  { value: "Shield", label: "Shield" },
  { value: "Users", label: "Users" },
  { value: "Book", label: "Book" },
  { value: "BookOpen", label: "Book Open" },
];

const LearningMaterialForm: React.FC<LearningMaterialFormProps> = ({
  onSubmit,
  initialData,
  onCancel,
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<LearningMaterial>({
    title: initialData?.title || "",
    description: initialData?.description || "",
    category: initialData?.category || "SEXUAL_HEALTH",
    icon: initialData?.icon || "Book",
    featured: initialData?.featured || false,
    url: initialData?.url || "",
    readTime: initialData?.readTime || "5 min",
    status: initialData?.status || "DRAFT",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof LearningMaterial, string>>
  >({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof LearningMaterial, string>> = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";

    if (!formData.description.trim())
      newErrors.description = "Description is required";

    if (!formData.url?.trim()) newErrors.url = "URL is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-pamoja-purple focus:outline-none focus:ring-1 focus:ring-pamoja-purple"
            required
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-500">{errors.title}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={4}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-pamoja-purple focus:outline-none focus:ring-1 focus:ring-pamoja-purple"
            required
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-500">{errors.description}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  category: e.target.value as Category,
                })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-pamoja-purple focus:outline-none focus:ring-1 focus:ring-pamoja-purple"
              required
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Icon <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.icon}
              onChange={(e) =>
                setFormData({ ...formData, icon: e.target.value as Icon })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-pamoja-purple focus:outline-none focus:ring-1 focus:ring-pamoja-purple"
              required
            >
              {icons.map((icon) => (
                <option key={icon.value} value={icon.value}>
                  {icon.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            URL <span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-pamoja-purple focus:outline-none focus:ring-1 focus:ring-pamoja-purple"
            required
          />
          {errors.url && (
            <p className="mt-1 text-sm text-red-500">{errors.url}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Read Time
          </label>
          <input
            type="text"
            value={formData.readTime}
            onChange={(e) =>
              setFormData({ ...formData, readTime: e.target.value })
            }
            placeholder="5 min"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-pamoja-purple focus:outline-none focus:ring-1 focus:ring-pamoja-purple"
          />
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) =>
                setFormData({ ...formData, featured: e.target.checked })
              }
              className="h-4 w-4 rounded border-gray-300 text-pamoja-purple focus:ring-pamoja-purple"
            />
            <label
              htmlFor="featured"
              className="ml-2 text-sm font-medium text-gray-700"
            >
              Featured
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as "DRAFT" | "PUBLISHED",
                })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-pamoja-purple focus:outline-none focus:ring-1 focus:ring-pamoja-purple"
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          onClick={onCancel}
          className="bg-gray-100 hover:bg-gray-200 text-gray-800"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-pamoja-purple hover:bg-pamoja-purple/90 text-white"
          disabled={loading}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          {initialData ? "Update" : "Create"} Material
        </Button>
      </div>
    </form>
  );
};

export default LearningMaterialForm;
