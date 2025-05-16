import type { BlogPost } from "./types"

// This function simulates fetching blog posts from an API
// In a real application, you would replace this with actual API calls
export async function getBlogPosts(): Promise<BlogPost[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return [
    {
      id: "1",
      title: "velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat",
      excerpt: "velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      image: "/assets/blog-page/aau.png",
      date: "14 June 2023",
      comments: 6,
      slug: "velit-esse-cillum-dolore-1",
    },
    {
      id: "2",
      title: "velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat",
      excerpt: "velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      image: "/assets/blog-page/students.png",
      date: "21 April 2024",
      comments: 6,
      slug: "velit-esse-cillum-dolore-2",
    },
    {
      id: "3",
      title: "velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat",
      excerpt: "velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      image: "/assets/blog-page/graduates.png",
      date: "14 June 2023",
      comments: 6,
      slug: "velit-esse-cillum-dolore-3",
    },
    {
      id: "4",
      title: "velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat",
      excerpt: "velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      image: "/assets/blog-page/aau.png",
      date: "14 June 2023",
      comments: 6,
      slug: "velit-esse-cillum-dolore-4",
    },
    {
      id: "5",
      title: "velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat",
      excerpt: "velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      image: "/assets/blog-page/students.png",
      date: "21 April 2024",
      comments: 6,
      slug: "velit-esse-cillum-dolore-5",
    },
    {
      id: "6",
      title: "velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat",
      excerpt: "velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      image: "/assets/blog-page/graduates.png",
      date: "14 June 2023",
      comments: 6,
      slug: "velit-esse-cillum-dolore-6",
    },
  ]
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await getBlogPosts()
  return posts.find((post) => post.slug === slug) || null
}
