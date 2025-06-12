"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Switch } from "@/components/ui/switch"

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <Switch disabled />
  }

  const isDark = theme === "dark"

  const handleToggle = (checked: boolean) => {
    setTheme(checked ? "dark" : "light")
  }

  return (
    <Switch
      checked={isDark}
      onCheckedChange={handleToggle}
      aria-label="Toggle dark mode"
      className="data-[state=checked]:bg-blue-600"
    />
  )
}
