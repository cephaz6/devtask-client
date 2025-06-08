// src/pages/NotFound.tsx

import { Button } from "../../components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900">404</h1>
        <p className="mt-4 text-xl text-gray-600">Page not found</p>
        <div className="mt-6">
          <Button asChild>
            <Link to="/">Go back home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
