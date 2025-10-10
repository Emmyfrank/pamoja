import { Search } from "lucide-react";

interface SearchAndFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedTag: string | null;
  onTagSelect: (tag: string | null) => void;
  tags: string[];
}

export const SearchAndFilter = ({
  searchQuery,
  onSearchChange,
  selectedTag,
  onTagSelect,
  tags,
}: SearchAndFilterProps) => {
  return (
    <div className="mb-5 space-y-3">
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={18}
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search discussions..."
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-1 focus:ring-pamoja-purple focus:border-transparent"
        />
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 overflow-x-auto pb-1">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => onTagSelect(selectedTag === tag ? null : tag)}
              className={`px-3 py-1 rounded-full text-xs flex items-center gap-1 whitespace-nowrap ${
                selectedTag === tag
                  ? "bg-pamoja-purple text-white"
                  : "bg-pamoja-purple/10 text-pamoja-purple hover:bg-pamoja-purple/20"
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
