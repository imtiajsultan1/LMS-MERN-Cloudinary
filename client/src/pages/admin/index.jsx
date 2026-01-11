import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  fetchAdminCoursesService,
  fetchAdminOrdersService,
  fetchAdminUsersService,
  updateCoursePublishStatusService,
  updateUserRoleService,
} from "@/services";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthContext } from "@/context/auth-context";
import { useContext } from "react";

function AdminDashboardPage() {
  const { toast } = useToast();
  const { resetCredentials } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState({
    users: true,
    courses: true,
    orders: true,
  });

  function handleLogout() {
    resetCredentials();
    sessionStorage.clear();
  }

  function formatDate(value) {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleDateString("en-GB");
  }

  async function loadUsers() {
    try {
      const response = await fetchAdminUsersService();
      if (response?.success) {
        setUsers(response?.data || []);
      } else {
        toast({
          variant: "destructive",
          title: "Failed to load users",
          description: response?.message || "Please try again.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to load users",
        description:
          error?.response?.data?.message || "Please try again.",
      });
    } finally {
      setLoading((prev) => ({ ...prev, users: false }));
    }
  }

  async function loadCourses() {
    try {
      const response = await fetchAdminCoursesService();
      if (response?.success) {
        setCourses(response?.data || []);
      } else {
        toast({
          variant: "destructive",
          title: "Failed to load courses",
          description: response?.message || "Please try again.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to load courses",
        description:
          error?.response?.data?.message || "Please try again.",
      });
    } finally {
      setLoading((prev) => ({ ...prev, courses: false }));
    }
  }

  async function loadOrders() {
    try {
      const response = await fetchAdminOrdersService();
      if (response?.success) {
        setOrders(response?.data || []);
      } else {
        toast({
          variant: "destructive",
          title: "Failed to load orders",
          description: response?.message || "Please try again.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to load orders",
        description:
          error?.response?.data?.message || "Please try again.",
      });
    } finally {
      setLoading((prev) => ({ ...prev, orders: false }));
    }
  }

  async function handleRoleUpdate(userId, nextRole) {
    try {
      const response = await updateUserRoleService(userId, nextRole);
      if (response?.success) {
        setUsers((prev) =>
          prev.map((user) =>
            user._id === userId ? response.data : user
          )
        );
        toast({
          title: "Role updated",
          description: `User is now ${nextRole}.`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Update failed",
          description: response?.message || "Please try again.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description:
          error?.response?.data?.message || "Please try again.",
      });
    }
  }

  async function handlePublishToggle(courseId, currentStatus) {
    try {
      const response = await updateCoursePublishStatusService(
        courseId,
        !currentStatus
      );
      if (response?.success) {
        setCourses((prev) =>
          prev.map((course) =>
            course._id === courseId ? response.data : course
          )
        );
        toast({
          title: "Course updated",
          description: response.data.isPublised
            ? "Course is now published."
            : "Course is now unpublished.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Update failed",
          description: response?.message || "Please try again.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description:
          error?.response?.data?.message || "Please try again.",
      });
    }
  }

  useEffect(() => {
    loadUsers();
    loadCourses();
    loadOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-sm text-gray-600">
            Manage users, courses, and orders
          </p>
        </div>
        <Button onClick={handleLogout} variant="outline">
          Sign Out
        </Button>
      </header>
      <main className="max-w-6xl mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                {loading.users ? (
                  <div>Loading users...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => {
                        const isAdmin = user.role === "admin";
                        const isInstructor = user.role === "instructor";
                        const nextRole = isInstructor ? "user" : "instructor";
                        const actionLabel = isInstructor
                          ? "Make Student"
                          : "Make Instructor";

                        return (
                          <TableRow key={user._id}>
                            <TableCell className="font-medium">
                              {user.userName}
                            </TableCell>
                            <TableCell>{user.userEmail}</TableCell>
                            <TableCell className="capitalize">
                              {user.role}
                            </TableCell>
                            <TableCell className="text-right">
                              {isAdmin ? (
                                <span className="text-sm text-gray-500">
                                  Admin
                                </span>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    handleRoleUpdate(user._id, nextRole)
                                  }
                                >
                                  {actionLabel}
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses">
            <Card>
              <CardHeader>
                <CardTitle>Course Publishing</CardTitle>
              </CardHeader>
              <CardContent>
                {loading.courses ? (
                  <div>Loading courses...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Course</TableHead>
                        <TableHead>Instructor</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {courses.map((course) => (
                        <TableRow key={course._id}>
                          <TableCell className="font-medium">
                            {course.title}
                          </TableCell>
                          <TableCell>{course.instructorName}</TableCell>
                          <TableCell>Tk {course.pricing}</TableCell>
                          <TableCell>
                            {course.isPublised ? "Published" : "Hidden"}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handlePublishToggle(
                                  course._id,
                                  course.isPublised
                                )
                              }
                            >
                              {course.isPublised ? "Unpublish" : "Publish"}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Orders</CardTitle>
              </CardHeader>
              <CardContent>
                {loading.orders ? (
                  <div>Loading orders...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Course</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order._id}>
                          <TableCell>
                            <div className="font-medium">
                              {order.userName}
                            </div>
                            <div className="text-xs text-gray-500">
                              {order.userEmail}
                            </div>
                          </TableCell>
                          <TableCell>{order.courseTitle}</TableCell>
                          <TableCell>Tk {order.coursePricing}</TableCell>
                          <TableCell className="capitalize">
                            {order.orderStatus}
                          </TableCell>
                          <TableCell>{formatDate(order.orderDate)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

export default AdminDashboardPage;
