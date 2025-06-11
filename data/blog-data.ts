export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  image: string
  date: string
  author: string
  category: string
  tags: string[]
  commentCount: number
  readTime: number
  featured: boolean
}

export interface BlogCategory {
  id: string
  name: string
  slug: string
  count: number
}

export const blogCategories: BlogCategory[] = [
  {
    id: "1",
    name: "Education Announcements",
    slug: "education-announcements",
    count: 12,
  },
  {
    id: "2",
    name: "Science Fair",
    slug: "science-fair",
    count: 8,
  },
  {
    id: "3",
    name: "Technology News",
    slug: "technology-news",
    count: 15,
  },
  {
    id: "4",
    name: "Scholarship Opportunities",
    slug: "scholarship-opportunities",
    count: 20,
  },
  {
    id: "5",
    name: "University News",
    slug: "university-news",
    count: 25,
  },
]

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "university-entrance-requirements-2024",
    title: "velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat aute irure dolor in reprehenderit.

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat aute irure dolor in reprehenderit.

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat aute irure dolor in reprehenderit.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.`,
    image: "/placeholder.svg?height=400&width=600&query=historic university entrance gate with stone architecture",
    date: "14 June 2023",
    author: "CommonApply Team",
    category: "University News",
    tags: ["university", "admissions", "requirements"],
    commentCount: 6,
    readTime: 5,
    featured: true,
  },
  {
    id: "2",
    slug: "graduation-ceremony-highlights",
    title: "velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat",
    excerpt: "Celebrating our graduates and their achievements in this memorable ceremony.",
    content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.`,
    image: "/placeholder.svg?height=400&width=600&query=graduation ceremony with students in caps and gowns",
    date: "21 April 2024",
    author: "Events Team",
    category: "Education Announcements",
    tags: ["graduation", "ceremony", "students"],
    commentCount: 6,
    readTime: 3,
    featured: true,
  },
  {
    id: "3",
    slug: "large-graduation-celebration",
    title: "velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat",
    excerpt: "A grand celebration of academic achievements with hundreds of graduates.",
    content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
    image: "/placeholder.svg?height=400&width=600&query=large graduation ceremony with many students",
    date: "14 June 2023",
    author: "Academic Affairs",
    category: "University News",
    tags: ["graduation", "celebration", "academic"],
    commentCount: 6,
    readTime: 4,
    featured: true,
  },
  {
    id: "4",
    slug: "scholarship-opportunities-2024",
    title: "New Scholarship Programs Available for 2024",
    excerpt: "Discover the latest scholarship opportunities for undergraduate and graduate students.",
    content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
    image: "/placeholder.svg?height=400&width=600&query=students studying with books and laptops",
    date: "10 March 2024",
    author: "Financial Aid Office",
    category: "Scholarship Opportunities",
    tags: ["scholarship", "financial aid", "students"],
    commentCount: 12,
    readTime: 6,
    featured: false,
  },
  {
    id: "5",
    slug: "technology-innovation-fair",
    title: "Annual Technology Innovation Fair 2024",
    excerpt: "Students showcase their innovative projects and technological solutions.",
    content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
    image: "/placeholder.svg?height=400&width=600&query=technology fair with student projects and displays",
    date: "5 February 2024",
    author: "Technology Department",
    category: "Technology News",
    tags: ["technology", "innovation", "fair"],
    commentCount: 8,
    readTime: 4,
    featured: false,
  },
  {
    id: "6",
    slug: "science-research-symposium",
    title: "International Science Research Symposium",
    excerpt: "Join us for presentations of cutting-edge research from students and faculty.",
    content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
    image: "/placeholder.svg?height=400&width=600&query=science laboratory with research equipment",
    date: "28 January 2024",
    author: "Research Department",
    category: "Science Fair",
    tags: ["science", "research", "symposium"],
    commentCount: 15,
    readTime: 7,
    featured: false,
  },
]

export function getBlogPosts(): BlogPost[] {
  return blogPosts
}

export function getFeaturedPosts(): BlogPost[] {
  return blogPosts.filter((post) => post.featured)
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug)
}

export function getRelatedPosts(currentPostId: string, category: string, limit = 3): BlogPost[] {
  return blogPosts.filter((post) => post.id !== currentPostId && post.category === category).slice(0, limit)
}

export function getBlogPostsByCategory(category: string): BlogPost[] {
  return blogPosts.filter((post) => post.category === category)
}

export function searchBlogPosts(query: string): BlogPost[] {
  const lowercaseQuery = query.toLowerCase()
  return blogPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(lowercaseQuery) ||
      post.excerpt.toLowerCase().includes(lowercaseQuery) ||
      post.content.toLowerCase().includes(lowercaseQuery) ||
      post.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)),
  )
}
