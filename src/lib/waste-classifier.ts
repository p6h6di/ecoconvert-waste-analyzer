import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";
import {
  energyConversionMethods,
  wasteCategories,
  wasteCategoryDetails,
  wasteKeywords,
} from "./waste-data";

let model: mobilenet.MobileNet | null = null;

export const loadModel = async (): Promise<void> => {
  await tf.ready();
  if (!model) {
    model = await mobilenet.load();
  }
};

export const classifyImage = async (imageElement: HTMLImageElement) => {
  if (!model) {
    await loadModel();
  }

  if (!model) {
    throw new Error("Model failed to load");
  }

  // Classify the image and get the predictions
  const predictions = await model.classify(imageElement);

  // Check if the image contains waste
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

  // Determine waste categories based on predictions
  const detectedCategories = new Set();
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

  // Get recommendations for each detected category
  const recommendations = resultCategories.flatMap((category) => {
    return (
      energyConversionMethods[
        category as keyof typeof energyConversionMethods
      ] || energyConversionMethods.unknown
    );
  });

  // Get each category details
  const categoryDetails = resultCategories.map((category) => {
    return {
      category,
      ...wasteCategoryDetails[category as string],
    };
  });

  return {
    predictions,
    isWaste,
    wasteCategories: resultCategories,
    categoryDetails,
    recommendations,
  };
};
