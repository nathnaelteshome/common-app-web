"use client"

import { Component, type ReactNode } from "react"
import { NotFoundBase } from "./not-found-base"
import { AlertTriangle, Home, RefreshCw } from "lucide-react"

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class NotFoundErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("404 Error Boundary caught an error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      const errorIllustration = (
        <div className="relative w-64 h-64 mx-auto mb-8">
          <div className="absolute inset-0 bg-gradient-to-br from-red-100 to-pink-100 rounded-full opacity-20" />
          <div className="absolute inset-8 bg-gradient-to-br from-red-200 to-pink-200 rounded-full opacity-30" />
          <div className="absolute inset-0 flex items-center justify-center">
            <AlertTriangle className="w-16 h-16 text-red-500" />
          </div>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="text-2xl font-bold text-gray-400">Error</div>
          </div>
        </div>
      )

      return (
        <NotFoundBase
          title="Something Went Wrong"
          description="An unexpected error occurred while loading this page. Please try refreshing or return to the homepage."
          illustration={errorIllustration}
          primaryAction={{
            label: "Go Home",
            href: "/",
            icon: <Home className="w-4 h-4" />,
          }}
          secondaryActions={[
            {
              label: "Refresh Page",
              href: window.location.href,
              icon: <RefreshCw className="w-4 h-4" />,
            },
          ]}
        />
      )
    }

    return this.props.children
  }
}
