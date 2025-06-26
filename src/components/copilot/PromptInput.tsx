import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Sparkles, Mic, Image } from "lucide-react";
import { useState } from "react";

type Props = {
  prompt: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  loading?: boolean;
};

export function PromptInput({ prompt, onChange, onSubmit, loading }: Props) {
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  const examplePrompts = [
    "Learn web development from scratch in 3 months",
    "Build a mobile app for my startup idea",
    "Master data science for career transition",
    "Create a personal finance management system",
  ];

  return (
    <div className="space-y-4">
      <div className="relative">
        <div
          className={`
          relative rounded-2xl border-2 transition-all duration-300 bg-white dark:bg-slate-900
          ${
            isFocused
              ? "border-indigo-500 shadow-lg shadow-indigo-500/20 dark:border-indigo-400"
              : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
          }
          ${loading ? "animate-pulse" : ""}
        `}
        >
          <div className="flex items-center gap-3 p-4">
            <Sparkles
              className={`h-5 w-5 transition-colors duration-200 ${
                isFocused ? "text-indigo-500" : "text-slate-400"
              }`}
            />

            <Input
              placeholder="Describe your learning goal or project idea..."
              value={prompt}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              disabled={loading}
              className="flex-1 border-0 bg-transparent text-base placeholder:text-slate-500 focus-visible:ring-0 focus-visible:ring-offset-0 dark:placeholder:text-slate-400"
            />

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                disabled={loading}
              >
                <Mic className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                disabled={loading}
              >
                <Image className="h-4 w-4" />
              </Button>

              <Button
                onClick={onSubmit}
                disabled={loading || !prompt.trim()}
                className={`
                  h-10 w-10 p-0 rounded-xl transition-all duration-200
                  ${
                    prompt.trim() && !loading
                      ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl hover:scale-110 active:scale-95"
                      : "bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed"
                  }
                `}
              >
                <Send
                  className={`h-4 w-4 transition-transform duration-200 ${
                    loading ? "animate-pulse" : "group-hover:translate-x-0.5"
                  }`}
                />
              </Button>
            </div>
          </div>
        </div>

        {/* Character counter */}
        <div className="absolute -bottom-6 right-0 text-xs text-slate-400">
          {prompt.length}/500
        </div>
      </div>

      {/* Example prompts */}
      {!prompt && !loading && (
        <div className="space-y-3">
          <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
            Try these examples:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {examplePrompts.map((example, index) => (
              <button
                key={index}
                onClick={() => onChange(example)}
                className="text-left p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200 text-sm text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600"
              >
                "{example}"
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
