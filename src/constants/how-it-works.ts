import Recycle from "@/assets/img/recycle.png";
import Landfill from "@/assets/img/landfill.png";
import WasteToEnergy from "@/assets/img/waste-to-energy.png";

export const HOW_IT_WORKS = [
  {
    icon: Recycle,
    title: "Upload Waste Image",
    description:
      "Start by uploading a clear image of the waste item. Ensure the image is well-lit for accurate detection.",
    alt: "recycle",
  },
  {
    icon: Landfill,
    title: "Waste Category Prediction",
    description:
      "Our machine learning model analyzes the image to accurately identify the waste category, ensuring precise categorization.",
    alt: "landfill",
  },
  {
    icon: WasteToEnergy,
    title: "Energy Conversion Ideas",
    description:
      "Based on the identified category, we suggest detailed energy conversion ideas to transform waste into sustainable energy.",
    alt: "waste-to-energy",
  },
];
