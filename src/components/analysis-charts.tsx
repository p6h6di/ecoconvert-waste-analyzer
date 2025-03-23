import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

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

interface AnalysisChartsProps {
  analysisResult: ImageAnalysisResult;
  activeTab: string;
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
];

const AnalysisCharts: React.FC<AnalysisChartsProps> = ({
  analysisResult,
  activeTab,
}) => {
  // For predictions chart
  const predictionData = analysisResult.predictions
    .map((item) => ({
      name: item.className.split(",")[0], // Take just the first part of the class name
      probability: parseFloat((item.probability * 100).toFixed(1)),
    }))
    .sort((a, b) => b.probability - a.probability)
    .slice(0, 5); // Show top 5 predictions

  // For energy efficiency radar chart
  const prepareRadarData = () => {
    if (!analysisResult.categoryDetails.length) return [];

    const radarData = [];
    for (const category of analysisResult.categoryDetails) {
      if (category.energyEfficiency?.metrics) {
        const metrics = category.energyEfficiency.metrics;

        radarData.push(
          {
            subject: "Energy Potential",
            A: metrics.potentialEnergy,
            fullMark: 10,
            category: category.category,
          },
          {
            subject: "Conversion Efficiency",
            A: metrics.conversionEfficiency,
            fullMark: 10,
            category: category.category,
          },
          {
            subject: "Processing Complexity",
            A: 10 - metrics.processingComplexity, // Invert so lower is better
            fullMark: 10,
            category: category.category,
          },
          {
            subject: "Carbon Footprint",
            A: 10 - metrics.carbonFootprint, // Invert so lower is better
            fullMark: 10,
            category: category.category,
          },
          {
            subject: "Resource Recovery",
            A: metrics.resourceRecovery,
            fullMark: 10,
            category: category.category,
          }
        );
      }
    }
    return radarData;
  };

  // For waste category pie chart
  const preparePieData = () => {
    const categoriesCount: Record<string, number> = {};

    // Count occurrences of each waste category
    for (const category of analysisResult.wasteCategories) {
      categoriesCount[category] = (categoriesCount[category] || 0) + 1;
    }

    // Convert to array format for pie chart
    return Object.entries(categoriesCount).map(([name, value]) => ({
      name,
      value,
    }));
  };

  // For energy potential bar chart
  const prepareBarData = () => {
    return analysisResult.categoryDetails.map((detail) => ({
      name: detail.category.charAt(0).toUpperCase() + detail.category.slice(1),
      energyPotential: detail.energyEfficiency?.metrics?.potentialEnergy || 0,
      conversionEfficiency:
        detail.energyEfficiency?.metrics?.conversionEfficiency || 0,
    }));
  };

  // Render different charts based on active tab
  const renderCharts = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-4">
            <h4 className="font-medium">Waste Categories</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={preparePieData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {preparePieData().map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <h4 className="font-medium mt-6">Energy Potential by Category</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={prepareBarData()}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="energyPotential"
                    name="Energy Potential"
                    fill="#8884d8"
                  />
                  <Bar
                    dataKey="conversionEfficiency"
                    name="Conversion Efficiency"
                    fill="#82ca9d"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      case "efficiency":
        return (
          <div className="space-y-4">
            <h4 className="font-medium">Efficiency Metrics</h4>
            {analysisResult.categoryDetails.map((category, index) => (
              <div key={index} className="mb-6">
                <h5 className="text-sm font-medium capitalize mb-2">
                  {category.category} Metrics
                </h5>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart
                      outerRadius={90}
                      width={500}
                      height={250}
                      data={prepareRadarData().filter(
                        (item) => item.category === category.category
                      )}
                    >
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={30} domain={[0, 10]} />
                      <Radar
                        name={category.category}
                        dataKey="A"
                        stroke={COLORS[index % COLORS.length]}
                        fill={COLORS[index % COLORS.length]}
                        fillOpacity={0.6}
                      />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  <p className="py-1">
                    <span className="font-medium">Energy Potential:</span>{" "}
                    {category.energyEfficiency?.potentialEnergy}
                  </p>
                  <p className="py-1">
                    <span className="font-medium">Conversion Efficiency:</span>{" "}
                    {category.energyEfficiency?.conversionEfficiency}
                  </p>
                  <p className="py-1">
                    <span className="font-medium">Best Methods:</span>{" "}
                    {category.energyEfficiency?.bestMethods}
                  </p>
                </div>
              </div>
            ))}
          </div>
        );

      case "predictions":
        return (
          <div className="space-y-4">
            <h4 className="font-medium">AI Predictions</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={predictionData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis type="category" dataKey="name" width={150} />
                  <Tooltip
                    formatter={(value) => [`${value}%`, "Probability"]}
                  />
                  <Legend />
                  <Bar
                    dataKey="probability"
                    name="Probability (%)"
                    fill="#0088FE"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4">
              <h5 className="text-sm font-medium">All Predictions</h5>
              <div className="mt-2 max-h-48 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left p-2">Class</th>
                      <th className="text-right p-2">Probability</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analysisResult.predictions.map((pred, idx) => (
                      <tr key={idx} className="border-t">
                        <td className="p-2">{pred.className}</td>
                        <td className="text-right p-2">
                          {(pred.probability * 100).toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Select a tab to view analysis details</div>;
    }
  };

  return <div className="w-full h-full">{renderCharts()}</div>;
};

export default AnalysisCharts;
