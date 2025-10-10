import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import LearningMaterialForm from "./LearningMaterialForm";
import { useLearningMaterialStore } from "../../store/learningMaterial.store";

const LearningMaterials = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<any>(null);
  const {
    materials,
    loading,
    error,
    fetchMaterials,
    createMaterial,
    updateMaterial,
    deleteMaterial,
  } = useLearningMaterialStore();

  useEffect(() => {
    fetchMaterials();
  }, [fetchMaterials]);

  const handleCreate = async (data: any) => {
    try {
      await createMaterial(data);
      setShowForm(false);
    } catch (err) {
      // Error is handled by the store
    }
  };

  const handleUpdate = async (data: any) => {
    if (!editingMaterial) return;
    try {
      await updateMaterial(editingMaterial._id, data);
      setEditingMaterial(null);
    } catch (err) {
      // Error is handled by the store
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this material?"))
      return;
    try {
      await deleteMaterial(id);
    } catch (err) {
      // Error is handled by the store
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (showForm || editingMaterial) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">
            {editingMaterial
              ? "Edit Learning Material"
              : "Create Learning Material"}
          </h2>
          <LearningMaterialForm
            onSubmit={editingMaterial ? handleUpdate : handleCreate}
            initialData={editingMaterial}
            onCancel={() => {
              setShowForm(false);
              setEditingMaterial(null);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Learning Materials</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Material
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="grid gap-6">
        {materials.map((material) => (
          <div
            key={material._id}
            className="bg-white rounded-lg shadow-sm p-6 space-y-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold">{material.title}</h3>
                <p className="text-gray-600 mt-1">{material.description}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setEditingMaterial(material)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDelete(material._id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-gray-100 rounded text-sm">
                {material.category}
              </span>
              <span
                className={`px-2 py-1 rounded text-sm ${
                  material.status === "PUBLISHED"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {material.status}
              </span>
              {material.featured && (
                <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-sm">
                  Featured
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearningMaterials;
