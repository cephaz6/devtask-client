import {
  Cpu,
  BarChart3,
  Palette,
  Globe,
  Smartphone,
  Shield,
} from "lucide-react";

const topics = [
  //   {
  //     label: "Learn Python in 30 Days",
  //     icon: Code,
  //     color:
  //       "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700",
  //   },
  //   {
  //     label: "Master Git & GitHub",
  //     icon: Database,
  //     color:
  //       "bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-700",
  //   },
  //   {
  //     label: "Become a React Pro",
  //     icon: Cpu,
  //     color:
  //       "bg-cyan-100 text-cyan-700 border-cyan-200 hover:bg-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-300 dark:border-cyan-700",
  //   },
  {
    label: "Learn SQL for Data Analysis ",
    icon: BarChart3,
    color:
      "bg-green-100 text-green-700 border-green-200 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700",
  },
  {
    label: "Get Started with Machine Learning",
    icon: Cpu,
    color:
      "bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700",
  },
  {
    label: "UI/UX Design Fundamentals ",
    icon: Palette,
    color:
      "bg-pink-100 text-pink-700 border-pink-200 hover:bg-pink-200 dark:bg-pink-900/30 dark:text-pink-300 dark:border-pink-700",
  },
  {
    label: "Build a Full-Stack Ecommerce Website in 15 Days",
    icon: Globe,
    color:
      "bg-indigo-100 text-indigo-700 border-indigo-200 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-700",
  },
  {
    label: "Mobile App Development",
    icon: Smartphone,
    color:
      "bg-teal-100 text-teal-700 border-teal-200 hover:bg-teal-200 dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-700",
  },
  {
    label: "Cybersecurity Basics",
    icon: Shield,
    color:
      "bg-red-100 text-red-700 border-red-200 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700",
  },
];

type Props = {
  onSelect: (value: string) => void;
};

export function SuggestedTopics({ onSelect }: Props) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
          {/* Popular Learning Paths */}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {/* Quick start with these trending topics, or type your own idea below */}
          Popular Learning Paths ...
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {topics.map((topic) => {
          const Icon = topic.icon;
          return (
            <div
              key={topic.label}
              onClick={() => onSelect(topic.label)}
              className={`
                ${topic.color}
                cursor-pointer rounded-xl p-4 border-2 transition-all duration-200 
                hover:scale-105 hover:shadow-lg active:scale-95
                group
              `}
            >
              <div className="flex items-center gap-3">
                <Icon className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                <span className="font-medium text-sm">{topic.label}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          💡 Tip: Be specific about your goals, timeline, and current skill
          level for better results
        </p>
      </div>
    </div>
  );
}
