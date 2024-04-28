import { ITailwindClass } from "@/types/tailwind/base";
import BgColorPicker from "./inputs/background/BgColorPicker";
import Default from "./inputs/Readonly";

interface InputClassifierProps {
  twClass: ITailwindClass;
}

export default function InputClassifier({ twClass }: InputClassifierProps) {
  if (twClass.category && twClass.subcategory) {
    switch (twClass.subcategory) {
      case "Background_Color":
        return <BgColorPicker twClass={twClass} />;
      default:
        return <Default twClass={twClass} />;
    }
  }
}
