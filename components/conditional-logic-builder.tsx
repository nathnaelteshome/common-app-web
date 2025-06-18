"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Save, Zap, Eye, TestTube } from "lucide-react"
import { toast } from "sonner"

interface ConditionalRule {
  id: string
  name: string
  targetField: string
  action: "show" | "hide" | "require" | "disable" | "set_value"
  conditions: Array<{
    field: string
    operator:
      | "equals"
      | "not_equals"
      | "contains"
      | "not_contains"
      | "greater_than"
      | "less_than"
      | "is_empty"
      | "is_not_empty"
    value: string
  }>
  logic: "and" | "or"
  priority: number
  isActive: boolean
}

interface ConditionalLogicBuilderProps {
  fields: any[]
  onClose: () => void
  onUpdate: (fields: any[]) => void
  existingRules?: ConditionalRule[]
}

export function ConditionalLogicBuilder({
  fields,
  onClose,
  onUpdate,
  existingRules = [],
}: ConditionalLogicBuilderProps) {
  const [rules, setRules] = useState<ConditionalRule[]>(existingRules)
  const [selectedRule, setSelectedRule] = useState<string | null>(null)
  const [testMode, setTestMode] = useState(false)
  const [testValues, setTestValues] = useState<Record<string, any>>({})

  const addRule = () => {
    const newRule: ConditionalRule = {
      id: `rule_${Date.now()}`,
      name: `Rule ${rules.length + 1}`,
      targetField: "",
      action: "show",
      conditions: [{ field: "", operator: "equals", value: "" }],
      logic: "and",
      priority: rules.length + 1,
      isActive: true,
    }
    setRules([...rules, newRule])
    setSelectedRule(newRule.id)
  }

  const updateRule = (ruleId: string, updates: Partial<ConditionalRule>) => {
    setRules(rules.map((rule) => (rule.id === ruleId ? { ...rule, ...updates } : rule)))
  }

  const removeRule = (ruleId: string) => {
    setRules(rules.filter((rule) => rule.id !== ruleId))
    if (selectedRule === ruleId) {
      setSelectedRule(null)
    }
  }

  const duplicateRule = (ruleId: string) => {
    const rule = rules.find((r) => r.id === ruleId)
    if (rule) {
      const newRule = {
        ...rule,
        id: `rule_${Date.now()}`,
        name: `${rule.name} (Copy)`,
        priority: rules.length + 1,
      }
      setRules([...rules, newRule])
    }
  }

  const addCondition = (ruleId: string) => {
    const rule = rules.find((r) => r.id === ruleId)
    if (rule) {
      const newConditions = [...rule.conditions, { field: "", operator: "equals" as const, value: "" }]
      updateRule(ruleId, { conditions: newConditions })
    }
  }

  const updateCondition = (ruleId: string, conditionIndex: number, updates: any) => {
    const rule = rules.find((r) => r.id === ruleId)
    if (rule) {
      const newConditions = [...rule.conditions]
      newConditions[conditionIndex] = { ...newConditions[conditionIndex], ...updates }
      updateRule(ruleId, { conditions: newConditions })
    }
  }

  const removeCondition = (ruleId: string, conditionIndex: number) => {
    const rule = rules.find((r) => r.id === ruleId)
    if (rule && rule.conditions.length > 1) {
      const newConditions = rule.conditions.filter((_, index) => index !== conditionIndex)
      updateRule(ruleId, { conditions: newConditions })
    }
  }

  const testRule = (rule: ConditionalRule): boolean => {
    if (!rule.isActive) return false

    const results = rule.conditions.map((condition) => {
      const fieldValue = testValues[condition.field]
      const conditionValue = condition.value

      switch (condition.operator) {
        case "equals":
          return fieldValue === conditionValue
        case "not_equals":
          return fieldValue !== conditionValue
        case "contains":
          return String(fieldValue).toLowerCase().includes(String(conditionValue).toLowerCase())
        case "not_contains":
          return !String(fieldValue).toLowerCase().includes(String(conditionValue).toLowerCase())
        case "greater_than":
          return Number(fieldValue) > Number(conditionValue)
        case "less_than":
          return Number(fieldValue) < Number(conditionValue)
        case "is_empty":
          return !fieldValue || fieldValue === ""
        case "is_not_empty":
          return fieldValue && fieldValue !== ""
        default:
          return false
      }
    })

    return rule.logic === "and" ? results.every(Boolean) : results.some(Boolean)
  }

  const validateRules = (): string[] => {
    const errors: string[] = []

    rules.forEach((rule, index) => {
      if (!rule.name.trim()) {
        errors.push(`Rule ${index + 1}: Name is required`)
      }
      if (!rule.targetField) {
        errors.push(`Rule ${index + 1}: Target field is required`)
      }
      if (rule.conditions.some((c) => !c.field || !c.value)) {
        errors.push(`Rule ${index + 1}: All conditions must be complete`)
      }
    })

    return errors
  }

  const saveRules = () => {
    const errors = validateRules()
    if (errors.length > 0) {
      toast.error(`Please fix the following errors:\n${errors.join("\n")}`)
      return
    }

    // Apply rules to fields
    const updatedFields = fields.map((field) => {
      const fieldRules = rules.filter((rule) => rule.targetField === field.id && rule.isActive)
      if (fieldRules.length > 0) {
        return {
          ...field,
          conditionalLogic: fieldRules.map((rule) => ({
            id: rule.id,
            name: rule.name,
            action: rule.action,
            conditions: rule.conditions,
            logic: rule.logic,
            priority: rule.priority,
          })),
        }
      }
      return field
    })

    onUpdate(updatedFields)
    toast.success("Conditional logic saved successfully")
    onClose()
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case "show":
        return "bg-green-100 text-green-800"
      case "hide":
        return "bg-red-100 text-red-800"
      case "require":
        return "bg-orange-100 text-orange-800"
      case "disable":
        return "bg-gray-100 text-gray-800"
      case "set_value":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const selectedRuleData = rules.find((r) => r.id === selectedRule)

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Conditional Logic Builder
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[70vh]">
          {/* Rules List */}
          <div className="space-y-4 overflow-y-auto">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Rules ({rules.length})</h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setTestMode(!testMode)}
                  className={testMode ? "bg-blue-100" : ""}
                >
                  <TestTube className="w-4 h-4 mr-1" />
                  Test
                </Button>
                <Button onClick={addRule} size="sm" className="bg-[#0a5eb2] hover:bg-[#0a5eb2]/90">
                  <Plus className="w-4 h-4 mr-1" />
                  Add Rule
                </Button>
              </div>
            </div>

            {rules.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <Zap className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 mb-4">No conditional rules created yet</p>
                  <Button onClick={addRule} variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Rule
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {rules.map((rule) => (
                  <Card
                    key={rule.id}
                    className={`cursor-pointer transition-all ${
                      selectedRule === rule.id ? "ring-2 ring-[#0a5eb2]" : ""
                    } ${!rule.isActive ? "opacity-50" : ""}`}
                    onClick={() => setSelectedRule(rule.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{rule.name}</h4>
                          <p className="text-xs text-gray-500">
                            {rule.conditions.length} condition{rule.conditions.length !== 1 ? "s" : ""}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Badge className={`${getActionColor(rule.action)} text-xs`}>{rule.action}</Badge>
                          {testMode && (
                            <Badge variant={testRule(rule) ? "default" : "outline"} className="text-xs">
                              {testRule(rule) ? "✓" : "✗"}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          Target: {fields.find((f) => f.id === rule.targetField)?.label || "None"}
                        </span>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              duplicateRule(rule.id)
                            }}
                            className="h-6 w-6 p-0"
                          >
                            📋
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              removeRule(rule.id)
                            }}
                            className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Rule Editor */}
          <div className="lg:col-span-2 overflow-y-auto">
            {selectedRuleData ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Edit Rule: {selectedRuleData.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="ruleActive" className="text-sm">
                        Active
                      </Label>
                      <input
                        type="checkbox"
                        id="ruleActive"
                        checked={selectedRuleData.isActive}
                        onChange={(e) => updateRule(selectedRule!, { isActive: e.target.checked })}
                        className="rounded"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Rule Basic Settings */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Rule Name</Label>
                      <Input
                        value={selectedRuleData.name}
                        onChange={(e) => updateRule(selectedRule!, { name: e.target.value })}
                        placeholder="Enter rule name"
                      />
                    </div>
                    <div>
                      <Label>Priority</Label>
                      <Input
                        type="number"
                        min="1"
                        value={selectedRuleData.priority}
                        onChange={(e) => updateRule(selectedRule!, { priority: Number(e.target.value) })}
                      />
                    </div>
                  </div>

                  {/* Rule Action */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Action</Label>
                      <Select
                        value={selectedRuleData.action}
                        onValueChange={(value: any) => updateRule(selectedRule!, { action: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="show">Show field</SelectItem>
                          <SelectItem value="hide">Hide field</SelectItem>
                          <SelectItem value="require">Make required</SelectItem>
                          <SelectItem value="disable">Disable field</SelectItem>
                          <SelectItem value="set_value">Set field value</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Target Field</Label>
                      <Select
                        value={selectedRuleData.targetField}
                        onValueChange={(value) => updateRule(selectedRule!, { targetField: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select field" />
                        </SelectTrigger>
                        <SelectContent>
                          {fields.map((field) => (
                            <SelectItem key={field.id} value={field.id}>
                              {field.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Conditions */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Label>When these conditions are met:</Label>
                      <div className="flex items-center gap-2">
                        <Select
                          value={selectedRuleData.logic}
                          onValueChange={(value: any) => updateRule(selectedRule!, { logic: value })}
                        >
                          <SelectTrigger className="w-20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="and">AND</SelectItem>
                            <SelectItem value="or">OR</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button variant="outline" size="sm" onClick={() => addCondition(selectedRule!)}>
                          <Plus className="w-4 h-4 mr-1" />
                          Add Condition
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {selectedRuleData.conditions.map((condition, conditionIndex) => (
                        <div key={conditionIndex} className="grid grid-cols-4 gap-2 items-end p-3 border rounded-lg">
                          <div>
                            <Label className="text-xs">Field</Label>
                            <Select
                              value={condition.field}
                              onValueChange={(value) =>
                                updateCondition(selectedRule!, conditionIndex, { field: value })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select field" />
                              </SelectTrigger>
                              <SelectContent>
                                {fields
                                  .filter((f) => f.id !== selectedRuleData.targetField)
                                  .map((field) => (
                                    <SelectItem key={field.id} value={field.id}>
                                      {field.label}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label className="text-xs">Operator</Label>
                            <Select
                              value={condition.operator}
                              onValueChange={(value) =>
                                updateCondition(selectedRule!, conditionIndex, { operator: value })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="equals">Equals</SelectItem>
                                <SelectItem value="not_equals">Not equals</SelectItem>
                                <SelectItem value="contains">Contains</SelectItem>
                                <SelectItem value="not_contains">Not contains</SelectItem>
                                <SelectItem value="greater_than">Greater than</SelectItem>
                                <SelectItem value="less_than">Less than</SelectItem>
                                <SelectItem value="is_empty">Is empty</SelectItem>
                                <SelectItem value="is_not_empty">Is not empty</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label className="text-xs">Value</Label>
                            <Input
                              value={condition.value}
                              onChange={(e) =>
                                updateCondition(selectedRule!, conditionIndex, { value: e.target.value })
                              }
                              placeholder="Enter value"
                            />
                          </div>
                          <div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeCondition(selectedRule!, conditionIndex)}
                              disabled={selectedRuleData.conditions.length === 1}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Test Section */}
                  {testMode && (
                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-3">Test Rule</h4>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        {fields.map((field) => (
                          <div key={field.id}>
                            <Label className="text-xs">{field.label}</Label>
                            <Input
                              value={testValues[field.id] || ""}
                              onChange={(e) => setTestValues((prev) => ({ ...prev, [field.id]: e.target.value }))}
                              placeholder={`Test value for ${field.label}`}
                            />
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Result:</span>
                        <Badge variant={testRule(selectedRuleData) ? "default" : "outline"}>
                          {testRule(selectedRuleData) ? "Rule would trigger" : "Rule would not trigger"}
                        </Badge>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Rule to Edit</h3>
                  <p className="text-gray-600">Choose a rule from the list to view and edit its settings</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={saveRules} className="bg-[#0a5eb2] hover:bg-[#0a5eb2]/90">
            <Save className="w-4 h-4 mr-2" />
            Save Rules ({rules.filter((r) => r.isActive).length} active)
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
