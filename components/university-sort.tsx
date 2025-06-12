"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowUpDown, TrendingUp, Users, Star } from "lucide-react"

interface UniversitySortProps {
  sortBy: string
  onSortChange: (sortBy: string) => void
}

export function UniversitySort({ sortBy, onSortChange }: UniversitySortProps) {
  const sortOptions = [
    { value: "applicants-desc", label: "Most Applicants", icon: TrendingUp },
    { value: "applicants-asc", label: "Least Applicants", icon: TrendingUp },
    { value: "rating-desc", label: "Highest Rated", icon: Star },
    { value: "rating-asc", label: "Lowest Rated", icon: Star },
    { value: "students-desc", label: "Most Students", icon: Users },
    { value: "students-asc", label: "Least Students", icon: Users },
    { value: "name-asc", label: "Name (A-Z)", icon: ArrowUpDown },
    { value: "name-desc", label: "Name (Z-A)", icon: ArrowUpDown },
  ]

  const currentOption = sortOptions.find((option) => option.value === sortBy)

  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown className="w-4 h-4 text-gray-500" />
      <span className="text-sm text-gray-600 hidden sm:inline">Sort by:</span>
      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue>
            <div className="flex items-center gap-2">
              {currentOption && <currentOption.icon className="w-4 h-4" />}
              <span className="hidden sm:inline">{currentOption?.label || "Select..."}</span>
              <span className="sm:hidden">{currentOption?.label.split(" ")[0] || "Sort"}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              <div className="flex items-center gap-2">
                <option.icon className="w-4 h-4" />
                {option.label}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
