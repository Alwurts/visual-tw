import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "./ui/textarea";
import * as dbTools from "@/lib/db/proxy";
import { useNavigate } from "react-router-dom";

export function NewProject() {
  const navigate = useNavigate();

  const createNewProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Create new project");

    const form = e.target as HTMLFormElement;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const description = (
      form.elements.namedItem("description") as HTMLInputElement
    ).value;

    const newProjectId = await dbTools.createNewProject(name, description);
    navigate(`/${newProjectId}`);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="tool" className="dark:bg-editor-accent">
          Create new project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Create a new project to start coding
          </DialogDescription>
        </DialogHeader>
        <form className="grid gap-4 py-4" onSubmit={createNewProject}>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              required
              minLength={1}
              placeholder="Your project name"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="A short description of your project"
              className="col-span-3"
            />
          </div>
          <DialogFooter>
            <Button variant="tool" type="submit">
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
