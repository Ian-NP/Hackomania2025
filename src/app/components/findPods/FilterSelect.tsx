// components/FilterSelect.tsx
const FilterSelect = ({ options, label }: { options: string[]; label: string }) => {
    return (
      <select className="px-4 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
        {options.map((option, idx) => (
          <option key={idx}>{option}</option>
        ))}
      </select>
    );
  };
  
  export default FilterSelect;
  