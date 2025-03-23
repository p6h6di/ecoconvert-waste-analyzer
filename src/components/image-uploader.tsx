"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useImageUpload } from "@/hooks/use-image-upload";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import {
  AudioLines,
  FileText,
  FileWarning,
  ImagePlus,
  Info,
  Loader2,
  Play,
  Trash2,
  TriangleAlert,
  Upload,
  X,
} from "lucide-react";
import Image from "next/image";
import { Button } from "./ui/button";
import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";
import AnalysisCharts from "./analysis-charts";
import {
  PDFDocument,
  PDFFont,
  PDFPage,
  RGB,
  rgb,
  StandardFonts,
} from "pdf-lib";
import { format } from "date-fns";
import { UserButton } from "@clerk/nextjs";

interface ImageAnalysisResult {
  predictions: Array<{
    className: string;
    probability: number;
  }>;
  isWaste: boolean;
  wasteCategories: string[];
  categoryDetails: Array<{
    category: string;
    description: string;
    energyEfficiency: EnergyEfficiency;
  }>;
  recommendations: EnergyConversionMethod[];
}

interface EnergyEfficiency {
  potentialEnergy: string;
  conversionEfficiency: string;
  bestMethods: string;
  carbonFootprint: string;
  resourceRecovery: string;
  metrics: {
    potentialEnergy: number;
    conversionEfficiency: number;
    processingComplexity: number;
    carbonFootprint: number;
    resourceRecovery: number;
  };
}

interface EnergyConversionMethod {
  method: string;
  description: string;
  efficiency: string;
  wasteTypes: string;
  environmentalBenefits: string;
}

interface ImageUploaderProps {
  onAnalysisComplete?: (result: ImageAnalysisResult) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onAnalysisComplete,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [model, setModel] = useState<mobilenet.MobileNet | null>(null);
  const [modelLoading, setModelLoading] = useState<boolean>(false);
  const [modelError, setModelError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] =
    useState<ImageAnalysisResult | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>("overview");
  const [pdfGenerating, setPdfGenerating] = useState<boolean>(false);

  useEffect(() => {
    const loadTensorflowAndModel = async () => {
      try {
        setModelLoading(true);
        await tf.ready();
        const loadedModel = await mobilenet.load();
        setModel(loadedModel);
        setModelLoading(false);
      } catch (error) {
        console.error(
          "Failed to load TensorFlow.js or MobileNet model:",
          error
        );
        setModelError("Failed to load AI model. Please try again later.");
        setModelLoading(false);
      }
    };

    loadTensorflowAndModel();

    return () => {
      // Cleanup if needed
    };
  }, []);

  const {
    previewUrl,
    fileName,
    fileInputRef,
    imageElement,
    handleThumbnailClick,
    handleFileChange,
    handleRemove,
  } = useImageUpload({
    onUpload: () => {
      setAnalysisResult(null);
    },
  });

  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const file = e.dataTransfer.files?.[0];
      if (file && file.type.startsWith("image/")) {
        const fakeEvent = {
          target: {
            files: [file],
          },
        } as unknown as React.ChangeEvent<HTMLInputElement>;
        handleFileChange(fakeEvent);
      }
    },
    [handleFileChange]
  );

  const analyzeImage = async () => {
    if (!imageElement || !model) return;

    try {
      setIsLoading(true);

      const predictions = await model.classify(imageElement);

      const {
        wasteCategories,
        wasteKeywords,
        wasteCategoryDetails,
        energyConversionMethods,
      } = await import("@/lib/waste-data");

      let isWaste = false;
      for (const prediction of predictions) {
        const className = prediction.className.toLowerCase();
        for (const keyword of wasteKeywords) {
          if (className.includes(keyword)) {
            isWaste = true;
            break;
          }
        }
        if (isWaste) break;
      }

      const detectedCategories = new Set<string>();
      predictions.forEach((prediction) => {
        const className = prediction.className.toLowerCase();
        Object.entries(wasteCategories).forEach(([category, keywords]) => {
          keywords.forEach((keyword) => {
            if (className.includes(keyword)) {
              detectedCategories.add(category);
            }
          });
        });
      });

      const resultCategories = Array.from(detectedCategories);
      if (resultCategories.length === 0 && isWaste) {
        resultCategories.push("unknown");
      }

      const recommendations = resultCategories.flatMap((category) => {
        return (
          energyConversionMethods[
            category as keyof typeof energyConversionMethods
          ] || energyConversionMethods.unknown
        );
      });

      const categoryDetails = resultCategories.map((category) => {
        return {
          category,
          ...wasteCategoryDetails[
            category as keyof typeof wasteCategoryDetails
          ],
        };
      });

      const result: ImageAnalysisResult = {
        predictions,
        isWaste,
        wasteCategories: resultCategories,
        categoryDetails,
        recommendations,
      };

      setAnalysisResult(result);

      if (onAnalysisComplete) {
        onAnalysisComplete(result);
      }
    } catch (error) {
      console.error("Error analyzing image:", error);
      setModelError("Failed to analyze image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const generatePDF = async () => {
    if (!analysisResult) return;

    try {
      setPdfGenerating(true);

      // Create a new PDF document
      const pdfDoc = await PDFDocument.create();

      // Get fonts
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      // Define colors and constants
      const primaryColor = rgb(0.06, 0.5, 0.31); // Green
      const textColor = rgb(0.2, 0.2, 0.2);
      const lightGray = rgb(0.9, 0.9, 0.9);
      const pageWidth = 595.28;
      const pageHeight = 841.89;
      const margin = 50;
      const contentWidth = pageWidth - margin * 2;
      const headerHeight = 100;
      const footerHeight = 40;
      const sectionSpacing = 20;
      const lineHeight = {
        title: 32,
        heading: 24,
        normal: 18,
        small: 14,
      };

      // Helper function to draw wrapped text
      const drawWrappedText = (
        page: PDFPage,
        text: string,
        {
          x,
          y,
          width,
          size,
          font,
          color,
        }: {
          x: number;
          y: number;
          width: number;
          size: number;
          font: PDFFont;
          color: RGB;
        }
      ) => {
        const words = text.split(" ");
        let line = "";
        let currentY = y;
        const maxWidth = width || pageWidth - x - margin;

        for (let i = 0; i < words.length; i++) {
          const testLine = line + words[i] + " ";
          const testWidth = font.widthOfTextAtSize(testLine, size);

          if (testWidth > maxWidth) {
            page.drawText(line, { x, y: currentY, size, font, color });
            line = words[i] + " ";
            currentY -= lineHeight.normal;

            // Check if we need a new page
            if (currentY < footerHeight + margin) {
              const newPage = pdfDoc.addPage([pageWidth, pageHeight]);
              drawPageHeader(
                newPage,
                "Content Continued",
                helveticaBold,
                helveticaFont,
                primaryColor
              );
              drawPageFooter(newPage, helveticaFont, textColor);
              currentY = pageHeight - headerHeight - margin;
              page = newPage;
            }
          } else {
            line = testLine;
          }
        }

        if (line.trim().length > 0) {
          page.drawText(line, { x, y: currentY, size, font, color });
          currentY -= lineHeight.normal;
        }

        return currentY;
      };

      // Helper function to draw section header
      const drawSectionHeader = (
        page: PDFPage,
        text: string,
        y: number,
        font: PDFFont,
        color: RGB
      ) => {
        page.drawRectangle({
          x: margin,
          y: y - 10,
          width: contentWidth,
          height: 30,
          color: lightGray,
        });

        page.drawText(text, {
          x: margin + 10,
          y: y,
          size: 14,
          font: font,
          color: color,
        });

        return y - 30;
      };

      // Helper function to draw page header
      const drawPageHeader = (
        page: PDFPage,
        subtitle: string,
        boldFont: PDFFont,
        regularFont: PDFFont,
        bgColor: RGB
      ) => {
        page.drawRectangle({
          x: 0,
          y: pageHeight - headerHeight,
          width: pageWidth,
          height: headerHeight,
          color: bgColor,
        });

        page.drawText("ECOCONVERT LABS", {
          x: margin,
          y: pageHeight - 50,
          size: 24,
          font: boldFont,
          color: rgb(1, 1, 1),
        });

        page.drawText(subtitle, {
          x: margin,
          y: pageHeight - 80,
          size: 16,
          font: regularFont,
          color: rgb(1, 1, 1),
        });

        return pageHeight - headerHeight - 20;
      };

      // Helper function to draw page footer
      const drawPageFooter = (page: PDFPage, font: PDFFont, color: RGB) => {
        page.drawText(
          "© 2025 EcoConvert Labs - Turning Waste into Sustainable Energy",
          {
            x: pageWidth / 2 - 150,
            y: 30,
            size: 10,
            font: font,
            color: color,
          }
        );
      };

      // Create first page
      const page1 = pdfDoc.addPage([pageWidth, pageHeight]);
      let currentY = drawPageHeader(
        page1,
        "Waste Analysis Report",
        helveticaBold,
        helveticaFont,
        primaryColor
      );

      // Date and time
      const currentDate = format(new Date(), "MMMM d, yyyy 'at' h:mm a");
      page1.drawText(`Generated on: ${currentDate}`, {
        x: margin,
        y: currentY,
        size: 10,
        font: helveticaFont,
        color: textColor,
      });
      currentY -= sectionSpacing;

      // Summary section
      currentY = drawSectionHeader(
        page1,
        "ANALYSIS SUMMARY",
        currentY,
        helveticaBold,
        textColor
      );

      page1.drawText(
        `Waste Detected: ${analysisResult.isWaste ? "Yes" : "No"}`,
        {
          x: margin + 10,
          y: currentY,
          size: 12,
          font: helveticaFont,
          color: textColor,
        }
      );
      currentY -= lineHeight.normal;

      if (analysisResult.wasteCategories.length > 0) {
        const categoriesText = `Categories: ${analysisResult.wasteCategories.join(", ")}`;
        currentY = drawWrappedText(page1, categoriesText, {
          x: margin + 10,
          y: currentY,
          width: contentWidth - 20,
          size: 12,
          font: helveticaFont,
          color: textColor,
        });
      }
      currentY -= sectionSpacing;

      // Predictions section
      currentY = drawSectionHeader(
        page1,
        "AI PREDICTIONS",
        currentY,
        helveticaBold,
        textColor
      );

      for (let i = 0; i < Math.min(5, analysisResult.predictions.length); i++) {
        const prediction = analysisResult.predictions[i];
        const probability = (prediction.probability * 100).toFixed(2);
        const predictionText = `${i + 1}. ${prediction.className}: ${probability}%`;

        page1.drawText(predictionText, {
          x: margin + 10,
          y: currentY,
          size: 11,
          font: helveticaFont,
          color: textColor,
        });
        currentY -= lineHeight.normal;
      }
      currentY -= sectionSpacing;

      // Create a function to handle page breaks
      const ensurePageSpace = (requiredSpace: number) => {
        if (currentY - requiredSpace < footerHeight + margin) {
          // Add a new page if there's not enough space
          drawPageFooter(
            pdfDoc.getPage(pdfDoc.getPageCount() - 1),
            helveticaFont,
            textColor
          );
          const newPage = pdfDoc.addPage([pageWidth, pageHeight]);
          currentY = drawPageHeader(
            newPage,
            "Waste Analysis Report (Continued)",
            helveticaBold,
            helveticaFont,
            primaryColor
          );
          return newPage;
        }
        return pdfDoc.getPage(pdfDoc.getPageCount() - 1);
      };

      // Category details section
      if (analysisResult.categoryDetails.length > 0) {
        let currentPage = ensurePageSpace(50);
        currentY = drawSectionHeader(
          currentPage,
          "WASTE CATEGORY DETAILS",
          currentY,
          helveticaBold,
          textColor
        );

        for (const category of analysisResult.categoryDetails) {
          currentPage = ensurePageSpace(120); // Estimate space needed for a category

          // Category title
          currentPage.drawText(`${category.category.toUpperCase()}`, {
            x: margin + 10,
            y: currentY,
            size: 12,
            font: helveticaBold,
            color: textColor,
          });
          currentY -= lineHeight.heading;

          // Category description
          currentY = drawWrappedText(currentPage, category.description, {
            x: margin + 10,
            y: currentY,
            width: contentWidth - 20,
            size: 10,
            font: helveticaFont,
            color: textColor,
          });
          currentY -= lineHeight.small;

          // Energy efficiency details
          currentPage = ensurePageSpace(60);
          currentY = drawWrappedText(
            currentPage,
            `Potential Energy: ${category.energyEfficiency.potentialEnergy}`,
            {
              x: margin + 10,
              y: currentY,
              width: contentWidth - 20,
              size: 10,
              font: helveticaFont,
              color: textColor,
            }
          );
          currentY -= lineHeight.small;

          currentPage = ensurePageSpace(lineHeight.normal);
          currentY = drawWrappedText(
            currentPage,
            `Conversion Efficiency: ${category.energyEfficiency.conversionEfficiency}`,
            {
              x: margin + 10,
              y: currentY,
              width: contentWidth - 20,
              size: 10,
              font: helveticaFont,
              color: textColor,
            }
          );
          currentY -= lineHeight.small;

          currentPage = ensurePageSpace(lineHeight.normal);
          currentY = drawWrappedText(
            currentPage,
            `Best Methods: ${category.energyEfficiency.bestMethods}`,
            {
              x: margin + 10,
              y: currentY,
              width: contentWidth - 20,
              size: 10,
              font: helveticaFont,
              color: textColor,
            }
          );
          currentY -= sectionSpacing;
        }
      }

      // Draw footer on the last page
      drawPageFooter(
        pdfDoc.getPage(pdfDoc.getPageCount() - 1),
        helveticaFont,
        textColor
      );

      // Create recommendations page
      const recsPage = pdfDoc.addPage([pageWidth, pageHeight]);
      currentY = drawPageHeader(
        recsPage,
        "Recommended Energy Conversion Methods",
        helveticaBold,
        helveticaFont,
        primaryColor
      );

      // Recommendations content
      let currentRecsPage = recsPage;

      for (let i = 0; i < analysisResult.recommendations.length; i++) {
        const rec = analysisResult.recommendations[i];
        const estimatedSpace = 120; // Estimated space needed for a recommendation

        if (currentY - estimatedSpace < footerHeight + margin) {
          drawPageFooter(currentRecsPage, helveticaFont, textColor);
          currentRecsPage = pdfDoc.addPage([pageWidth, pageHeight]);
          currentY = drawPageHeader(
            currentRecsPage,
            "Recommendations (Continued)",
            helveticaBold,
            helveticaFont,
            primaryColor
          );
        }

        // Method header
        currentY = drawSectionHeader(
          currentRecsPage,
          `METHOD ${i + 1}: ${rec.method.toUpperCase()}`,
          currentY,
          helveticaBold,
          textColor
        );

        // Method description
        currentY = drawWrappedText(currentRecsPage, rec.description, {
          x: margin + 10,
          y: currentY,
          width: contentWidth - 20,
          size: 10,
          font: helveticaFont,
          color: textColor,
        });
        currentY -= lineHeight.small;

        // Efficiency
        currentRecsPage = ensurePageSpace(60);
        currentY = drawWrappedText(
          currentRecsPage,
          `Efficiency: ${rec.efficiency}`,
          {
            x: margin + 10,
            y: currentY,
            width: contentWidth - 20,
            size: 10,
            font: helveticaFont,
            color: textColor,
          }
        );
        currentY -= lineHeight.small;

        // Waste types
        currentRecsPage = ensurePageSpace(lineHeight.normal);
        currentY = drawWrappedText(
          currentRecsPage,
          `Waste Types: ${rec.wasteTypes}`,
          {
            x: margin + 10,
            y: currentY,
            width: contentWidth - 20,
            size: 10,
            font: helveticaFont,
            color: textColor,
          }
        );
        currentY -= lineHeight.small;

        // Environmental benefits
        currentRecsPage = ensurePageSpace(lineHeight.normal);
        currentY = drawWrappedText(
          currentRecsPage,
          `Environmental Benefits: ${rec.environmentalBenefits}`,
          {
            x: margin + 10,
            y: currentY,
            width: contentWidth - 20,
            size: 10,
            font: helveticaFont,
            color: textColor,
          }
        );
        currentY -= sectionSpacing * 1.5;
      }

      // Draw footer on the last recommendations page
      drawPageFooter(currentRecsPage, helveticaFont, textColor);

      // Save the PDF
      const pdfBytes = await pdfDoc.save();

      // Create a blob and download the PDF
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `EcoConvert_Analysis_${format(new Date(), "yyyyMMdd_HHmmss")}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setPdfGenerating(false);
    } catch (error) {
      console.error("Error generating PDF:", error);
      setPdfGenerating(false);
    }
  };

  if (modelLoading) {
    return (
      <div className="flex items-center flex-col justify-center h-screen gap-y-2">
        <Loader2 className="size-6 animate-spin text-black/90" />
        <span className="text-sm text-muted-foreground">
          Loading AI model...
        </span>
      </div>
    );
  }
  if (modelError) {
    return (
      <div className="p-3 bg-red-100 text-red-700 rounded text-sm">
        {modelError}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "min-h-screen flex items-center justify-center",
        analysisResult && previewUrl && "my-12"
      )}
    >
      <div className="w-full max-w-7xl mx-auto space-y-12 rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className={cn("flex items-center justify-between")}>
          <div className="space-y-2">
            <h3 className="text-2xl font-semibold">Waste to Energy Analyzer</h3>
            <p className="text-sm text-muted-foreground">
              Upload an image to analyze waste and energy conversion potential
            </p>
          </div>

          <div className="flex items-center gap-4">
            {!analysisResult && (
              <>
                {previewUrl && (
                  <Button
                    onClick={analyzeImage}
                    variant="outline"
                    size="lg"
                    disabled={isLoading || modelLoading || !model}
                    className=""
                  >
                    {isLoading ? (
                      <span>Generating....</span>
                    ) : (
                      <>
                        <AudioLines className="size-5" />
                        Start Analysis
                      </>
                    )}
                  </Button>
                )}
              </>
            )}

            {previewUrl &&
              analysisResult &&
              analysisResult.isWaste === true && (
                <Button
                  onClick={generatePDF}
                  variant="outline"
                  size="lg"
                  disabled={pdfGenerating}
                >
                  {pdfGenerating ? (
                    <div className="size-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <>
                      <FileText className="size-4" />
                      Download Report
                    </>
                  )}
                </Button>
              )}
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: {
                    width: "36px",
                    height: "36px",
                  },
                },
              }}
            />
          </div>
        </div>

        <Input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            {!previewUrl ? (
              <div
                onClick={handleThumbnailClick}
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                  "flex h-[460px] cursor-pointer flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 transition-colors hover:bg-muted",
                  isDragging && "border-primary/50 bg-primary/5"
                )}
              >
                <div className="rounded-full bg-background p-3 shadow-sm">
                  <ImagePlus className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">Click to select</p>
                  <p className="text-xs text-muted-foreground">
                    or drag and drop file here
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative">
                <div className="group relative h-[460px] overflow-hidden rounded-lg border">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={handleThumbnailClick}
                      className="h-9 w-9 p-0"
                    >
                      <Upload className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={handleRemove}
                      className="h-9 w-9 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {fileName && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="truncate">{fileName}</span>
                    <button
                      onClick={handleRemove}
                      className="ml-auto rounded-full p-1 hover:bg-muted"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {analysisResult && previewUrl && (
              <div className="mt-4 space-y-3 p-3 bg-gray-50 rounded-lg">
                <h4 className="font-medium">Quick Summary</h4>
                <div className="text-sm space-y-2">
                  <p>
                    <span className="font-medium">Waste detected:</span>{" "}
                    {analysisResult.isWaste ? "Yes" : "No"}
                  </p>
                  {analysisResult.wasteCategories.length > 0 && (
                    <p>
                      <span className="font-medium">Categories:</span>{" "}
                      {analysisResult.wasteCategories.join(", ")}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Info */}

          <div className="flex flex-col space-y-4">
            <h1 className="text-xl font-semibold">
              How our AI model classifies waste materials
            </h1>
            <ul className="text-base font-normal text-muted-foreground divide-y divide-gray-300">
              <li className="py-2">
                When you upload an image, we use MobileNet (a pre-trained neural
                network) to identify objects in the image
              </li>
              <li className="py-2">
                The model returns predictions with confidence scores for what it
                sees
              </li>
              <li className="py-2">
                We map these predictions to waste categories (plastic, paper,
                organic, etc.)
              </li>
              <li className="py-2">
                Based on the waste categories, we recommend optimal energy
                conversion methods
              </li>
            </ul>

            <div className="border p-4 border-yellow-200 bg-yellow-50 flex space-x-3">
              <TriangleAlert className="size-6 text-yellow-400" />
              <p className="text-base text-yellow-500">
                Currently supported categories are plastic, paper, organic,
                metal, glass, electronic, textile and hazardous.
              </p>
            </div>
            <p className=" text-sm italic text-black">
              For best results, ensure your image clearly shows the waste
              materials with good lighting and minimal background clutter.
            </p>
          </div>

          {previewUrl && analysisResult?.isWaste === true ? (
            <>
              {analysisResult && (
                <div className="flex flex-col h-full rounded-lg border border-border overflow-hidden">
                  <div className="flex bg-muted overflow-x-auto">
                    <button
                      onClick={() => setSelectedTab("overview")}
                      className={`px-4 py-2 text-sm font-medium ${
                        selectedTab === "overview"
                          ? "bg-background border-b-2 border-primary"
                          : "text-muted-foreground"
                      }`}
                    >
                      Overview
                    </button>
                    <button
                      onClick={() => setSelectedTab("efficiency")}
                      className={`px-4 py-2 text-sm font-medium ${
                        selectedTab === "efficiency"
                          ? "bg-background border-b-2 border-primary"
                          : "text-muted-foreground"
                      }`}
                    >
                      Efficiency
                    </button>
                    <button
                      onClick={() => setSelectedTab("predictions")}
                      className={`px-4 py-2 text-sm font-medium ${
                        selectedTab === "predictions"
                          ? "bg-background border-b-2 border-primary"
                          : "text-muted-foreground"
                      }`}
                    >
                      Predictions
                    </button>
                  </div>

                  <div className="flex-1 overflow-auto p-4">
                    <AnalysisCharts
                      analysisResult={analysisResult}
                      activeTab={selectedTab}
                    />
                  </div>
                </div>
              )}
            </>
          ) : null}

          {previewUrl &&
            analysisResult &&
            analysisResult.recommendations.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-xl font-medium">
                  Recommended Energy Conversion Methods
                </h4>
                <div className="grid grid-cols-1 gap-4">
                  {analysisResult.recommendations
                    .slice(0, 4)
                    .map((rec, idx) => (
                      <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                        <h5 className="font-medium text-lg text-primary">
                          {rec.method}
                        </h5>
                        <p className="mt-2 text-base text-gray-600">
                          {rec.description}
                        </p>
                        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                          <div className="text-sm">
                            <span className="font-medium text-gray-700">
                              Efficiency:
                            </span>{" "}
                            <span className="text-gray-600">
                              {rec.efficiency}
                            </span>
                          </div>
                          <div className="text-sm">
                            <span className="font-medium text-gray-700">
                              Waste Types:
                            </span>{" "}
                            <span className="text-gray-600">
                              {rec.wasteTypes}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
