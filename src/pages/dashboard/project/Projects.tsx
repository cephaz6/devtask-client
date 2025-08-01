// src/pages/Projects.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchProjects, createProject } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import type { Project } from "@/types";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  FolderOpen,
  Users,
  LayoutDashboard,
  Plus,
  Frown,
  Sparkles,
  Activity,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getUserInitials, formatDate } from "@/helpers/taskHelpers";

// Import the new CreateProjectDialog
import CreateProjectDialog from "@/components/project/CreateProjectDialog";

const Projects = () => {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const [showCreateProjectDialog, setShowCreateProjectDialog] = useState(false);
  const queryClient = useQueryClient();

  function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Fetch projects linked to the current user
  const {
    data: projects,
    isLoading,
    isError,
    error,
  } = useQuery<Project[], Error>({
    queryKey: ["myLinkedProjects"],
    queryFn: fetchProjects,
    enabled: !!authUser,
    staleTime: 5 * 60 * 1000,
  });

  // Mutation for creating a new project
  const createProjectMutation = useMutation<
    Project,
    Error,
    Pick<Project, "title" | "description">
  >({
    mutationFn: (newProjectData) => createProject(newProjectData),
    onSuccess: (newProject) => {
      queryClient.invalidateQueries({ queryKey: ["myLinkedProjects"] });
      setShowCreateProjectDialog(false);
      console.log("Project created successfully:", newProject);
    },
    onError: (err) => {
      console.error("Failed to create project:", err);
      // TODO: Display a user-friendly error message
    },
  });

  const handleProjectClick = (projectId: string) => {
    navigate(`/dashboard/projects/${projectId}`);
  };

  const handleCreateNewProject = () => {
    setShowCreateProjectDialog(true);
  };

  const handleCreateProjectSubmit = (
    projectData: Pick<Project, "title" | "description">
  ) => {
    createProjectMutation.mutate(projectData);
  };

  if (!authUser) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">
              Please log in to view your projects.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-64">
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading projects... 🏗️</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <p className="text-destructive">
              <Frown className="inline-block mr-2" /> Error loading projects:{" "}
              {error?.message || "Unknown error"}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const hasProjects = projects && projects.length > 0;

  return (
    <div className="flex-1 overflow-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FolderOpen className="h-8 w-8 text-blue-400" /> My Projects
          </h1>
          <Button
            onClick={handleCreateNewProject}
            className="bg-blue-600 hover:bg-blue-700 font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-200 ease-in-out"
          >
            <Plus className="h-5 w-5 mr-2" /> New Project
          </Button>
        </div>

        {!hasProjects ? (
          <div className="text-center py-20">
            <LayoutDashboard className="h-24 w-24 text-gray-600 mx-auto mb-6" />
            <p className="text-xl text-gray-400 font-semibold mb-3">
              No projects found.
            </p>
            <p className="text-muted-foreground mb-6">
              It looks like you haven't created or been added to any projects
              yet.
            </p>
            <Button
              onClick={handleCreateNewProject}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Sparkles className="h-4 w-4 mr-2" /> Create Your First Project
            </Button>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-2 xl:columns-3 gap-6">
            {" "}
            {/* Changed to column-based layout */}
            {projects.map((project) => (
              <Card
                key={project.id}
                className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 ease-in-out cursor-pointer flex flex-col justify-between
                           dark:border-neutral-900 rounded-2xl shadow-lg mb-6
                           transform hover:-translate-y-1 hover:scale-103 hover:bg-neutral-800 break-inside-avoid-column" /* Added mb-6 and break-inside-avoid-column */
                onClick={() => handleProjectClick(project.id)}
              >
                {/* Subtle overlay effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"></div>

                <CardHeader className="pb-3 flex flex-row items-start justify-between">
                  <div>
                    <CardTitle className="text-xl text-gray-700 dark:text-gray-300 font-bold leading-tight">
                      {project.title}
                    </CardTitle>
                    <CardDescription className="text-sm mt-1">
                      ID: {project.id.slice(-8)}
                    </CardDescription>
                  </div>
                  {/* If you can access owner details directly, display avatar */}
                  {project.owner && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-purple-500 text-white text-sm">
                        {getUserInitials(project.owner)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </CardHeader>
                <CardContent className="flex-1 pt-0">
                  <p className="text-sm text-gray-500">
                    {project.description || "No description provided."}
                  </p>
                </CardContent>
                <div className="px-6 pb-4 pt-2 border-t border-neutral-800 flex flex-wrap gap-x-4 gap-y-2 items-center text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>{formatDate(project.created_at)}</span>
                  </div>
                  {/* Display number of members */}
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span>
                      {project.members ? project.members.length : 0} Members
                    </span>
                  </div>
                  {/* Display number of tasks */}
                  <div className="flex items-center gap-1">
                    <LayoutDashboard className="h-4 w-4 text-gray-500" />
                    <span>
                      {project.tasks ? project.tasks.length : 0} Tasks
                    </span>
                  </div>

                  {/* Project Activity Chart Placeholder */}
                  <div className="w-full mt-3">
                    <div className="flex items-center gap-2 text-gray-400 mb-2">
                      <Activity className="h-4 w-4 text-gray-500" />
                      <span>Activity Overview</span>
                    </div>
                    <div className="flex items-end justify-between h-10 w-full bg-gray-100 dark:bg-accent rounded-md p-2">
                      {/* Simple activity bars (placeholder for a real chart) */}
                      <div
                        className="w-1/6 h-full bg-green-500 rounded-sm"
                        style={{ height: `${randomInt(100, 0)}%` }}
                      ></div>
                      <div
                        className="w-1/6 h-full bg-blue-500 rounded-sm"
                        style={{ height: `${randomInt(0, 100)}%` }}
                      ></div>
                      <div
                        className="w-1/6 h-full bg-yellow-500 rounded-sm"
                        style={{ height: `${randomInt(0, 100)}%` }}
                      ></div>
                      <div
                        className="w-1/6 h-full bg-purple-500 rounded-sm"
                        style={{ height: "100%" }}
                      ></div>
                      <div
                        className="w-1/6 h-full bg-red-500 rounded-sm"
                        style={{ height: `${randomInt(0, 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Daily activity (Data Assumed)
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
      {/* Create Project Dialog */}
      <CreateProjectDialog
        open={showCreateProjectDialog}
        onOpenChange={setShowCreateProjectDialog}
        onSubmit={handleCreateProjectSubmit}
        isSubmitting={createProjectMutation.isPending}
      />
    </div>
  );
};

export default Projects;
