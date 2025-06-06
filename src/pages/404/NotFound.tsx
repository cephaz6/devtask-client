// src/pages/NotFound.tsx

import { Home } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center text-2xl font-semibold">
      404 - Page Not Found
      <div className="flex p-4">
        <Home />
        <Link to={"/"} className="mx-2 font-bold text-avocado-600">
          {" "}
          Go home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
