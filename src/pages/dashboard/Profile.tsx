import React, { useState } from "react";
import {
  User,
  Mail,
  MapPin,
  Calendar,
  Edit,
  Save,
  X,
  Camera,
  Shield,
  Clock,
  Users,
  CheckCircle,
  Activity,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  role: string;
  department: string;
  joinDate: string;
  avatar: string;
  timezone: string;
  language: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
}

interface ActivityItem {
  id: string;
  type: "task" | "project" | "comment" | "assignment";
  title: string;
  description: string;
  timestamp: string;
  status?: string;
}

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Mock user data
  const [profile, setProfile] = useState<UserProfile>({
    id: "1",
    name: "Bright Atagah",
    email: "bright.atagah@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    bio: "Full-stack developer passionate about creating elegant solutions to complex problems. I love working with modern web technologies and building scalable applications.",
    role: "Senior Full Stack Developer",
    department: "Engineering",
    joinDate: "2023-01-15",
    avatar: "/api/placeholder/150/150",
    timezone: "PST",
    language: "English",
    github: "brightatagah",
    linkedin: "brightatagah",
    twitter: "brightatagah",
  });

  const [editedProfile, setEditedProfile] = useState<UserProfile>(profile);

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    taskUpdates: true,
    projectUpdates: false,
    comments: true,
    assignments: true,
  });

  // Mock stats data
  const stats = [
    {
      label: "Tasks Completed",
      value: "142",
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      label: "Projects Active",
      value: "8",
      icon: Activity,
      color: "text-blue-600",
    },
    {
      label: "Team Members",
      value: "24",
      icon: Users,
      color: "text-purple-600",
    },
    {
      label: "Hours This Month",
      value: "156",
      icon: Clock,
      color: "text-orange-600",
    },
  ];

  // Mock recent activity
  const recentActivity: ActivityItem[] = [
    {
      id: "1",
      type: "task",
      title: "Completed authentication system",
      description: "Finished implementing JWT-based authentication",
      timestamp: "2 hours ago",
      status: "completed",
    },
    {
      id: "2",
      type: "project",
      title: "DevTask App",
      description: "Updated project timeline and milestones",
      timestamp: "1 day ago",
      status: "updated",
    },
    {
      id: "3",
      type: "comment",
      title: "New comment on design review",
      description: "Added feedback on the new dashboard mockups",
      timestamp: "2 days ago",
    },
    {
      id: "4",
      type: "assignment",
      title: "New task assigned",
      description: "Database optimization for user queries",
      timestamp: "3 days ago",
      status: "pending",
    },
  ];

  const skills = [
    "React",
    "TypeScript",
    "Node.js",
    "Python",
    "PostgreSQL",
    "AWS",
    "Docker",
    "GraphQL",
    "Redis",
    "MongoDB",
  ];

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "task":
        return CheckCircle;
      case "project":
        return Activity;
      case "comment":
        return Mail;
      case "assignment":
        return User;
      default:
        return Activity;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "task":
        return "text-green-600";
      case "project":
        return "text-blue-600";
      case "comment":
        return "text-purple-600";
      case "assignment":
        return "text-orange-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Profile</h1>
          <p className="text-gray-400 mt-1">
            Manage your account settings and preferences
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button
                onClick={handleSave}
                size="sm"
                className="bg-green-600 hover:bg-green-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
              <Button onClick={handleCancel} variant="outline" size="sm">
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setIsEditing(true)}
              size="sm"
              className="rounded-br-2xl"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800/50">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-gray-700"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="activity"
            className="data-[state=active]:bg-gray-700"
          >
            Activity
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="data-[state=active]:bg-gray-700"
          >
            Settings
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="data-[state=active]:bg-gray-700"
          >
            Security
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <Card className="lg:col-span-1 bg-dark border-gray-00">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="relative">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src={profile.avatar} alt={user?.full_name} />
                      <AvatarFallback className="bg-blue-600 text-white text-2xl">
                        {user?.full_name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <Button
                        size="sm"
                        className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                      >
                        <Camera className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <div className="mt-4 space-y-2">
                    {isEditing ? (
                      <Input
                        value={editedProfile.name}
                        onChange={(e) =>
                          setEditedProfile({
                            ...editedProfile,
                            name: e.target.value,
                          })
                        }
                        className="text-center bg-gray-700 border-gray-600"
                      />
                    ) : (
                      <h3 className="text-xl font-semibold text-white">
                        {user?.full_name}
                      </h3>
                    )}

                    <p className="text-blue-400">{profile.role}</p>
                    <p className="text-gray-400 text-sm">
                      {profile.department}
                    </p>
                  </div>

                  <div className="mt-4 space-y-2 w-full">
                    <div className="flex items-center text-sm text-gray-400">
                      <Mail className="w-4 h-4 mr-2" />
                      {user?.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                      <MapPin className="w-4 h-4 mr-2" />
                      {profile.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                      <Calendar className="w-4 h-4 mr-2" />
                      Joined {new Date(profile.joinDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats and Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <Card
                      key={index}
                      className="bg-gray-800/50 border-gray-700"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-400">
                              {stat.label}
                            </p>
                            <p className="text-2xl font-bold text-white">
                              {stat.value}
                            </p>
                          </div>
                          <Icon className={`w-8 h-8 ${stat.color}`} />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Bio and Skills */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">About</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditing ? (
                    <Textarea
                      value={editedProfile.bio}
                      onChange={(e) =>
                        setEditedProfile({
                          ...editedProfile,
                          bio: e.target.value,
                        })
                      }
                      rows={4}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  ) : (
                    <p className="text-gray-300">{profile.bio}</p>
                  )}

                  <div>
                    <h4 className="text-sm font-medium text-white mb-2">
                      Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-blue-600/20 text-blue-400 hover:bg-blue-600/30"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-6">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Recent Activity</CardTitle>
              <CardDescription className="text-gray-400">
                Your recent actions and updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => {
                  const Icon = getActivityIcon(activity.type);
                  return (
                    <div
                      key={activity.id}
                      className="flex items-start space-x-3 p-3 rounded-lg bg-gray-700/30"
                    >
                      <div
                        className={`p-2 rounded-full bg-gray-700 ${getActivityColor(
                          activity.type
                        )}`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-white">
                          {activity.title}
                        </h4>
                        <p className="text-sm text-gray-400 mt-1">
                          {activity.description}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {activity.timestamp}
                        </p>
                      </div>
                      {activity.status && (
                        <Badge variant="outline" className="text-xs">
                          {activity.status}
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Information */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">
                    Email
                  </Label>
                  <Input
                    id="email"
                    value={editedProfile.email}
                    onChange={(e) =>
                      setEditedProfile({
                        ...editedProfile,
                        email: e.target.value,
                      })
                    }
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-300">
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    value={editedProfile.phone}
                    onChange={(e) =>
                      setEditedProfile({
                        ...editedProfile,
                        phone: e.target.value,
                      })
                    }
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-gray-300">
                    Location
                  </Label>
                  <Input
                    id="location"
                    value={editedProfile.location}
                    onChange={(e) =>
                      setEditedProfile({
                        ...editedProfile,
                        location: e.target.value,
                      })
                    }
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone" className="text-gray-300">
                    Timezone
                  </Label>
                  <Select
                    value={editedProfile.timezone}
                    onValueChange={(value) =>
                      setEditedProfile({ ...editedProfile, timezone: value })
                    }
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="PST">Pacific Standard Time</SelectItem>
                      <SelectItem value="EST">Eastern Standard Time</SelectItem>
                      <SelectItem value="GMT">Greenwich Mean Time</SelectItem>
                      <SelectItem value="CET">Central European Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Preferences */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="language" className="text-gray-300">
                    Language
                  </Label>
                  <Select
                    value={editedProfile.language}
                    onValueChange={(value) =>
                      setEditedProfile({ ...editedProfile, language: value })
                    }
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Spanish">Spanish</SelectItem>
                      <SelectItem value="French">French</SelectItem>
                      <SelectItem value="German">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-white">
                    Notifications
                  </h4>
                  {Object.entries(notifications).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between"
                    >
                      <Label htmlFor={key} className="text-gray-300 capitalize">
                        {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                      </Label>
                      <Switch
                        id={key}
                        checked={value}
                        onCheckedChange={(checked) =>
                          setNotifications({ ...notifications, [key]: checked })
                        }
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card className="bg-dark border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Security Settings
              </CardTitle>
              <CardDescription className="text-gray-400">
                Manage your account security and privacy settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password" className="text-gray-300">
                  Current Password
                </Label>
                <Input
                  id="current-password"
                  type="password"
                  className="bg-black border-gray-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-gray-300">
                  New Password
                </Label>
                <Input
                  id="new-password"
                  type="password"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-gray-300">
                  Confirm New Password
                </Label>
                <Input
                  id="confirm-password"
                  type="password"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <Button className="rounded-br-2xl">Update Password</Button>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">
                Two-Factor Authentication
              </CardTitle>
              <CardDescription className="text-gray-400">
                Add an extra layer of security to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Enable 2FA</p>
                  <p className="text-sm text-gray-400">
                    Secure your account with two-factor authentication
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
