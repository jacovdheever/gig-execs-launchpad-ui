import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-white">404</h1>
        <p className="text-xl text-white mb-4 opacity-90">Oops! Page not found</p>
        <a href="/" className="text-blue-300 hover:text-blue-100 underline">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
