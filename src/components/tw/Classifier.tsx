import { ITailwindClass } from "@/types/tailwind/base";
import BgColorPicker from "./background/BgColorPicker";
import Default from "./Default";

interface ClassifierProps {
  twClass: ITailwindClass;
}

export default function Classifier({ twClass }: ClassifierProps) {
  if (twClass.category && twClass.subcategory) {
    switch (twClass.subcategory) {
      case "Background_Color":
        return <BgColorPicker twClass={twClass} />;
      default:
        return <Default twClass={twClass} />;
    }
  }
}
