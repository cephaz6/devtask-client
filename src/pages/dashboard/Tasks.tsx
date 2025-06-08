import { Plus } from "lucide-react";
import { Button } from "../../components/ui/button";

const Tasks = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-gray-600">Your tasks will appear here.</p>
      </div>
    </div>
  );
};

export default Tasks;
