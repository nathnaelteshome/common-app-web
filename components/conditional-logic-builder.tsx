"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, Save } from "lucide-react"
import { toast } from "sonner"

interface ConditionalRule {
  id: string
  targetField: string
  action: "show" | "hide" | "require"
  conditions: Array<{
    field: string
    operator: "equals" | "not_equals" | "contains" | "greater_than" | "less_than"
    value: string
  }>
  logic: "and" | "or"
}

interface ConditionalLogicBuilderProps {
  fields: any[]
  onClose: () => void
  onUpdate: (fields: any[]) => void
}

export function ConditionalLogicBuilder({ fields, onClose, onUpdate }: ConditionalLogicBuilderProps) {
  const [rules, setRules] = useState<ConditionalRule[]>([])

  const addRule = () => {
    const newRule: ConditionalRule = {
      id: `rule_${Date.now()}`,
      targetField: "",
      action: "show",
      conditions: [{ field: "", operator: "equals", value: "" }],
      logic: "and",
    }
    setRules([...rules, newRule])
  }

  const updateRule = (ruleId: string, updates: Partial<ConditionalRule>) => {
    setRules(rules.map((rule) => (rule.id === ruleId ? { ...rule, ...updates } : rule)))
  }

  const removeRule = (ruleId: string) => {
    setRules(rules.filter((rule) => rule.id !== ruleId))
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

  const saveRules = () => {
    // Apply rules to fields
    const updatedFields = fields.map((field) => {
      const fieldRules = rules.filter((rule) => rule.targetField === field.id)
      if (fieldRules.length > 0) {
        return {
          ...field,
          conditionalLogic: fieldRules.map((rule) => ({
            action: rule.action,
            conditions: rule.conditions,
            logic: rule.logic,
          })),
        }
      }
      return field
    })

    onUpdate(updatedFields)
    toast.success("Conditional logic saved successfully")
    onClose()
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Conditional Logic Builder</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">Create rules to show, hide, or require fields based on user input</p>
            <Button onClick={addRule} className="bg-[#0a5eb2] hover:bg-[#0a5eb2]/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Rule
            </Button>
          </div>

          {rules.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-gray-500 mb-4">No conditional rules created yet</p>
                <Button onClick={addRule} variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Rule
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {rules.map((rule, ruleIndex) => (
                <Card key={rule.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Rule {ruleIndex + 1}</CardTitle>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeRule(rule.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Rule Action */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Action</Label>
                        <Select
                          value={rule.action}
                          onValueChange={(value: any) => updateRule(rule.id, { action: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="show">Show field</SelectItem>
                            <SelectItem value="hide">Hide field</SelectItem>
                            <SelectItem value="require">Make required</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Target Field</Label>
                        <Select
                          value={rule.targetField}
                          onValueChange={(value) => updateRule(rule.id, { targetField: value })}
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
                            value={rule.logic}
                            onValueChange={(value: any) => updateRule(rule.id, { logic: value })}
                          >
                            <SelectTrigger className="w-20">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="and">AND</SelectItem>
                              <SelectItem value="or">OR</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button variant="outline" size="sm" onClick={() => addCondition(rule.id)}>
                            <Plus className="w-4 h-4 mr-1" />
                            Add Condition
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {rule.conditions.map((condition, conditionIndex) => (
                          <div key={conditionIndex} className="grid grid-cols-4 gap-2 items-end">
                            <div>
                              <Label className="text-xs">Field</Label>
                              <Select
                                value={condition.field}
                                onValueChange={(value) => updateCondition(rule.id, conditionIndex, { field: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select field" />
                                </SelectTrigger>
                                <SelectContent>
                                  {fields
                                    .filter((f) => f.id !== rule.targetField)
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
                                onValueChange={(value) => updateCondition(rule.id, conditionIndex, { operator: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="equals">Equals</SelectItem>
                                  <SelectItem value="not_equals">Not equals</SelectItem>
                                  <SelectItem value="contains">Contains</SelectItem>
                                  <SelectItem value="greater_than">Greater than</SelectItem>
                                  <SelectItem value="less_than">Less than</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label className="text-xs">Value</Label>
                              <Input
                                value={condition.value}
                                onChange={(e) => updateCondition(rule.id, conditionIndex, { value: e.target.value })}
                                placeholder="Enter value"
                              />
                            </div>
                            <div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeCondition(rule.id, conditionIndex)}
                                disabled={rule.conditions.length === 1}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={saveRules} className="bg-[#0a5eb2] hover:bg-[#0a5eb2]/90">
              <Save className="w-4 h-4 mr-2" />
              Save Rules
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
