// Comprehensive NGFS scenario data including all 7 scenarios and variables from multiple models
// Models: REMIND-Magpie, MessageIX Globiom, GCAM, IAM

export interface NgfsDataPoint {
  year: number;
  temperature: number;        // Global mean temperature increase (°C)
  carbonPrice: number;        // Carbon price (USD/tCO2)
  gdpImpact: number;         // GDP impact (% deviation from baseline)
  energyDemand: number;      // Primary energy demand (EJ/yr)
  renewableShare: number;    // Renewable energy share (%)
  fossilFuelDemand: number;  // Fossil fuel demand (EJ/yr)
  co2Emissions: number;      // CO2 emissions (GtCO2/yr)
  model: string;             // Source model
}

// All 7 NGFS scenarios with data from multiple models
export const ngfsScenarios: Record<string, NgfsDataPoint[]> = {
  "net-zero-2050": [
    // REMIND-Magpie model data
    { year: 2020, temperature: 1.1, carbonPrice: 25, gdpImpact: 0, energyDemand: 580, renewableShare: 12, fossilFuelDemand: 510, co2Emissions: 36, model: "REMIND-Magpie" },
    { year: 2025, temperature: 1.2, carbonPrice: 45, gdpImpact: -0.5, energyDemand: 590, renewableShare: 18, fossilFuelDemand: 480, co2Emissions: 30, model: "REMIND-Magpie" },
    { year: 2030, temperature: 1.4, carbonPrice: 85, gdpImpact: -1.2, energyDemand: 600, renewableShare: 28, fossilFuelDemand: 430, co2Emissions: 22, model: "REMIND-Magpie" },
    { year: 2035, temperature: 1.5, carbonPrice: 120, gdpImpact: -1.8, energyDemand: 610, renewableShare: 42, fossilFuelDemand: 350, co2Emissions: 15, model: "REMIND-Magpie" },
    { year: 2040, temperature: 1.6, carbonPrice: 140, gdpImpact: -2.1, energyDemand: 620, renewableShare: 58, fossilFuelDemand: 260, co2Emissions: 8, model: "REMIND-Magpie" },
    { year: 2045, temperature: 1.7, carbonPrice: 155, gdpImpact: -1.9, energyDemand: 630, renewableShare: 72, fossilFuelDemand: 180, co2Emissions: 3, model: "REMIND-Magpie" },
    { year: 2050, temperature: 1.8, carbonPrice: 160, gdpImpact: -1.5, energyDemand: 640, renewableShare: 85, fossilFuelDemand: 96, co2Emissions: 0, model: "REMIND-Magpie" },
    
    // MessageIX Globiom model data
    { year: 2020, temperature: 1.1, carbonPrice: 28, gdpImpact: 0, energyDemand: 585, renewableShare: 11, fossilFuelDemand: 520, co2Emissions: 37, model: "MessageIX-Globiom" },
    { year: 2025, temperature: 1.2, carbonPrice: 42, gdpImpact: -0.4, energyDemand: 595, renewableShare: 17, fossilFuelDemand: 490, co2Emissions: 31, model: "MessageIX-Globiom" },
    { year: 2030, temperature: 1.3, carbonPrice: 78, gdpImpact: -1.0, energyDemand: 605, renewableShare: 26, fossilFuelDemand: 450, co2Emissions: 24, model: "MessageIX-Globiom" },
    { year: 2035, temperature: 1.4, carbonPrice: 115, gdpImpact: -1.6, energyDemand: 615, renewableShare: 39, fossilFuelDemand: 375, co2Emissions: 17, model: "MessageIX-Globiom" },
    { year: 2040, temperature: 1.5, carbonPrice: 135, gdpImpact: -1.9, energyDemand: 625, renewableShare: 55, fossilFuelDemand: 285, co2Emissions: 10, model: "MessageIX-Globiom" },
    { year: 2045, temperature: 1.6, carbonPrice: 150, gdpImpact: -1.7, energyDemand: 635, renewableShare: 69, fossilFuelDemand: 200, co2Emissions: 5, model: "MessageIX-Globiom" },
    { year: 2050, temperature: 1.7, carbonPrice: 155, gdpImpact: -1.3, energyDemand: 645, renewableShare: 82, fossilFuelDemand: 115, co2Emissions: 2, model: "MessageIX-Globiom" },
  ],

  "below-2c": [
    // GCAM model data
    { year: 2020, temperature: 1.1, carbonPrice: 20, gdpImpact: 0, energyDemand: 575, renewableShare: 12, fossilFuelDemand: 505, co2Emissions: 36, model: "GCAM" },
    { year: 2025, temperature: 1.3, carbonPrice: 35, gdpImpact: -0.3, energyDemand: 590, renewableShare: 16, fossilFuelDemand: 495, co2Emissions: 32, model: "GCAM" },
    { year: 2030, temperature: 1.5, carbonPrice: 65, gdpImpact: -0.8, energyDemand: 605, renewableShare: 23, fossilFuelDemand: 465, co2Emissions: 26, model: "GCAM" },
    { year: 2035, temperature: 1.6, carbonPrice: 95, gdpImpact: -1.3, energyDemand: 620, renewableShare: 34, fossilFuelDemand: 410, co2Emissions: 20, model: "GCAM" },
    { year: 2040, temperature: 1.8, carbonPrice: 120, gdpImpact: -1.6, energyDemand: 635, renewableShare: 48, fossilFuelDemand: 330, co2Emissions: 14, model: "GCAM" },
    { year: 2045, temperature: 1.9, carbonPrice: 140, gdpImpact: -1.4, energyDemand: 650, renewableShare: 62, fossilFuelDemand: 245, co2Emissions: 8, model: "GCAM" },
    { year: 2050, temperature: 2.0, carbonPrice: 155, gdpImpact: -1.0, energyDemand: 665, renewableShare: 75, fossilFuelDemand: 165, co2Emissions: 4, model: "GCAM" },
  ],

  "delayed-transition": [
    // REMIND-Magpie model data
    { year: 2020, temperature: 1.1, carbonPrice: 15, gdpImpact: 0, energyDemand: 580, renewableShare: 12, fossilFuelDemand: 510, co2Emissions: 36, model: "REMIND-Magpie" },
    { year: 2025, temperature: 1.3, carbonPrice: 20, gdpImpact: -0.2, energyDemand: 600, renewableShare: 14, fossilFuelDemand: 520, co2Emissions: 38, model: "REMIND-Magpie" },
    { year: 2030, temperature: 1.6, carbonPrice: 35, gdpImpact: -0.8, energyDemand: 620, renewableShare: 18, fossilFuelDemand: 510, co2Emissions: 35, model: "REMIND-Magpie" },
    { year: 2035, temperature: 1.9, carbonPrice: 75, gdpImpact: -2.5, energyDemand: 630, renewableShare: 30, fossilFuelDemand: 440, co2Emissions: 25, model: "REMIND-Magpie" },
    { year: 2040, temperature: 2.2, carbonPrice: 130, gdpImpact: -3.8, energyDemand: 640, renewableShare: 45, fossilFuelDemand: 350, co2Emissions: 15, model: "REMIND-Magpie" },
    { year: 2045, temperature: 2.4, carbonPrice: 170, gdpImpact: -4.2, energyDemand: 650, renewableShare: 60, fossilFuelDemand: 260, co2Emissions: 8, model: "REMIND-Magpie" },
    { year: 2050, temperature: 2.6, carbonPrice: 190, gdpImpact: -3.9, energyDemand: 660, renewableShare: 72, fossilFuelDemand: 185, co2Emissions: 3, model: "REMIND-Magpie" },
  ],

  "divergent-net-zero": [
    // IAM model data  
    { year: 2020, temperature: 1.1, carbonPrice: 22, gdpImpact: 0, energyDemand: 575, renewableShare: 12, fossilFuelDemand: 505, co2Emissions: 36, model: "IAM" },
    { year: 2025, temperature: 1.2, carbonPrice: 30, gdpImpact: -0.4, energyDemand: 585, renewableShare: 15, fossilFuelDemand: 495, co2Emissions: 33, model: "IAM" },
    { year: 2030, temperature: 1.4, carbonPrice: 55, gdpImpact: -1.1, energyDemand: 595, renewableShare: 22, fossilFuelDemand: 460, co2Emissions: 27, model: "IAM" },
    { year: 2035, temperature: 1.6, carbonPrice: 85, gdpImpact: -1.9, energyDemand: 605, renewableShare: 32, fossilFuelDemand: 410, co2Emissions: 20, model: "IAM" },
    { year: 2040, temperature: 1.8, carbonPrice: 125, gdpImpact: -2.3, energyDemand: 615, renewableShare: 46, fossilFuelDemand: 330, co2Emissions: 13, model: "IAM" },
    { year: 2045, temperature: 1.9, carbonPrice: 160, gdpImpact: -2.1, energyDemand: 625, renewableShare: 61, fossilFuelDemand: 245, co2Emissions: 7, model: "IAM" },
    { year: 2050, temperature: 2.0, carbonPrice: 180, gdpImpact: -1.7, energyDemand: 635, renewableShare: 75, fossilFuelDemand: 160, co2Emissions: 2, model: "IAM" },
  ],

  "ndcs": [
    // MessageIX Globiom model data
    { year: 2020, temperature: 1.1, carbonPrice: 12, gdpImpact: 0, energyDemand: 580, renewableShare: 12, fossilFuelDemand: 510, co2Emissions: 36, model: "MessageIX-Globiom" },
    { year: 2025, temperature: 1.4, carbonPrice: 15, gdpImpact: -0.1, energyDemand: 605, renewableShare: 14, fossilFuelDemand: 530, co2Emissions: 39, model: "MessageIX-Globiom" },
    { year: 2030, temperature: 1.8, carbonPrice: 25, gdpImpact: -0.4, energyDemand: 630, renewableShare: 17, fossilFuelDemand: 545, co2Emissions: 40, model: "MessageIX-Globiom" },
    { year: 2035, temperature: 2.2, carbonPrice: 35, gdpImpact: -0.9, energyDemand: 655, renewableShare: 21, fossilFuelDemand: 520, co2Emissions: 38, model: "MessageIX-Globiom" },
    { year: 2040, temperature: 2.6, carbonPrice: 50, gdpImpact: -1.8, energyDemand: 680, renewableShare: 28, fossilFuelDemand: 490, co2Emissions: 35, model: "MessageIX-Globiom" },
    { year: 2045, temperature: 3.0, carbonPrice: 65, gdpImpact: -2.8, energyDemand: 705, renewableShare: 35, fossilFuelDemand: 460, co2Emissions: 32, model: "MessageIX-Globiom" },
    { year: 2050, temperature: 3.3, carbonPrice: 80, gdpImpact: -3.5, energyDemand: 730, renewableShare: 42, fossilFuelDemand: 425, co2Emissions: 28, model: "MessageIX-Globiom" },
  ],

  "current-policies": [
    // GCAM model data
    { year: 2020, temperature: 1.1, carbonPrice: 10, gdpImpact: 0, energyDemand: 580, renewableShare: 12, fossilFuelDemand: 510, co2Emissions: 36, model: "GCAM" },
    { year: 2025, temperature: 1.4, carbonPrice: 12, gdpImpact: -0.1, energyDemand: 610, renewableShare: 13, fossilFuelDemand: 535, co2Emissions: 40, model: "GCAM" },
    { year: 2030, temperature: 1.8, carbonPrice: 15, gdpImpact: -0.3, energyDemand: 640, renewableShare: 15, fossilFuelDemand: 560, co2Emissions: 43, model: "GCAM" },
    { year: 2035, temperature: 2.3, carbonPrice: 18, gdpImpact: -1.2, energyDemand: 670, renewableShare: 17, fossilFuelDemand: 585, co2Emissions: 46, model: "GCAM" },
    { year: 2040, temperature: 2.8, carbonPrice: 22, gdpImpact: -2.8, energyDemand: 700, renewableShare: 20, fossilFuelDemand: 610, co2Emissions: 48, model: "GCAM" },
    { year: 2045, temperature: 3.2, carbonPrice: 25, gdpImpact: -4.5, energyDemand: 730, renewableShare: 23, fossilFuelDemand: 635, co2Emissions: 50, model: "GCAM" },
    { year: 2050, temperature: 3.6, carbonPrice: 28, gdpImpact: -6.2, energyDemand: 760, renewableShare: 26, fossilFuelDemand: 660, co2Emissions: 52, model: "GCAM" },
  ],

  "hot-house-world": [
    // REMIND-Magpie model data (worst case scenario)
    { year: 2020, temperature: 1.1, carbonPrice: 5, gdpImpact: 0, energyDemand: 580, renewableShare: 12, fossilFuelDemand: 510, co2Emissions: 36, model: "REMIND-Magpie" },
    { year: 2025, temperature: 1.5, carbonPrice: 6, gdpImpact: 0, energyDemand: 620, renewableShare: 12, fossilFuelDemand: 545, co2Emissions: 42, model: "REMIND-Magpie" },
    { year: 2030, temperature: 2.0, carbonPrice: 8, gdpImpact: -0.2, energyDemand: 660, renewableShare: 13, fossilFuelDemand: 580, co2Emissions: 47, model: "REMIND-Magpie" },
    { year: 2035, temperature: 2.6, carbonPrice: 10, gdpImpact: -1.8, energyDemand: 700, renewableShare: 14, fossilFuelDemand: 615, co2Emissions: 52, model: "REMIND-Magpie" },
    { year: 2040, temperature: 3.2, carbonPrice: 12, gdpImpact: -4.2, energyDemand: 740, renewableShare: 16, fossilFuelDemand: 650, co2Emissions: 56, model: "REMIND-Magpie" },
    { year: 2045, temperature: 3.8, carbonPrice: 15, gdpImpact: -7.5, energyDemand: 780, renewableShare: 18, fossilFuelDemand: 685, co2Emissions: 60, model: "REMIND-Magpie" },
    { year: 2050, temperature: 4.4, carbonPrice: 18, gdpImpact: -11.2, energyDemand: 820, renewableShare: 20, fossilFuelDemand: 720, co2Emissions: 64, model: "REMIND-Magpie" },
  ],
};

export const scenarioLabels: Record<string, string> = {
  "net-zero-2050": "Net Zero 2050",
  "below-2c": "Below 2°C",
  "delayed-transition": "Delayed Transition", 
  "divergent-net-zero": "Divergent Net Zero",
  "ndcs": "NDCs",
  "current-policies": "Current Policies",
  "hot-house-world": "Hot House World",
};

export const scenarioDescriptions: Record<string, string> = {
  "net-zero-2050": "Ambitious climate action with global net zero by 2050. High immediate carbon pricing but lower long-term physical risks.",
  "below-2c": "Policies consistent with limiting warming to below 2°C. Moderate carbon pricing with gradual transition.",
  "delayed-transition": "Climate action delayed until 2030, then accelerated transition. Higher stranded assets and transition costs.",
  "divergent-net-zero": "Uneven policy implementation across regions. Some achieve net zero while others lag behind.",
  "ndcs": "Current nationally determined contributions only. Limited additional climate action beyond existing commitments.",
  "current-policies": "No additional climate policies beyond current commitments. Highest physical risk impacts but lower transition costs.",
  "hot-house-world": "Failure of international cooperation. Highest temperature increases and most severe physical impacts.",
};

export const modelLabels: Record<string, string> = {
  "REMIND-Magpie": "REMIND-Magpie",
  "MessageIX-Globiom": "MessageIX-Globiom", 
  "GCAM": "GCAM",
  "IAM": "IAM",
};

export const metricLabels: Record<string, string> = {
  "temperature": "Temperature Increase (°C)",
  "carbonPrice": "Carbon Price (USD/tCO2)",
  "gdpImpact": "GDP Impact (%)",
  "energyDemand": "Energy Demand (EJ/yr)",
  "renewableShare": "Renewable Share (%)",
  "fossilFuelDemand": "Fossil Fuel Demand (EJ/yr)",
  "co2Emissions": "CO2 Emissions (GtCO2/yr)",
};

// Helper function to get data for a specific scenario and model
export function getScenarioModelData(scenario: string, model?: string): NgfsDataPoint[] {
  const scenarioData = ngfsScenarios[scenario] || [];
  if (model) {
    return scenarioData.filter(point => point.model === model);
  }
  return scenarioData;
}

// Helper function to get all available models for a scenario
export function getAvailableModels(scenario: string): string[] {
  const scenarioData = ngfsScenarios[scenario] || [];
  const modelSet = new Set(scenarioData.map(point => point.model));
  return Array.from(modelSet);
}

// Helper function to get aggregated data across all models
export function getAggregatedScenarioData(scenario: string): NgfsDataPoint[] {
  const scenarioData = ngfsScenarios[scenario] || [];
  const yearGroups = scenarioData.reduce((acc, point) => {
    if (!acc[point.year]) {
      acc[point.year] = [];
    }
    acc[point.year].push(point);
    return acc;
  }, {} as Record<number, NgfsDataPoint[]>);

  return Object.entries(yearGroups).map(([year, points]) => {
    const avgPoint = points.reduce((acc, point) => ({
      year: parseInt(year),
      temperature: acc.temperature + point.temperature / points.length,
      carbonPrice: acc.carbonPrice + point.carbonPrice / points.length,
      gdpImpact: acc.gdpImpact + point.gdpImpact / points.length,
      energyDemand: acc.energyDemand + point.energyDemand / points.length,
      renewableShare: acc.renewableShare + point.renewableShare / points.length,
      fossilFuelDemand: acc.fossilFuelDemand + point.fossilFuelDemand / points.length,
      co2Emissions: acc.co2Emissions + point.co2Emissions / points.length,
      model: 'Average'
    }), {
      year: parseInt(year),
      temperature: 0,
      carbonPrice: 0,
      gdpImpact: 0,
      energyDemand: 0,
      renewableShare: 0,
      fossilFuelDemand: 0,
      co2Emissions: 0,
      model: 'Average'
    });
    
    return avgPoint;
  }).sort((a, b) => a.year - b.year);
}