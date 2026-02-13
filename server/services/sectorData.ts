import { db } from "../db";
import { sectorProfiles, sectorInputOutput, sectorEmissionsHistory, sectorScenarioImpacts } from "@shared/schema";
import type { SectorProfile, InsertSectorProfile, SectorInputOutput, SectorEmissionsHistory, SectorScenarioImpact } from "@shared/schema";
import { eq, and } from "drizzle-orm";

// Baseline sector data with real-world estimates
// Sources: Climate TRACE, World Bank, NGFS, IEA reports
const BASELINE_SECTOR_DATA: Omit<InsertSectorProfile, 'id'>[] = [
  {
    sectorCode: "energy",
    sectorName: "Energy",
    description: "Oil & gas extraction, coal mining, electricity generation, renewables",
    naicsCodeRange: "21-22",
    gdpContributionPercent: 5.8,
    employmentPercent: 1.2,
    valueAddedBillions: 5200,
    averageRevenueGrowth: 2.3,
    annualEmissionsMtCo2: 15100,
    emissionsIntensity: 2900,
    emissionsTrend: "stable",
    primaryEmissionSources: ["Fossil fuel combustion", "Methane leakage", "Coal mining", "Oil refining"],
    transitionRiskLevel: "very_high",
    physicalRiskLevel: "high",
    opportunityLevel: "high",
    carbonIntensityCategory: "high",
    keyInputSectors: [
      { sector: "manufacturing", percent: 18, description: "Equipment and machinery" },
      { sector: "mining", percent: 12, description: "Raw materials extraction" },
      { sector: "technology", percent: 8, description: "Digital infrastructure" }
    ],
    keyOutputSectors: [
      { sector: "manufacturing", percent: 32, description: "Industrial power supply" },
      { sector: "transportation", percent: 24, description: "Fuel supply" },
      { sector: "agriculture", percent: 11, description: "Farm energy needs" }
    ],
    supplyChainVulnerabilities: [
      "Carbon pricing exposure across value chain",
      "Stranded asset risk for fossil fuel reserves",
      "Technology disruption from renewables",
      "Regulatory uncertainty in key markets"
    ],
    keyRisks: [
      "Stranded fossil fuel assets worth $4T+",
      "Carbon pricing up to $150/tCO2 by 2030",
      "Declining demand for oil/gas products",
      "Regulatory phase-out of coal power"
    ],
    keyOpportunities: [
      "Renewable energy expansion (solar, wind, storage)",
      "Green hydrogen production and distribution",
      "Carbon capture and storage technology",
      "Grid modernization and smart energy systems"
    ],
    dataSourceVersion: "2024-Q4"
  },
  {
    sectorCode: "manufacturing",
    sectorName: "Manufacturing",
    description: "Industrial production, machinery, chemicals, metals, consumer goods",
    naicsCodeRange: "31-33",
    gdpContributionPercent: 16.2,
    employmentPercent: 14.1,
    valueAddedBillions: 14800,
    averageRevenueGrowth: 3.1,
    annualEmissionsMtCo2: 8900,
    emissionsIntensity: 600,
    emissionsTrend: "decreasing",
    primaryEmissionSources: ["Industrial processes", "Energy use", "Chemical production", "Steel/cement making"],
    transitionRiskLevel: "high",
    physicalRiskLevel: "medium",
    opportunityLevel: "high",
    carbonIntensityCategory: "high",
    keyInputSectors: [
      { sector: "energy", percent: 22, description: "Power and fuel" },
      { sector: "mining", percent: 15, description: "Raw materials" },
      { sector: "agriculture", percent: 8, description: "Agricultural inputs" }
    ],
    keyOutputSectors: [
      { sector: "retail", percent: 28, description: "Consumer goods" },
      { sector: "construction", percent: 18, description: "Building materials" },
      { sector: "technology", percent: 14, description: "Components and hardware" }
    ],
    supplyChainVulnerabilities: [
      "Energy cost volatility from carbon pricing",
      "Supply chain disruptions from extreme weather",
      "Circular economy requirements increasing",
      "Raw material scarcity from resource constraints"
    ],
    keyRisks: [
      "Energy costs rising 30-50% by 2030",
      "Supply chain carbon border adjustments",
      "Mandatory sustainability reporting",
      "Resource scarcity affecting production"
    ],
    keyOpportunities: [
      "Clean technology manufacturing boom",
      "Circular economy and recycling growth",
      "Low-carbon materials innovation",
      "Energy efficiency retrofitting market"
    ],
    dataSourceVersion: "2024-Q4"
  },
  {
    sectorCode: "agriculture",
    sectorName: "Agriculture & Farming",
    description: "Crop production, livestock, fishing, forestry, food processing",
    naicsCodeRange: "11",
    gdpContributionPercent: 4.3,
    employmentPercent: 26.8,
    valueAddedBillions: 3900,
    averageRevenueGrowth: 1.8,
    annualEmissionsMtCo2: 5800,
    emissionsIntensity: 1490,
    emissionsTrend: "increasing",
    primaryEmissionSources: ["Livestock methane", "Fertilizer use", "Land use change", "Farm machinery"],
    transitionRiskLevel: "medium",
    physicalRiskLevel: "very_high",
    opportunityLevel: "high",
    carbonIntensityCategory: "medium",
    keyInputSectors: [
      { sector: "energy", percent: 14, description: "Fuel and electricity" },
      { sector: "manufacturing", percent: 18, description: "Machinery and chemicals" },
      { sector: "transportation", percent: 9, description: "Logistics" }
    ],
    keyOutputSectors: [
      { sector: "food_beverage", percent: 62, description: "Raw ingredients" },
      { sector: "retail", percent: 18, description: "Direct sales" },
      { sector: "manufacturing", percent: 12, description: "Industrial inputs" }
    ],
    supplyChainVulnerabilities: [
      "Extreme weather impacts on yields",
      "Water scarcity in key growing regions",
      "Changing pest and disease patterns",
      "Land use regulations and deforestation policies"
    ],
    keyRisks: [
      "Crop yield declines of 10-25% by 2050",
      "Water stress affecting 40% of farmland",
      "Methane regulations on livestock",
      "Deforestation-free supply chain requirements"
    ],
    keyOpportunities: [
      "Regenerative agriculture practices",
      "Precision agriculture and AgTech",
      "Alternative proteins and plant-based foods",
      "Carbon farming and ecosystem services"
    ],
    dataSourceVersion: "2024-Q4"
  },
  {
    sectorCode: "technology",
    sectorName: "Technology & IT Services",
    description: "Software, hardware, cloud computing, data centers, telecommunications",
    naicsCodeRange: "51-54",
    gdpContributionPercent: 8.4,
    employmentPercent: 4.2,
    valueAddedBillions: 7600,
    averageRevenueGrowth: 8.2,
    annualEmissionsMtCo2: 1100,
    emissionsIntensity: 145,
    emissionsTrend: "increasing",
    primaryEmissionSources: ["Data center energy", "Manufacturing supply chain", "Office energy use", "Employee travel"],
    transitionRiskLevel: "low",
    physicalRiskLevel: "low",
    opportunityLevel: "very_high",
    carbonIntensityCategory: "low",
    keyInputSectors: [
      { sector: "energy", percent: 12, description: "Data center power" },
      { sector: "manufacturing", percent: 24, description: "Hardware components" },
      { sector: "real_estate", percent: 8, description: "Office space" }
    ],
    keyOutputSectors: [
      { sector: "all_sectors", percent: 85, description: "Digital services across economy" },
      { sector: "finance", percent: 22, description: "Fintech solutions" },
      { sector: "manufacturing", percent: 18, description: "Automation and IoT" }
    ],
    supplyChainVulnerabilities: [
      "Data center cooling in warming climate",
      "Rare earth mineral supply constraints",
      "Infrastructure vulnerability to extreme weather",
      "Growing energy demand for AI workloads"
    ],
    keyRisks: [
      "Data center energy costs increasing",
      "Supply chain emissions reporting",
      "E-waste and circular economy regulations",
      "AI training carbon footprint concerns"
    ],
    keyOpportunities: [
      "Climate tech and clean energy software",
      "Smart grid and energy management solutions",
      "Sustainability data analytics platforms",
      "Remote work reducing commuting emissions"
    ],
    dataSourceVersion: "2024-Q4"
  },
  {
    sectorCode: "food_beverage",
    sectorName: "Food & Beverage Processing",
    description: "Food manufacturing, beverage production, packaging, distribution",
    naicsCodeRange: "311-312",
    gdpContributionPercent: 3.8,
    employmentPercent: 5.4,
    valueAddedBillions: 3500,
    averageRevenueGrowth: 2.6,
    annualEmissionsMtCo2: 2100,
    emissionsIntensity: 600,
    emissionsTrend: "stable",
    primaryEmissionSources: ["Supply chain agriculture", "Refrigeration", "Packaging", "Transportation"],
    transitionRiskLevel: "medium",
    physicalRiskLevel: "high",
    opportunityLevel: "high",
    carbonIntensityCategory: "medium",
    keyInputSectors: [
      { sector: "agriculture", percent: 58, description: "Raw ingredients" },
      { sector: "energy", percent: 12, description: "Processing energy" },
      { sector: "packaging", percent: 14, description: "Packaging materials" }
    ],
    keyOutputSectors: [
      { sector: "retail", percent: 52, description: "Grocery and food service" },
      { sector: "hospitality", percent: 28, description: "Restaurants and hotels" },
      { sector: "exports", percent: 14, description: "International trade" }
    ],
    supplyChainVulnerabilities: [
      "Agricultural supply disruption from climate events",
      "Water stress in processing facilities",
      "Cold chain disruption from extreme heat",
      "Packaging regulation and plastic restrictions"
    ],
    keyRisks: [
      "Agricultural input cost volatility",
      "Water scarcity affecting production",
      "Sustainable packaging requirements",
      "Scope 3 emissions from supply chain"
    ],
    keyOpportunities: [
      "Sustainable product lines premium pricing",
      "Plant-based and alternative proteins",
      "Food waste reduction technologies",
      "Local and regenerative sourcing"
    ],
    dataSourceVersion: "2024-Q4"
  }
];

// Input-output relationships between sectors (simplified BEA-style data)
const BASELINE_INPUT_OUTPUT: Omit<SectorInputOutput, 'id' | 'updatedAt'>[] = [
  // Energy sector flows
  { fromSectorCode: "energy", toSectorCode: "manufacturing", flowValueBillions: 320, flowPercent: 32, relationshipType: "output", year: 2023, dataSource: "BEA-derived" },
  { fromSectorCode: "energy", toSectorCode: "transportation", flowValueBillions: 240, flowPercent: 24, relationshipType: "output", year: 2023, dataSource: "BEA-derived" },
  { fromSectorCode: "energy", toSectorCode: "agriculture", flowValueBillions: 110, flowPercent: 11, relationshipType: "output", year: 2023, dataSource: "BEA-derived" },
  { fromSectorCode: "energy", toSectorCode: "technology", flowValueBillions: 85, flowPercent: 8.5, relationshipType: "output", year: 2023, dataSource: "BEA-derived" },
  { fromSectorCode: "energy", toSectorCode: "food_beverage", flowValueBillions: 75, flowPercent: 7.5, relationshipType: "output", year: 2023, dataSource: "BEA-derived" },
  
  // Manufacturing sector flows
  { fromSectorCode: "manufacturing", toSectorCode: "energy", flowValueBillions: 180, flowPercent: 18, relationshipType: "input", year: 2023, dataSource: "BEA-derived" },
  { fromSectorCode: "manufacturing", toSectorCode: "technology", flowValueBillions: 140, flowPercent: 14, relationshipType: "output", year: 2023, dataSource: "BEA-derived" },
  { fromSectorCode: "manufacturing", toSectorCode: "food_beverage", flowValueBillions: 95, flowPercent: 9.5, relationshipType: "output", year: 2023, dataSource: "BEA-derived" },
  
  // Agriculture sector flows
  { fromSectorCode: "agriculture", toSectorCode: "food_beverage", flowValueBillions: 620, flowPercent: 62, relationshipType: "output", year: 2023, dataSource: "BEA-derived" },
  { fromSectorCode: "agriculture", toSectorCode: "manufacturing", flowValueBillions: 120, flowPercent: 12, relationshipType: "output", year: 2023, dataSource: "BEA-derived" },
  
  // Technology sector flows
  { fromSectorCode: "technology", toSectorCode: "all_sectors", flowValueBillions: 850, flowPercent: 85, relationshipType: "output", year: 2023, dataSource: "BEA-derived" },
  
  // Food & Beverage sector flows
  { fromSectorCode: "food_beverage", toSectorCode: "retail", flowValueBillions: 520, flowPercent: 52, relationshipType: "output", year: 2023, dataSource: "BEA-derived" }
];

// Emissions history (Climate TRACE style data)
const BASELINE_EMISSIONS_HISTORY: Omit<SectorEmissionsHistory, 'id' | 'updatedAt'>[] = [
  // Energy sector emissions
  { sectorCode: "energy", year: 2019, emissionsMtCo2: 14800, emissionsByGas: { CO2: 12500, CH4: 2100, N2O: 200 }, emissionsByRegion: { "North America": 22, "Europe": 18, "Asia Pacific": 45, "Other": 15 }, dataSource: "Climate TRACE" },
  { sectorCode: "energy", year: 2020, emissionsMtCo2: 14200, emissionsByGas: { CO2: 12000, CH4: 2000, N2O: 200 }, emissionsByRegion: { "North America": 21, "Europe": 17, "Asia Pacific": 46, "Other": 16 }, dataSource: "Climate TRACE" },
  { sectorCode: "energy", year: 2021, emissionsMtCo2: 14600, emissionsByGas: { CO2: 12300, CH4: 2100, N2O: 200 }, emissionsByRegion: { "North America": 21, "Europe": 17, "Asia Pacific": 47, "Other": 15 }, dataSource: "Climate TRACE" },
  { sectorCode: "energy", year: 2022, emissionsMtCo2: 14900, emissionsByGas: { CO2: 12600, CH4: 2100, N2O: 200 }, emissionsByRegion: { "North America": 20, "Europe": 16, "Asia Pacific": 48, "Other": 16 }, dataSource: "Climate TRACE" },
  { sectorCode: "energy", year: 2023, emissionsMtCo2: 15100, emissionsByGas: { CO2: 12800, CH4: 2100, N2O: 200 }, emissionsByRegion: { "North America": 20, "Europe": 15, "Asia Pacific": 49, "Other": 16 }, dataSource: "Climate TRACE" },
  
  // Manufacturing sector emissions
  { sectorCode: "manufacturing", year: 2019, emissionsMtCo2: 9200, emissionsByGas: { CO2: 8500, CH4: 400, N2O: 300 }, emissionsByRegion: { "North America": 18, "Europe": 20, "Asia Pacific": 48, "Other": 14 }, dataSource: "Climate TRACE" },
  { sectorCode: "manufacturing", year: 2020, emissionsMtCo2: 8800, emissionsByGas: { CO2: 8100, CH4: 400, N2O: 300 }, emissionsByRegion: { "North America": 17, "Europe": 19, "Asia Pacific": 49, "Other": 15 }, dataSource: "Climate TRACE" },
  { sectorCode: "manufacturing", year: 2021, emissionsMtCo2: 8900, emissionsByGas: { CO2: 8200, CH4: 400, N2O: 300 }, emissionsByRegion: { "North America": 17, "Europe": 18, "Asia Pacific": 50, "Other": 15 }, dataSource: "Climate TRACE" },
  { sectorCode: "manufacturing", year: 2022, emissionsMtCo2: 8950, emissionsByGas: { CO2: 8250, CH4: 400, N2O: 300 }, emissionsByRegion: { "North America": 16, "Europe": 17, "Asia Pacific": 51, "Other": 16 }, dataSource: "Climate TRACE" },
  { sectorCode: "manufacturing", year: 2023, emissionsMtCo2: 8900, emissionsByGas: { CO2: 8200, CH4: 400, N2O: 300 }, emissionsByRegion: { "North America": 16, "Europe": 17, "Asia Pacific": 51, "Other": 16 }, dataSource: "Climate TRACE" },
  
  // Agriculture sector emissions
  { sectorCode: "agriculture", year: 2019, emissionsMtCo2: 5500, emissionsByGas: { CO2: 1500, CH4: 2800, N2O: 1200 }, emissionsByRegion: { "North America": 12, "Europe": 10, "Asia Pacific": 38, "Other": 40 }, dataSource: "Climate TRACE" },
  { sectorCode: "agriculture", year: 2020, emissionsMtCo2: 5600, emissionsByGas: { CO2: 1520, CH4: 2850, N2O: 1230 }, emissionsByRegion: { "North America": 12, "Europe": 10, "Asia Pacific": 38, "Other": 40 }, dataSource: "Climate TRACE" },
  { sectorCode: "agriculture", year: 2021, emissionsMtCo2: 5650, emissionsByGas: { CO2: 1540, CH4: 2870, N2O: 1240 }, emissionsByRegion: { "North America": 11, "Europe": 9, "Asia Pacific": 39, "Other": 41 }, dataSource: "Climate TRACE" },
  { sectorCode: "agriculture", year: 2022, emissionsMtCo2: 5720, emissionsByGas: { CO2: 1560, CH4: 2900, N2O: 1260 }, emissionsByRegion: { "North America": 11, "Europe": 9, "Asia Pacific": 39, "Other": 41 }, dataSource: "Climate TRACE" },
  { sectorCode: "agriculture", year: 2023, emissionsMtCo2: 5800, emissionsByGas: { CO2: 1580, CH4: 2950, N2O: 1270 }, emissionsByRegion: { "North America": 11, "Europe": 9, "Asia Pacific": 39, "Other": 41 }, dataSource: "Climate TRACE" },
  
  // Technology sector emissions
  { sectorCode: "technology", year: 2019, emissionsMtCo2: 850, emissionsByGas: { CO2: 830, CH4: 10, N2O: 10 }, emissionsByRegion: { "North America": 35, "Europe": 22, "Asia Pacific": 38, "Other": 5 }, dataSource: "Climate TRACE" },
  { sectorCode: "technology", year: 2020, emissionsMtCo2: 920, emissionsByGas: { CO2: 900, CH4: 10, N2O: 10 }, emissionsByRegion: { "North America": 34, "Europe": 21, "Asia Pacific": 40, "Other": 5 }, dataSource: "Climate TRACE" },
  { sectorCode: "technology", year: 2021, emissionsMtCo2: 980, emissionsByGas: { CO2: 960, CH4: 10, N2O: 10 }, emissionsByRegion: { "North America": 33, "Europe": 20, "Asia Pacific": 42, "Other": 5 }, dataSource: "Climate TRACE" },
  { sectorCode: "technology", year: 2022, emissionsMtCo2: 1040, emissionsByGas: { CO2: 1020, CH4: 10, N2O: 10 }, emissionsByRegion: { "North America": 32, "Europe": 19, "Asia Pacific": 44, "Other": 5 }, dataSource: "Climate TRACE" },
  { sectorCode: "technology", year: 2023, emissionsMtCo2: 1100, emissionsByGas: { CO2: 1080, CH4: 10, N2O: 10 }, emissionsByRegion: { "North America": 31, "Europe": 18, "Asia Pacific": 46, "Other": 5 }, dataSource: "Climate TRACE" },
  
  // Food & Beverage sector emissions
  { sectorCode: "food_beverage", year: 2019, emissionsMtCo2: 2000, emissionsByGas: { CO2: 1400, CH4: 400, N2O: 200 }, emissionsByRegion: { "North America": 22, "Europe": 20, "Asia Pacific": 35, "Other": 23 }, dataSource: "Climate TRACE" },
  { sectorCode: "food_beverage", year: 2020, emissionsMtCo2: 2020, emissionsByGas: { CO2: 1410, CH4: 410, N2O: 200 }, emissionsByRegion: { "North America": 22, "Europe": 20, "Asia Pacific": 35, "Other": 23 }, dataSource: "Climate TRACE" },
  { sectorCode: "food_beverage", year: 2021, emissionsMtCo2: 2050, emissionsByGas: { CO2: 1430, CH4: 420, N2O: 200 }, emissionsByRegion: { "North America": 21, "Europe": 19, "Asia Pacific": 36, "Other": 24 }, dataSource: "Climate TRACE" },
  { sectorCode: "food_beverage", year: 2022, emissionsMtCo2: 2080, emissionsByGas: { CO2: 1450, CH4: 430, N2O: 200 }, emissionsByRegion: { "North America": 21, "Europe": 19, "Asia Pacific": 36, "Other": 24 }, dataSource: "Climate TRACE" },
  { sectorCode: "food_beverage", year: 2023, emissionsMtCo2: 2100, emissionsByGas: { CO2: 1470, CH4: 430, N2O: 200 }, emissionsByRegion: { "North America": 20, "Europe": 18, "Asia Pacific": 37, "Other": 25 }, dataSource: "Climate TRACE" }
];

// NGFS Scenario impacts by sector
const BASELINE_SCENARIO_IMPACTS: Omit<SectorScenarioImpact, 'id' | 'updatedAt'>[] = [
  // Energy sector scenarios
  { sectorCode: "energy", scenarioName: "Net Zero 2050", year: 2030, gdpImpactPercent: -8.5, carbonPriceUsd: 130, energyDemandChange: -15, investmentRequiredBillions: 850, strandedAssetRiskPercent: 35, transitionScore: 9.2, adaptationNeeds: ["Renewable capacity expansion", "Grid modernization", "Fossil fuel phase-out planning"], dataSource: "NGFS Phase 5" },
  { sectorCode: "energy", scenarioName: "Net Zero 2050", year: 2040, gdpImpactPercent: -12.3, carbonPriceUsd: 280, energyDemandChange: -28, investmentRequiredBillions: 1200, strandedAssetRiskPercent: 55, transitionScore: 9.5, adaptationNeeds: ["Complete coal phase-out", "Hydrogen infrastructure", "Carbon capture at scale"], dataSource: "NGFS Phase 5" },
  { sectorCode: "energy", scenarioName: "Net Zero 2050", year: 2050, gdpImpactPercent: -5.2, carbonPriceUsd: 450, energyDemandChange: -45, investmentRequiredBillions: 600, strandedAssetRiskPercent: 75, transitionScore: 8.8, adaptationNeeds: ["Final fossil fuel elimination", "Grid stability solutions", "Long-term storage"], dataSource: "NGFS Phase 5" },
  { sectorCode: "energy", scenarioName: "Current Policies", year: 2030, gdpImpactPercent: 2.1, carbonPriceUsd: 25, energyDemandChange: 8, investmentRequiredBillions: 200, strandedAssetRiskPercent: 5, transitionScore: 2.5, adaptationNeeds: ["Marginal efficiency improvements"], dataSource: "NGFS Phase 5" },
  { sectorCode: "energy", scenarioName: "Current Policies", year: 2040, gdpImpactPercent: -4.8, carbonPriceUsd: 45, energyDemandChange: 12, investmentRequiredBillions: 350, strandedAssetRiskPercent: 15, transitionScore: 3.2, adaptationNeeds: ["Physical risk adaptation", "Extreme weather resilience"], dataSource: "NGFS Phase 5" },
  { sectorCode: "energy", scenarioName: "Current Policies", year: 2050, gdpImpactPercent: -18.5, carbonPriceUsd: 80, energyDemandChange: 15, investmentRequiredBillions: 500, strandedAssetRiskPercent: 25, transitionScore: 4.5, adaptationNeeds: ["Severe physical risk management", "Abrupt transition preparation"], dataSource: "NGFS Phase 5" },
  
  // Manufacturing sector scenarios
  { sectorCode: "manufacturing", scenarioName: "Net Zero 2050", year: 2030, gdpImpactPercent: -4.2, carbonPriceUsd: 130, energyDemandChange: -12, investmentRequiredBillions: 420, strandedAssetRiskPercent: 18, transitionScore: 7.5, adaptationNeeds: ["Industrial electrification", "Process efficiency", "Circular economy adoption"], dataSource: "NGFS Phase 5" },
  { sectorCode: "manufacturing", scenarioName: "Net Zero 2050", year: 2040, gdpImpactPercent: -6.8, carbonPriceUsd: 280, energyDemandChange: -22, investmentRequiredBillions: 580, strandedAssetRiskPercent: 28, transitionScore: 8.2, adaptationNeeds: ["Green hydrogen for heat", "Carbon capture", "Material substitution"], dataSource: "NGFS Phase 5" },
  { sectorCode: "manufacturing", scenarioName: "Net Zero 2050", year: 2050, gdpImpactPercent: -2.5, carbonPriceUsd: 450, energyDemandChange: -35, investmentRequiredBillions: 320, strandedAssetRiskPercent: 38, transitionScore: 7.8, adaptationNeeds: ["Full decarbonization", "Sustainable materials only"], dataSource: "NGFS Phase 5" },
  { sectorCode: "manufacturing", scenarioName: "Current Policies", year: 2030, gdpImpactPercent: 1.5, carbonPriceUsd: 25, energyDemandChange: 5, investmentRequiredBillions: 120, strandedAssetRiskPercent: 3, transitionScore: 2.2, adaptationNeeds: ["Marginal improvements"], dataSource: "NGFS Phase 5" },
  { sectorCode: "manufacturing", scenarioName: "Current Policies", year: 2050, gdpImpactPercent: -8.5, carbonPriceUsd: 80, energyDemandChange: 10, investmentRequiredBillions: 280, strandedAssetRiskPercent: 12, transitionScore: 3.8, adaptationNeeds: ["Physical risk adaptation", "Supply chain resilience"], dataSource: "NGFS Phase 5" },
  
  // Agriculture sector scenarios
  { sectorCode: "agriculture", scenarioName: "Net Zero 2050", year: 2030, gdpImpactPercent: -2.8, carbonPriceUsd: 130, energyDemandChange: -8, investmentRequiredBillions: 180, strandedAssetRiskPercent: 8, transitionScore: 5.5, adaptationNeeds: ["Sustainable farming practices", "Methane reduction", "Precision agriculture"], dataSource: "NGFS Phase 5" },
  { sectorCode: "agriculture", scenarioName: "Net Zero 2050", year: 2050, gdpImpactPercent: 1.2, carbonPriceUsd: 450, energyDemandChange: -20, investmentRequiredBillions: 250, strandedAssetRiskPercent: 12, transitionScore: 6.2, adaptationNeeds: ["Regenerative agriculture", "Alternative proteins", "Carbon sequestration"], dataSource: "NGFS Phase 5" },
  { sectorCode: "agriculture", scenarioName: "Current Policies", year: 2030, gdpImpactPercent: -3.5, carbonPriceUsd: 25, energyDemandChange: 3, investmentRequiredBillions: 80, strandedAssetRiskPercent: 5, transitionScore: 2.8, adaptationNeeds: ["Water management", "Heat-resistant crops"], dataSource: "NGFS Phase 5" },
  { sectorCode: "agriculture", scenarioName: "Current Policies", year: 2050, gdpImpactPercent: -22.5, carbonPriceUsd: 80, energyDemandChange: 5, investmentRequiredBillions: 180, strandedAssetRiskPercent: 25, transitionScore: 4.8, adaptationNeeds: ["Severe yield adaptation", "Migration of farming regions"], dataSource: "NGFS Phase 5" },
  
  // Technology sector scenarios
  { sectorCode: "technology", scenarioName: "Net Zero 2050", year: 2030, gdpImpactPercent: 5.2, carbonPriceUsd: 130, energyDemandChange: 15, investmentRequiredBillions: 120, strandedAssetRiskPercent: 2, transitionScore: 3.5, adaptationNeeds: ["Renewable energy procurement", "Efficient data centers", "Green software"], dataSource: "NGFS Phase 5" },
  { sectorCode: "technology", scenarioName: "Net Zero 2050", year: 2050, gdpImpactPercent: 12.8, carbonPriceUsd: 450, energyDemandChange: 25, investmentRequiredBillions: 180, strandedAssetRiskPercent: 3, transitionScore: 4.2, adaptationNeeds: ["100% renewable", "Circular electronics", "AI for sustainability"], dataSource: "NGFS Phase 5" },
  { sectorCode: "technology", scenarioName: "Current Policies", year: 2030, gdpImpactPercent: 3.8, carbonPriceUsd: 25, energyDemandChange: 22, investmentRequiredBillions: 60, strandedAssetRiskPercent: 1, transitionScore: 2.0, adaptationNeeds: ["Minor efficiency gains"], dataSource: "NGFS Phase 5" },
  { sectorCode: "technology", scenarioName: "Current Policies", year: 2050, gdpImpactPercent: -2.5, carbonPriceUsd: 80, energyDemandChange: 45, investmentRequiredBillions: 120, strandedAssetRiskPercent: 5, transitionScore: 3.0, adaptationNeeds: ["Infrastructure cooling", "Grid reliability"], dataSource: "NGFS Phase 5" },
  
  // Food & Beverage sector scenarios
  { sectorCode: "food_beverage", scenarioName: "Net Zero 2050", year: 2030, gdpImpactPercent: -3.5, carbonPriceUsd: 130, energyDemandChange: -10, investmentRequiredBillions: 95, strandedAssetRiskPercent: 8, transitionScore: 5.8, adaptationNeeds: ["Sustainable packaging", "Cold chain efficiency", "Plant-based expansion"], dataSource: "NGFS Phase 5" },
  { sectorCode: "food_beverage", scenarioName: "Net Zero 2050", year: 2050, gdpImpactPercent: 0.8, carbonPriceUsd: 450, energyDemandChange: -25, investmentRequiredBillions: 140, strandedAssetRiskPercent: 15, transitionScore: 6.5, adaptationNeeds: ["Zero-waste operations", "Regenerative sourcing", "Carbon-neutral logistics"], dataSource: "NGFS Phase 5" },
  { sectorCode: "food_beverage", scenarioName: "Current Policies", year: 2030, gdpImpactPercent: -2.2, carbonPriceUsd: 25, energyDemandChange: 4, investmentRequiredBillions: 45, strandedAssetRiskPercent: 4, transitionScore: 2.5, adaptationNeeds: ["Supply chain diversification"], dataSource: "NGFS Phase 5" },
  { sectorCode: "food_beverage", scenarioName: "Current Policies", year: 2050, gdpImpactPercent: -15.8, carbonPriceUsd: 80, energyDemandChange: 8, investmentRequiredBillions: 110, strandedAssetRiskPercent: 18, transitionScore: 4.2, adaptationNeeds: ["Severe agricultural adaptation", "Alternative sourcing"], dataSource: "NGFS Phase 5" }
];

export class SectorDataService {
  // Initialize baseline data if not present
  async initializeBaselineData(): Promise<void> {
    try {
      // Check if sector profiles exist
      const existingProfiles = await db.select().from(sectorProfiles).limit(1);
      
      if (existingProfiles.length === 0) {
        console.log("Initializing baseline sector data...");
        
        // Insert sector profiles
        for (const profile of BASELINE_SECTOR_DATA) {
          await db.insert(sectorProfiles).values(profile).onConflictDoNothing();
        }
        
        // Insert input-output relationships
        for (const io of BASELINE_INPUT_OUTPUT) {
          await db.insert(sectorInputOutput).values(io).onConflictDoNothing();
        }
        
        // Insert emissions history
        for (const emission of BASELINE_EMISSIONS_HISTORY) {
          await db.insert(sectorEmissionsHistory).values(emission).onConflictDoNothing();
        }
        
        // Insert scenario impacts
        for (const impact of BASELINE_SCENARIO_IMPACTS) {
          await db.insert(sectorScenarioImpacts).values(impact).onConflictDoNothing();
        }
        
        console.log("Baseline sector data initialized successfully");
      }
    } catch (error) {
      console.error("Error initializing baseline sector data:", error);
    }
  }

  // Get all sector profiles
  async getAllSectorProfiles(): Promise<SectorProfile[]> {
    return db.select().from(sectorProfiles);
  }

  // Get sector profile by code
  async getSectorProfile(sectorCode: string): Promise<SectorProfile | undefined> {
    const results = await db.select().from(sectorProfiles).where(eq(sectorProfiles.sectorCode, sectorCode));
    return results[0];
  }

  // Get input-output relationships for a sector
  async getSectorInputOutput(sectorCode: string): Promise<SectorInputOutput[]> {
    return db.select().from(sectorInputOutput).where(
      eq(sectorInputOutput.fromSectorCode, sectorCode)
    );
  }

  // Get emissions history for a sector
  async getSectorEmissionsHistory(sectorCode: string): Promise<SectorEmissionsHistory[]> {
    return db.select().from(sectorEmissionsHistory).where(
      eq(sectorEmissionsHistory.sectorCode, sectorCode)
    );
  }

  // Get scenario impacts for a sector
  async getSectorScenarioImpacts(sectorCode: string, scenarioName?: string): Promise<SectorScenarioImpact[]> {
    if (scenarioName) {
      return db.select().from(sectorScenarioImpacts).where(
        and(
          eq(sectorScenarioImpacts.sectorCode, sectorCode),
          eq(sectorScenarioImpacts.scenarioName, scenarioName)
        )
      );
    }
    return db.select().from(sectorScenarioImpacts).where(
      eq(sectorScenarioImpacts.sectorCode, sectorCode)
    );
  }

  // Get comprehensive sector data for assessment integration
  async getComprehensiveSectorData(sectorCode: string): Promise<{
    profile: SectorProfile | undefined;
    inputOutput: SectorInputOutput[];
    emissionsHistory: SectorEmissionsHistory[];
    scenarioImpacts: SectorScenarioImpact[];
  }> {
    const [profile, inputOutput, emissionsHistory, scenarioImpacts] = await Promise.all([
      this.getSectorProfile(sectorCode),
      this.getSectorInputOutput(sectorCode),
      this.getSectorEmissionsHistory(sectorCode),
      this.getSectorScenarioImpacts(sectorCode)
    ]);

    return { profile, inputOutput, emissionsHistory, scenarioImpacts };
  }

  // Map industry name to sector code
  mapIndustryToSectorCode(industry: string): string | null {
    const industryLower = industry.toLowerCase();
    
    const mappings: Record<string, string[]> = {
      energy: ["energy", "oil", "gas", "petroleum", "utilities", "electricity", "power", "coal", "renewable", "solar", "wind"],
      manufacturing: ["manufacturing", "industrial", "machinery", "equipment", "chemical", "steel", "metal", "automotive", "aerospace"],
      agriculture: ["agriculture", "farming", "crop", "livestock", "forestry", "fishing", "agribusiness"],
      technology: ["technology", "tech", "software", "hardware", "it", "digital", "cloud", "data", "telecommunications", "telecom"],
      food_beverage: ["food", "beverage", "restaurant", "grocery", "consumer goods", "packaged food", "drink", "brewery"]
    };

    for (const [sectorCode, keywords] of Object.entries(mappings)) {
      if (keywords.some(keyword => industryLower.includes(keyword))) {
        return sectorCode;
      }
    }

    return null;
  }
}

export const sectorDataService = new SectorDataService();
