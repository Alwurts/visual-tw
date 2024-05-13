import { Github, Globe, MonitorSmartphone, XIcon } from "lucide-react";
import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";

export default function OrientationError() {
  // Uncaught ReferenceError: path is not defined
  return (
    <div className="flex h-screen flex-col  items-center justify-start overflow-y-auto bg-editor-black px-10 text-white scrollbar scrollbar-thumb-neutral-700">
      <div className="my-10 flex  flex-col items-center space-y-1 px-4">
        <MonitorSmartphone className="h-16 w-16" />
        <h1 className="text-2xl">Screen dimensions error</h1>
        <p className="">
          The editor does not support small screens for now. Please rotate your
          device or use a device with a larger screen.
        </p>
      </div>
      <Separator className="dark:bg-editor-gray-medium" />

      <div className="my-10 flex-initial px-4 text-white lg:px-16">
        <div>
          <h2 className="mb-5 text-xl font-bold text-white">
            Welcome to Visual-TW
            <span className="text-editor-accent"> beta</span>
          </h2>
          <p className="text-white">
            Visual-TW is a visual editor for HTML and Tailwind CSS. Create and
            edit projects visually or in code.
          </p>
          <p className="mt-2">
            The editor features run entirely in the browser making sure your
            projects are private and secure.
          </p>
          <p className="mt-2">
            This project is open-source and free to use. If you like it, please
            consider supporting the project by sharing it with your friends.
          </p>
          <a
            className={cn(
              buttonVariants({ variant: "link", size: "tool" }),
              "mt-5 text-base font-normal italic dark:hover:text-editor-accent",
            )}
            href="https://www.alwurts.com"
            target="_blank"
          >
            Alejandro Wurts
          </a>
        </div>
        <Separator className="my-4 dark:bg-editor-gray-medium" />
        <div className="space-y-2">
          <p className="">Follow the project progress on:</p>
          <div className="flex space-x-2">
            <a
              className={buttonVariants({ variant: "tool", size: "icon" })}
              href="https://github.com/Alwurts/visual-tw"
              target="_blank"
              title="View on Github"
            >
              <Github className="h-6 w-6 dark:text-white" />
            </a>
            <a
              className={buttonVariants({ variant: "tool", size: "icon" })}
              href="https://twitter.com/Alwurts"
              target="_blank"
              title="Follow on X"
            >
              <XIcon className="h-6 w-6 dark:text-white" />
            </a>
            <a
              className={buttonVariants({ variant: "tool", size: "icon" })}
              href="https://www.alwurts.com"
              target="_blank"
              title="View on alwurts.com"
            >
              <Globe className="h-6 w-6 dark:text-white" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
