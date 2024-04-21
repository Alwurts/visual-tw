import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface ZoomSelectProps {
  zoom: string;
  handleZoomChange: (zoomLevel: string) => void;
}

export default function ZoomSelect({
  zoom,
  handleZoomChange,
}: ZoomSelectProps) {
  const possibleZoomLevels = [
    { value: "0.25", label: "25%" },
    { value: "0.5", label: "50%" },
    { value: "0.75", label: "75%" },
    { value: "1", label: "100%" },
    { value: "AUTO", label: "Auto Zoom" },
  ];

  return (
    <Select onValueChange={handleZoomChange} value={zoom}>
      <SelectTrigger className="h-auto px-2 py-1 text-white dark:hover:bg-editor-accent">
        <SelectValue placeholder="Zoom Level" />
      </SelectTrigger>
      <SelectContent className="border-editor-gray-dark bg-editor-gray-light text-white">
        <SelectGroup>
          <SelectLabel>Zoom Level</SelectLabel>
          {possibleZoomLevels.map((zoomLevel) => (
            <SelectItem key={zoomLevel.value} value={zoomLevel.value}>
              {zoomLevel.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
