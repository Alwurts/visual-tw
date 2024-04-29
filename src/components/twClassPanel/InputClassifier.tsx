import { ITailwindClassClassified } from "@/types/tailwind/base";
import BackgroundColor from "@/components/twClassPanel/inputs/background/BackgroundColor";
import Default from "@/components/twClassPanel/inputs/Readonly";

interface InputClassifierProps {
  twClass: ITailwindClassClassified;
}

export default function InputClassifier({ twClass }: InputClassifierProps) {
  if (twClass.category && twClass.subcategory) {
    switch (twClass.subcategory) {
      case "Background_Color":
        return <BackgroundColor twClass={twClass} />;
      default:
        return <Default twClass={twClass} />;
    }
  }
}
