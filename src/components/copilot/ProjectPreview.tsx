import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Clock,
  Calendar,
  CheckCircle2,
  Circle,
  AlertCircle,
  ArrowRight,
  BookOpen,
  Target,
  TrendingUp,
  Save,
  Share2,
  MoreHorizontal,
} from "lucide-react";
import type { GeneratedProject } from "@/types";

type Props = {
  project: GeneratedProject;
};

export function ProjectPreview({ project }: Props) {
  const totalHours = project.tasks.reduce(
    (sum, task) => sum + task.estimated_time,
    0
  );
  const highPriorityTasks = project.tasks.filter(
    (task) => task.priority === "high"
  ).length;
  const completedTasks = 0; // Since these are new tasks

  const priorityConfig = {
    high: {
      color:
        "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800",
      icon: AlertCircle,
      label: "High Priority",
    },
    medium: {
      color:
        "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800",
      icon: Clock,
      label: "Medium Priority",
    },
    low: {
      color:
        "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800",
      icon: CheckCircle2,
      label: "Low Priority",
    },
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Project Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="flex items-start justify-between mb-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">{project.title}</h2>
            <p className="text-indigo-100 max-w-2xl">{project.description}</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Project Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <BookOpen className="h-5 w-5" />
              <span className="text-sm font-medium">Total Tasks</span>
            </div>
            <span className="text-2xl font-bold">{project.tasks.length}</span>
          </div>

          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-5 w-5" />
              <span className="text-sm font-medium">Estimated Time</span>
            </div>
            <span className="text-2xl font-bold">{totalHours}h</span>
          </div>

          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle className="h-5 w-5" />
              <span className="text-sm font-medium">High Priority</span>
            </div>
            <span className="text-2xl font-bold">{highPriorityTasks}</span>
          </div>

          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-5 w-5" />
              <span className="text-sm font-medium">Progress</span>
            </div>
            <span className="text-2xl font-bold">
              {completedTasks}/{project.tasks.length}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
          Learning Roadmap
        </h3>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          <Target className="h-4 w-4 mr-2" />
          Start Learning Path
        </Button>
      </div>

      {/* Tasks Grid */}
      <div className="grid gap-4">
        {project.tasks.map((task, index) => {
          const priority =
            priorityConfig[task.priority] || priorityConfig.medium;
          const PriorityIcon = priority.icon;

          return (
            <Card
              key={index}
              className="group hover:shadow-lg transition-all duration-200 border-2 hover:border-indigo-200 dark:hover:border-indigo-800"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="mt-1">
                      <Circle className="h-5 w-5 text-slate-400 group-hover:text-indigo-500 transition-colors duration-200" />
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                          Step {index + 1}
                        </span>
                        <ArrowRight className="h-4 w-4 text-slate-300" />
                      </div>

                      <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-lg group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
                        {task.title}
                      </h4>

                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        {task.description}
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{task.estimated_time}h</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(task.due_date)}</span>
                    </div>
                  </div>

                  <Badge
                    className={`${priority.color} flex items-center gap-1 font-medium`}
                  >
                    <PriorityIcon className="h-3 w-3" />
                    {priority.label}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Summary Footer */}
      <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h4 className="font-semibold text-slate-800 dark:text-slate-200">
              Ready to Start Your Journey?
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              This learning path will take approximately {totalHours} hours to
              complete
            </p>
          </div>

          <div className="flex gap-3">
            <Button variant="outline">Customize Path</Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              Add to Dashboard
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
