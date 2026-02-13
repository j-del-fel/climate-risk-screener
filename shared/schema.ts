import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, integer, real, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const assessments = pgTable("assessments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  companyName: text("company_name").notNull(),
  industry: text("industry").notNull(), // Auto-determined from company name
  naicsCode: text("naics_code"), // 4 or 6-digit NAICS code
  assessmentFramework: text("assessment_framework").default("standard"), // 'standard' or 'advanced'
  businessContext: jsonb("business_context").notNull(),
  currentStep: integer("current_step").default(1),
  isComplete: boolean("is_complete").default(false),
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

export const riskAssessments = pgTable("risk_assessments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  assessmentId: varchar("assessment_id").references(() => assessments.id).notNull(),
  category: text("category").notNull(), // 'transition' or 'physical' or 'opportunity'
  subcategory: text("subcategory").notNull(), // 'policy_legal', 'technology', etc.
  
  // Standard framework metrics (Impact, Likelihood, Vulnerability)
  impactScore: integer("impact_score"), // 1-5
  likelihoodScore: integer("likelihood_score"), // 1-5
  vulnerabilityScore: integer("vulnerability_score"), // 1-5
  
  // Advanced framework metrics for risks (Exposure, Vulnerability, Strategic Misalignment, Mitigation Readiness)
  exposureScore: integer("exposure_score"), // 1-5
  strategicMisalignmentScore: integer("strategic_misalignment_score"), // 1-5
  mitigationReadinessScore: integer("mitigation_readiness_score"), // 1-5
  
  // Advanced framework metrics for opportunities (Strategic Misalignment, Market Readiness, Value Creation, Feasibility)
  marketReadinessScore: integer("market_readiness_score"), // 1-5
  valueCreationScore: integer("value_creation_score"), // 1-5
  feasibilityScore: integer("feasibility_score"), // 1-5
  
  timeHorizon: text("time_horizon"), // 'short', 'medium', 'long'
  overallRisk: real("overall_risk"),
  narrative: text("narrative"),
  reasoning: text("reasoning"),
  peerComparison: jsonb("peer_comparison"), // peer ranking data
  sources: jsonb("sources"),
  scenarioProjections: jsonb("scenario_projections"), // NGFS scenario analysis projections
  isAiGenerated: boolean("is_ai_generated").default(false),
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

export const questions = pgTable("questions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  questionText: text("question_text").notNull(),
  questionType: text("question_type").notNull(), // 'multiple_choice', 'text', 'scale'
  category: text("category").notNull(),
  options: jsonb("options"),
  order: integer("order").notNull(),
});

export const assessmentAnswers = pgTable("assessment_answers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  assessmentId: varchar("assessment_id").references(() => assessments.id).notNull(),
  questionId: varchar("question_id").references(() => questions.id).notNull(),
  answer: text("answer").notNull(),
  createdAt: timestamp("created_at").default(sql`now()`),
});

// Sector Intelligence Module - Sector Profiles
export const sectorProfiles = pgTable("sector_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sectorCode: text("sector_code").notNull().unique(), // e.g., 'energy', 'manufacturing', 'agriculture'
  sectorName: text("sector_name").notNull(),
  description: text("description"),
  naicsCodeRange: text("naics_code_range"), // e.g., '21-22' for mining/utilities
  
  // Economic Metrics (from World Bank/OECD)
  gdpContributionPercent: real("gdp_contribution_percent"), // % of global GDP
  employmentPercent: real("employment_percent"), // % of global employment
  valueAddedBillions: real("value_added_billions"), // USD billions
  averageRevenueGrowth: real("average_revenue_growth"), // annual %
  
  // Emissions Data (from Climate TRACE)
  annualEmissionsMtCo2: real("annual_emissions_mt_co2"), // megatonnes CO2
  emissionsIntensity: real("emissions_intensity"), // tCO2/$M revenue
  emissionsTrend: text("emissions_trend"), // 'increasing', 'stable', 'decreasing'
  primaryEmissionSources: jsonb("primary_emission_sources"), // array of source descriptions
  
  // Climate Risk Profile
  transitionRiskLevel: text("transition_risk_level"), // 'low', 'medium', 'high', 'very_high'
  physicalRiskLevel: text("physical_risk_level"),
  opportunityLevel: text("opportunity_level"),
  carbonIntensityCategory: text("carbon_intensity_category"), // 'low', 'medium', 'high'
  
  // Key dependencies and vulnerabilities
  keyInputSectors: jsonb("key_input_sectors"), // sectors this sector buys from
  keyOutputSectors: jsonb("key_output_sectors"), // sectors this sector sells to
  supplyChainVulnerabilities: jsonb("supply_chain_vulnerabilities"),
  
  // Key risks and opportunities
  keyRisks: jsonb("key_risks").$type<string[]>(),
  keyOpportunities: jsonb("key_opportunities").$type<string[]>(),
  
  // Data freshness
  dataLastUpdated: timestamp("data_last_updated").default(sql`now()`),
  dataSourceVersion: text("data_source_version"),
});

// Input-Output Relationships between sectors (from BEA)
export const sectorInputOutput = pgTable("sector_input_output", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fromSectorCode: text("from_sector_code").notNull(),
  toSectorCode: text("to_sector_code").notNull(),
  flowValueBillions: real("flow_value_billions"), // USD billions
  flowPercent: real("flow_percent"), // % of total inputs/outputs
  relationshipType: text("relationship_type"), // 'input' or 'output'
  year: integer("year"),
  dataSource: text("data_source"), // 'BEA', 'OECD', etc.
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

// Sector Emissions by Year (time series from Climate TRACE)
export const sectorEmissionsHistory = pgTable("sector_emissions_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sectorCode: text("sector_code").notNull(),
  year: integer("year").notNull(),
  emissionsMtCo2: real("emissions_mt_co2"),
  emissionsByGas: jsonb("emissions_by_gas"), // CO2, CH4, N2O breakdown
  emissionsByRegion: jsonb("emissions_by_region"), // geographic breakdown
  dataSource: text("data_source"),
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

// NGFS Scenario Impacts by Sector
export const sectorScenarioImpacts = pgTable("sector_scenario_impacts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sectorCode: text("sector_code").notNull(),
  scenarioName: text("scenario_name").notNull(), // 'Net Zero 2050', 'Current Policies', etc.
  year: integer("year").notNull(),
  
  // Impact metrics
  gdpImpactPercent: real("gdp_impact_percent"), // % change from baseline
  carbonPriceUsd: real("carbon_price_usd"), // $/tCO2
  energyDemandChange: real("energy_demand_change"), // % change
  investmentRequiredBillions: real("investment_required_billions"),
  strandedAssetRiskPercent: real("stranded_asset_risk_percent"),
  
  // Transition pathway
  transitionScore: real("transition_score"), // 1-10 difficulty
  adaptationNeeds: jsonb("adaptation_needs"),
  
  dataSource: text("data_source"),
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

// Zod schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

export const insertAssessmentSchema = createInsertSchema(assessments).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

// Updated schema without industry field (auto-determined)
export const createAssessmentSchema = insertAssessmentSchema.omit({
  industry: true,
  naicsCode: true,
});

export const insertRiskAssessmentSchema = createInsertSchema(riskAssessments).omit({
  id: true,
  updatedAt: true,
});

export const insertQuestionSchema = createInsertSchema(questions).omit({
  id: true,
});

export const insertAssessmentAnswerSchema = createInsertSchema(assessmentAnswers).omit({
  id: true,
  createdAt: true,
});

export const insertSectorProfileSchema = createInsertSchema(sectorProfiles).omit({
  id: true,
  dataLastUpdated: true,
});

export const insertSectorInputOutputSchema = createInsertSchema(sectorInputOutput).omit({
  id: true,
  updatedAt: true,
});

export const insertSectorEmissionsHistorySchema = createInsertSchema(sectorEmissionsHistory).omit({
  id: true,
  updatedAt: true,
});

export const insertSectorScenarioImpactSchema = createInsertSchema(sectorScenarioImpacts).omit({
  id: true,
  updatedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Assessment = typeof assessments.$inferSelect;
export type InsertAssessment = z.infer<typeof insertAssessmentSchema>;

export type RiskAssessment = typeof riskAssessments.$inferSelect;
export type InsertRiskAssessment = z.infer<typeof insertRiskAssessmentSchema>;

export type Question = typeof questions.$inferSelect;
export type InsertQuestion = z.infer<typeof insertQuestionSchema>;

export type AssessmentAnswer = typeof assessmentAnswers.$inferSelect;
export type InsertAssessmentAnswer = z.infer<typeof insertAssessmentAnswerSchema>;

export type SectorProfile = typeof sectorProfiles.$inferSelect;
export type InsertSectorProfile = z.infer<typeof insertSectorProfileSchema>;

export type SectorInputOutput = typeof sectorInputOutput.$inferSelect;
export type InsertSectorInputOutput = z.infer<typeof insertSectorInputOutputSchema>;

export type SectorEmissionsHistory = typeof sectorEmissionsHistory.$inferSelect;
export type InsertSectorEmissionsHistory = z.infer<typeof insertSectorEmissionsHistorySchema>;

export type SectorScenarioImpact = typeof sectorScenarioImpacts.$inferSelect;
export type InsertSectorScenarioImpact = z.infer<typeof insertSectorScenarioImpactSchema>;

// NGFS Time Series Data - Global scenario projections over time
export const ngfsTimeSeries = pgTable("ngfs_time_series", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  scenario: text("scenario").notNull(), // e.g., 'net-zero-2050', 'current-policies'
  model: text("model").notNull(), // e.g., 'REMIND-Magpie', 'GCAM', 'MessageIX-Globiom'
  year: integer("year").notNull(),
  temperature: real("temperature"), // Global mean temperature increase (°C)
  carbonPrice: real("carbon_price"), // Carbon price (USD/tCO2)
  gdpImpact: real("gdp_impact"), // GDP impact (% deviation from baseline)
  energyDemand: real("energy_demand"), // Primary energy demand (EJ/yr)
  renewableShare: real("renewable_share"), // Renewable energy share (%)
  fossilFuelDemand: real("fossil_fuel_demand"), // Fossil fuel demand (EJ/yr)
  co2Emissions: real("co2_emissions"), // CO2 emissions (GtCO2/yr)
  dataSource: text("data_source").default("NGFS Phase III"),
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

export const insertNgfsTimeSeriesSchema = createInsertSchema(ngfsTimeSeries).omit({
  id: true,
  updatedAt: true,
});

export type NgfsTimeSeries = typeof ngfsTimeSeries.$inferSelect;
export type InsertNgfsTimeSeries = z.infer<typeof insertNgfsTimeSeriesSchema>;

// Climate Grid Data - Pre-processed CMIP6 and ISIMIP climate projections
export const climateGridData = pgTable("climate_grid_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  source: text("source").notNull(), // 'cmip6' or 'isimip'
  indicatorId: text("indicator_id").notNull(), // e.g., 'tas', 'pr', 'flood_depth'
  scenario: text("scenario").notNull(), // e.g., 'ssp126', 'ssp245', 'ssp370', 'ssp585'
  timePeriod: text("time_period").notNull(), // e.g., '2030', '2050', '2070', '2090'
  latitude: real("latitude").notNull(), // Grid point latitude
  longitude: real("longitude").notNull(), // Grid point longitude
  value: real("value").notNull(), // Indicator value (anomaly for temperature, absolute for others)
  unit: text("unit"), // e.g., '°C', 'mm/day', 'days'
  model: text("model"), // Climate model name e.g., 'MRI-AGCM3-2-S'
  percentile: integer("percentile"), // e.g., 50 for median
  dataSource: text("data_source"), // e.g., 'Open-Meteo', 'ISIMIP'
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

// Index for fast spatial queries
export const climateGridDataIndicatorIdx = sql`CREATE INDEX IF NOT EXISTS idx_climate_grid_indicator ON climate_grid_data(source, indicator_id, scenario, time_period)`;
export const climateGridDataLatLonIdx = sql`CREATE INDEX IF NOT EXISTS idx_climate_grid_latlon ON climate_grid_data(latitude, longitude)`;

export const insertClimateGridDataSchema = createInsertSchema(climateGridData).omit({
  id: true,
  updatedAt: true,
});

export type ClimateGridData = typeof climateGridData.$inferSelect;
export type InsertClimateGridData = z.infer<typeof insertClimateGridDataSchema>;

// Economic Data - Cached time series from FRED, BEA, IMF, OECD, DBnomics, Data.gov
export const economicData = pgTable("economic_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  source: text("source").notNull(), // 'FRED', 'BEA', 'IMF', 'OECD', 'DBnomics', 'Data.gov'
  seriesId: text("series_id").notNull(), // e.g., 'DCOILWTICO', 'GDP', 'NIPA.T10101'
  seriesName: text("series_name").notNull(), // Human-readable name
  category: text("category").notNull(), // 'energy', 'economic', 'emissions'
  date: text("date").notNull(), // Date in YYYY-MM-DD format
  value: real("value"), // Can be null for missing data points
  units: text("units"), // e.g., 'USD Billions', 'Index', 'Percent'
  frequency: text("frequency"), // 'Daily', 'Weekly', 'Monthly', 'Quarterly', 'Annual'
  description: text("description"), // Series description
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

// Index for fast queries by source and series
export const economicDataSeriesIdx = sql`CREATE INDEX IF NOT EXISTS idx_economic_data_series ON economic_data(source, series_id)`;
export const economicDataCategoryIdx = sql`CREATE INDEX IF NOT EXISTS idx_economic_data_category ON economic_data(category)`;
export const economicDataDateIdx = sql`CREATE INDEX IF NOT EXISTS idx_economic_data_date ON economic_data(date)`;

export const insertEconomicDataSchema = createInsertSchema(economicData).omit({
  id: true,
  updatedAt: true,
});

export type EconomicData = typeof economicData.$inferSelect;
export type InsertEconomicData = z.infer<typeof insertEconomicDataSchema>;

// LCA Data - Cached emission factors from Federal LCA Commons (USLCI, NIST, USDA, etc.)
export const lcaData = pgTable("lca_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  refId: text("ref_id").notNull(), // UUID reference from LCA Commons
  repository: text("repository").notNull(), // 'USLCI', 'NIST_Building_Systems', 'USDA_Agricultural', etc.
  name: text("name").notNull(), // Process/flow name
  category: text("category"), // Category path e.g., 'Energy/Electricity/Grid Mix'
  flowType: text("flow_type"), // 'ELEMENTARY_FLOW', 'PRODUCT_FLOW'
  processType: text("process_type"), // 'UNIT_PROCESS', 'LCI_RESULT'
  location: text("location"), // Geographic location e.g., 'US', 'US-CA'
  description: text("description"),
  units: text("units"), // e.g., 'kg CO2e', 'MJ', 'kg'
  emissionFactor: real("emission_factor"), // Primary emission factor value
  emissionUnit: text("emission_unit"), // Unit for emission factor e.g., 'kg CO2e/kWh'
  metadata: jsonb("metadata"), // Additional process metadata
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

export const lcaDataRefIdx = sql`CREATE INDEX IF NOT EXISTS idx_lca_data_ref ON lca_data(ref_id)`;
export const lcaDataRepoIdx = sql`CREATE INDEX IF NOT EXISTS idx_lca_data_repo ON lca_data(repository)`;
export const lcaDataCategoryIdx = sql`CREATE INDEX IF NOT EXISTS idx_lca_data_category ON lca_data(category)`;
export const lcaDataNameIdx = sql`CREATE INDEX IF NOT EXISTS idx_lca_data_name ON lca_data(name)`;

export const insertLcaDataSchema = createInsertSchema(lcaData).omit({
  id: true,
  updatedAt: true,
});

export type LcaData = typeof lcaData.$inferSelect;
export type InsertLcaData = z.infer<typeof insertLcaDataSchema>;

// Company Dependencies table for economic simulation
export const companyDependencies = pgTable("company_dependencies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyName: text("company_name").notNull(),
  ticker: text("ticker"),
  naicsCode: text("naics_code").notNull(),
  naicsDescription: text("naics_description"),
  sector: text("sector").notNull(),
  subsector: text("subsector"),
  hqState: text("hq_state"),
  hqRegion: text("hq_region").default("US"),
  revenueRange: text("revenue_range"),
  employees: text("employees"),
  materialDependencies: jsonb("material_dependencies").notNull().default(sql`'[]'::jsonb`),
  energyDependencies: jsonb("energy_dependencies").notNull().default(sql`'[]'::jsonb`),
  waterDependency: jsonb("water_dependency").notNull().default(sql`'{}'::jsonb`),
  geographicDependencies: jsonb("geographic_dependencies").notNull().default(sql`'[]'::jsonb`),
  supplyChainNotes: text("supply_chain_notes"),
  climateRiskExposure: text("climate_risk_exposure"),
  sources: text("sources"),
});

export const companyDependenciesNameIdx = sql`CREATE INDEX IF NOT EXISTS idx_company_deps_name ON company_dependencies(company_name)`;
export const companyDependenciesSectorIdx = sql`CREATE INDEX IF NOT EXISTS idx_company_deps_sector ON company_dependencies(sector)`;
export const companyDependenciesNaicsIdx = sql`CREATE INDEX IF NOT EXISTS idx_company_deps_naics ON company_dependencies(naics_code)`;

export const insertCompanyDependencySchema = createInsertSchema(companyDependencies).omit({
  id: true,
});

export type CompanyDependency = typeof companyDependencies.$inferSelect;
export type InsertCompanyDependency = z.infer<typeof insertCompanyDependencySchema>;

export interface MaterialDependency {
  name: string;
  criticality: "high" | "medium" | "low";
  primarySource: string;
  notes: string;
}

export interface EnergyDependency {
  source: string;
  percentOfTotal: number;
  criticality: "high" | "medium" | "low";
  notes: string;
}

export interface WaterDependency {
  usageLevel: "high" | "medium" | "low";
  primaryUse: string;
  annualVolumeEstimate: string;
  waterStressExposure: string;
  notes: string;
}

export interface GeographicDependency {
  region: string;
  dependencyType: string;
  criticality: "high" | "medium" | "low";
  notes: string;
}

// Scenario analysis types
export interface ScenarioScores {
  impactScore: number;
  likelihoodScore: number;
  vulnerabilityScore: number;
  overallRisk: number;
}

export interface ScenarioProjections {
  [scenarioId: string]: {
    [year: string]: ScenarioScores;
  };
}

export interface ScenarioAnalysisRequest {
  assessmentId: string;
  riskAssessmentIds: string[];
}
