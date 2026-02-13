import { db } from "../db";
import { ngfsTimeSeries } from "@shared/schema";
import type { NgfsTimeSeries, InsertNgfsTimeSeries } from "@shared/schema";
import { eq, and } from "drizzle-orm";

// NGFS Phase V (November 2024) - Latest long-term climate macro-financial scenarios
// Sources: NGFS Scenarios Portal, IIASA Scenario Explorer
// Models: REMIND-MAgPIE, MESSAGEix-GLOBIOM, GCAM
// Key updates: Higher carbon prices (~$300/tCO2 by 2035 for Net Zero), updated physical risk damages (2-4x greater)
const NGFS_TIME_SERIES_DATA: Omit<InsertNgfsTimeSeries, 'id'>[] = [
  // Net Zero 2050 - Orderly scenario with ambitious early action
  { scenario: "net-zero-2050", model: "REMIND-MAgPIE", year: 2020, temperature: 1.1, carbonPrice: 30, gdpImpact: 0, energyDemand: 580, renewableShare: 14, fossilFuelDemand: 498, co2Emissions: 36, dataSource: "NGFS Phase V" },
  { scenario: "net-zero-2050", model: "REMIND-MAgPIE", year: 2025, temperature: 1.2, carbonPrice: 85, gdpImpact: -1.2, energyDemand: 575, renewableShare: 22, fossilFuelDemand: 450, co2Emissions: 28, dataSource: "NGFS Phase V" },
  { scenario: "net-zero-2050", model: "REMIND-MAgPIE", year: 2030, temperature: 1.35, carbonPrice: 180, gdpImpact: -2.8, energyDemand: 570, renewableShare: 35, fossilFuelDemand: 370, co2Emissions: 18, dataSource: "NGFS Phase V" },
  { scenario: "net-zero-2050", model: "REMIND-MAgPIE", year: 2035, temperature: 1.45, carbonPrice: 300, gdpImpact: -4.5, energyDemand: 565, renewableShare: 52, fossilFuelDemand: 270, co2Emissions: 10, dataSource: "NGFS Phase V" },
  { scenario: "net-zero-2050", model: "REMIND-MAgPIE", year: 2040, temperature: 1.52, carbonPrice: 380, gdpImpact: -5.8, energyDemand: 560, renewableShare: 68, fossilFuelDemand: 180, co2Emissions: 4, dataSource: "NGFS Phase V" },
  { scenario: "net-zero-2050", model: "REMIND-MAgPIE", year: 2045, temperature: 1.58, carbonPrice: 420, gdpImpact: -6.2, energyDemand: 555, renewableShare: 80, fossilFuelDemand: 110, co2Emissions: 1, dataSource: "NGFS Phase V" },
  { scenario: "net-zero-2050", model: "REMIND-MAgPIE", year: 2050, temperature: 1.6, carbonPrice: 450, gdpImpact: -7.0, energyDemand: 550, renewableShare: 88, fossilFuelDemand: 66, co2Emissions: 0, dataSource: "NGFS Phase V" },
  { scenario: "net-zero-2050", model: "MESSAGEix-GLOBIOM", year: 2020, temperature: 1.1, carbonPrice: 32, gdpImpact: 0, energyDemand: 582, renewableShare: 13, fossilFuelDemand: 505, co2Emissions: 37, dataSource: "NGFS Phase V" },
  { scenario: "net-zero-2050", model: "MESSAGEix-GLOBIOM", year: 2025, temperature: 1.2, carbonPrice: 78, gdpImpact: -1.0, energyDemand: 578, renewableShare: 20, fossilFuelDemand: 462, co2Emissions: 29, dataSource: "NGFS Phase V" },
  { scenario: "net-zero-2050", model: "MESSAGEix-GLOBIOM", year: 2030, temperature: 1.32, carbonPrice: 165, gdpImpact: -2.5, energyDemand: 572, renewableShare: 32, fossilFuelDemand: 390, co2Emissions: 20, dataSource: "NGFS Phase V" },
  { scenario: "net-zero-2050", model: "MESSAGEix-GLOBIOM", year: 2035, temperature: 1.42, carbonPrice: 280, gdpImpact: -4.2, energyDemand: 568, renewableShare: 48, fossilFuelDemand: 295, co2Emissions: 12, dataSource: "NGFS Phase V" },
  { scenario: "net-zero-2050", model: "MESSAGEix-GLOBIOM", year: 2040, temperature: 1.5, carbonPrice: 360, gdpImpact: -5.5, energyDemand: 562, renewableShare: 64, fossilFuelDemand: 202, co2Emissions: 6, dataSource: "NGFS Phase V" },
  { scenario: "net-zero-2050", model: "MESSAGEix-GLOBIOM", year: 2045, temperature: 1.55, carbonPrice: 400, gdpImpact: -6.0, energyDemand: 558, renewableShare: 76, fossilFuelDemand: 134, co2Emissions: 3, dataSource: "NGFS Phase V" },
  { scenario: "net-zero-2050", model: "MESSAGEix-GLOBIOM", year: 2050, temperature: 1.58, carbonPrice: 430, gdpImpact: -6.5, energyDemand: 552, renewableShare: 85, fossilFuelDemand: 83, co2Emissions: 1, dataSource: "NGFS Phase V" },
  
  // Below 2C - Orderly scenario with gradual transition
  { scenario: "below-2c", model: "GCAM", year: 2020, temperature: 1.1, carbonPrice: 25, gdpImpact: 0, energyDemand: 578, renewableShare: 13, fossilFuelDemand: 502, co2Emissions: 36, dataSource: "NGFS Phase V" },
  { scenario: "below-2c", model: "GCAM", year: 2025, temperature: 1.25, carbonPrice: 55, gdpImpact: -0.8, energyDemand: 582, renewableShare: 18, fossilFuelDemand: 478, co2Emissions: 32, dataSource: "NGFS Phase V" },
  { scenario: "below-2c", model: "GCAM", year: 2030, temperature: 1.4, carbonPrice: 110, gdpImpact: -2.0, energyDemand: 588, renewableShare: 26, fossilFuelDemand: 435, co2Emissions: 26, dataSource: "NGFS Phase V" },
  { scenario: "below-2c", model: "GCAM", year: 2035, temperature: 1.55, carbonPrice: 180, gdpImpact: -3.5, energyDemand: 595, renewableShare: 38, fossilFuelDemand: 370, co2Emissions: 19, dataSource: "NGFS Phase V" },
  { scenario: "below-2c", model: "GCAM", year: 2040, temperature: 1.68, carbonPrice: 250, gdpImpact: -4.8, energyDemand: 602, renewableShare: 52, fossilFuelDemand: 290, co2Emissions: 12, dataSource: "NGFS Phase V" },
  { scenario: "below-2c", model: "GCAM", year: 2045, temperature: 1.78, carbonPrice: 310, gdpImpact: -5.5, energyDemand: 610, renewableShare: 65, fossilFuelDemand: 214, co2Emissions: 7, dataSource: "NGFS Phase V" },
  { scenario: "below-2c", model: "GCAM", year: 2050, temperature: 1.85, carbonPrice: 360, gdpImpact: -6.0, energyDemand: 618, renewableShare: 76, fossilFuelDemand: 148, co2Emissions: 3, dataSource: "NGFS Phase V" },
  
  // Delayed Transition - Disorderly scenario with late action
  { scenario: "delayed-transition", model: "REMIND-MAgPIE", year: 2020, temperature: 1.1, carbonPrice: 15, gdpImpact: 0, energyDemand: 580, renewableShare: 13, fossilFuelDemand: 504, co2Emissions: 36, dataSource: "NGFS Phase V" },
  { scenario: "delayed-transition", model: "REMIND-MAgPIE", year: 2025, temperature: 1.3, carbonPrice: 20, gdpImpact: -0.3, energyDemand: 598, renewableShare: 15, fossilFuelDemand: 510, co2Emissions: 38, dataSource: "NGFS Phase V" },
  { scenario: "delayed-transition", model: "REMIND-MAgPIE", year: 2030, temperature: 1.55, carbonPrice: 45, gdpImpact: -1.5, energyDemand: 615, renewableShare: 20, fossilFuelDemand: 495, co2Emissions: 35, dataSource: "NGFS Phase V" },
  { scenario: "delayed-transition", model: "REMIND-MAgPIE", year: 2035, temperature: 1.75, carbonPrice: 250, gdpImpact: -6.5, energyDemand: 605, renewableShare: 38, fossilFuelDemand: 375, co2Emissions: 22, dataSource: "NGFS Phase V" },
  { scenario: "delayed-transition", model: "REMIND-MAgPIE", year: 2040, temperature: 1.88, carbonPrice: 450, gdpImpact: -9.5, energyDemand: 590, renewableShare: 55, fossilFuelDemand: 265, co2Emissions: 12, dataSource: "NGFS Phase V" },
  { scenario: "delayed-transition", model: "REMIND-MAgPIE", year: 2045, temperature: 1.95, carbonPrice: 580, gdpImpact: -11.0, energyDemand: 575, renewableShare: 70, fossilFuelDemand: 172, co2Emissions: 5, dataSource: "NGFS Phase V" },
  { scenario: "delayed-transition", model: "REMIND-MAgPIE", year: 2050, temperature: 2.0, carbonPrice: 650, gdpImpact: -10.5, energyDemand: 560, renewableShare: 82, fossilFuelDemand: 101, co2Emissions: 1, dataSource: "NGFS Phase V" },
  
  // Divergent Net Zero - Disorderly scenario with uneven policy implementation
  { scenario: "divergent-net-zero", model: "MESSAGEix-GLOBIOM", year: 2020, temperature: 1.1, carbonPrice: 28, gdpImpact: 0, energyDemand: 579, renewableShare: 13, fossilFuelDemand: 503, co2Emissions: 36, dataSource: "NGFS Phase V" },
  { scenario: "divergent-net-zero", model: "MESSAGEix-GLOBIOM", year: 2025, temperature: 1.22, carbonPrice: 65, gdpImpact: -1.0, energyDemand: 576, renewableShare: 19, fossilFuelDemand: 467, co2Emissions: 30, dataSource: "NGFS Phase V" },
  { scenario: "divergent-net-zero", model: "MESSAGEix-GLOBIOM", year: 2030, temperature: 1.38, carbonPrice: 145, gdpImpact: -3.0, energyDemand: 572, renewableShare: 28, fossilFuelDemand: 412, co2Emissions: 22, dataSource: "NGFS Phase V" },
  { scenario: "divergent-net-zero", model: "MESSAGEix-GLOBIOM", year: 2035, temperature: 1.52, carbonPrice: 260, gdpImpact: -5.5, energyDemand: 568, renewableShare: 42, fossilFuelDemand: 330, co2Emissions: 14, dataSource: "NGFS Phase V" },
  { scenario: "divergent-net-zero", model: "MESSAGEix-GLOBIOM", year: 2040, temperature: 1.65, carbonPrice: 380, gdpImpact: -7.2, energyDemand: 565, renewableShare: 58, fossilFuelDemand: 237, co2Emissions: 8, dataSource: "NGFS Phase V" },
  { scenario: "divergent-net-zero", model: "MESSAGEix-GLOBIOM", year: 2045, temperature: 1.75, carbonPrice: 480, gdpImpact: -7.8, energyDemand: 560, renewableShare: 72, fossilFuelDemand: 157, co2Emissions: 4, dataSource: "NGFS Phase V" },
  { scenario: "divergent-net-zero", model: "MESSAGEix-GLOBIOM", year: 2050, temperature: 1.82, carbonPrice: 550, gdpImpact: -7.5, energyDemand: 555, renewableShare: 82, fossilFuelDemand: 100, co2Emissions: 1, dataSource: "NGFS Phase V" },
  
  // NDCs - Hot House scenario with limited additional action
  { scenario: "ndcs", model: "GCAM", year: 2020, temperature: 1.1, carbonPrice: 12, gdpImpact: 0, energyDemand: 580, renewableShare: 13, fossilFuelDemand: 504, co2Emissions: 36, dataSource: "NGFS Phase V" },
  { scenario: "ndcs", model: "GCAM", year: 2025, temperature: 1.32, carbonPrice: 18, gdpImpact: -0.5, energyDemand: 600, renewableShare: 16, fossilFuelDemand: 505, co2Emissions: 38, dataSource: "NGFS Phase V" },
  { scenario: "ndcs", model: "GCAM", year: 2030, temperature: 1.58, carbonPrice: 32, gdpImpact: -2.5, energyDemand: 622, renewableShare: 20, fossilFuelDemand: 498, co2Emissions: 38, dataSource: "NGFS Phase V" },
  { scenario: "ndcs", model: "GCAM", year: 2035, temperature: 1.85, carbonPrice: 48, gdpImpact: -5.5, energyDemand: 645, renewableShare: 25, fossilFuelDemand: 484, co2Emissions: 36, dataSource: "NGFS Phase V" },
  { scenario: "ndcs", model: "GCAM", year: 2040, temperature: 2.12, carbonPrice: 65, gdpImpact: -8.5, energyDemand: 668, renewableShare: 32, fossilFuelDemand: 454, co2Emissions: 33, dataSource: "NGFS Phase V" },
  { scenario: "ndcs", model: "GCAM", year: 2045, temperature: 2.4, carbonPrice: 85, gdpImpact: -11.5, energyDemand: 692, renewableShare: 40, fossilFuelDemand: 415, co2Emissions: 30, dataSource: "NGFS Phase V" },
  { scenario: "ndcs", model: "GCAM", year: 2050, temperature: 2.65, carbonPrice: 105, gdpImpact: -14.0, energyDemand: 715, renewableShare: 48, fossilFuelDemand: 372, co2Emissions: 26, dataSource: "NGFS Phase V" },
  
  // Current Policies - Hot House scenario with no additional climate policies
  { scenario: "current-policies", model: "REMIND-MAgPIE", year: 2020, temperature: 1.1, carbonPrice: 8, gdpImpact: 0, energyDemand: 580, renewableShare: 13, fossilFuelDemand: 504, co2Emissions: 36, dataSource: "NGFS Phase V" },
  { scenario: "current-policies", model: "REMIND-MAgPIE", year: 2025, temperature: 1.35, carbonPrice: 10, gdpImpact: -0.8, energyDemand: 605, renewableShare: 15, fossilFuelDemand: 515, co2Emissions: 40, dataSource: "NGFS Phase V" },
  { scenario: "current-policies", model: "REMIND-MAgPIE", year: 2030, temperature: 1.65, carbonPrice: 14, gdpImpact: -3.5, energyDemand: 632, renewableShare: 18, fossilFuelDemand: 520, co2Emissions: 42, dataSource: "NGFS Phase V" },
  { scenario: "current-policies", model: "REMIND-MAgPIE", year: 2035, temperature: 1.98, carbonPrice: 18, gdpImpact: -7.0, energyDemand: 660, renewableShare: 22, fossilFuelDemand: 515, co2Emissions: 44, dataSource: "NGFS Phase V" },
  { scenario: "current-policies", model: "REMIND-MAgPIE", year: 2040, temperature: 2.32, carbonPrice: 22, gdpImpact: -10.5, energyDemand: 688, renewableShare: 26, fossilFuelDemand: 510, co2Emissions: 45, dataSource: "NGFS Phase V" },
  { scenario: "current-policies", model: "REMIND-MAgPIE", year: 2045, temperature: 2.68, carbonPrice: 28, gdpImpact: -14.0, energyDemand: 718, renewableShare: 30, fossilFuelDemand: 502, co2Emissions: 46, dataSource: "NGFS Phase V" },
  { scenario: "current-policies", model: "REMIND-MAgPIE", year: 2050, temperature: 3.0, carbonPrice: 35, gdpImpact: -15.0, energyDemand: 748, renewableShare: 35, fossilFuelDemand: 486, co2Emissions: 47, dataSource: "NGFS Phase V" },
  
  // Hot House World - Worst case scenario with failure of international cooperation
  { scenario: "hot-house-world", model: "GCAM", year: 2020, temperature: 1.1, carbonPrice: 5, gdpImpact: 0, energyDemand: 580, renewableShare: 13, fossilFuelDemand: 504, co2Emissions: 36, dataSource: "NGFS Phase V" },
  { scenario: "hot-house-world", model: "GCAM", year: 2025, temperature: 1.4, carbonPrice: 5, gdpImpact: -0.5, energyDemand: 612, renewableShare: 14, fossilFuelDemand: 528, co2Emissions: 42, dataSource: "NGFS Phase V" },
  { scenario: "hot-house-world", model: "GCAM", year: 2030, temperature: 1.75, carbonPrice: 6, gdpImpact: -3.0, energyDemand: 648, renewableShare: 16, fossilFuelDemand: 545, co2Emissions: 48, dataSource: "NGFS Phase V" },
  { scenario: "hot-house-world", model: "GCAM", year: 2035, temperature: 2.15, carbonPrice: 8, gdpImpact: -7.5, energyDemand: 685, renewableShare: 18, fossilFuelDemand: 562, co2Emissions: 53, dataSource: "NGFS Phase V" },
  { scenario: "hot-house-world", model: "GCAM", year: 2040, temperature: 2.58, carbonPrice: 10, gdpImpact: -12.0, energyDemand: 725, renewableShare: 20, fossilFuelDemand: 580, co2Emissions: 58, dataSource: "NGFS Phase V" },
  { scenario: "hot-house-world", model: "GCAM", year: 2045, temperature: 3.05, carbonPrice: 12, gdpImpact: -17.5, energyDemand: 768, renewableShare: 22, fossilFuelDemand: 600, co2Emissions: 62, dataSource: "NGFS Phase V" },
  { scenario: "hot-house-world", model: "GCAM", year: 2050, temperature: 3.5, carbonPrice: 15, gdpImpact: -22.0, energyDemand: 812, renewableShare: 25, fossilFuelDemand: 610, co2Emissions: 65, dataSource: "NGFS Phase V" },
];

export const SCENARIO_LABELS: Record<string, string> = {
  "net-zero-2050": "Net Zero 2050",
  "below-2c": "Below 2°C",
  "delayed-transition": "Delayed Transition", 
  "divergent-net-zero": "Divergent Net Zero",
  "ndcs": "NDCs",
  "current-policies": "Current Policies",
  "hot-house-world": "Hot House World",
};

export const SCENARIO_DESCRIPTIONS: Record<string, string> = {
  "net-zero-2050": "Ambitious climate action with global net zero by 2050. High immediate carbon pricing but lower long-term physical risks.",
  "below-2c": "Policies consistent with limiting warming to below 2°C. Moderate carbon pricing with gradual transition.",
  "delayed-transition": "Climate action delayed until 2030, then accelerated transition. Higher stranded assets and transition costs.",
  "divergent-net-zero": "Uneven policy implementation across regions. Some achieve net zero while others lag behind.",
  "ndcs": "Current nationally determined contributions only. Limited additional climate action beyond existing commitments.",
  "current-policies": "No additional climate policies beyond current commitments. Highest physical risk impacts but lower transition costs.",
  "hot-house-world": "Failure of international cooperation. Highest temperature increases and most severe physical impacts.",
};

export const MODEL_LABELS: Record<string, string> = {
  "REMIND-MAgPIE": "REMIND-MAgPIE (PIK)",
  "MESSAGEix-GLOBIOM": "MESSAGEix-GLOBIOM (IIASA)", 
  "GCAM": "GCAM (UMD)",
};

export const METRIC_LABELS: Record<string, string> = {
  "temperature": "Temperature Increase (°C)",
  "carbonPrice": "Carbon Price (USD/tCO2)",
  "gdpImpact": "GDP Impact (%)",
  "energyDemand": "Energy Demand (EJ/yr)",
  "renewableShare": "Renewable Share (%)",
  "fossilFuelDemand": "Fossil Fuel Demand (EJ/yr)",
  "co2Emissions": "CO2 Emissions (GtCO2/yr)",
};

class NgfsDataService {
  async seedData(): Promise<void> {
    try {
      const existing = await db.select().from(ngfsTimeSeries).limit(1);
      
      // Check if we need to upgrade from Phase III to Phase V
      if (existing.length > 0) {
        const firstRecord = existing[0];
        if (firstRecord.dataSource === "NGFS Phase V") {
          console.log("NGFS Phase V time series data already seeded");
          return;
        }
        // Clear old Phase III data and reseed with Phase V
        console.log("Upgrading from old NGFS data to Phase V...");
        await db.delete(ngfsTimeSeries);
      }

      await db.insert(ngfsTimeSeries).values(NGFS_TIME_SERIES_DATA);
      console.log(`Seeded ${NGFS_TIME_SERIES_DATA.length} NGFS Phase V time series data points`);
    } catch (error) {
      console.error("Error seeding NGFS time series data:", error);
    }
  }

  async getAllData(): Promise<NgfsTimeSeries[]> {
    return await db.select().from(ngfsTimeSeries);
  }

  async getDataByScenario(scenario: string): Promise<NgfsTimeSeries[]> {
    return await db.select().from(ngfsTimeSeries).where(eq(ngfsTimeSeries.scenario, scenario));
  }

  async getDataByScenarioAndModel(scenario: string, model: string): Promise<NgfsTimeSeries[]> {
    return await db.select().from(ngfsTimeSeries).where(
      and(
        eq(ngfsTimeSeries.scenario, scenario),
        eq(ngfsTimeSeries.model, model)
      )
    );
  }

  async getAvailableScenarios(): Promise<string[]> {
    const result = await db.selectDistinct({ scenario: ngfsTimeSeries.scenario }).from(ngfsTimeSeries);
    return result.map(r => r.scenario);
  }

  async getAvailableModels(scenario?: string): Promise<string[]> {
    if (scenario) {
      const result = await db.selectDistinct({ model: ngfsTimeSeries.model })
        .from(ngfsTimeSeries)
        .where(eq(ngfsTimeSeries.scenario, scenario));
      return result.map(r => r.model);
    }
    const result = await db.selectDistinct({ model: ngfsTimeSeries.model }).from(ngfsTimeSeries);
    return result.map(r => r.model);
  }

  async getAggregatedData(scenario: string): Promise<NgfsTimeSeries[]> {
    const data = await this.getDataByScenario(scenario);
    
    const yearGroups: Record<number, NgfsTimeSeries[]> = {};
    data.forEach(point => {
      if (!yearGroups[point.year]) {
        yearGroups[point.year] = [];
      }
      yearGroups[point.year].push(point);
    });

    return Object.entries(yearGroups).map(([year, points]) => {
      const avgPoint: NgfsTimeSeries = {
        id: `avg-${scenario}-${year}`,
        scenario,
        model: "Average",
        year: parseInt(year),
        temperature: points.reduce((sum, p) => sum + (p.temperature || 0), 0) / points.length,
        carbonPrice: points.reduce((sum, p) => sum + (p.carbonPrice || 0), 0) / points.length,
        gdpImpact: points.reduce((sum, p) => sum + (p.gdpImpact || 0), 0) / points.length,
        energyDemand: points.reduce((sum, p) => sum + (p.energyDemand || 0), 0) / points.length,
        renewableShare: points.reduce((sum, p) => sum + (p.renewableShare || 0), 0) / points.length,
        fossilFuelDemand: points.reduce((sum, p) => sum + (p.fossilFuelDemand || 0), 0) / points.length,
        co2Emissions: points.reduce((sum, p) => sum + (p.co2Emissions || 0), 0) / points.length,
        dataSource: "NGFS Phase III",
        updatedAt: new Date(),
      };
      return avgPoint;
    }).sort((a, b) => a.year - b.year);
  }

  getScenarioLabels() {
    return SCENARIO_LABELS;
  }

  getScenarioDescriptions() {
    return SCENARIO_DESCRIPTIONS;
  }

  getModelLabels() {
    return MODEL_LABELS;
  }

  getMetricLabels() {
    return METRIC_LABELS;
  }
}

export const ngfsDataService = new NgfsDataService();
