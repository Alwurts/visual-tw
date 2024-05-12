import { cn } from "@/lib/utils";

export default function BaseLayout({
  children,
  toolbar,
  className,
}: {
  children: React.ReactNode;
  toolbar?: React.ReactNode;
  className?: string;
}) {
  return (
    <main className="bg-editor-black">
      <nav className="flex h-[32px] justify-between bg-editor-gray-medium px-4 py-1">
        <h1 className="font-bold text-white">
          Visual-
          <span className="text-editor-accent">TW</span>
        </h1>
        {toolbar}
      </nav>
      <div className={cn("h-[calc(100dvh-32px)]", className)}>{children}</div>
    </main>
  );
}
