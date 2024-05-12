import { Frown } from "lucide-react";
import { Link, useRouteError } from "react-router-dom";
import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";

export default function ErrorBoundary() {
  const error = useRouteError();

  console.error("ErrorBoundary", error);

  // Uncaught ReferenceError: path is not defined
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-editor-black text-white">
      <div className="flex flex-col items-center space-y-3">
        <Frown className="h-20 w-20" />
        <p className="max-w-80 text-center text-xl">
          There was an error, please try reloading or visiting another page.
        </p>
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
