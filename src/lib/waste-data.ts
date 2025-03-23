type WasteCategories = {
  [key: string]: string[];
};

type EnergyEfficiency = {
  potentialEnergy: string;
  conversionEfficiency: string;
  bestMethods: string;
  carbonFootprint: string;
  resourceRecovery: string;
  metrics: EnergyEfficiencyMetrics;
};

type EnergyEfficiencyMetrics = {
  potentialEnergy: number;
  conversionEfficiency: number;
  processingComplexity: number;
  carbonFootprint: number;
  resourceRecovery: number;
};

type WasteCategoryDetails = {
  [key: string]: {
    description: string;
    energyEfficiency: EnergyEfficiency;
  };
};

type EnergyConversionMethod = {
  method: string;
  description: string;
  efficiency: string;
  wasteTypes: string;
  environmentalBenefits: string;
};

type EnergyConversionMethods = {
  [key: string]: EnergyConversionMethod[];
};

export const wasteCategories: WasteCategories = {
  organic: [
    "food",
    "fruit",
    "vegetable",
    "plant",
    "leaf",
    "wood",
    "paper",
    "cardboard",
    "coffee",
    "tea",
  ],
  plastic: [
    "bottle",
    "container",
    "plastic",
    "polymer",
    "packaging",
    "bag",
    "wrapper",
  ],
  metal: ["can", "aluminum", "tin", "steel", "metal", "foil"],
  glass: ["bottle", "jar", "glass", "window"],
  electronic: [
    "computer",
    "phone",
    "electronic",
    "device",
    "battery",
    "cable",
    "charger",
    "appliance",
  ],
  textile: ["clothing", "fabric", "textile", "cloth", "garment", "shoe"],
  hazardous: [
    "chemical",
    "paint",
    "oil",
    "battery",
    "medicine",
    "pharmaceutical",
  ],
};

export const wasteCategoryDetails: WasteCategoryDetails = {
  organic: {
    description:
      "Biodegradable waste that comes from plants or animals. Includes food waste, paper, cardboard, and yard trimmings.",
    energyEfficiency: {
      potentialEnergy: "Medium to High (8-15 MJ/kg)",
      conversionEfficiency:
        "60-80% for anaerobic digestion, 25-35% for direct combustion",
      bestMethods:
        "Anaerobic digestion, composting with heat recovery, biomass combustion",
      carbonFootprint:
        "Low when properly managed, can be carbon-neutral or negative with methane capture",
      resourceRecovery:
        "Produces biogas, compost, and soil amendments as valuable byproducts",
      metrics: {
        potentialEnergy: 65,
        conversionEfficiency: 70,
        processingComplexity: 40,
        carbonFootprint: 25,
        resourceRecovery: 80,
      },
    },
  },
  plastic: {
    description:
      "Synthetic materials made from polymers. Includes bottles, containers, packaging, and single-use items.",
    energyEfficiency: {
      potentialEnergy: "Very High (35-45 MJ/kg, similar to fossil fuels)",
      conversionEfficiency:
        "70-85% for pyrolysis, 25-30% for incineration with energy recovery",
      bestMethods:
        "Pyrolysis, plastic-to-fuel conversion, waste-to-energy incineration",
      carbonFootprint:
        "Medium to high due to fossil origin, but offsets virgin plastic production",
      resourceRecovery:
        "Can produce synthetic fuels, oils, and gases with properties similar to petroleum products",
      metrics: {
        potentialEnergy: 90,
        conversionEfficiency: 75,
        processingComplexity: 60,
        carbonFootprint: 65,
        resourceRecovery: 70,
      },
    },
  },
  metal: {
    description:
      "Recyclable materials like aluminum cans, steel containers, and scrap metal that can be melted and reformed.",
    energyEfficiency: {
      potentialEnergy: "Low as direct fuel, but very high embodied energy",
      conversionEfficiency:
        "Not typically used for energy conversion, 95% energy savings through recycling",
      bestMethods:
        "Recycling is far more energy-efficient than energy recovery",
      carbonFootprint:
        "Recycling reduces carbon emissions by 60-95% compared to virgin production",
      resourceRecovery:
        "Nearly 100% recyclable without quality degradation for most metals",
      metrics: {
        potentialEnergy: 30,
        conversionEfficiency: 20,
        processingComplexity: 50,
        carbonFootprint: 20,
        resourceRecovery: 95,
      },
    },
  },
  glass: {
    description:
      "Recyclable material made from sand. Includes bottles, jars, and broken glass items.",
    energyEfficiency: {
      potentialEnergy: "Very low (not suitable for energy conversion)",
      conversionEfficiency:
        "Not used for energy conversion, 25-30% energy savings through recycling",
      bestMethods: "Recycling or repurposing as construction materials",
      carbonFootprint:
        "Recycling reduces carbon emissions by approximately 20-30%",
      resourceRecovery: "Can be recycled indefinitely without loss of quality",
      metrics: {
        potentialEnergy: 15,
        conversionEfficiency: 10,
        processingComplexity: 45,
        carbonFootprint: 30,
        resourceRecovery: 90,
      },
    },
  },
  electronic: {
    description:
      "Discarded electrical or electronic devices. Includes computers, phones, appliances, and batteries.",
    energyEfficiency: {
      potentialEnergy:
        "Variable (plastic components: 30-40 MJ/kg, metals: low direct energy)",
      conversionEfficiency:
        "25-35% for advanced thermal treatment after material recovery",
      bestMethods:
        "Precious metal recovery followed by thermal treatment of remaining fractions",
      carbonFootprint:
        "High if improperly disposed, medium with proper recovery processes",
      resourceRecovery:
        "Contains valuable metals (gold, silver, copper) at concentrations higher than natural ores",
      metrics: {
        potentialEnergy: 50,
        conversionEfficiency: 30,
        processingComplexity: 85,
        carbonFootprint: 60,
        resourceRecovery: 85,
      },
    },
  },
  textile: {
    description:
      "Fabric and clothing items made from natural or synthetic fibers that can often be reused or recycled.",
    energyEfficiency: {
      potentialEnergy:
        "Medium (15-20 MJ/kg for mixed textiles, higher for synthetics)",
      conversionEfficiency:
        "20-25% for gasification, 60-75% for pyrolysis of synthetic textiles",
      bestMethods:
        "Reuse, recycling, gasification, or pyrolysis for synthetic materials",
      carbonFootprint:
        "Medium, lower with reuse and recycling compared to energy recovery",
      resourceRecovery:
        "Natural fibers can be composted, synthetics can be converted to fuels",
      metrics: {
        potentialEnergy: 55,
        conversionEfficiency: 45,
        processingComplexity: 55,
        carbonFootprint: 45,
        resourceRecovery: 60,
      },
    },
  },
  hazardous: {
    description:
      "Materials that are potentially harmful to human health or the environment. Requires special handling.",
    energyEfficiency: {
      potentialEnergy:
        "Variable (some solvents and oils have high energy content)",
      conversionEfficiency:
        "Safety prioritized over efficiency, specialized high-temperature treatment",
      bestMethods:
        "Specialized treatment, high-temperature incineration, cement kiln co-processing",
      carbonFootprint:
        "Can be high, but proper treatment prevents more harmful environmental impacts",
      resourceRecovery: "Limited, focus is on safe destruction and containment",
      metrics: {
        potentialEnergy: 40,
        conversionEfficiency: 25,
        processingComplexity: 90,
        carbonFootprint: 70,
        resourceRecovery: 30,
      },
    },
  },
  unknown: {
    description:
      "The system couldn't confidently identify the type of waste. Consider consulting waste management professionals.",
    energyEfficiency: {
      potentialEnergy: "Unknown (requires professional assessment)",
      conversionEfficiency: "Varies based on composition",
      bestMethods:
        "Professional waste assessment, mechanical biological treatment",
      carbonFootprint: "Unknown without proper characterization",
      resourceRecovery:
        "Mechanical biological treatment can recover 40-60% of materials",
      metrics: {
        potentialEnergy: 50,
        conversionEfficiency: 40,
        processingComplexity: 70,
        carbonFootprint: 50,
        resourceRecovery: 50,
      },
    },
  },
};

export const wasteKeywords: string[] = [
  "waste",
  "trash",
  "garbage",
  "rubbish",
  "litter",
  "refuse",
  "debris",
  "junk",
  "recycle",
  "recyclable",
  "disposal",
  "dump",
  "landfill",
  "bin",
  "container",
  ...Object.values(wasteCategories).flat(),
];

export const energyConversionMethods: EnergyConversionMethods = {
  organic: [
    {
      method: "Anaerobic Digestion",
      description:
        "Converts organic waste into biogas (methane and carbon dioxide) through bacterial decomposition in oxygen-free environments. The biogas can be used for electricity generation, heating, or as vehicle fuel.",
      efficiency:
        "Can convert up to 60-80% of the energy content in organic waste to usable biogas, with 1 ton of food waste producing approximately 300-500 cubic meters of biogas.",
      wasteTypes:
        "Food waste, agricultural residues, sewage sludge, animal manure, and other biodegradable materials.",
      environmentalBenefits:
        "Reduces methane emissions from landfills, produces renewable energy, and creates nutrient-rich digestate that can be used as fertilizer.",
    },
    {
      method: "Composting with Heat Recovery",
      description:
        "Captures heat generated during the aerobic decomposition process for space heating or hot water. Advanced systems use heat exchangers embedded in compost piles to extract thermal energy.",
      efficiency:
        "30-40% of the energy in organic waste can be recovered as heat, with temperatures reaching 50-70°C in active compost piles.",
      wasteTypes:
        "Yard trimmings, food scraps, agricultural waste, paper products, and wood chips.",
      environmentalBenefits:
        "Produces valuable compost for soil improvement, reduces landfill waste, and captures energy that would otherwise be lost as heat.",
    },
    {
      method: "Biomass Direct Combustion",
      description:
        "Burning dried organic waste directly in specialized boilers to generate steam for electricity production or heating applications.",
      efficiency:
        "Modern biomass power plants can achieve 25-35% electrical efficiency, with combined heat and power systems reaching overall efficiencies of 80-90%.",
      wasteTypes:
        "Wood waste, agricultural residues, dedicated energy crops, and dried organic municipal waste.",
      environmentalBenefits:
        "Considered carbon-neutral when sustainably managed, reduces landfill volume, and provides baseload renewable energy.",
    },
  ],
  plastic: [
    {
      method: "Pyrolysis",
      description:
        "Thermal decomposition of plastic waste in the absence of oxygen to produce synthetic fuels (pyrolysis oil), syngas, and char. The process breaks down polymer chains into smaller hydrocarbon molecules.",
      efficiency:
        "Can convert 1 ton of plastic waste into approximately 750-850 liters of fuel oil with energy content similar to diesel fuel (42-45 MJ/kg).",
      wasteTypes:
        "Most thermoplastics including polyethylene (PE), polypropylene (PP), and polystyrene (PS). Less effective for PET and PVC.",
      environmentalBenefits:
        "Diverts plastic from landfills and oceans, reduces dependency on fossil fuels, and has lower emissions than incineration.",
    },
    {
      method: "Waste-to-Energy Incineration",
      description:
        "Controlled burning of plastic waste in advanced facilities with emissions control systems to generate electricity or heat. Modern plants use moving grate technology and extensive flue gas treatment.",
      efficiency:
        "Modern facilities can achieve 25-30% electrical efficiency, with combined heat and power systems reaching overall efficiencies of 80%.",
      wasteTypes:
        "Mixed plastic waste, including non-recyclable plastics, multi-layer packaging, and contaminated plastic materials.",
      environmentalBenefits:
        "Reduces landfill volume by up to 90%, destroys potential harmful substances, and offsets fossil fuel use.",
    },
    {
      method: "Plastic to Fuel (PTF)",
      description:
        "Advanced catalytic conversion processes that transform plastic waste into liquid fuels with properties similar to conventional petroleum products. Can produce diesel, gasoline, and kerosene fractions.",
      efficiency:
        "Up to 85% of plastic input can be converted to liquid fuels, with energy recovery rates of 38-40 MJ/kg.",
      wasteTypes:
        "Polyethylene (PE), polypropylene (PP), and polystyrene (PS) yield the highest quality fuel products.",
      environmentalBenefits:
        "Creates value from waste plastics, reduces landfill pressure, and produces lower-sulfur fuels than conventional petroleum.",
    },
  ],
  metal: [
    {
      method: "Recycling",
      description:
        "Metals are best recycled rather than converted to energy, saving significant energy compared to primary production. The process involves collection, sorting, shredding, melting, and reforming.",
      efficiency:
        "Energy savings of 95% for aluminum, 85% for copper, and 60-74% for steel compared to virgin material production.",
      wasteTypes:
        "Aluminum cans, steel containers, copper wiring, brass fixtures, zinc components, and precious metals from electronics.",
      environmentalBenefits:
        "Reduces mining impacts, conserves natural resources, decreases energy consumption, and lowers greenhouse gas emissions.",
    },
    {
      method: "Metal Recovery from Incineration",
      description:
        "Extraction of metals from incineration bottom ash using magnetic separators, eddy current separators, and advanced sorting technologies.",
      efficiency:
        "Can recover 80-90% of ferrous metals and 50-70% of non-ferrous metals from incineration residues.",
      wasteTypes:
        "Mixed municipal waste containing metal components that enter waste-to-energy facilities.",
      environmentalBenefits:
        "Recovers valuable resources that would otherwise be landfilled and reduces the environmental footprint of waste disposal.",
    },
  ],
  glass: [
    {
      method: "Recycling",
      description:
        "Glass is best recycled rather than converted to energy, as it can be remelted indefinitely without quality degradation. The process involves collection, color sorting, crushing into cullet, and remelting.",
      efficiency:
        "Energy savings of 25-30% compared to virgin glass production, with 1 ton of recycled glass saving approximately 1.2 tons of raw materials.",
      wasteTypes:
        "Container glass (bottles and jars), flat glass (windows), and specialty glass products.",
      environmentalBenefits:
        "Reduces mining of raw materials, decreases energy use and associated emissions, and diverts waste from landfills.",
    },
    {
      method: "Glass Aggregate Production",
      description:
        "Crushing waste glass into various sizes for use as construction aggregate, abrasives, or filtration media when recycling into new glass is not feasible.",
      efficiency:
        "Energy conservation rather than generation, but saves the embodied energy in glass materials.",
      wasteTypes:
        "Mixed color glass, contaminated glass, or glass types that cannot be easily recycled into new containers.",
      environmentalBenefits:
        "Reduces landfill waste, decreases demand for virgin aggregate materials, and can improve drainage properties in construction applications.",
    },
  ],
  electronic: [
    {
      method: "Precious Metal Recovery",
      description:
        "Extraction of valuable metals like gold, silver, platinum, and copper from electronic waste through mechanical processing, hydrometallurgical, or pyrometallurgical methods.",
      efficiency:
        "One ton of circuit boards can contain 40-800 times the concentration of gold found in gold ore and 30-40 times the concentration of copper in copper ore.",
      wasteTypes:
        "Circuit boards, connectors, computer components, mobile phones, and other high-value electronic components.",
      environmentalBenefits:
        "Reduces mining impacts, conserves rare resources, prevents toxic materials from entering landfills, and saves significant energy compared to primary production.",
    },
    {
      method: "Waste-to-Energy Incineration",
      description:
        "After removal of hazardous components and valuable materials, remaining non-recyclable fractions can be incinerated for energy recovery in specialized facilities.",
      efficiency:
        "Variable depending on composition, but plastic components can yield 30-40 MJ/kg of energy.",
      wasteTypes:
        "Non-recyclable plastic housings, mixed materials, and other combustible components after removal of hazardous substances.",
      environmentalBenefits:
        "Reduces landfill volume and recovers energy from materials that cannot be effectively recycled.",
    },
    {
      method: "Advanced Thermal Treatment",
      description:
        "Specialized processes like plasma arc gasification that use extremely high temperatures to break down electronic waste into syngas and an inert vitrified slag.",
      efficiency:
        "Can achieve electrical efficiencies of 25-35% with high-temperature processes that effectively destroy hazardous organic compounds.",
      wasteTypes:
        "Mixed electronic waste including hazardous components that require thermal destruction.",
      environmentalBenefits:
        "Destroys toxic organic compounds, immobilizes heavy metals in slag, and produces renewable energy.",
    },
  ],
  textile: [
    {
      method: "Gasification",
      description:
        "Converts textile waste into syngas (a mixture of carbon monoxide, hydrogen, and methane) through partial oxidation at high temperatures. The syngas can be used for electricity generation or converted to liquid fuels.",
      efficiency:
        "Can achieve 20-25% electrical efficiency, with 1 ton of textile waste producing approximately 700-1000 cubic meters of syngas.",
      wasteTypes:
        "Natural and synthetic fabrics, carpet waste, and mixed textile materials that cannot be recycled or reused.",
      environmentalBenefits:
        "Diverts textiles from landfills, produces fewer emissions than direct incineration, and generates renewable energy.",
    },
    {
      method: "Waste-to-Energy Incineration",
      description:
        "Controlled burning of textile waste in advanced facilities to generate electricity or heat, with extensive emissions control systems.",
      efficiency:
        "Modern facilities can achieve 25-30% electrical efficiency, with textiles having a calorific value of approximately 15-20 MJ/kg.",
      wasteTypes:
        "Mixed textile waste, contaminated fabrics, and synthetic materials that are difficult to recycle.",
      environmentalBenefits:
        "Reduces landfill volume and recovers energy from materials that would otherwise be wasted.",
    },
    {
      method: "Pyrolysis of Synthetic Textiles",
      description:
        "Thermal decomposition of synthetic textile waste in the absence of oxygen to produce oils and gases that can be used as fuels.",
      efficiency:
        "Can convert 60-75% of synthetic textile mass into usable fuel products with high energy content.",
      wasteTypes:
        "Polyester, nylon, acrylic, and other petroleum-based synthetic fabrics.",
      environmentalBenefits:
        "Recovers the embodied energy in synthetic textiles and reduces landfill waste.",
    },
  ],
  hazardous: [
    {
      method: "Specialized Treatment",
      description:
        "Hazardous waste typically requires specialized treatment for safe disposal rather than energy recovery. This may include neutralization, stabilization, encapsulation, or other treatment methods.",
      efficiency:
        "Safety is prioritized over energy recovery, though some processes may recover heat or materials.",
      wasteTypes:
        "Chemical waste, medical waste, radioactive materials, heavy metal-containing waste, and other regulated hazardous substances.",
      environmentalBenefits:
        "Prevents environmental contamination and protects public health by safely managing dangerous materials.",
    },
    {
      method: "High-Temperature Incineration",
      description:
        "Destruction of hazardous organic compounds in specially designed incinerators operating at temperatures of 850-1200°C with advanced emissions control systems.",
      efficiency:
        "Energy recovery is secondary to destruction efficiency, but modern facilities can recover heat for steam or electricity production.",
      wasteTypes:
        "Organic solvents, pesticides, pharmaceutical waste, and other combustible hazardous materials.",
      environmentalBenefits:
        "Destroys harmful compounds, reduces waste volume by up to 90%, and can recover energy while ensuring safe disposal.",
    },
    {
      method: "Cement Kiln Co-processing",
      description:
        "Using suitable hazardous waste as alternative fuel in cement kilns, where high temperatures (1400-1500°C) ensure complete destruction of toxic compounds.",
      efficiency:
        "Replaces fossil fuels in cement production while safely destroying waste, with energy utilization rates of 80-90%.",
      wasteTypes:
        "Waste oils, solvents, paint residues, and other high-calorific hazardous wastes compatible with cement production.",
      environmentalBenefits:
        "Reduces fossil fuel consumption in cement industry, ensures complete destruction of hazardous compounds, and eliminates the need for separate incineration facilities.",
    },
  ],
  unknown: [
    {
      method: "Professional Waste Assessment",
      description:
        "Unidentified waste should be assessed by waste management professionals for proper characterization, classification, and handling. This involves sampling, laboratory analysis, and expert evaluation.",
      efficiency:
        "N/A - Safety and proper identification take precedence over energy recovery.",
      wasteTypes:
        "Mixed waste of unknown composition, unusual waste streams, or materials that cannot be readily identified.",
      environmentalBenefits:
        "Ensures waste is handled appropriately to minimize environmental impacts and maximize resource recovery potential.",
    },
    {
      method: "Mechanical Biological Treatment (MBT)",
      description:
        "Combined approach that separates mixed waste into recyclable materials, organic fraction for biological treatment, and refuse-derived fuel (RDF) for energy recovery.",
      efficiency:
        "Can recover 40-60% of materials for recycling or composting, with remaining RDF having a calorific value of 14-18 MJ/kg.",
      wasteTypes:
        "Mixed municipal solid waste or unidentified waste streams that require sorting and processing.",
      environmentalBenefits:
        "Maximizes material recovery, reduces landfill disposal, and produces renewable energy from non-recyclable fractions.",
    },
  ],
};
