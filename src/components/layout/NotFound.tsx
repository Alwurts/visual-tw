import { Frown } from "lucide-react";
import { Link } from "react-router-dom";
import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  // Uncaught ReferenceError: path is not defined
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-editor-black text-white">
      <div className="flex flex-col items-center space-y-1">
        <Frown className="h-16 w-16" />
        <h1 className="text-4xl">404</h1>
        <h2 className="text-2xl">Page Not Found</h2>
      </div>
      <Link
        to="/"
        className={cn(
          buttonVariants({
            variant: "link",
            size: "sm",
          }),
          "mt-4 text-2xl dark:text-editor-accent",
        )}
      >
        GO HOME
      </Link>
    </div>
  );
}
