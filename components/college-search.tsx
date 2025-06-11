import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MapPin, GraduationCap } from "lucide-react"

export function CollegeSearch() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input placeholder="Program Type" className="pl-10 border-gray-300 focus:border-primary" />
        </div>

        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input placeholder="Location" className="pl-10 border-gray-300 focus:border-primary" />
        </div>

        <div className="relative">
          <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input placeholder="College/University" className="pl-10 border-gray-300 focus:border-primary" />
        </div>

        <Button className="bg-primary hover:bg-primary/90 text-white">
          Search
          <Search className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
