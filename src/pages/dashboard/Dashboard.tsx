import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  CheckSquare,
  FolderOpen,
  MessageSquare,
  UserCheck,
  Plus,
  TrendingUp,
  Clock,
  Users,
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();

  // Mock data - replace with real data from your FastAPI backend
  const stats = [
    {
      title: "Total Tasks",
      value: "24",
      description: "+12% from last month",
      icon: CheckSquare,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Active Projects",
      value: "8",
      description: "+2 new this week",
      icon: FolderOpen,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Pending Assignments",
      value: "12",
      description: "3 due today",
      icon: UserCheck,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Recent Comments",
      value: "45",
      description: "+8 new today",
      icon: MessageSquare,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  const quickActions = [
    {
      title: "Create New Task",
      description: "Add a new task to your workflow",
      icon: CheckSquare,
      action: () => navigate("/dashboard/tasks"),
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      title: "Start New Project",
      description: "Begin a new project with your team",
      icon: FolderOpen,
      action: () => navigate("/dashboard/projects"),
      color: "bg-green-600 hover:bg-green-700",
    },
    {
      title: "View Assignments",
      description: "Check your current assignments",
      icon: UserCheck,
      action: () => navigate("/dashboard/assignments"),
      color: "bg-orange-600 hover:bg-orange-700",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Hey NeeL 🎊🥳</h1>
        <p className="text-gray-600">
          Welcome back! Here's your project overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-md ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="md:col-span-2 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Get started with these common tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action) => (
              <div
                key={action.title}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 cursor-pointer"
                onClick={action.action}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-md text-white ${action.color}`}>
                    <action.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-medium">{action.title}</h3>
                    <p className="text-sm text-gray-600">
                      {action.description}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Task completed</p>
                <p className="text-xs text-gray-500">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">New comment added</p>
                <p className="text-xs text-gray-500">1 hour ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Project updated</p>
                <p className="text-xs text-gray-500">3 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Assignment created</p>
                <p className="text-xs text-gray-500">1 day ago</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Overview
          </CardTitle>
          <CardDescription>
            Current team activity and performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">5</div>
              <div className="text-sm text-gray-600">Active Members</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">87%</div>
              <div className="text-sm text-gray-600">Completion Rate</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-orange-600">3.2</div>
              <div className="text-sm text-gray-600">Avg. Rating</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
