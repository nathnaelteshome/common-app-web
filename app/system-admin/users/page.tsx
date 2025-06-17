"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Plus,
  Search,
  Filter,
  Download,
  MoreHorizontal,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  Mail,
  Key,
  Users,
  UserPlus,
  Shield,
  Eye,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { UserManagementService } from "@/lib/services/user-management-service"
import type { User, PaginatedResponse } from "@/lib/api/types"
import type { UserFilters, CreateUserData, UpdateUserData, BulkUserAction } from "@/lib/validations/user-management"

export default function UsersManagementPage() {
  const [users, setUsers] = useState<PaginatedResponse<User> | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [filters, setFilters] = useState<UserFilters>({
    search: "",
    role: "all",
    status: "all",
    emailVerified: "all",
    sortBy: "createdAt",
    sortOrder: "desc",
    page: 1,
    limit: 20,
  })
  const [stats, setStats] = useState<any>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showBulkDialog, setShowBulkDialog] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [createForm, setCreateForm] = useState<CreateUserData>({
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    isActive: true,
    isEmailVerified: false,
    permissions: [],
    department: "",
    position: "",
    notes: "",
  })
  const [bulkAction, setBulkAction] = useState<string>("")
  const [exporting, setExporting] = useState(false)

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true)
      const response = await UserManagementService.getUsers(filters)
      setUsers(response)
    } catch (error) {
      toast.error("Failed to load users")
      console.error("Error loading users:", error)
    } finally {
      setLoading(false)
    }
  }, [filters])

  const loadStats = useCallback(async () => {
    try {
      const statsData = await UserManagementService.getUserStats()
      setStats(statsData)
    } catch (error) {
      console.error("Error loading stats:", error)
    }
  }, [])

  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  useEffect(() => {
    loadStats()
  }, [loadStats])

  const handleSearch = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value, page: 1 }))
  }

  const handleFilterChange = (key: keyof UserFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }))
  }

  const handleSelectUser = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers((prev) => [...prev, userId])
    } else {
      setSelectedUsers((prev) => prev.filter((id) => id !== userId))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked && users) {
      setSelectedUsers(users.data.map((user) => user.id))
    } else {
      setSelectedUsers([])
    }
  }

  const handleCreateUser = async () => {
    try {
      await UserManagementService.createUser(createForm)
      toast.success("User created successfully")
      setShowCreateDialog(false)
      setCreateForm({
        email: "",
        password: "",
        confirmPassword: "",
        role: "student",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        isActive: true,
        isEmailVerified: false,
        permissions: [],
        department: "",
        position: "",
        notes: "",
      })
      loadUsers()
      loadStats()
    } catch (error) {
      toast.error("Failed to create user")
      console.error("Error creating user:", error)
    }
  }

  const handleUpdateUser = async () => {
    if (!editingUser) return

    try {
      const updateData: UpdateUserData = {
        firstName: (editingUser.profile as any).firstName,
        lastName: (editingUser.profile as any).lastName,
        email: editingUser.email,
        role: editingUser.role,
        isActive: editingUser.isActive,
        isEmailVerified: editingUser.isEmailVerified,
        phoneNumber: (editingUser.profile as any).phoneNumber,
        department: (editingUser.profile as any).department,
        permissions: (editingUser.profile as any).permissions,
      }

      await UserManagementService.updateUser(editingUser.id, updateData)
      toast.success("User updated successfully")
      setShowEditDialog(false)
      setEditingUser(null)
      loadUsers()
    } catch (error) {
      toast.error("Failed to update user")
      console.error("Error updating user:", error)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    try {
      await UserManagementService.deleteUser(userId)
      toast.success("User deleted successfully")
      loadUsers()
      loadStats()
    } catch (error) {
      toast.error("Failed to delete user")
      console.error("Error deleting user:", error)
    }
  }

  const handleBulkAction = async () => {
    if (!bulkAction || selectedUsers.length === 0) return

    try {
      const actionData: BulkUserAction = {
        userIds: selectedUsers,
        action: bulkAction as any,
        reason: "Bulk action performed by system admin",
      }

      const result = await UserManagementService.bulkAction(actionData)
      toast.success(`Bulk action completed: ${result.success} successful, ${result.failed} failed`)
      setShowBulkDialog(false)
      setBulkAction("")
      setSelectedUsers([])
      loadUsers()
      loadStats()
    } catch (error) {
      toast.error("Failed to perform bulk action")
      console.error("Error performing bulk action:", error)
    }
  }

  const handleExport = async () => {
    try {
      setExporting(true)
      const blob = await UserManagementService.exportUsers(filters)
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `users-export-${new Date().toISOString().split("T")[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success("Users exported successfully")
    } catch (error) {
      toast.error("Failed to export users")
      console.error("Error exporting users:", error)
    } finally {
      setExporting(false)
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "student":
        return "bg-blue-100 text-blue-800"
      case "university":
        return "bg-green-100 text-green-800"
      case "admin":
        return "bg-purple-100 text-purple-800"
      case "system_admin":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusBadgeColor = (isActive: boolean) => {
    return isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
  }

  const getUserDisplayName = (user: User) => {
    const profile = user.profile as any
    if (profile.firstName && profile.lastName) {
      return `${profile.firstName} ${profile.lastName}`
    }
    if (profile.collegeName) {
      return profile.collegeName
    }
    return user.email.split("@")[0]
  }

  const getUserInitials = (user: User) => {
    const name = getUserDisplayName(user)
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  if (loading && !users) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-20" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-16" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage all users, roles, and permissions across the platform</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport} disabled={exporting}>
            <Download className="h-4 w-4 mr-2" />
            {exporting ? "Exporting..." : "Export"}
          </Button>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New User</DialogTitle>
                <DialogDescription>
                  Add a new user to the platform with the specified role and permissions.
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={createForm.email}
                    onChange={(e) => setCreateForm((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="user@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={createForm.role}
                    onValueChange={(value) => setCreateForm((prev) => ({ ...prev, role: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="university">University</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="system_admin">System Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={createForm.firstName}
                    onChange={(e) => setCreateForm((prev) => ({ ...prev, firstName: e.target.value }))}
                    placeholder="John"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={createForm.lastName}
                    onChange={(e) => setCreateForm((prev) => ({ ...prev, lastName: e.target.value }))}
                    placeholder="Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={createForm.password}
                    onChange={(e) => setCreateForm((prev) => ({ ...prev, password: e.target.value }))}
                    placeholder="••••••••"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={createForm.confirmPassword}
                    onChange={(e) => setCreateForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="••••••••"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    value={createForm.phoneNumber}
                    onChange={(e) => setCreateForm((prev) => ({ ...prev, phoneNumber: e.target.value }))}
                    placeholder="+1234567890"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={createForm.department}
                    onChange={(e) => setCreateForm((prev) => ({ ...prev, department: e.target.value }))}
                    placeholder="Operations"
                  />
                </div>
                <div className="col-span-2 space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isActive"
                      checked={createForm.isActive}
                      onCheckedChange={(checked) => setCreateForm((prev) => ({ ...prev, isActive: checked }))}
                    />
                    <Label htmlFor="isActive">Active Account</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isEmailVerified"
                      checked={createForm.isEmailVerified}
                      onCheckedChange={(checked) => setCreateForm((prev) => ({ ...prev, isEmailVerified: checked }))}
                    />
                    <Label htmlFor="isEmailVerified">Email Verified</Label>
                  </div>
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={createForm.notes}
                    onChange={(e) => setCreateForm((prev) => ({ ...prev, notes: e.target.value }))}
                    placeholder="Additional notes about this user..."
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateUser}>Create User</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                {stats.active} active, {stats.inactive} inactive
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Students</CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.students}</div>
              <p className="text-xs text-muted-foreground">Student accounts</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Universities</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.universities}</div>
              <p className="text-xs text-muted-foreground">University accounts</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Email Verified</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.verified}</div>
              <p className="text-xs text-muted-foreground">{stats.unverified} unverified</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={filters.search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={filters.role} onValueChange={(value) => handleFilterChange("role", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="student">Students</SelectItem>
                  <SelectItem value="university">Universities</SelectItem>
                  <SelectItem value="admin">Admins</SelectItem>
                  <SelectItem value="system_admin">System Admins</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Email Status</Label>
              <Select
                value={filters.emailVerified}
                onValueChange={(value) => handleFilterChange("emailVerified", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="unverified">Unverified</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {selectedUsers.length} user{selectedUsers.length > 1 ? "s" : ""} selected
                </span>
                <Button variant="outline" size="sm" onClick={() => setSelectedUsers([])}>
                  Clear Selection
                </Button>
              </div>
              <Dialog open={showBulkDialog} onOpenChange={setShowBulkDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    Bulk Actions
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Bulk Actions</DialogTitle>
                    <DialogDescription>
                      Perform actions on {selectedUsers.length} selected user{selectedUsers.length > 1 ? "s" : ""}.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Action</Label>
                      <Select value={bulkAction} onValueChange={setBulkAction}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an action" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="activate">Activate Users</SelectItem>
                          <SelectItem value="deactivate">Deactivate Users</SelectItem>
                          <SelectItem value="verify_email">Verify Email</SelectItem>
                          <SelectItem value="reset_password">Reset Password</SelectItem>
                          <SelectItem value="delete">Delete Users</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowBulkDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleBulkAction} disabled={!bulkAction}>
                      Apply Action
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>{users?.pagination.total} total users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={users?.data.length > 0 && selectedUsers.length === users.data.length}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Email Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading
                  ? [...Array(5)].map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <Skeleton className="h-4 w-4" />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="space-y-1">
                              <Skeleton className="h-4 w-32" />
                              <Skeleton className="h-3 w-48" />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-16" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-16" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-16" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-20" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-8 w-8" />
                        </TableCell>
                      </TableRow>
                    ))
                  : users?.data.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedUsers.includes(user.id)}
                            onCheckedChange={(checked) => handleSelectUser(user.id, checked as boolean)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarImage src={(user.profile as any).avatar || "/placeholder.svg"} />
                              <AvatarFallback>{getUserInitials(user)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{getUserDisplayName(user)}</div>
                              <div className="text-sm text-muted-foreground">{user.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getRoleBadgeColor(user.role)}>{user.role.replace("_", " ")}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusBadgeColor(user.isActive)}>
                            {user.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.isEmailVerified ? "default" : "secondary"}>
                            {user.isEmailVerified ? "Verified" : "Unverified"}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => {
                                  setEditingUser(user)
                                  setShowEditDialog(true)
                                }}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit User
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Key className="h-4 w-4 mr-2" />
                                Reset Password
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => {
                                  const newStatus = !user.isActive
                                  // Handle status toggle
                                }}
                              >
                                {user.isActive ? (
                                  <>
                                    <UserX className="h-4 w-4 mr-2" />
                                    Deactivate
                                  </>
                                ) : (
                                  <>
                                    <UserCheck className="h-4 w-4 mr-2" />
                                    Activate
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem className="text-red-600" onSelect={(e) => e.preventDefault()}>
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete User
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete User</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete {getUserDisplayName(user)}? This action cannot be
                                      undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeleteUser(user.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {users && users.pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {(users.pagination.page - 1) * users.pagination.limit + 1} to{" "}
                {Math.min(users.pagination.page * users.pagination.limit, users.pagination.total)} of{" "}
                {users.pagination.total} users
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleFilterChange("page", Math.max(1, filters.page - 1))}
                  disabled={!users.pagination.hasPrev}
                >
                  Previous
                </Button>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, users.pagination.totalPages) }, (_, i) => {
                    const page = i + 1
                    return (
                      <Button
                        key={page}
                        variant={page === filters.page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleFilterChange("page", page)}
                      >
                        {page}
                      </Button>
                    )
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleFilterChange("page", Math.min(users.pagination.totalPages, filters.page + 1))}
                  disabled={!users.pagination.hasNext}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user information and settings.</DialogDescription>
          </DialogHeader>
          {editingUser && (
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="permissions">Permissions</TabsTrigger>
              </TabsList>
              <TabsContent value="profile" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>First Name</Label>
                    <Input
                      value={(editingUser.profile as any).firstName || ""}
                      onChange={(e) =>
                        setEditingUser((prev) =>
                          prev
                            ? {
                                ...prev,
                                profile: { ...prev.profile, firstName: e.target.value },
                              }
                            : null,
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name</Label>
                    <Input
                      value={(editingUser.profile as any).lastName || ""}
                      onChange={(e) =>
                        setEditingUser((prev) =>
                          prev
                            ? {
                                ...prev,
                                profile: { ...prev.profile, lastName: e.target.value },
                              }
                            : null,
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      value={editingUser.email}
                      onChange={(e) =>
                        setEditingUser((prev) =>
                          prev
                            ? {
                                ...prev,
                                email: e.target.value,
                              }
                            : null,
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      value={(editingUser.profile as any).phoneNumber || ""}
                      onChange={(e) =>
                        setEditingUser((prev) =>
                          prev
                            ? {
                                ...prev,
                                profile: { ...prev.profile, phoneNumber: e.target.value },
                              }
                            : null,
                        )
                      }
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="security" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Select
                      value={editingUser.role}
                      onValueChange={(value) =>
                        setEditingUser((prev) =>
                          prev
                            ? {
                                ...prev,
                                role: value as any,
                              }
                            : null,
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="university">University</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="system_admin">System Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={editingUser.isActive}
                        onCheckedChange={(checked) =>
                          setEditingUser((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  isActive: checked,
                                }
                              : null,
                          )
                        }
                      />
                      <Label>Active Account</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={editingUser.isEmailVerified}
                        onCheckedChange={(checked) =>
                          setEditingUser((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  isEmailVerified: checked,
                                }
                              : null,
                          )
                        }
                      />
                      <Label>Email Verified</Label>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="permissions" className="space-y-4">
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Input
                    value={(editingUser.profile as any).department || ""}
                    onChange={(e) =>
                      setEditingUser((prev) =>
                        prev
                          ? {
                              ...prev,
                              profile: { ...prev.profile, department: e.target.value },
                            }
                          : null,
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Permissions</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      "manage_users",
                      "manage_applications",
                      "manage_payments",
                      "view_analytics",
                      "system_settings",
                    ].map((permission) => (
                      <div key={permission} className="flex items-center space-x-2">
                        <Checkbox
                          checked={((editingUser.profile as any).permissions || []).includes(permission)}
                          onCheckedChange={(checked) => {
                            const currentPermissions = (editingUser.profile as any).permissions || []
                            const newPermissions = checked
                              ? [...currentPermissions, permission]
                              : currentPermissions.filter((p: string) => p !== permission)
                            setEditingUser((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    profile: { ...prev.profile, permissions: newPermissions },
                                  }
                                : null,
                            )
                          }}
                        />
                        <Label className="text-sm">{permission.replace("_", " ")}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateUser}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
