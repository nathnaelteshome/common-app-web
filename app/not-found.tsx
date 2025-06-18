import { NotFoundBase } from "@/components/not-found-base"
import { BookOpen, Users, GraduationCap } from "lucide-react"

export default function GlobalNotFound() {
  return (
    <NotFoundBase
      title="Oops! Page Not Found"
      description="The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL."
      showSearch={true}
      searchPlaceholder="Search universities, programs, or resources..."
      secondaryActions={[
        {
          label: "Browse Colleges",
          href: "/colleges",
          icon: <GraduationCap className="w-4 h-4" />,
        },
        {
          label: "Read Blog",
          href: "/blog",
          icon: <BookOpen className="w-4 h-4" />,
        },
        {
          label: "About Us",
          href: "/about",
          icon: <Users className="w-4 h-4" />,
        },
      ]}
    />
  )
}
