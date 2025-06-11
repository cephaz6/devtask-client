// src/pages/NotFound.tsx

import { Button } from "../../components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div>
          <img
            src="https://assets.dochipo.com/editor/animations/404-error/a6b2b4d8-520a-48df-aceb-e44b0f958919.gif"
            alt=""
            width={200}
          />
        </div>
        <p className="mt-4 text-xl ">
          🤭⛓️‍💥 <br /> Page not found
        </p>
        <div className="mt-6">
          <Button
            className="rounded-l-4xl rounded-br-3xl hover:rounded-tl-3xl"
            asChild
          >
            <Link to="/dashboard" className="">
              Go back to DevTask Tracker
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
