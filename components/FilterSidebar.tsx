"use client";

import { FilteringData } from "@/public/data/data";

interface FilterSidebarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const FilterSidebar = ({ searchTerm, setSearchTerm }: FilterSidebarProps) => {
  return (
    <div className="w-1/4 p-4 border-r border-gray-300 h-full">
      <h3 className="text-lg font-semibold mb-2">Filters</h3>
      <input
        type="text"
        placeholder="Search universities..."
        className="w-full p-2 border border-gray-300 rounded-md mb-4"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div>
        {Object.entries(FilteringData).map(([key, values], index) => (
          <div key={index} className="mb-4">
            <h1 className="font-semibold mb-2">{key}</h1>
            {values.map((value, valueIndex) => (
              <label key={valueIndex} className="block mb-1">
                <input type="radio" name={key} value={value} className="mr-2" />
                <span className="text-sm text-gray-400">{value}</span>
              </label>
            ))}
          </div>
        ))}
        <h4 className="font-medium mb-1">Location</h4>
        <label className="block">
          <input type="checkbox" /> Addis Ababa
        </label>
        <label className="block">
          <input type="checkbox" /> Mekelle
        </label>
        <label className="block">
          <input type="checkbox" /> Bahir Dar
        </label>
      </div>
    </div>
  );
};

export default FilterSidebar;
