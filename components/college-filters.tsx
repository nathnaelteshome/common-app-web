"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function CollegeFilters() {
  const [selectedRanking, setSelectedRanking] = useState("advanced")
  const [selectedPrograms, setSelectedPrograms] = useState(["marketing"])
  const [selectedLocations, setSelectedLocations] = useState(["addis-ababa"])
  const [selectedSize, setSelectedSize] = useState("large")
  const [selectedType, setSelectedType] = useState("extension")

  return (
    <div className="space-y-6">
      {/* Ranking */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">Ranking</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedRanking} onValueChange={setSelectedRanking}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="beginner" id="beginner" />
              <Label htmlFor="beginner" className="text-gray-600">
                Beginner
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="intermediate" id="intermediate" />
              <Label htmlFor="intermediate" className="text-gray-600">
                Intermediate
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="advanced" id="advanced" />
              <Label htmlFor="advanced" className="text-gray-600">
                Advanced
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Programs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">Programs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox id="software-dev" />
            <Label htmlFor="software-dev" className="text-gray-600">
              Software Development
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="ui-ux" />
            <Label htmlFor="ui-ux" className="text-gray-600">
              UI/UX Designer
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="product-design" />
            <Label htmlFor="product-design" className="text-gray-600">
              Product Designer
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="marketing" defaultChecked />
            <Label htmlFor="marketing" className="text-gray-600">
              Marketing Officer
            </Label>
          </div>
          <Button variant="link" className="p-0 h-auto text-primary">
            Show More
          </Button>
        </CardContent>
      </Card>

      {/* Location */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">Location</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedLocations[0]} onValueChange={(value) => setSelectedLocations([value])}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="addis-ababa" id="addis-ababa" />
              <Label htmlFor="addis-ababa" className="text-gray-600">
                Addis Ababa
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="asmara" id="asmara" />
              <Label htmlFor="asmara" className="text-gray-600">
                Asmara
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="aksum" id="aksum" />
              <Label htmlFor="aksum" className="text-gray-600">
                Aksum
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="harar" id="harar" />
              <Label htmlFor="harar" className="text-gray-600">
                Harar
              </Label>
            </div>
          </RadioGroup>
          <Button variant="link" className="p-0 h-auto text-primary mt-2">
            Show More
          </Button>
        </CardContent>
      </Card>

      {/* Total Enrollment Size */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">Total Enrollment Size</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedSize} onValueChange={setSelectedSize}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="small" id="small" />
              <Label htmlFor="small" className="text-gray-600">
                Small (under 5000)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="medium" id="medium" />
              <Label htmlFor="medium" className="text-gray-600">
                Medium (5000 - 15,000)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="large" id="large" />
              <Label htmlFor="large" className="text-gray-600">
                Large (15,000+)
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Type */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">Type</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedType} onValueChange={setSelectedType}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="regular" id="regular" />
              <Label htmlFor="regular" className="text-gray-600">
                Regular Program
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="extension" id="extension" />
              <Label htmlFor="extension" className="text-gray-600">
                Extension Program
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="distance" id="distance" />
              <Label htmlFor="distance" className="text-gray-600">
                Distance Program
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* For transfer students */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">For transfer students</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup defaultValue="no-test">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no-test" id="no-test" />
              <Label htmlFor="no-test" className="text-gray-600">
                No test required
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no-application" id="no-application" />
              <Label htmlFor="no-application" className="text-gray-600">
                No application fee
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>
    </div>
  )
}
