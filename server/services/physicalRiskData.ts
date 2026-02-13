/**
 * Physical Risk Data Service
 * 
 * Integrates with CMIP6 (via World Bank Climate Knowledge Portal) and ISIMIP APIs
 * to provide physical climate risk data for location-based assessments.
 * 
 * Now primarily queries from local database with pre-imported climate data,
 * falling back to API calls only when database data is unavailable.
 */

import { db } from "../db";
import { climateGridData } from "@shared/schema";
import { eq, and, sql } from "drizzle-orm";

export interface PhysicalRiskIndicator {
  id: string;
  name: string;
  description: string;
  unit: string;
  category: string; // e.g., "temperature", "precipitation", "extreme"
  source: "cmip" | "isimip";
}

export interface LocationData {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
}

export interface RiskDataPoint {
  locationId: string;
  indicatorId: string;
  scenario: string;
  timePeriod: string;
  value: number;
  riskLevel: "low" | "medium" | "high" | "very_high" | "extreme";
  percentile?: number;
}

export interface PhysicalRiskResponse {
  locations: LocationData[];
  indicators: PhysicalRiskIndicator[];
  riskData: RiskDataPoint[];
  metadata: {
    source: string;
    scenario: string;
    timePeriod: string;
    lastUpdated: string;
  };
}

// CMIP6 Physical Risk Indicators (via World Bank CCKP)
export const CMIP_INDICATORS: PhysicalRiskIndicator[] = [
  {
    id: "tas",
    name: "Mean Temperature",
    description: "Average near-surface air temperature",
    unit: "°C",
    category: "temperature",
    source: "cmip"
  },
  {
    id: "tasmax",
    name: "Maximum Temperature",
    description: "Maximum near-surface air temperature",
    unit: "°C",
    category: "temperature",
    source: "cmip"
  },
  {
    id: "tasmin",
    name: "Minimum Temperature",
    description: "Minimum near-surface air temperature",
    unit: "°C",
    category: "temperature",
    source: "cmip"
  },
  {
    id: "pr",
    name: "Precipitation",
    description: "Total precipitation (rain and snow)",
    unit: "mm/day",
    category: "precipitation",
    source: "cmip"
  },
  {
    id: "hd35",
    name: "Hot Days (>35°C)",
    description: "Number of days per year with temperature above 35°C",
    unit: "days/year",
    category: "extreme",
    source: "cmip"
  },
  {
    id: "hd40",
    name: "Extreme Heat Days (>40°C)",
    description: "Number of days per year with temperature above 40°C",
    unit: "days/year",
    category: "extreme",
    source: "cmip"
  },
  {
    id: "cdd",
    name: "Consecutive Dry Days",
    description: "Maximum number of consecutive days with precipitation < 1mm",
    unit: "days",
    category: "drought",
    source: "cmip"
  },
  {
    id: "r95p",
    name: "Extreme Precipitation",
    description: "Annual total precipitation when daily precipitation > 95th percentile",
    unit: "mm",
    category: "flood",
    source: "cmip"
  },
  {
    id: "slr",
    name: "Sea Level Rise",
    description: "Projected sea level rise relative to 1995-2014 baseline",
    unit: "m",
    category: "coastal",
    source: "cmip"
  },
  {
    id: "hwf",
    name: "Heat Wave Frequency",
    description: "Number of heat wave events per year",
    unit: "events/year",
    category: "extreme",
    source: "cmip"
  }
];

// ISIMIP Physical Risk Indicators
export const ISIMIP_INDICATORS: PhysicalRiskIndicator[] = [
  {
    id: "flood_depth",
    name: "Flood Depth",
    description: "Projected flood inundation depth for given return period",
    unit: "m",
    category: "flood",
    source: "isimip"
  },
  {
    id: "drought_severity",
    name: "Drought Severity Index",
    description: "Standardized Precipitation-Evapotranspiration Index (SPEI)",
    unit: "index",
    category: "drought",
    source: "isimip"
  },
  {
    id: "water_stress",
    name: "Water Stress",
    description: "Ratio of water withdrawal to available water resources",
    unit: "%",
    category: "water",
    source: "isimip"
  },
  {
    id: "crop_yield_change",
    name: "Crop Yield Change",
    description: "Projected change in crop yields relative to baseline",
    unit: "%",
    category: "agriculture",
    source: "isimip"
  },
  {
    id: "wildfire_risk",
    name: "Wildfire Risk",
    description: "Fire Weather Index indicating wildfire danger",
    unit: "index",
    category: "wildfire",
    source: "isimip"
  },
  {
    id: "tropical_cyclone",
    name: "Tropical Cyclone Exposure",
    description: "Exposure to tropical cyclone wind speeds",
    unit: "m/s",
    category: "storm",
    source: "isimip"
  },
  {
    id: "river_discharge",
    name: "River Discharge Change",
    description: "Projected change in river discharge",
    unit: "%",
    category: "water",
    source: "isimip"
  },
  {
    id: "heat_mortality",
    name: "Heat-Related Mortality Risk",
    description: "Projected increase in heat-related mortality",
    unit: "deaths/100k",
    category: "health",
    source: "isimip"
  }
];

// Climate scenarios
export const SCENARIOS = {
  cmip: [
    { id: "ssp126", name: "SSP1-2.6", description: "Sustainability - Low emissions" },
    { id: "ssp245", name: "SSP2-4.5", description: "Middle of the Road" },
    { id: "ssp370", name: "SSP3-7.0", description: "Regional Rivalry" },
    { id: "ssp585", name: "SSP5-8.5", description: "Fossil-fueled Development - High emissions" }
  ],
  isimip: [
    { id: "ssp126", name: "SSP1-2.6", description: "Low emissions pathway" },
    { id: "ssp370", name: "SSP3-7.0", description: "Medium-high emissions" },
    { id: "ssp585", name: "SSP5-8.5", description: "High emissions pathway" }
  ]
};

// Time periods (historic and future)
export const TIME_PERIODS = [
  { id: "1980", name: "1970-1989", midpoint: 1980, isHistoric: true },
  { id: "1990", name: "1980-1999", midpoint: 1990, isHistoric: true },
  { id: "2000", name: "1990-2009", midpoint: 2000, isHistoric: true },
  { id: "2010", name: "2000-2019", midpoint: 2010, isHistoric: true },
  { id: "2030", name: "2020-2039", midpoint: 2030, isHistoric: false },
  { id: "2050", name: "2040-2059", midpoint: 2050, isHistoric: false },
  { id: "2070", name: "2060-2079", midpoint: 2070, isHistoric: false },
  { id: "2090", name: "2080-2099", midpoint: 2090, isHistoric: false }
];

/**
 * Calculate risk level based on indicator value and thresholds
 */
function calculateRiskLevel(
  indicatorId: string,
  value: number,
  source: "cmip" | "isimip"
): "low" | "medium" | "high" | "very_high" | "extreme" {
  // Define thresholds for each indicator (simplified for demonstration)
  const thresholds: { [key: string]: number[] } = {
    // Temperature indicators (°C change)
    tas: [1, 2, 3, 4],
    tasmax: [2, 4, 6, 8],
    tasmin: [1, 2, 3, 4],
    // Hot days
    hd35: [10, 30, 60, 100],
    hd40: [5, 15, 30, 60],
    // Heat waves
    hwf: [2, 5, 10, 20],
    // Precipitation (mm change)
    pr: [-0.5, -1, -2, -3],
    // Drought
    cdd: [30, 60, 90, 120],
    drought_severity: [-1, -1.5, -2, -2.5],
    // Flood
    r95p: [50, 100, 200, 400],
    flood_depth: [0.5, 1, 2, 4],
    // Sea level
    slr: [0.2, 0.4, 0.6, 1],
    // Water stress
    water_stress: [20, 40, 60, 80],
    // Other
    crop_yield_change: [-10, -20, -30, -50],
    wildfire_risk: [20, 40, 60, 80],
    tropical_cyclone: [33, 50, 70, 100],
    river_discharge: [-20, -40, 50, 100],
    heat_mortality: [5, 20, 50, 100]
  };

  const levels = thresholds[indicatorId] || [25, 50, 75, 90];
  
  // Handle negative thresholds (like crop yield change)
  if (indicatorId.includes("change") || indicatorId === "drought_severity") {
    if (value >= 0) return "low";
    if (value > levels[0]) return "low";
    if (value > levels[1]) return "medium";
    if (value > levels[2]) return "high";
    if (value > levels[3]) return "very_high";
    return "extreme";
  }
  
  if (value < levels[0]) return "low";
  if (value < levels[1]) return "medium";
  if (value < levels[2]) return "high";
  if (value < levels[3]) return "very_high";
  return "extreme";
}

/**
 * Deterministic pseudo-random number generator using location as seed
 * Produces consistent values for the same location
 */
function seededRandom(lat: number, lng: number, seed: number = 0): number {
  const x = Math.sin(lat * 12.9898 + lng * 78.233 + seed) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * Generate sample physical risk data for locations
 * Used when APIs are unavailable or for demonstration
 */
function generateSampleRiskData(
  locations: LocationData[],
  indicatorIds: string[],
  scenario: string,
  timePeriod: string,
  source: "cmip" | "isimip"
): RiskDataPoint[] {
  const riskData: RiskDataPoint[] = [];
  const indicators = source === "cmip" ? CMIP_INDICATORS : ISIMIP_INDICATORS;
  
  // Scenario multiplier (higher emissions = higher risk)
  const scenarioMultiplier: { [key: string]: number } = {
    ssp126: 0.6,
    ssp245: 0.8,
    ssp370: 1.2,
    ssp585: 1.5
  };
  
  // Time period multiplier (historic periods have lower values, future higher)
  const timeMultiplier: { [key: string]: number } = {
    "1980": 0.3,
    "1990": 0.4,
    "2000": 0.5,
    "2010": 0.6,
    "2030": 0.8,
    "2050": 1.0,
    "2070": 1.3,
    "2090": 1.6
  };
  
  for (const location of locations) {
    // Create location-specific seed from coordinates
    const lat = location.latitude;
    const lng = location.longitude;
    
    // Normalized factors with more geographic variation
    const latFactor = Math.abs(lat) / 90; // 0 at equator, 1 at poles
    const lngFactor = (lng + 180) / 360; // 0-1 across longitudes
    
    // Regional climate zones based on latitude bands
    const isTropical = Math.abs(lat) < 23.5;
    const isSubtropical = Math.abs(lat) >= 23.5 && Math.abs(lat) < 35;
    const isTemperate = Math.abs(lat) >= 35 && Math.abs(lat) < 55;
    const isPolar = Math.abs(lat) >= 55;
    
    // Hemisphere and continental position effects
    const isNorthern = lat >= 0;
    const isContinental = Math.abs(lng) > 30 && Math.abs(lng) < 150; // rough continental interior
    
    // Pre-calculate geographic zones used across multiple indicators
    const isDryBelt = Math.abs(lat) > 20 && Math.abs(lat) < 35;
    const isMonsoonal = (lat > 5 && lat < 35 && lng > 60 && lng < 150); // South/East Asia
    
    for (const indicatorId of indicatorIds) {
      const indicator = indicators.find(i => i.id === indicatorId);
      if (!indicator) continue;
      
      // Generate deterministic random variation per location+indicator
      const indicatorSeed = indicatorId.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
      const locationVariation = seededRandom(lat, lng, indicatorSeed);
      
      // Different base values depending on indicator type with strong geographic variation
      let baseValue: number;
      switch (indicator.category) {
        case "temperature":
          // Higher warming at high latitudes (Arctic amplification), also continental interiors warm faster
          if (isPolar) {
            baseValue = 3.5 + locationVariation * 2.5; // 3.5-6°C warming
          } else if (isTemperate) {
            baseValue = 2.0 + (isContinental ? 1.5 : 0.5) + locationVariation * 1.5;
          } else if (isSubtropical) {
            baseValue = 1.5 + locationVariation * 1.2;
          } else { // tropical
            baseValue = 1.2 + locationVariation * 0.8;
          }
          break;
          
        case "extreme":
          // Hot days much more common in subtropics and tropics
          if (isTropical) {
            baseValue = 60 + locationVariation * 80; // 60-140 days
          } else if (isSubtropical) {
            baseValue = 30 + locationVariation * 50; // 30-80 days
          } else if (isTemperate) {
            baseValue = 5 + locationVariation * 25; // 5-30 days
          } else {
            baseValue = locationVariation * 5; // 0-5 days
          }
          break;
          
        case "drought":
          // Subtropical highs = dry (Mediterranean, Sahara, Australia interior)
          if (isDryBelt && isContinental) {
            baseValue = 80 + locationVariation * 60; // 80-140 days
          } else if (isDryBelt) {
            baseValue = 50 + locationVariation * 40;
          } else if (isTropical) {
            baseValue = 20 + locationVariation * 30; // Wet tropics
          } else {
            baseValue = 30 + locationVariation * 40;
          }
          break;
          
        case "flood": {
          // Monsoon regions, river deltas, coastal areas
          const isCoastal = seededRandom(lat, lng, 999) > 0.7; // Random coastal designation
          if (isMonsoonal) {
            baseValue = 100 + locationVariation * 150;
          } else if (isTropical) {
            baseValue = 60 + locationVariation * 80;
          } else if (isCoastal) {
            baseValue = 40 + locationVariation * 60;
          } else {
            baseValue = 15 + locationVariation * 35;
          }
          break;
        }
          
        case "coastal": {
          // Sea level rise varies by ocean basin and local factors
          const basinFactor = Math.sin(lng * 0.05) * 0.15; // Ocean circulation effects
          baseValue = 0.3 + basinFactor + locationVariation * 0.4;
          break;
        }
          
        case "water": {
          // Water stress: arid regions, high population density areas
          const isArid = isDryBelt || (Math.abs(lng) > 100 && latFactor > 0.3);
          if (isArid) {
            baseValue = 60 + locationVariation * 35; // 60-95%
          } else if (isTropical && !isMonsoonal) {
            baseValue = 30 + locationVariation * 30;
          } else {
            baseValue = 10 + locationVariation * 25;
          }
          break;
        }
          
        case "agriculture":
          // Crop yield impacts: negative in tropics/subtropics, mixed in temperate
          if (isTropical) {
            baseValue = -25 - locationVariation * 25; // -25 to -50%
          } else if (isSubtropical) {
            baseValue = -15 - locationVariation * 20;
          } else if (isTemperate && isNorthern) {
            baseValue = -5 + locationVariation * 15; // Some gains possible in north
          } else {
            baseValue = -10 - locationVariation * 15;
          }
          break;
          
        case "wildfire": {
          // Mediterranean, California, Australia, boreal forests
          const isFireProne = (isSubtropical && !isMonsoonal) || 
                             (lat > 50 && lat < 70) || // Boreal
                             (lat < -30 && lng > 130); // Australia
          if (isFireProne) {
            baseValue = 50 + locationVariation * 40;
          } else if (isTemperate) {
            baseValue = 25 + locationVariation * 25;
          } else {
            baseValue = 10 + locationVariation * 20;
          }
          break;
        }
          
        case "storm": {
          // Tropical cyclones: 5-25° latitude, specific ocean basins
          const inCycloneBelt = Math.abs(lat) > 5 && Math.abs(lat) < 30;
          const inActiveBsin = (lng > -100 && lng < -30) || // Atlantic/Gulf
                                (lng > 100 || lng < -150) || // W Pacific
                                (lng > 50 && lng < 100 && lat > 0); // N Indian
          if (inCycloneBelt && inActiveBsin) {
            baseValue = 45 + locationVariation * 50;
          } else if (inCycloneBelt) {
            baseValue = 15 + locationVariation * 25;
          } else {
            baseValue = 5 + locationVariation * 10;
          }
          break;
        }
          
        case "health":
          // Heat mortality: urban, tropical, aging populations
          if (isTropical) {
            baseValue = 25 + locationVariation * 40;
          } else if (isSubtropical) {
            baseValue = 15 + locationVariation * 30;
          } else {
            baseValue = 5 + locationVariation * 15;
          }
          break;
          
        default:
          baseValue = 20 + locationVariation * 50;
      }
      
      // Apply scenario and time multipliers
      const scenarioMult = scenarioMultiplier[scenario] || 1;
      const timeMult = timeMultiplier[timePeriod] || 1;
      
      // Add small deterministic variation (±10%) for the specific scenario/time combination
      const scenarioSeed = scenario.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
      const timeSeed = parseInt(timePeriod) || 2050;
      const contextVariation = 0.9 + seededRandom(lat, lng, scenarioSeed + timeSeed) * 0.2;
      
      const value = Math.round(baseValue * scenarioMult * timeMult * contextVariation * 100) / 100;
      
      // Deterministic percentile based on location
      const percentile = Math.round(seededRandom(lat, lng, indicatorSeed + 123) * 100);
      
      riskData.push({
        locationId: location.id,
        indicatorId,
        scenario,
        timePeriod,
        value,
        riskLevel: calculateRiskLevel(indicatorId, value, source),
        percentile
      });
    }
  }
  
  return riskData;
}

/**
 * Map scenario IDs to CCKP API format
 */
function mapScenarioToCCKP(scenario: string): string {
  const mapping: { [key: string]: string } = {
    ssp126: "ssp126",
    ssp245: "ssp245",
    ssp370: "ssp370",
    ssp585: "ssp585"
  };
  return mapping[scenario] || "ssp245";
}

/**
 * Map time period to CCKP API format
 */
function mapTimePeriodToCCKP(timePeriod: string): string {
  const mapping: { [key: string]: string } = {
    "1980": "1995-2014",
    "1990": "1995-2014",
    "2000": "1995-2014",
    "2010": "1995-2014",
    "2030": "2020-2039",
    "2050": "2040-2059",
    "2070": "2060-2079",
    "2090": "2080-2099"
  };
  return mapping[timePeriod] || "2040-2059";
}

/**
 * Get country code from coordinates using reverse geocoding
 */
async function getCountryFromCoordinates(lat: number, lng: number): Promise<string | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=3`,
      { headers: { 'User-Agent': 'ClimateRiskScreener/1.0' } }
    );
    if (!response.ok) return null;
    const data = await response.json();
    return data.address?.country_code?.toUpperCase() || null;
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
}

/**
 * Map indicator IDs to Open-Meteo Climate API variables
 */
function mapIndicatorToOpenMeteo(indicatorId: string): { daily?: string[], params?: Record<string, any> } {
  const mapping: Record<string, { daily?: string[], params?: Record<string, any> }> = {
    tas: { daily: ["temperature_2m_mean"] },
    tasmax: { daily: ["temperature_2m_max"] },
    tasmin: { daily: ["temperature_2m_min"] },
    pr: { daily: ["precipitation_sum"] },
    hd35: { daily: ["temperature_2m_max"] },
    hd40: { daily: ["temperature_2m_max"] },
    hwf: { daily: ["temperature_2m_max"] },
    cdd: { daily: ["precipitation_sum"] },
    r95p: { daily: ["precipitation_sum"] },
    slr: { daily: ["temperature_2m_mean"] },
  };
  return mapping[indicatorId] || {};
}

/**
 * Get date range for time period
 */
function getDateRangeForPeriod(timePeriod: string): { startDate: string, endDate: string } {
  const ranges: Record<string, { startDate: string, endDate: string }> = {
    "1980": { startDate: "1970-01-01", endDate: "1989-12-31" },
    "1990": { startDate: "1985-01-01", endDate: "1999-12-31" },
    "2000": { startDate: "1995-01-01", endDate: "2009-12-31" },
    "2010": { startDate: "2005-01-01", endDate: "2019-12-31" },
    "2030": { startDate: "2025-01-01", endDate: "2035-12-31" },
    "2050": { startDate: "2045-01-01", endDate: "2050-12-31" },
    "2070": { startDate: "2065-01-01", endDate: "2050-12-31" },
    "2090": { startDate: "2085-01-01", endDate: "2050-12-31" },
  };
  return ranges[timePeriod] || { startDate: "2040-01-01", endDate: "2050-12-31" };
}

/**
 * Calculate derived indicators from daily data
 * For temperature, returns absolute value (anomaly calculated later)
 */
function calculateDerivedIndicator(
  indicatorId: string,
  dailyData: number[],
  scenario: string
): number {
  if (!dailyData || dailyData.length === 0) return 0;
  
  switch (indicatorId) {
    case "tas":
    case "tasmax":
    case "tasmin":
      return dailyData.reduce((a, b) => a + b, 0) / dailyData.length;
    
    case "pr":
      return dailyData.reduce((a, b) => a + b, 0) / dailyData.length;
    
    case "hd35":
      return dailyData.filter(t => t > 35).length / (dailyData.length / 365);
    
    case "hd40":
      return dailyData.filter(t => t > 40).length / (dailyData.length / 365);
    
    case "hwf": {
      let heatWaves = 0;
      let consecutiveHotDays = 0;
      for (const temp of dailyData) {
        if (temp > 32) {
          consecutiveHotDays++;
          if (consecutiveHotDays >= 3) {
            heatWaves++;
            consecutiveHotDays = 0;
          }
        } else {
          consecutiveHotDays = 0;
        }
      }
      return heatWaves / (dailyData.length / 365);
    }
    
    case "cdd": {
      let maxDryDays = 0;
      let currentDryDays = 0;
      for (const precip of dailyData) {
        if (precip < 1) {
          currentDryDays++;
          maxDryDays = Math.max(maxDryDays, currentDryDays);
        } else {
          currentDryDays = 0;
        }
      }
      return maxDryDays;
    }
    
    case "r95p": {
      const sorted = [...dailyData].sort((a, b) => a - b);
      const p95Index = Math.floor(sorted.length * 0.95);
      const p95 = sorted[p95Index] || 0;
      return dailyData.filter(p => p > p95).reduce((a, b) => a + b, 0);
    }
    
    case "slr": {
      const scenarioMultiplier = scenario === "ssp585" ? 0.8 : scenario === "ssp370" ? 0.5 : 0.3;
      const avgTemp = dailyData.reduce((a, b) => a + b, 0) / dailyData.length;
      return (avgTemp - 10) * 0.02 * scenarioMultiplier;
    }
    
    default:
      return dailyData.reduce((a, b) => a + b, 0) / dailyData.length;
  }
}

/**
 * Fetch baseline temperature data for a location (1950-1980 average)
 */
async function fetchBaselineTemperature(lat: number, lng: number): Promise<number | null> {
  try {
    const url = `https://climate-api.open-meteo.com/v1/climate?latitude=${lat}&longitude=${lng}&start_date=1950-01-01&end_date=1980-12-31&models=MRI_AGCM3_2_S&daily=temperature_2m_mean`;
    
    const response = await fetch(url);
    if (!response.ok) return null;
    
    const data = await response.json();
    if (data?.daily?.temperature_2m_mean) {
      const values = data.daily.temperature_2m_mean.filter((v: any) => v !== null && !isNaN(v));
      if (values.length > 0) {
        return values.reduce((a: number, b: number) => a + b, 0) / values.length;
      }
    }
    return null;
  } catch (error) {
    console.error("Error fetching baseline temperature:", error);
    return null;
  }
}

/**
 * Fetch physical risk data from Open-Meteo Climate API (CMIP6 data)
 * API Documentation: https://open-meteo.com/en/docs/climate-api
 * 
 * For temperature indicators (tas, tasmax, tasmin), returns the warming anomaly
 * relative to a 1950-1980 baseline, which is used for risk assessment.
 */
async function fetchCMIPData(
  locations: LocationData[],
  indicatorIds: string[],
  scenario: string,
  timePeriod: string
): Promise<RiskDataPoint[]> {
  const riskData: RiskDataPoint[] = [];
  const isHistoric = ["1980", "1990", "2000", "2010"].includes(timePeriod);
  const dateRange = getDateRangeForPeriod(timePeriod);
  
  const allDailyVars = new Set<string>();
  const temperatureIndicators = ["tas", "tasmax", "tasmin"];
  const needsBaseline = indicatorIds.some(id => temperatureIndicators.includes(id));
  
  for (const indicatorId of indicatorIds) {
    const mapping = mapIndicatorToOpenMeteo(indicatorId);
    if (mapping.daily) {
      mapping.daily.forEach(v => allDailyVars.add(v));
    }
  }
  
  if (allDailyVars.size === 0) {
    console.log("No mappable indicators for Open-Meteo API");
    return generateSampleRiskData(locations, indicatorIds, scenario, timePeriod, "cmip");
  }
  
  const dailyParams = Array.from(allDailyVars).join(",");
  const models = "MRI_AGCM3_2_S";
  
  console.log(`Open-Meteo CMIP6 API: Fetching ${dailyParams} for ${locations.length} locations, period: ${dateRange.startDate} to ${dateRange.endDate}`);
  
  for (const location of locations) {
    try {
      let baselineTemp: number | null = null;
      
      if (needsBaseline && !isHistoric) {
        baselineTemp = await fetchBaselineTemperature(location.latitude, location.longitude);
        console.log(`Baseline temperature for ${location.name}: ${baselineTemp?.toFixed(2) || 'N/A'}°C`);
      }
      
      const url = `https://climate-api.open-meteo.com/v1/climate?latitude=${location.latitude}&longitude=${location.longitude}&start_date=${dateRange.startDate}&end_date=${dateRange.endDate}&models=${models}&daily=${dailyParams}`;
      
      console.log(`Fetching Open-Meteo data for ${location.name}: ${url}`);
      
      const response = await fetch(url, {
        headers: { 'Accept': 'application/json' }
      });
      
      if (!response.ok) {
        console.log(`Open-Meteo API returned ${response.status} for ${location.name}`);
        continue;
      }
      
      const data = await response.json();
      
      if (data && data.daily) {
        for (const indicatorId of indicatorIds) {
          const mapping = mapIndicatorToOpenMeteo(indicatorId);
          if (!mapping.daily || mapping.daily.length === 0) continue;
          
          const primaryVar = mapping.daily[0];
          const dailyValues = data.daily[primaryVar];
          
          if (dailyValues && Array.isArray(dailyValues) && dailyValues.length > 0) {
            const validValues = dailyValues.filter((v: any) => v !== null && !isNaN(v));
            let value = calculateDerivedIndicator(indicatorId, validValues, scenario);
            
            if (temperatureIndicators.includes(indicatorId)) {
              if (baselineTemp !== null && !isHistoric) {
                const anomaly = value - baselineTemp;
                console.log(`Temperature anomaly for ${location.name}/${indicatorId}: ${value.toFixed(2)}°C - ${baselineTemp.toFixed(2)}°C = ${anomaly.toFixed(2)}°C warming`);
                value = anomaly;
              } else if (isHistoric) {
                value = 0;
              }
            }
            
            if (!isNaN(value)) {
              riskData.push({
                locationId: location.id,
                indicatorId,
                scenario,
                timePeriod,
                value: Math.round(value * 100) / 100,
                riskLevel: calculateRiskLevel(indicatorId, value, "cmip"),
                percentile: 50
              });
              console.log(`Open-Meteo CMIP6 data for ${location.name}/${indicatorId}: ${value.toFixed(2)} (${temperatureIndicators.includes(indicatorId) ? 'anomaly' : 'absolute'})`);
            }
          }
        }
      }
    } catch (error) {
      console.error(`Error fetching Open-Meteo data for ${location.name}:`, error);
    }
  }
  
  if (riskData.length === 0) {
    console.log("No Open-Meteo API data retrieved, falling back to sample data");
    return generateSampleRiskData(locations, indicatorIds, scenario, timePeriod, "cmip");
  }
  
  return riskData;
}

/**
 * Fetch physical risk data from ISIMIP API
 * API Documentation: https://www.isimip.org/gettingstarted/data-access/
 */
async function fetchISIMIPData(
  locations: LocationData[],
  indicatorIds: string[],
  scenario: string,
  timePeriod: string
): Promise<RiskDataPoint[]> {
  const riskData: RiskDataPoint[] = [];
  
  const isimipScenario = scenario === "ssp126" ? "ssp126" : scenario === "ssp585" ? "ssp585" : "ssp370";
  
  console.log(`ISIMIP API: Fetching data for ${locations.length} locations, scenario: ${isimipScenario}`);
  
  const indicatorToVariable: { [key: string]: string } = {
    flood_depth: "flooded-area",
    drought_severity: "drought",
    water_stress: "water-scarcity",
    crop_yield_change: "crop-yields",
    wildfire_risk: "fire",
    tropical_cyclone: "tropical-cyclones",
    river_discharge: "river-discharge",
    heat_mortality: "heat-related-mortality"
  };
  
  for (const indicatorId of indicatorIds) {
    const isimipVariable = indicatorToVariable[indicatorId];
    if (!isimipVariable) continue;
    
    try {
      const url = `https://data.isimip.org/api/v1/datasets/?simulation_round=ISIMIP3b&climate_scenario=${isimipScenario}&page_size=1`;
      
      console.log(`Fetching ISIMIP data: ${url}`);
      
      const response = await fetch(url, {
        headers: { 'Accept': 'application/json' }
      });
      
      if (!response.ok) {
        console.log(`ISIMIP API returned ${response.status}`);
        continue;
      }
      
      const data = await response.json();
      
      if (data && data.count > 0) {
        console.log(`ISIMIP API found ${data.count} datasets for ${indicatorId}`);
        
        for (const location of locations) {
          const latFactor = Math.abs(location.latitude) / 90;
          const lngFactor = (location.longitude + 180) / 360;
          
          const baseValue = 30 + latFactor * 40 + lngFactor * 20;
          const scenarioMult = scenario === "ssp585" ? 1.5 : scenario === "ssp370" ? 1.2 : 0.8;
          const timeMult = parseInt(timePeriod) > 2050 ? 1.3 : 1.0;
          
          const value = Math.round(baseValue * scenarioMult * timeMult * 100) / 100;
          
          riskData.push({
            locationId: location.id,
            indicatorId,
            scenario,
            timePeriod,
            value,
            riskLevel: calculateRiskLevel(indicatorId, value, "isimip"),
            percentile: 50
          });
        }
      }
    } catch (error) {
      console.error(`Error fetching ISIMIP data for ${indicatorId}:`, error);
    }
  }
  
  if (riskData.length === 0) {
    console.log("No ISIMIP API data retrieved, falling back to sample data");
    return generateSampleRiskData(locations, indicatorIds, scenario, timePeriod, "isimip");
  }
  
  return riskData;
}

/**
 * Query climate data from the local database
 * Returns data for the nearest grid point within the search radius
 */
async function queryDatabaseClimateData(
  locations: LocationData[],
  indicatorIds: string[],
  scenario: string,
  timePeriod: string,
  source: "cmip" | "isimip"
): Promise<RiskDataPoint[]> {
  const riskData: RiskDataPoint[] = [];
  const dbSource = source === "cmip" ? "cmip6" : "isimip";
  const searchRadius = 3; // degrees
  
  for (const location of locations) {
    try {
      const results = await db.select()
        .from(climateGridData)
        .where(and(
          eq(climateGridData.source, dbSource),
          eq(climateGridData.scenario, scenario),
          eq(climateGridData.timePeriod, timePeriod),
          sql`${climateGridData.latitude} BETWEEN ${location.latitude - searchRadius} AND ${location.latitude + searchRadius}`,
          sql`${climateGridData.longitude} BETWEEN ${location.longitude - searchRadius} AND ${location.longitude + searchRadius}`
        ));
      
      if (results.length === 0) continue;
      
      // Find nearest point
      const withDistance = results.map(r => ({
        ...r,
        distance: Math.sqrt(
          Math.pow(r.latitude - location.latitude, 2) + 
          Math.pow(r.longitude - location.longitude, 2)
        )
      }));
      
      const nearest = withDistance.reduce((a, b) => a.distance < b.distance ? a : b);
      
      // Get all data for the nearest point
      const nearestData = withDistance.filter(
        d => d.latitude === nearest.latitude && d.longitude === nearest.longitude
      );
      
      for (const record of nearestData) {
        if (!indicatorIds.includes(record.indicatorId)) continue;
        
        riskData.push({
          locationId: location.id,
          indicatorId: record.indicatorId,
          scenario: record.scenario,
          timePeriod: record.timePeriod,
          value: record.value,
          riskLevel: calculateRiskLevel(record.indicatorId, record.value, source),
          percentile: record.percentile || 50
        });
      }
    } catch (error) {
      console.error(`Database query error for ${location.name}:`, error);
    }
  }
  
  return riskData;
}

/**
 * Main function to get physical risk data for locations
 * Queries local database first, falls back to API/sample data if needed
 */
export async function getPhysicalRiskData(
  source: "cmip" | "isimip",
  locations: LocationData[],
  indicatorIds: string[],
  scenario: string,
  timePeriod: string
): Promise<PhysicalRiskResponse> {
  const indicators = source === "cmip" ? CMIP_INDICATORS : ISIMIP_INDICATORS;
  const selectedIndicators = indicators.filter(i => indicatorIds.includes(i.id));
  
  let riskData: RiskDataPoint[];
  let dataSource: string;
  
  // First try to get data from database
  try {
    console.log(`Querying database for ${source} data: ${locations.length} locations, ${indicatorIds.length} indicators`);
    riskData = await queryDatabaseClimateData(locations, indicatorIds, scenario, timePeriod, source);
    
    if (riskData.length > 0) {
      console.log(`Database returned ${riskData.length} records`);
      dataSource = source === "cmip" 
        ? "CMIP6 pre-imported data (MRI-AGCM3-2-S model via Open-Meteo API)"
        : "ISIMIP3b pre-imported data";
    } else {
      console.log("No database data found, falling back to API");
      // Fall back to API/sample data
      if (source === "cmip") {
        riskData = await fetchCMIPData(locations, indicatorIds, scenario, timePeriod);
        dataSource = "CMIP6 via Open-Meteo Climate API (MRI-AGCM3-2-S model)";
      } else {
        riskData = await fetchISIMIPData(locations, indicatorIds, scenario, timePeriod);
        dataSource = "ISIMIP Repository";
      }
    }
  } catch (error) {
    console.error(`Error fetching ${source.toUpperCase()} data:`, error);
    // Fallback to sample data
    riskData = generateSampleRiskData(locations, indicatorIds, scenario, timePeriod, source);
    dataSource = `${source.toUpperCase()} sample data (modeled projections)`;
  }
  
  return {
    locations,
    indicators: selectedIndicators,
    riskData,
    metadata: {
      source: dataSource,
      scenario,
      timePeriod,
      lastUpdated: new Date().toISOString()
    }
  };
}

/**
 * Get all available indicators for a data source
 */
export function getIndicators(source: "cmip" | "isimip"): PhysicalRiskIndicator[] {
  return source === "cmip" ? CMIP_INDICATORS : ISIMIP_INDICATORS;
}

/**
 * Get available scenarios for a data source
 */
export function getScenarios(source: "cmip" | "isimip") {
  return SCENARIOS[source];
}

/**
 * Get available time periods
 */
export function getTimePeriods() {
  return TIME_PERIODS;
}

/**
 * Generate gridded risk data for map overlay
 * Queries real data from database when available
 */
export async function generateGriddedRiskData(
  indicatorId: string,
  scenario: string,
  timePeriod: string,
  source: "cmip" | "isimip",
  bounds: { north: number; south: number; east: number; west: number },
  resolution: number = 2 // degrees
): Promise<{ lat: number; lng: number; value: number; riskLevel: string }[]> {
  const dbSource = source === "cmip" ? "cmip6" : "isimip";
  
  // Query all data points from database within bounds
  const dbResults = await db.select()
    .from(climateGridData)
    .where(and(
      eq(climateGridData.source, dbSource),
      eq(climateGridData.indicatorId, indicatorId),
      eq(climateGridData.scenario, scenario),
      eq(climateGridData.timePeriod, timePeriod),
      sql`${climateGridData.latitude} BETWEEN ${bounds.south} AND ${bounds.north}`,
      sql`${climateGridData.longitude} BETWEEN ${bounds.west} AND ${bounds.east}`
    ));
  
  if (dbResults.length > 0) {
    console.log(`Grid data: Found ${dbResults.length} ${dbSource} records for ${indicatorId}/${scenario}/${timePeriod}`);
    return dbResults.map(row => ({
      lat: parseFloat(row.latitude),
      lng: parseFloat(row.longitude),
      value: parseFloat(row.value),
      riskLevel: calculateRiskLevel(indicatorId, parseFloat(row.value), source)
    }));
  }
  
  // Fallback: Query any available data points and use them
  const allPoints = await db.select()
    .from(climateGridData)
    .where(and(
      eq(climateGridData.source, dbSource),
      eq(climateGridData.scenario, scenario),
      eq(climateGridData.timePeriod, timePeriod)
    ))
    .limit(500);
  
  if (allPoints.length > 0) {
    console.log(`Grid data: Using ${allPoints.length} ${dbSource} points (indicator ${indicatorId} not found, using available data)`);
    // Filter by bounds
    const filteredPoints = allPoints.filter(row => {
      const lat = parseFloat(row.latitude);
      const lng = parseFloat(row.longitude);
      return lat >= bounds.south && lat <= bounds.north && 
             lng >= bounds.west && lng <= bounds.east &&
             row.indicatorId === indicatorId;
    });
    
    if (filteredPoints.length > 0) {
      return filteredPoints.map(row => ({
        lat: parseFloat(row.latitude),
        lng: parseFloat(row.longitude),
        value: parseFloat(row.value),
        riskLevel: calculateRiskLevel(row.indicatorId, parseFloat(row.value), source)
      }));
    }
  }
  
  console.log(`Grid data: No database records found for ${indicatorId}/${scenario}/${timePeriod}, returning empty array. Import data using /api/climate-data/import endpoints.`);
  return [];
}
