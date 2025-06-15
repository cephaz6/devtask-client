// src/pages/Dashboard.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchDashboardStats, fetchRecentActivities } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  CheckSquare,
  FolderOpen,
  MessageSquare,
  UserCheck,
  Plus,
  TrendingUp,
  Clock,
  LayoutDashboard,
  Activity,
  Calendar,
  Loader2,
  Frown,
  ArrowUpRight,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import CreateTaskDialog from "@/components/task/CreateTaskDialog";
import CreateProjectDialog from "@/components/project/CreateProjectDialog";
import type { DashboardStats, RecentActivityItem } from "@/types";
import { getUserInitials } from "@/helpers/taskHelpers";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [openCreateTask, setOpenCreateTask] = useState(false);
  const [openCreateProject, setOpenCreateProject] = useState(false);

  // Fetch dashboard stats
  const {
    data: dashboardStats,
    isLoading: isLoadingStats,
    isError: isErrorStats,
    error: statsError,
  } = useQuery<DashboardStats, Error>({
    queryKey: ["dashboardStats", user?.user_id],
    queryFn: fetchDashboardStats,
    enabled: !!user?.user_id,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch recent activities
  const {
    data: recentActivities,
    isLoading: isLoadingActivities,
    isError: isErrorActivities,
    error: activitiesError,
  } = useQuery<RecentActivityItem[], Error>({
    queryKey: ["recentActivities", user?.user_id],
    queryFn: fetchRecentActivities,
    enabled: !!user?.user_id,
    staleTime: 60 * 1000,
  });

  // Helper to format timestamps
  const formatTimeAgo = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return `${seconds} seconds ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return `${Math.floor(days / 365)} years ago`;
  };

  // Helper to get icon based on activity type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "task_created":
        return <CheckSquare className="h-4 w-4 text-blue-500" />;
      case "task_completed":
        return <CheckSquare className="h-4 w-4 text-green-500" />;
      case "comment_added":
        return <MessageSquare className="h-4 w-4 text-purple-500" />;
      case "assignment_created":
        return <UserCheck className="h-4 w-4 text-orange-500" />;
      case "project_created":
      case "project_updated":
        return <FolderOpen className="h-4 w-4 text-yellow-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  // Stats configuration
  const stats = [
    {
      title: "Total Tasks",
      value: isLoadingStats
        ? "..."
        : dashboardStats?.total_tasks?.toString() || "0",
      description: "Across all projects and assignments",
      icon: CheckSquare,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      title: "Active Projects",
      value: isLoadingStats
        ? "..."
        : dashboardStats?.active_projects?.toString() || "0",
      description: "Projects you are a member of",
      icon: FolderOpen,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20",
    },
    {
      title: "Pending Assignments",
      value: isLoadingStats
        ? "..."
        : dashboardStats?.pending_assignments?.toString() || "0",
      description: "Tasks assigned to you, not yet done",
      icon: UserCheck,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/20",
    },
    {
      title: "Completed Tasks",
      value: isLoadingStats
        ? "..."
        : dashboardStats?.completed_tasks?.toString() || "0",
      description: "Successfully finished tasks",
      icon: MessageSquare,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
    },
  ];

  const quickActions = [
    {
      title: "Create New Task",
      description: "Add a new task to your workflow",
      icon: CheckSquare,
      action: () => setOpenCreateTask(true),
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      title: "Start New Project",
      description: "Begin a new project with your team",
      icon: FolderOpen,
      action: () => setOpenCreateProject(true),
      color: "bg-green-600 hover:bg-green-700",
    },
    {
      title: "View My Assignments",
      description: "See all tasks assigned to you",
      icon: UserCheck,
      action: () => navigate("/tasks/assigned"),
      color: "bg-orange-600 hover:bg-orange-700",
    },
  ];

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950 text-gray-100">
        <Card className="w-96 bg-neutral-900 border-neutral-800 text-center p-6 rounded-xl shadow-xl">
          <CardTitle className="text-xl font-bold text-gray-50 mb-3">
            Welcome! 👋
          </CardTitle>
          <CardDescription className="text-gray-400 mb-6">
            Please log in to view your dashboard.
          </CardDescription>
          <Button
            onClick={() => navigate("/login")}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Log In
          </Button>
        </Card>
      </div>
    );
  }

  // Unified Loading state
  if (isLoadingStats || isLoadingActivities) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 text-gray-100 p-8">
        <Loader2 className="h-16 w-16 animate-spin text-blue-500 mb-6" />
        <p className="text-xl text-muted-foreground font-semibold">
          Loading your personalized dashboard...
        </p>
        <p className="text-sm text-gray-500 mt-2">
          This might take a moment to fetch all your data.
        </p>
      </div>
    );
  }

  // Unified Error state
  if (isErrorStats || isErrorActivities) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 text-gray-100 p-8">
        <Frown className="h-16 w-16 text-red-500 mb-6" />
        <h2 className="text-2xl font-bold text-destructive mb-3">
          Error Loading Dashboard
        </h2>
        <p className="text-muted-foreground text-center max-w-md">
          Something went wrong while fetching your data:{" "}
          {(statsError || activitiesError)?.message || "Unknown error"}. Please
          try refreshing the page or contact support.
        </p>
        <Button
          onClick={() => window.location.reload()}
          className="mt-6 bg-red-600 hover:bg-red-700"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 sm:p-8 space-y-6 animate-fade-in">
      {/* Hero Section / Greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-neutral-800 to-neutral-900 p-6 rounded-xl shadow-lg border border-neutral-700">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14 shadow-lg">
            <AvatarFallback className="bg-blue-600 text-white text-xl font-bold">
              {getUserInitials(user)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-extrabold text-white leading-tight">
              Hey {user?.full_name?.split(" ")[0] || user?.email?.split("@")[0]}{" "}
              🎉
            </h1>
            <p className="text-base text-gray-300 mt-1">
              Welcome back to your command center. Let's get things done!
            </p>
          </div>
        </div>
        <Button
          onClick={() => setOpenCreateTask(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full shadow-md transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          <Plus className="h-5 w-5 mr-2" /> Create New Task
        </Button>
      </div>

      {/* Quick Actions and Overview - Side by Side */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Quick Actions - First */}
        <section className="space-y-4 lg:w-1/3">
          <h2 className="text-xl font-bold text-gray-50 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-400" /> Get Started
          </h2>
          <Card className="bg-neutral-900 border-neutral-800 shadow-lg rounded-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-gray-50">
                Quick Actions
              </CardTitle>
              <CardDescription className="text-gray-400">
                Jump right into your most common tasks.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickActions.map((action) => (
                <div
                  key={action.title}
                  className="flex items-center justify-between p-4 rounded-lg border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 transition-colors duration-200 cursor-pointer shadow-sm"
                  onClick={action.action}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-full text-white ${action.color}`}
                    >
                      <action.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-white">
                        {action.title}
                      </h3>
                      <p className="text-xs text-gray-400">
                        {action.description}
                      </p>
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-gray-400" />
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        {/* Stats Grid - Second */}
        <section className="space-y-4 lg:flex-1">
          <h2 className="text-xl font-bold text-gray-50 flex items-center gap-2">
            <LayoutDashboard className="h-5 w-5 text-blue-400" /> Your Overview
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {stats.map((stat) => (
              <Card
                key={stat.title}
                className="bg-neutral-900 border-neutral-800 text-gray-100 shadow-lg rounded-xl transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-2xl"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-full ${stat.bgColor}`}>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent className="pt-1">
                  <div className="text-2xl font-extrabold text-white mb-1">
                    {stat.value}
                  </div>
                  <p className="text-xs text-gray-400">{stat.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>

      {/* Recent Activity */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-gray-50 flex items-center gap-2">
          <Activity className="h-5 w-5 text-orange-400" /> Recent Activity
        </h2>
        <Card className="bg-neutral-900 border-neutral-800 shadow-lg rounded-xl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg text-gray-50">
                  Latest Updates
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Catch up on what's been happening across your tasks and
                  projects.
                </CardDescription>
              </div>
              {Array.isArray(recentActivities) &&
                recentActivities.length > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {recentActivities.length}
                  </Badge>
                )}
            </div>
          </CardHeader>
          <CardContent className="space-y-3 max-h-96 overflow-y-auto">
            {Array.isArray(recentActivities) && recentActivities.length > 0 ? (
              recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-3 p-3 bg-neutral-800 rounded-md border border-neutral-700 hover:bg-neutral-700 transition-colors"
                >
                  <div className="flex-shrink-0">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-100">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-gray-500" />
                      {formatTimeAgo(activity.timestamp)} by{" "}
                      <span className="font-semibold">
                        {activity.actor_name}
                      </span>
                      {activity.related_entity_title && (
                        <>
                          {" "}
                          on{" "}
                          <span
                            className="font-semibold text-blue-400 cursor-pointer hover:underline"
                            onClick={() => {
                              if (
                                activity.related_entity_id &&
                                activity.type.includes("task")
                              ) {
                                navigate(
                                  `/tasks/${activity.related_entity_id}`
                                );
                              } else if (
                                activity.related_entity_id &&
                                activity.type.includes("project")
                              ) {
                                navigate(
                                  `/projects/${activity.related_entity_id}`
                                );
                              }
                            }}
                          >
                            {activity.related_entity_title}
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-muted-foreground text-center p-6">
                <Clock className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p>No recent activity found.</p>
                <p className="text-sm">Start creating tasks and projects!</p>
              </div>
            )}

            {Array.isArray(recentActivities) && recentActivities.length > 0 && (
              <Button
                variant="outline"
                className="w-full mt-4 bg-neutral-800 border-neutral-700 hover:bg-neutral-700 text-gray-300"
              >
                View All Activity
              </Button>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Create Dialogs */}
      <CreateTaskDialog
        open={openCreateTask}
        onOpenChange={setOpenCreateTask}
      />
      <CreateProjectDialog
        open={openCreateProject}
        onOpenChange={setOpenCreateProject}
      />
    </div>
  );
};

export default Dashboard;
