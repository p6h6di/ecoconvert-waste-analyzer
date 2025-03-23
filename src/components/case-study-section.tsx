import React from "react";
import Image from "next/image";
import CaseStudyOne from "@/assets/img/case-study-1.png";
import CaseStudyTwo from "@/assets/img/case-study-2.png";
import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContent,
  MorphingDialogTitle,
  MorphingDialogImage,
  MorphingDialogSubtitle,
  MorphingDialogClose,
  MorphingDialogDescription,
  MorphingDialogContainer,
} from "@/components/ui/morphing-dialog";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

const CaseStudySection = () => {
  return (
    <section id="case-studies" className="space-y-8">
      <h1 className="font-bold text-2xl">Case studies</h1>
      <div className="grid grid-cols-2 gap-3">
        <Link
          href="https://pmc.ncbi.nlm.nih.gov/articles/PMC10658231"
          target="_blank"
          className="w-full space-y-2"
        >
          <Image
            src={CaseStudyOne}
            alt="case-study-1"
            width={1080}
            height={260}
            className="object-cover rounded-xl"
          />
          <h1 className="text-base font-medium">
            Solid Waste Composition and Its Management
          </h1>
          <p className="text-sm text-[#788763]">
            A Case Study of Kirtipur Municipality
          </p>
        </Link>

        <Link
          href="https://en.wikipedia.org/wiki/Sustainable_Technology_Optimization_Research_Center"
          target="_blank"
          className="w-full space-y-2"
        >
          <Image
            src={CaseStudyTwo}
            alt="case-study-1"
            width={1080}
            height={260}
            className="object-cover rounded-xl"
          />
          <h1 className="text-base font-medium">
            Sustainable Technology Optimization Research Center
          </h1>
          <p className="text-sm text-[#788763]">
            California State University, Sacramento
          </p>
        </Link>
      </div>
    </section>
  );
};

export default CaseStudySection;
