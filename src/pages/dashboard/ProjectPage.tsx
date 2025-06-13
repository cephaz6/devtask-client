// src/pages/ProjectPage.tsx
import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchProjectDetails,
  updateProject,
  deleteProject,
  inviteProjectMember,
  removeProjectMember,
  updateProjectMemberRole,
} from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import type { Project, Task, User, ProjectMember } from "@/types";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Users,
  Briefcase,
  Trash2,
  Edit,
  MoreHorizontal,
  Plus,
  Loader2,
  Frown,
  Share,
  Archive,
  Copy,
  Crown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import ProjectBoard from "@/components/project/ProjectBoard"; // Import the ProjectBoard component
import { getUserInitials } from "@/helpers/taskHelpers";

// TODO: Import dialogs for editing project, managing members, etc.
// import EditProjectDialog from "@/components/project/EditProjectDialog";
// import ManageProjectMembersDialog from "@/components/project/ManageProjectMembersDialog";
// import DeleteProjectDialog from "@/components/project/DeleteProjectDialog";

const ProjectPage: React.FC = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split("/");
  const projectId = pathSegments[pathSegments.length - 1];

  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const queryClient = useQueryClient();

  const [showEditProjectDialog, setShowEditProjectDialog] = useState(false);
  const [showManageMembersDialog, setShowManageMembersDialog] = useState(false);
  const [showDeleteProjectDialog, setShowDeleteProjectDialog] = useState(false);

  // Fetch project details including tasks and members
  const {
    data: project,
    isLoading,
    isError,
    error,
  } = useQuery<Project, Error>({
    queryKey: ["projectDetails", projectId],
    queryFn: () => fetchProjectDetails(projectId!),
    enabled: !!projectId && !!authUser,
    staleTime: 5 * 60 * 1000,
  });

  const isOwner = project ? authUser?.user_id === project.owner_id : false;

  const updateProjectMutation = useMutation<Project, Error, Partial<Project>>({
    mutationFn: (updatedData) => updateProject(projectId!, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projectDetails", projectId],
      });
      queryClient.invalidateQueries({ queryKey: ["myLinkedProjects"] });
      // setShowEditProjectDialog(false);
    },
  });

  const deleteProjectMutation = useMutation<void, Error>({
    mutationFn: () => deleteProject(projectId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myLinkedProjects"] });
      navigate("/projects");
      // setShowDeleteProjectDialog(false);
    },
  });

  const inviteMemberMutation = useMutation<
    ProjectMember,
    Error,
    { userId: string; role: "owner" | "member" }
  >({
    mutationFn: ({ userId, role }) =>
      inviteProjectMember(projectId!, userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projectDetails", projectId],
      });
    },
  });

  const handleEditProject = () => {
    console.log("Open edit project dialog");
  };

  const handleDeleteProject = () => {
    console.log("Open delete project confirmation");
  };

  const handleManageMembers = () => {
    console.log("Open manage members dialog");
  };

  const handleAddProjectTask = (status: Task["status"]) => {
    console.log(`Add new task to project ${projectId} with status: ${status}`);
    // Example: navigate with state to create task page
    // navigate('/tasks/new', { state: { projectId: projectId, initialStatus: status } });
  };

  if (!authUser) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">
              Please log in to view this project.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!projectId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <p className="text-destructive">Project ID is missing!</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Card className="w-64 bg-neutral-900 text-gray-100">
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <p className="text-muted-foreground">
              Loading project details... 🚀
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Card className="w-96 bg-neutral-900 text-gray-100">
          <CardContent className="p-6 text-center">
            <p className="text-destructive">
              <Frown className="inline-block mr-2" /> Error loading project:{" "}
              {error?.message || "Unknown error"}
            </p>
            <Button onClick={() => navigate("/projects")} className="mt-4">
              Go to Projects List
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Card className="w-96 bg-neutral-900 text-gray-100">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">Project not found.</p>
            <Button onClick={() => navigate("/projects")} className="mt-4">
              Go to Projects List
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const projectMembers = project.members || [];
  const projectTasks = project.tasks || [];

  return (
    // Main container: full height, hidden overflow to manage internal scrolls
    <div className="flex flex-col h-screen bg-gray-950 text-gray-100 overflow-hidden">
      {/* Fixed Project Header/Navbar - This section will not scroll horizontally or vertically with content */}
      <div className="bg-neutral-900 border-b border-neutral-800 p-4 sticky top-0 z-10 shadow-md w-full">
        <div className="container mx-auto">
          {/* Top Row: Back button, Project Title & Description, Owner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/projects")}
                className="text-gray-400 hover:text-blue-400"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex flex-col items-start">
                <h1 className="text-2xl font-bold text-gray-50">
                  {project.title}
                </h1>
                {project.description && (
                  <p className="text-gray-400 text-sm mt-1">
                    {project.description}
                  </p>
                )}
              </div>
              {project.owner && (
                <div className="hidden md:flex items-center gap-1 text-gray-400 text-sm ml-4">
                  <Crown className="h-4 w-4 text-yellow-400" />
                  <span>
                    Owner:{" "}
                    {project.owner.full_name ||
                      project.owner.email ||
                      `User ID: ${project.owner.user_id.slice(-6)}`}
                  </span>
                </div>
              )}
            </div>

            {/* Project Actions - Grouped and responsive */}
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-gray-300 border-neutral-700 hover:bg-neutral-800"
              >
                <Users className="h-4 w-4 mr-2" />
                Members ({projectMembers.length})
              </Button>

              <Button
                variant="default"
                size="sm"
                onClick={() => handleAddProjectTask("not_started")}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" /> Add Task
              </Button>

              {isOwner && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleManageMembers}
                  className="text-gray-300 border-neutral-700 hover:bg-neutral-800"
                >
                  <Users className="h-4 w-4 mr-2" /> Manage Members
                </Button>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-blue-400"
                  >
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48 bg-neutral-800 text-gray-50 border-neutral-700"
                >
                  <DropdownMenuLabel className="text-gray-300">
                    Project Options
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-neutral-700" />
                  {isOwner && (
                    <>
                      <DropdownMenuItem
                        onClick={handleEditProject}
                        className="hover:bg-neutral-700 focus:bg-neutral-700"
                      >
                        <Edit className="h-4 w-4 mr-2" /> Edit Project
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={handleDeleteProject}
                        className="text-red-400 hover:bg-neutral-700 focus:bg-neutral-700 focus:text-red-400"
                      >
                        <Trash2 className="h-4 w-4 mr-2" /> Delete Project
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-neutral-700" />
                    </>
                  )}
                  <DropdownMenuItem
                    onClick={() => console.log("Share Project")}
                    className="hover:bg-neutral-700 focus:bg-neutral-700"
                  >
                    <Share className="h-4 w-4 mr-2" /> Share
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => console.log("Archive Project")}
                    className="hover:bg-neutral-700 focus:bg-neutral-700"
                  >
                    <Archive className="h-4 w-4 mr-2" /> Archive
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => console.log("Duplicate Project")}
                    className="hover:bg-neutral-700 focus:bg-neutral-700"
                  >
                    <Copy className="h-4 w-4 mr-2" /> Duplicate
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area: Kanban Board Container */}
      {/* flex-1 allows this div to take up remaining vertical space */}
      {/* overflow-y-auto ensures vertical scrolling for the entire board area when masonry content overflows */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {" "}
        {/* Removed overflow-x-auto */}
        {!projectTasks || projectTasks.length === 0 ? (
          <div className="text-center py-20 bg-neutral-900 rounded-lg shadow-inner border border-neutral-800 mx-auto max-w-xl">
            <Briefcase className="h-24 w-24 text-gray-600 mx-auto mb-6" />
            <p className="text-xl text-gray-400 font-semibold mb-3">
              No tasks yet for this project.
            </p>
            <p className="text-muted-foreground mb-6">
              Start by creating your first task or importing existing ones!
            </p>
            <Button
              onClick={() => handleAddProjectTask("not_started")}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" /> Create First Task
            </Button>
          </div>
        ) : (
          <ProjectBoard tasks={projectTasks} onAddTask={handleAddProjectTask} />
        )}
      </div>

      {/* TODO: Add dialog components here (EditProjectDialog, ManageProjectMembersDialog, DeleteProjectDialog) */}
      {/* Example:
      <EditProjectDialog
        open={showEditProjectDialog}
        onOpenChange={setShowEditProjectDialog}
        project={project}
        onSubmit={updateProjectMutation.mutate}
        isSubmitting={updateProjectMutation.isPending}
      />
      */}
    </div>
  );
};

export default ProjectPage;
