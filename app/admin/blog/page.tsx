"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/auth-store"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Calendar,
  TrendingUp,
  Users,
  MessageSquare,
  Heart,
  BarChart3,
  FileText,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"
import { blogApi } from "@/lib/api/blog"
import { api } from "@/lib/api/client"
import type { BlogPost, BlogCategory } from "@/lib/api/types"
import { toast } from "sonner"

export default function AdminBlogPage() {
  const { user, isAuthenticated } = useAuthStore()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [blogStats, setBlogStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0,
    avgViewsPerPost: 0,
    avgLikesPerPost: 0
  })

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "university") {
      router.push("/auth/sign-in")
    } else {
      // Initialize API tokens from localStorage
      const tokens = api.getTokens()
      if (tokens.accessToken) {
        api.setTokens(tokens.accessToken, tokens.refreshToken || "")
      }
      fetchData()
    }
  }, [isAuthenticated, user, router])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      
      // Fetch blog posts (include all statuses for admin view)
      const postsResponse = await blogApi.listPosts({
        page: 1,
        limit: 50,
        sortBy: "created_at",
        sortOrder: "desc"
        // Don't filter by status - admin should see all posts (draft, published, archived)
      })

      // Fetch categories
      const categoriesResponse = await blogApi.listCategories()

      if (postsResponse.success && postsResponse.data) {
        setPosts(postsResponse.data.posts)
        
        // Calculate stats with safe handling of undefined values
        const totalPosts = postsResponse.data.posts.length
        const publishedPosts = postsResponse.data.posts.filter(p => p.status === "published").length
        const totalViews = postsResponse.data.posts.reduce((sum, p) => sum + (p.viewCount || 0), 0)
        const totalLikes = postsResponse.data.posts.reduce((sum, p) => sum + (p.likeCount || 0), 0)
        const totalComments = postsResponse.data.posts.reduce((sum, p) => sum + (p.commentCount || 0), 0)
        
        setBlogStats({
          totalPosts,
          publishedPosts,
          totalViews,
          totalLikes,
          totalComments,
          avgViewsPerPost: totalPosts > 0 ? Math.round(totalViews / totalPosts) : 0,
          avgLikesPerPost: totalPosts > 0 ? Math.round(totalLikes / totalPosts) : 0
        })
      }

      if (categoriesResponse.success && categoriesResponse.data) {
        setCategories(categoriesResponse.data.categories)
      }

    } catch (error) {
      console.error("Error fetching blog data:", error)
      toast.error("Failed to load blog data")
    } finally {
      setIsLoading(false)
    }
  }

  const filteredPosts = posts.filter((post) => {
    // Filter by search query
    if (searchQuery && !post.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    // Filter by category
    if (selectedCategory !== "all" && post.category.name !== selectedCategory) {
      return false
    }

    // Filter by status
    if (selectedStatus !== "all" && post.status !== selectedStatus) {
      return false
    }

    return true
  })

  const handleDeletePost = async (postId: string, postTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${postTitle}"? This action cannot be undone.`)) {
      return
    }

    try {
      const response = await blogApi.deletePost(postId)
      if (response.success) {
        toast.success("Post deleted successfully")
        // Remove the post from the local state
        setPosts(prev => prev.filter(p => p.id !== postId))
      } else {
        toast.error("Failed to delete post")
      }
    } catch (error) {
      console.error("Error deleting post:", error)
      toast.error("Failed to delete post")
    }
  }

  if (isLoading || !isAuthenticated || user?.role !== "university") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#0a5eb2]"></div>
      </div>
    )
  }


  const getStatusBadge = (status: BlogPost["status"]) => {
    const variants = {
      published: "default",
      draft: "secondary",
      scheduled: "outline",
      archived: "destructive",
    } as const

    const colors = {
      published: "bg-green-100 text-green-800",
      draft: "bg-gray-100 text-gray-800",
      scheduled: "bg-blue-100 text-blue-800",
      archived: "bg-red-100 text-red-800",
    }

    return <Badge className={colors[status]}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Blog Management</h1>
              <p className="text-gray-600">Create, manage, and publish blog posts for your university</p>
            </div>
            <Button className="bg-[#0a5eb2] hover:bg-[#0a5eb2]/90" asChild>
              <Link href="/admin/blog/create">
                <Plus className="w-4 h-4 mr-2" />
                Create New Post
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Posts</p>
                  <p className="text-3xl font-bold text-gray-900">{blogStats.totalPosts}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Published</p>
                  <p className="text-3xl font-bold text-green-600">{blogStats.publishedPosts}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Views</p>
                  <p className="text-3xl font-bold text-purple-600">{blogStats.totalViews.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Eye className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Engagement</p>
                  <p className="text-3xl font-bold text-orange-600">{blogStats.totalLikes + blogStats.totalComments}</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="posts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="posts">All Posts</TabsTrigger>
            {/* <TabsTrigger value="analytics">Analytics</TabsTrigger> */}
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search posts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Posts Table */}
            <Card>
              <CardHeader>
                <CardTitle>Blog Posts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Views</TableHead>
                        <TableHead>Engagement</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPosts.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8">
                            <div className="flex flex-col items-center">
                              <FileText className="w-12 h-12 text-gray-400 mb-4" />
                              <h3 className="text-lg font-medium text-gray-900 mb-2">No blog posts found</h3>
                              <p className="text-gray-500 mb-4">
                                {searchQuery || selectedCategory !== "all" || selectedStatus !== "all"
                                  ? "Try adjusting your search or filter criteria"
                                  : "Get started by creating your first blog post"}
                              </p>
                              <Button asChild>
                                <Link href="/admin/blog/create">
                                  <Plus className="w-4 h-4 mr-2" />
                                  Create Your First Post
                                </Link>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredPosts.map((post) => (
                        <TableRow key={post.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium text-gray-900">{post.title}</p>
                              <p className="text-sm text-gray-500 line-clamp-1">{post.excerpt}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{post.category.name}</Badge>
                          </TableCell>
                          <TableCell>{getStatusBadge(post.status)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Eye className="w-4 h-4 text-gray-400" />
                              <span>{post.viewCount.toLocaleString()}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1">
                                <Heart className="w-4 h-4 text-red-400" />
                                <span className="text-sm">{post.likeCount || 0}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MessageSquare className="w-4 h-4 text-blue-400" />
                                <span className="text-sm">{post.commentCount || 0}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span className="text-sm">{formatDate(post.publishedAt)}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                  <Link href={`/blog/${post.slug}`}>
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Post
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link href={`/admin/blog/${post.id}/edit`}>
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit
                                  </Link>
                                </DropdownMenuItem>
                                {/* <DropdownMenuItem asChild>
                                  <Link href={`/admin/blog/${post.id}/analytics`}>
                                    <BarChart3 className="w-4 h-4 mr-2" />
                                    Analytics
                                  </Link>
                                </DropdownMenuItem> */}
                                <DropdownMenuItem 
                                  className="text-red-600"
                                  onClick={() => handleDeletePost(post.id, post.title)}
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Performance Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Avg. Views per Post</span>
                      <span className="font-semibold">{blogStats.avgViewsPerPost}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Avg. Likes per Post</span>
                      <span className="font-semibold">{blogStats.avgLikesPerPost}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Comments</span>
                      <span className="font-semibold">{blogStats.totalComments}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Top Performing Posts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {posts
                      .sort((a, b) => b.viewCount - a.viewCount)
                      .slice(0, 3)
                      .map((post) => (
                        <div key={post.id} className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="text-sm font-medium line-clamp-2">{post.title}</p>
                            <p className="text-xs text-gray-500">{post.viewCount} views</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Engagement Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Likes</span>
                      <span className="font-semibold text-red-600">{blogStats.totalLikes}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Comments</span>
                      <span className="font-semibold text-blue-600">{blogStats.totalComments}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Engagement Rate</span>
                      <span className="font-semibold text-green-600">
                        {blogStats.totalViews > 0 
                          ? (((blogStats.totalLikes + blogStats.totalComments) / blogStats.totalViews) * 100).toFixed(1)
                          : "0.0"
                        }%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            {categories.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <div className="flex flex-col items-center">
                    <FileText className="w-12 h-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
                    <p className="text-gray-500 mb-4">Create categories to organize your blog posts</p>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Category
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => {
                const categoryPostCount = posts.filter(p => p.category.id === category.id).length
                return (
                  <Card key={category.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-4 h-4 rounded-full bg-blue-500" />
                        <Badge variant="outline">{categoryPostCount} posts</Badge>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{category.name}</h3>
                      <p className="text-sm text-gray-600 mb-4">{category.description}</p>
                      <Button variant="outline" size="sm" className="w-full">
                        Manage Category
                      </Button>
                    </CardContent>
                  </Card>
                )
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  )
}
