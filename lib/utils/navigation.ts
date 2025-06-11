// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getRouteForRole(user: any, basePath: string): string {
  if (!user?.role) return `/student/${basePath}`;

  switch (user.role) {
    case "university":
      return `/admin/${basePath}`;
    case "admin":
      return `/system-admin/${basePath}`;
    case "student":
    default:
      return `/student/${basePath}`;
  }
}

export function getRoleDisplayName(role: string): string {
  switch (role) {
    case "university":
      return "University Admin";
    case "admin":
      return "System Admin";
    case "student":
      return "Student";
    default:
      return "User";
  }
}
