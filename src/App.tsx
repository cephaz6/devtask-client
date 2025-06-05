import { Button } from "@/components/ui/button";

function App() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Welcome to My App</h1>
      <Button className="rounded-full">Click Me</Button>
      <p className="mt-4 text-gray-700">
        This is a simple example of a React app with Tailwind CSS.
      </p>
    </div>
  );
}

export default App;
