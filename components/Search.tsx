"use client";
import { universityData } from "@/public/data/data";
import Image from "next/image";

interface UniversitySearchProps {
  searchTerm: string;
}

export default function UniversitySearch({
  searchTerm,
}: UniversitySearchProps) {
  const filteredUniversities = Object.values(universityData).filter(
    (university) =>
      university.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-3/4 grid-cols-1 p-4 grid md:grid-cols-2 gap-4">
      {filteredUniversities.length > 0 ? (
        filteredUniversities.map((university, index) => (
          <div
            key={index}
            className=" relative p-4 max-h-[420px] border rounded-lg shadow-lg"
          >
            <Image
              width={300}
              height={200}
              src={university.image}
              alt={university.name}
              className="w-full  h-40 object-cover rounded-md mb-2"
            />
            <div className="absolute p-1 top-5 text-gray-200 left-5 bg-primary bg-opacity-80 rounded-md min-w-15">
              {" "}
              {university.location}
            </div>
            <h2 className="text-lg font-semibold">{university.name}</h2>
            <p className="text-gray-600">{university.location}</p>
            <p className="text-sm text-gray-500">{university.description}</p>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No universities found.</p>
      )}
    </div>
  );
}
