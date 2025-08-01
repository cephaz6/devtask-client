import { useState } from "react";
import { generateTasks } from "@/lib/api";
import { SuggestedTopics } from "@/components/copilot/SuggestedTopics";
import { PromptInput } from "@/components/copilot/PromptInput";
import { ProjectPreview } from "@/components/copilot/ProjectPreview";
import { Loader2, Sparkles, Brain } from "lucide-react";
import type { GeneratedProject } from "@/types";

export default function Copilot() {
  const [prompt, setPrompt] = useState("");
  const [project, setProject] = useState<GeneratedProject | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePromptSubmit = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    setProject(null);

    try {
      const data = await generateTasks(prompt);
      setProject(data);
    } catch (err) {
      setError("Failed to generate project. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen  dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="relative">
              <Brain className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />
              <Sparkles className="h-6 w-6 text-yellow-500 absolute -top-2 -right-2 animate-pulse" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              DevTask Co-Pilot
            </h1>
          </div>
          <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
            What do you want me to help you with today?
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Transform your ideas into structured paths and actionable tasks.
            Just describe what you want to achieve, and I'll create a
            personalized roadmap for you.
          </p>
        </div>

        {/* Features Grid */}
        {/* <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3 mb-3">
              <Target className="h-8 w-8 text-green-500" />
              <h3 className="font-semibold text-slate-800 dark:text-slate-200">
                Smart Planning
              </h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              AI-powered task breakdown with realistic timelines and priorities
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3 mb-3">
              <Zap className="h-8 w-8 text-yellow-500" />
              <h3 className="font-semibold text-slate-800 dark:text-slate-200">
                Instant Results
              </h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Get structured learning paths and project plans in seconds
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3 mb-3">
              <Brain className="h-8 w-8 text-indigo-500" />
              <h3 className="font-semibold text-slate-800 dark:text-slate-200">
                Personalized
              </h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Tailored recommendations based on your specific goals and context
            </p>
          </div>
        </div> */}

        {/* Main Content */}
        <div className="space-y-8">
          <SuggestedTopics onSelect={setPrompt} />

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl border border-slate-200 dark:border-slate-700">
            <PromptInput
              prompt={prompt}
              onChange={setPrompt}
              onSubmit={handlePromptSubmit}
              loading={loading}
            />
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-600 dark:text-red-400 text-sm font-medium">
                {error}
              </p>
            </div>
          )}

          {loading && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 shadow-xl border border-slate-200 dark:border-slate-700">
              <div className="flex flex-col items-center space-y-6">
                <div className="relative">
                  <Loader2 className="animate-spin h-12 w-12 text-indigo-600" />
                  <div className="absolute inset-0 rounded-full border-4 border-indigo-200 dark:border-indigo-800 animate-pulse"></div>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
                    Crafting Your Learning Path
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Our AI is analyzing your request and creating a personalized
                    roadmap...
                  </p>
                </div>
              </div>
            </div>
          )}

          {project && (
            <div className="animate-in slide-in-from-bottom-4 duration-500">
              <ProjectPreview project={project} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
