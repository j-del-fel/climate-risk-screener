import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateRiskAnalysis, generateRiskAssessment, generateOpportunityAssessment, detectIndustryFromCompanyName, generateEcologicalRiskAssessment, generateTcfdRiskAssessment, generateTnfdRiskAssessment, generateCsrdReport, generateTcfdReport, generateTnfdReport } from "./services/openai";
import { generateScenarioProjections } from "./services/generateScenarioProjections";
import { sectorDataService } from "./services/sectorData";
import { ngfsDataService } from "./services/ngfsData";
import * as economicData from "./services/economicData";
import * as lcaData from "./services/lcaData";
import * as physicalRiskData from "./services/physicalRiskData";
import * as climateDataImport from "./services/climateDataImport";
import * as secEdgar from "./services/secEdgar";
import { US_COMPANY_SEED_DATA } from "./services/companyDependenciesSeed";
import { insertAssessmentSchema, insertRiskAssessmentSchema, insertAssessmentAnswerSchema, createAssessmentSchema, insertCompanyDependencySchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Assessment routes
  app.get("/api/assessments", async (req, res) => {
    try {
      // For now, get all assessments (in real app, filter by user)
      const allAssessments = Array.from((storage as any).assessments.values());
      res.json(allAssessments);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ message });
    }
  });

  app.post("/api/assessments", async (req, res) => {
    try {
      // Use the new schema without industry field
      const inputData = createAssessmentSchema.parse(req.body);
      
      // Detect industry and NAICS code from company name
      const industryDetection = await detectIndustryFromCompanyName({
        companyName: inputData.companyName
      });
      
      // Create assessment with detected industry and NAICS
      const assessmentData = {
        ...inputData,
        industry: industryDetection.industry,
        naicsCode: industryDetection.naicsCode
      };
      
      const assessment = await storage.createAssessment(assessmentData);
      
      // Return assessment with industry detection info
      res.json({
        ...assessment,
        industryDetection
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(400).json({ message: "Failed to create assessment: " + message });
    }
  });

  app.get("/api/assessments/:id", async (req, res) => {
    try {
      const assessment = await storage.getAssessment(req.params.id);
      if (!assessment) {
        return res.status(404).json({ message: "Assessment not found" });
      }
      res.json(assessment);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ message });
    }
  });

  app.patch("/api/assessments/:id", async (req, res) => {
    try {
      const updated = await storage.updateAssessment(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ message: "Assessment not found" });
      }
      res.json(updated);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ message });
    }
  });

  // Risk assessment routes
  app.get("/api/assessments/:id/risks", async (req, res) => {
    try {
      const risks = await storage.getRiskAssessments(req.params.id);
      res.json(risks);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ message });
    }
  });

  app.post("/api/assessments/:id/risks", async (req, res) => {
    try {
      const validatedData = insertRiskAssessmentSchema.parse({
        ...req.body,
        assessmentId: req.params.id
      });
      const risk = await storage.createRiskAssessment(validatedData);
      res.json(risk);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(400).json({ message });
    }
  });

  app.patch("/api/risks/:id", async (req, res) => {
    try {
      const updated = await storage.updateRiskAssessment(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ message: "Risk assessment not found" });
      }
      res.json(updated);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ message });
    }
  });

  // AI analysis routes - Risk assessment only
  app.post("/api/assessments/:id/analyze-risks", async (req, res) => {
    try {
      const assessment = await storage.getAssessment(req.params.id);
      if (!assessment) {
        return res.status(404).json({ message: "Assessment not found" });
      }

      const riskAnalyses = await generateRiskAssessment(
        assessment.industry,
        assessment.companyName,
        assessment.businessContext,
        assessment.assessmentFramework || 'standard'
      );

      // Save the risk assessments
      const savedRisks = [];
      for (const analysis of riskAnalyses) {
        const risk = await storage.createRiskAssessment({
          assessmentId: req.params.id,
          category: analysis.category,
          subcategory: analysis.subcategory,
          impactScore: analysis.impactScore,
          likelihoodScore: analysis.likelihoodScore,
          vulnerabilityScore: analysis.vulnerabilityScore,
          exposureScore: analysis.exposureScore,
          strategicMisalignmentScore: analysis.strategicMisalignmentScore,
          mitigationReadinessScore: analysis.mitigationReadinessScore,
          timeHorizon: 'medium',
          overallRisk: analysis.overallRisk,
          narrative: analysis.narrative,
          reasoning: analysis.reasoning,
          peerComparison: analysis.peerComparison,
          sources: analysis.sources,
          isAiGenerated: true
        });
        savedRisks.push(risk);
      }

      // Update assessment step
      await storage.updateAssessment(req.params.id, { 
        currentStep: 2
      });

      res.json({ risks: savedRisks, message: "Risk analysis completed successfully" });
    } catch (error) {
      console.error("Risk analysis error:", error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ message: "Failed to generate risk analysis: " + message });
    }
  });

  // AI analysis routes - Opportunity assessment
  app.post("/api/assessments/:id/analyze-opportunities", async (req, res) => {
    try {
      const assessment = await storage.getAssessment(req.params.id);
      if (!assessment) {
        return res.status(404).json({ message: "Assessment not found" });
      }

      const opportunityAnalyses = await generateOpportunityAssessment(
        assessment.industry,
        assessment.companyName,
        assessment.businessContext,
        assessment.assessmentFramework || 'standard'
      );

      // Save the opportunity assessments
      const savedOpportunities = [];
      for (const analysis of opportunityAnalyses) {
        const opportunity = await storage.createRiskAssessment({
          assessmentId: req.params.id,
          category: analysis.category,
          subcategory: analysis.subcategory,
          impactScore: analysis.impactScore,
          likelihoodScore: analysis.likelihoodScore,
          vulnerabilityScore: analysis.vulnerabilityScore,
          strategicMisalignmentScore: analysis.strategicMisalignmentScore,
          marketReadinessScore: analysis.marketReadinessScore,
          valueCreationScore: analysis.valueCreationScore,
          feasibilityScore: analysis.feasibilityScore,
          timeHorizon: 'medium',
          overallRisk: analysis.overallRisk,
          narrative: analysis.narrative,
          reasoning: analysis.reasoning,
          peerComparison: analysis.peerComparison,
          sources: analysis.sources,
          isAiGenerated: true
        });
        savedOpportunities.push(opportunity);
      }

      // Update assessment as complete
      await storage.updateAssessment(req.params.id, { 
        currentStep: 3,
        isComplete: true
      });

      res.json({ opportunities: savedOpportunities, message: "Opportunity analysis completed successfully" });
    } catch (error) {
      console.error("Opportunity analysis error:", error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ message: "Failed to generate opportunity analysis: " + message });
    }
  });

  // Ecological risk assessment endpoint
  app.post("/api/ecological-risk/analyze", async (req, res) => {
    try {
      const { companyName, industry, businessContext } = req.body;
      if (!companyName) {
        return res.status(400).json({ message: "Company name is required" });
      }

      let detectedIndustry = industry;
      if (!detectedIndustry) {
        const detection = await detectIndustryFromCompanyName({ companyName });
        detectedIndustry = detection.industry;
      }

      const analyses = await generateEcologicalRiskAssessment(
        detectedIndustry,
        companyName,
        businessContext || {}
      );

      res.json({ risks: analyses, industry: detectedIndustry, message: "Ecological risk analysis completed" });
    } catch (error) {
      console.error("Ecological risk analysis error:", error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ message: "Failed to generate ecological risk analysis: " + message });
    }
  });

  app.post("/api/tcfd-risk/analyze", async (req, res) => {
    try {
      const { companyName, industry, businessContext } = req.body;
      if (!companyName) {
        return res.status(400).json({ message: "Company name is required" });
      }

      let detectedIndustry = industry;
      if (!detectedIndustry) {
        const detection = await detectIndustryFromCompanyName({ companyName });
        detectedIndustry = detection.industry;
      }

      const analyses = await generateTcfdRiskAssessment(
        detectedIndustry,
        companyName,
        businessContext || {}
      );

      res.json({ risks: analyses, industry: detectedIndustry, message: "TCFD risk analysis completed" });
    } catch (error) {
      console.error("TCFD risk analysis error:", error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ message: "Failed to generate TCFD risk analysis: " + message });
    }
  });

  app.post("/api/tnfd-risk/analyze", async (req, res) => {
    try {
      const { companyName, industry, businessContext } = req.body;
      if (!companyName) {
        return res.status(400).json({ message: "Company name is required" });
      }

      let detectedIndustry = industry;
      if (!detectedIndustry) {
        const detection = await detectIndustryFromCompanyName({ companyName });
        detectedIndustry = detection.industry;
      }

      const analyses = await generateTnfdRiskAssessment(
        detectedIndustry,
        companyName,
        businessContext || {}
      );

      res.json({ risks: analyses, industry: detectedIndustry, message: "TNFD nature-related risk analysis completed" });
    } catch (error) {
      console.error("TNFD risk analysis error:", error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ message: "Failed to generate TNFD risk analysis: " + message });
    }
  });

  app.post("/api/csrd-report", async (req, res) => {
    try {
      const { companyName, industry, geography, revenue, employees, description, materialTopics } = req.body;
      if (!companyName) {
        return res.status(400).json({ message: "Company name is required" });
      }

      let detectedIndustry = industry;
      if (!detectedIndustry) {
        const detection = await detectIndustryFromCompanyName({ companyName });
        detectedIndustry = detection.industry;
      }

      const report = await generateCsrdReport({
        companyName, industry: detectedIndustry, geography, revenue, employees, description, materialTopics
      });

      res.json(report);
    } catch (error) {
      console.error("CSRD report generation error:", error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ message: "Failed to generate CSRD report: " + message });
    }
  });

  app.post("/api/tcfd-report", async (req, res) => {
    try {
      const { companyName, industry, geography, revenue, employees, description, materialTopics } = req.body;
      if (!companyName) {
        return res.status(400).json({ message: "Company name is required" });
      }

      let detectedIndustry = industry;
      if (!detectedIndustry) {
        const detection = await detectIndustryFromCompanyName({ companyName });
        detectedIndustry = detection.industry;
      }

      const report = await generateTcfdReport({
        companyName, industry: detectedIndustry, geography, revenue, employees, description, materialTopics
      });

      res.json(report);
    } catch (error) {
      console.error("TCFD report generation error:", error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ message: "Failed to generate TCFD report: " + message });
    }
  });

  app.post("/api/tnfd-report", async (req, res) => {
    try {
      const { companyName, industry, geography, revenue, employees, description, materialTopics } = req.body;
      if (!companyName) {
        return res.status(400).json({ message: "Company name is required" });
      }

      let detectedIndustry = industry;
      if (!detectedIndustry) {
        const detection = await detectIndustryFromCompanyName({ companyName });
        detectedIndustry = detection.industry;
      }

      const report = await generateTnfdReport({
        companyName, industry: detectedIndustry, geography, revenue, employees, description, materialTopics
      });

      res.json(report);
    } catch (error) {
      console.error("TNFD report generation error:", error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ message: "Failed to generate TNFD report: " + message });
    }
  });

  // Questions routes
  app.get("/api/questions", async (req, res) => {
    try {
      const questions = await storage.getQuestions();
      res.json(questions);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ message });
    }
  });

  // Assessment answers routes
  app.post("/api/assessments/:id/answers", async (req, res) => {
    try {
      const validatedData = insertAssessmentAnswerSchema.parse({
        ...req.body,
        assessmentId: req.params.id
      });
      const answer = await storage.createAssessmentAnswer(validatedData);
      res.json(answer);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(400).json({ message });
    }
  });

  app.get("/api/assessments/:id/answers", async (req, res) => {
    try {
      const answers = await storage.getAssessmentAnswers(req.params.id);
      res.json(answers);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ message });
    }
  });

  // Scenario analysis route
  app.post("/api/assessments/:id/analyze-scenarios", async (req, res) => {
    try {
      const assessment = await storage.getAssessment(req.params.id);
      if (!assessment) {
        return res.status(404).json({ message: "Assessment not found" });
      }

      const riskAssessments = await storage.getRiskAssessments(req.params.id);
      if (!riskAssessments || riskAssessments.length === 0) {
        return res.status(400).json({ message: "No risk assessments found. Please complete the risk analysis first." });
      }

      // Generate scenario projections for each risk assessment
      const updatedRisks = [];
      for (const risk of riskAssessments) {
        const scenarioProjections = await generateScenarioProjections(
          risk,
          assessment.industry,
          assessment.companyName,
          assessment.assessmentFramework || 'standard'
        );

        const updatedRisk = await storage.updateRiskAssessment(risk.id, {
          scenarioProjections
        });
        
        if (updatedRisk) {
          updatedRisks.push(updatedRisk);
        }
      }

      res.json({ 
        risks: updatedRisks, 
        message: "Scenario analysis completed successfully",
        scenariosAnalyzed: 7,
        timeHorizons: [2030, 2040, 2050]
      });
    } catch (error) {
      console.error("Scenario analysis error:", error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ message: "Failed to generate scenario analysis: " + message });
    }
  });

  // ==================== SECTOR INTELLIGENCE ROUTES ====================

  // Initialize sector data on startup
  sectorDataService.initializeBaselineData().catch(console.error);

  // Get all sector profiles
  app.get("/api/sectors", async (req, res) => {
    try {
      const sectors = await sectorDataService.getAllSectorProfiles();
      res.json(sectors);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ message: "Failed to fetch sectors: " + message });
    }
  });

  // Get sector profile by code
  app.get("/api/sectors/:sectorCode", async (req, res) => {
    try {
      const sector = await sectorDataService.getSectorProfile(req.params.sectorCode);
      if (!sector) {
        return res.status(404).json({ message: "Sector not found" });
      }
      res.json(sector);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ message: "Failed to fetch sector: " + message });
    }
  });

  // Get comprehensive sector data (profile + input-output + emissions + scenarios)
  app.get("/api/sectors/:sectorCode/comprehensive", async (req, res) => {
    try {
      const data = await sectorDataService.getComprehensiveSectorData(req.params.sectorCode);
      if (!data.profile) {
        return res.status(404).json({ message: "Sector not found" });
      }
      res.json(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ message: "Failed to fetch comprehensive sector data: " + message });
    }
  });

  // Get sector input-output relationships
  app.get("/api/sectors/:sectorCode/input-output", async (req, res) => {
    try {
      const inputOutput = await sectorDataService.getSectorInputOutput(req.params.sectorCode);
      res.json(inputOutput);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ message: "Failed to fetch input-output data: " + message });
    }
  });

  // Get sector emissions history
  app.get("/api/sectors/:sectorCode/emissions", async (req, res) => {
    try {
      const emissions = await sectorDataService.getSectorEmissionsHistory(req.params.sectorCode);
      res.json(emissions);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ message: "Failed to fetch emissions history: " + message });
    }
  });

  // Get sector scenario impacts
  app.get("/api/sectors/:sectorCode/scenarios", async (req, res) => {
    try {
      const scenarioName = req.query.scenario as string | undefined;
      const scenarios = await sectorDataService.getSectorScenarioImpacts(req.params.sectorCode, scenarioName);
      res.json(scenarios);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ message: "Failed to fetch scenario impacts: " + message });
    }
  });

  // Map industry to sector code
  app.get("/api/sectors/map/:industry", async (req, res) => {
    try {
      const sectorCode = sectorDataService.mapIndustryToSectorCode(req.params.industry);
      if (!sectorCode) {
        return res.json({ sectorCode: null, message: "No matching sector found" });
      }
      const sector = await sectorDataService.getSectorProfile(sectorCode);
      res.json({ sectorCode, sector });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ message: "Failed to map industry: " + message });
    }
  });

  // ==================== NGFS TIME SERIES DATA ROUTES ====================

  // Initialize NGFS data on startup
  ngfsDataService.seedData().catch(console.error);

  // Get all NGFS time series data
  app.get("/api/ngfs/data", async (req, res) => {
    try {
      const { scenario, model } = req.query;
      let data;
      
      if (scenario && model && model !== "Average") {
        data = await ngfsDataService.getDataByScenarioAndModel(scenario as string, model as string);
      } else if (scenario && model === "Average") {
        data = await ngfsDataService.getAggregatedData(scenario as string);
      } else if (scenario) {
        data = await ngfsDataService.getDataByScenario(scenario as string);
      } else {
        data = await ngfsDataService.getAllData();
      }
      
      res.json(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ message: "Failed to fetch NGFS data: " + message });
    }
  });

  // Get available scenarios
  app.get("/api/ngfs/scenarios", async (req, res) => {
    try {
      const scenarios = await ngfsDataService.getAvailableScenarios();
      res.json({
        scenarios,
        labels: ngfsDataService.getScenarioLabels(),
        descriptions: ngfsDataService.getScenarioDescriptions()
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ message: "Failed to fetch scenarios: " + message });
    }
  });

  // Get available models for a scenario
  app.get("/api/ngfs/models", async (req, res) => {
    try {
      const { scenario } = req.query;
      const models = await ngfsDataService.getAvailableModels(scenario as string | undefined);
      res.json({
        models,
        labels: ngfsDataService.getModelLabels()
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ message: "Failed to fetch models: " + message });
    }
  });

  // Get metric labels
  app.get("/api/ngfs/metrics", async (req, res) => {
    try {
      res.json({
        labels: ngfsDataService.getMetricLabels()
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ message: "Failed to fetch metrics: " + message });
    }
  });

  // ==========================================
  // Economic Data API Routes (FRED, BEA, IMF, OECD, DBnomics, Data.gov)
  // ==========================================

  // Get available data series
  app.get("/api/economic/series", async (req, res) => {
    try {
      const series = economicData.getAvailableSeries();
      res.json({ series });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ message: "Failed to fetch series: " + message });
    }
  });

  // Get data source status
  app.get("/api/economic/status", async (req, res) => {
    try {
      const status = await economicData.checkDataSourcesStatus();
      res.json({ sources: status });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ message: "Failed to check status: " + message });
    }
  });

  // Fetch FRED data
  app.get("/api/economic/fred/:seriesId", async (req, res) => {
    try {
      const { seriesId } = req.params;
      const { startDate, endDate } = req.query;
      const data = await economicData.fetchFREDData(
        seriesId,
        startDate as string | undefined,
        endDate as string | undefined
      );
      res.json({ data, source: 'FRED' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ message: "Failed to fetch FRED data: " + message });
    }
  });

  // Fetch BEA data
  app.get("/api/economic/bea/:datasetName/:tableName", async (req, res) => {
    try {
      const { datasetName, tableName } = req.params;
      const data = await economicData.fetchBEAData(datasetName, tableName);
      res.json({ data, source: 'BEA' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ message: "Failed to fetch BEA data: " + message });
    }
  });

  // Fetch IMF data
  app.get("/api/economic/imf/:indicator", async (req, res) => {
    try {
      const { indicator } = req.params;
      const { country } = req.query;
      const data = await economicData.fetchIMFData(indicator, country as string || 'US');
      res.json({ data, source: 'IMF' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ message: "Failed to fetch IMF data: " + message });
    }
  });

  // Fetch OECD data
  app.get("/api/economic/oecd/:datasetId", async (req, res) => {
    try {
      const { datasetId } = req.params;
      const { country } = req.query;
      const data = await economicData.fetchOECDData(datasetId, country as string || 'USA');
      res.json({ data, source: 'OECD' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ message: "Failed to fetch OECD data: " + message });
    }
  });

  // Fetch DBnomics data
  app.get("/api/economic/dbnomics", async (req, res) => {
    try {
      const { seriesId } = req.query;
      if (!seriesId) {
        return res.status(400).json({ message: "seriesId is required" });
      }
      const data = await economicData.fetchDBnomicsData(seriesId as string);
      res.json({ data, source: 'DBnomics' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ message: "Failed to fetch DBnomics data: " + message });
    }
  });

  // Fetch Data.gov data
  app.get("/api/economic/datagov/:datasetId", async (req, res) => {
    try {
      const { datasetId } = req.params;
      const data = await economicData.fetchDataGovData(datasetId);
      res.json({ data, source: 'Data.gov' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ message: "Failed to fetch Data.gov data: " + message });
    }
  });

  // Fetch all climate-relevant economic data
  app.get("/api/economic/climate-data", async (req, res) => {
    try {
      const data = await economicData.fetchAllClimateEconomicData();
      res.json(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ message: "Failed to fetch climate economic data: " + message });
    }
  });

  // Get economic data cache statistics
  app.get("/api/economic/stats", async (req, res) => {
    try {
      const stats = await economicData.getEconomicDataStats();
      res.json(stats);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ message: "Failed to get economic data stats: " + message });
    }
  });

  // Import all economic data series into database
  app.post("/api/economic/import", async (req, res) => {
    try {
      const forceRefresh = req.body?.forceRefresh === true;
      const result = await economicData.importAllEconomicData(forceRefresh);
      res.json(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ message: "Failed to import economic data: " + message });
    }
  });

  // Clear economic data cache
  app.delete("/api/economic/cache", async (req, res) => {
    try {
      const source = req.query.source as string | undefined;
      const result = await economicData.clearEconomicDataCache(source);
      res.json(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ message: "Failed to clear economic data cache: " + message });
    }
  });

  // ============== LCA DATA ROUTES ==============

  // Get LCA data cache statistics
  app.get("/api/lca/stats", async (req, res) => {
    try {
      const stats = await lcaData.getLcaStats();
      res.json(stats);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ message: "Failed to get LCA data stats: " + message });
    }
  });

  // Search LCA processes/emission factors
  app.get("/api/lca/search", async (req, res) => {
    try {
      const query = req.query.query as string || '';
      const repository = req.query.repository as string | undefined;
      const type = req.query.type as string | undefined;
      const category = req.query.category as string | undefined;
      const location = req.query.location as string | undefined;
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 50;
      
      const results = await lcaData.searchProcesses(query, { repository, type, category, location, page, pageSize });
      res.json(results);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ message: "Failed to search LCA data: " + message });
    }
  });

  // Get LCA repositories
  app.get("/api/lca/repositories", async (req, res) => {
    try {
      const repositories = await lcaData.getRepositories();
      res.json(repositories);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ message: "Failed to get LCA repositories: " + message });
    }
  });

  // Get specific LCA process
  app.get("/api/lca/process/:group/:repo/:type/:refId", async (req, res) => {
    try {
      const { group, repo, type, refId } = req.params;
      const process = await lcaData.getProcess(group, repo, type, refId);
      if (!process) {
        return res.status(404).json({ message: "Process not found" });
      }
      res.json(process);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ message: "Failed to get LCA process: " + message });
    }
  });

  // Import LCA data into database
  app.post("/api/lca/import", async (req, res) => {
    try {
      const repository = req.body?.repository as string | undefined;
      const result = await lcaData.importLcaData(repository);
      res.json(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ message: "Failed to import LCA data: " + message });
    }
  });

  // Clear LCA data cache
  app.delete("/api/lca/cache", async (req, res) => {
    try {
      const repository = req.query.repository as string | undefined;
      const result = await lcaData.clearLcaCache(repository);
      res.json(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ message: "Failed to clear LCA cache: " + message });
    }
  });

  // ============== PHYSICAL RISK ROUTES ==============

  // Get available indicators for a data source
  app.get("/api/physical-risk/indicators", (req, res) => {
    try {
      const source = (req.query.source as "cmip" | "isimip") || "cmip";
      const indicators = physicalRiskData.getIndicators(source);
      res.json(indicators);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ message: "Failed to fetch indicators: " + message });
    }
  });

  // Get available scenarios for a data source
  app.get("/api/physical-risk/scenarios", (req, res) => {
    try {
      const source = (req.query.source as "cmip" | "isimip") || "cmip";
      const scenarios = physicalRiskData.getScenarios(source);
      res.json(scenarios);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ message: "Failed to fetch scenarios: " + message });
    }
  });

  // Get available time periods
  app.get("/api/physical-risk/time-periods", (req, res) => {
    try {
      const timePeriods = physicalRiskData.getTimePeriods();
      res.json(timePeriods);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ message: "Failed to fetch time periods: " + message });
    }
  });

  // Get physical risk data for locations
  app.post("/api/physical-risk/analyze", async (req, res) => {
    try {
      const { source, locations, indicatorIds, scenario, timePeriod } = req.body;
      
      if (!source || !locations || !indicatorIds || !scenario || !timePeriod) {
        return res.status(400).json({ message: "Missing required parameters" });
      }
      
      const data = await physicalRiskData.getPhysicalRiskData(
        source as "cmip" | "isimip",
        locations,
        indicatorIds,
        scenario,
        timePeriod
      );
      
      res.json(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ message: "Failed to analyze physical risk: " + message });
    }
  });

  // Get gridded risk data for map overlay
  app.get("/api/physical-risk/grid", async (req, res) => {
    try {
      const {
        indicatorId,
        scenario,
        timePeriod,
        source,
        north,
        south,
        east,
        west,
        resolution
      } = req.query;
      
      if (!indicatorId || !scenario || !timePeriod || !source) {
        return res.status(400).json({ message: "Missing required parameters" });
      }
      
      const bounds = {
        north: parseFloat(north as string) || 85,
        south: parseFloat(south as string) || -85,
        east: parseFloat(east as string) || 180,
        west: parseFloat(west as string) || -180
      };
      
      const gridResolution = parseFloat(resolution as string) || 5;
      
      const gridData = await physicalRiskData.generateGriddedRiskData(
        indicatorId as string,
        scenario as string,
        timePeriod as string,
        source as "cmip" | "isimip",
        bounds,
        gridResolution
      );
      
      res.json(gridData);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ message: "Failed to generate grid data: " + message });
    }
  });

  // Climate data import routes
  app.get("/api/climate-data/stats", async (req, res) => {
    try {
      const stats = await climateDataImport.getClimateDataStats();
      res.json(stats);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ message: "Failed to get climate data stats: " + message });
    }
  });

  app.post("/api/climate-data/import/cmip6", async (req, res) => {
    try {
      const { limitPoints, limitScenarios, limitPeriods } = req.body;
      const logs: string[] = [];
      
      const result = await climateDataImport.importCMIP6Data({
        progressCallback: (msg) => logs.push(msg),
        limitPoints: limitPoints || 5,
        limitScenarios: limitScenarios,
        limitPeriods: limitPeriods || ["2050"],
      });
      
      res.json({ ...result, logs });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ message: "Failed to import CMIP6 data: " + message });
    }
  });

  app.post("/api/climate-data/import/isimip", async (req, res) => {
    try {
      const { limitPoints } = req.body;
      const logs: string[] = [];
      
      const result = await climateDataImport.importISIMIPData({
        progressCallback: (msg) => logs.push(msg),
        limitPoints: limitPoints,
      });
      
      res.json({ ...result, logs });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ message: "Failed to import ISIMIP data: " + message });
    }
  });

  app.get("/api/climate-data/query", async (req, res) => {
    try {
      const { lat, lon, source, scenario, timePeriod, indicators, radius } = req.query;
      
      if (!lat || !lon) {
        return res.status(400).json({ message: "Latitude and longitude are required" });
      }
      
      const result = await climateDataImport.queryClimateData(
        parseFloat(lat as string),
        parseFloat(lon as string),
        {
          source: source as "cmip6" | "isimip" | undefined,
          scenario: scenario as string | undefined,
          timePeriod: timePeriod as string | undefined,
          indicators: indicators ? (indicators as string).split(",") : undefined,
          searchRadius: radius ? parseFloat(radius as string) : undefined,
        }
      );
      
      res.json(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ message: "Failed to query climate data: " + message });
    }
  });

  app.get("/api/climate-data/grid-points", (req, res) => {
    res.json(climateDataImport.GLOBAL_GRID_POINTS);
  });

  // Company Dependencies routes
  app.get("/api/company-dependencies", async (req, res) => {
    try {
      const { sector, naicsCode, search } = req.query;
      const filters: { sector?: string; naicsCode?: string; search?: string } = {};
      if (sector && typeof sector === 'string') filters.sector = sector;
      if (naicsCode && typeof naicsCode === 'string') filters.naicsCode = naicsCode;
      if (search && typeof search === 'string') filters.search = search;
      const results = await storage.getCompanyDependencies(filters);
      res.json(results);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ message: "Failed to fetch company dependencies: " + message });
    }
  });

  app.get("/api/company-dependencies/sectors", async (req, res) => {
    try {
      const all = await storage.getCompanyDependencies();
      const sectors = [...new Set(all.map(c => c.sector))].sort();
      res.json(sectors);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch sectors" });
    }
  });

  app.get("/api/company-dependencies/stats", async (req, res) => {
    try {
      const all = await storage.getCompanyDependencies();
      const sectors: Record<string, number> = {};
      for (const c of all) {
        sectors[c.sector] = (sectors[c.sector] || 0) + 1;
      }
      res.json({ total: all.length, sectors });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  app.get("/api/company-dependencies/:id", async (req, res) => {
    try {
      const company = await storage.getCompanyDependency(req.params.id);
      if (!company) return res.status(404).json({ message: "Company not found" });
      res.json(company);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ message });
    }
  });

  app.post("/api/company-dependencies", async (req, res) => {
    try {
      const parsed = insertCompanyDependencySchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid data", errors: parsed.error.issues });
      }
      const company = await storage.createCompanyDependency(parsed.data);
      res.status(201).json(company);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ message: "Failed to create company: " + message });
    }
  });

  app.post("/api/company-dependencies/seed", async (req, res) => {
    try {
      const count = await storage.getCompanyDependencyCount();
      if (count > 0) {
        return res.json({ message: "Database already seeded", count });
      }
      let seeded = 0;
      for (const company of US_COMPANY_SEED_DATA) {
        await storage.createCompanyDependency(company);
        seeded++;
      }
      res.json({ message: `Seeded ${seeded} companies`, count: seeded });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ message: "Failed to seed data: " + message });
    }
  });

  app.post("/api/company-dependencies/ai-suggest", async (req, res) => {
    try {
      const { companyName, naicsCode, description } = req.body;
      if (!companyName) {
        return res.status(400).json({ message: "Company name is required" });
      }

      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({ message: "OpenAI API key is not configured. Please add your OPENAI_API_KEY." });
      }
      const OpenAI = (await import("openai")).default;
      const openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

      const prompt = `You are an expert in supply chain analysis and industrial ecology. Analyze the following company and provide detailed dependency data.

Company: ${companyName}
${naicsCode ? `NAICS Code: ${naicsCode}` : ''}
${description ? `Description: ${description}` : ''}

Provide a JSON response with the following structure:
{
  "naicsCode": "most appropriate 4-6 digit NAICS code",
  "naicsDescription": "official NAICS description",
  "sector": "broad sector name",
  "subsector": "specific subsector",
  "materialDependencies": [
    { "name": "material name", "criticality": "high|medium|low", "primarySource": "source regions", "notes": "usage context" }
  ] (exactly 5 items),
  "energyDependencies": [
    { "source": "energy source", "percentOfTotal": number, "criticality": "high|medium|low", "notes": "usage context" }
  ] (3-5 items, percentages must sum to 100),
  "waterDependency": {
    "usageLevel": "high|medium|low",
    "primaryUse": "main water uses",
    "annualVolumeEstimate": "estimated volume",
    "waterStressExposure": "exposure assessment",
    "notes": "additional context"
  },
  "geographicDependencies": [
    { "region": "region name", "dependencyType": "type of dependency", "criticality": "high|medium|low", "notes": "context" }
  ] (3-5 items),
  "supplyChainNotes": "brief supply chain overview",
  "climateRiskExposure": "brief climate risk assessment"
}

Use realistic, factual data based on the company's known operations. Be specific about sourcing regions and dependency levels.`;

      const response = await openaiClient.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.3,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        return res.status(500).json({ message: "No response from AI" });
      }

      const suggestion = JSON.parse(content);
      res.json(suggestion);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ message: "AI suggestion failed: " + message });
    }
  });

  // SEC EDGAR Filing routes
  app.get("/api/sec/search", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q || typeof q !== 'string' || q.trim().length < 1) {
        return res.status(400).json({ message: "Search query is required" });
      }
      const results = await secEdgar.searchCompanies(q.trim());
      res.json(results);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ message: "Failed to search companies: " + message });
    }
  });

  app.get("/api/sec/filings/:cik", async (req, res) => {
    try {
      const { cik } = req.params;
      const formType = (req.query.formType as string) || '10-K';
      const count = parseInt(req.query.count as string) || 20;
      const result = await secEdgar.getCompanyFilings(cik, formType, count);
      res.json(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ message: "Failed to fetch filings: " + message });
    }
  });

  app.get("/api/sec/filing-content/:cik/:accessionNumber/:document", async (req, res) => {
    try {
      const { cik, accessionNumber, document } = req.params;
      const content = await secEdgar.getFilingDocument(cik, accessionNumber, document);
      res.json({ content });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ message: "Failed to fetch filing content: " + message });
    }
  });

  app.post("/api/municipal-risk/analyze", async (req, res) => {
    try {
      const { cityName } = req.body;
      if (!cityName) {
        return res.status(400).json({ message: "City name is required" });
      }
      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({ message: "OpenAI API key is not configured." });
      }
      const OpenAI = (await import("openai")).default;
      const openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

      const prompt = `You are an expert in municipal climate risk assessment. Analyze the following city and provide a comprehensive climate risk assessment covering both physical risks and transition risks.

City: ${cityName}

Return a JSON object with this exact structure:
{
  "cityName": "City Name",
  "state": "State",
  "population": "population estimate string",
  "region": "geographic region (e.g., Southwest, Northeast)",
  "climateZone": "climate zone description",
  "physicalRisks": [
    {
      "hazard": "hazard name (e.g., Extreme Heat, Flooding, Wildfire, Hurricane, Drought, Sea Level Rise)",
      "severity": number 1-5,
      "likelihood": number 1-5,
      "timeframe": "Near-term (2025-2035)" or "Medium-term (2035-2050)" or "Long-term (2050-2100)",
      "description": "2-3 sentence description of this risk for the city",
      "projectedImpact": "specific projected impact with data if possible",
      "adaptationMeasures": "key adaptation strategies"
    }
  ],
  "transitionRisks": [
    {
      "category": "Policy & Legal" or "Technology" or "Market" or "Reputation" or "Workforce" or "Infrastructure",
      "risk": "specific risk name",
      "severity": number 1-5,
      "likelihood": number 1-5,
      "timeframe": "Near-term (2025-2035)" or "Medium-term (2035-2050)" or "Long-term (2050-2100)",
      "description": "2-3 sentence description",
      "financialImplication": "estimated financial impact or cost range",
      "mitigationStrategy": "key mitigation approach"
    }
  ],
  "overallPhysicalScore": number 1-5 (weighted average),
  "overallTransitionScore": number 1-5 (weighted average),
  "keyFindings": "3-4 sentence summary of the most critical climate risks for this municipality",
  "recommendations": ["recommendation 1", "recommendation 2", "recommendation 3", "recommendation 4", "recommendation 5"]
}

Provide 5-7 physical risks and 5-7 transition risks specific to this city's geography, economy, infrastructure, and demographics. Be specific and use real data where possible.`;

      const response = await openaiClient.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.7,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error("No response from AI");
      }

      const result = JSON.parse(content);
      res.json(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ message: "Failed to analyze municipal risk: " + message });
    }
  });

  app.post("/api/lca-calculator/analyze", async (req, res) => {
    try {
      const { productName, productDescription, quantity, quantityUnit, boundary, stages } = req.body;
      if (!productName) {
        return res.status(400).json({ message: "Product name is required" });
      }
      if (!boundary) {
        return res.status(400).json({ message: "System boundary is required" });
      }
      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({ message: "OpenAI API key is not configured." });
      }
      const OpenAI = (await import("openai")).default;
      const openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

      const stagesText = stages && stages.length > 0
        ? `The user has selected these specific lifecycle stages to include: ${stages.join(", ")}`
        : `Include all stages appropriate for the "${boundary}" system boundary`;

      const prompt = `You are an expert Life Cycle Assessment (LCA) analyst with deep knowledge of ISO 14040/14044 standards, ecoinvent database, USLCI data, and industrial ecology.

Perform a detailed LCA for the following product:
- Product: ${productName}
- ${productDescription ? `Description: ${productDescription}` : ''}
- Quantity: ${quantity || 1} ${quantityUnit || 'unit'}
- System Boundary: ${boundary}
- ${stagesText}

For EACH lifecycle stage included in the boundary, provide THREE scenarios:
1. LOW emissions scenario (best available technology, renewable energy, recycled materials, best practices)
2. MEDIUM emissions scenario (current industry average, conventional technology)
3. HIGH emissions scenario (worst-case conventional, coal-heavy grid, virgin materials, inefficient processes)

Return a JSON object with this EXACT structure:
{
  "productName": "Product Name",
  "functionalUnit": "e.g., 1 kg of product",
  "boundary": "${boundary}",
  "methodology": "Brief description of LCA methodology and key assumptions",
  "dataSources": ["List of key data sources used (e.g., ecoinvent 3.9, USLCI, EPA, literature)"],
  "stages": [
    {
      "name": "Stage name (e.g., Raw Material Extraction)",
      "description": "What this stage covers",
      "low": {
        "emissions_kg_co2e": 0.0,
        "energy_mj": 0.0,
        "cost_usd": 0.0,
        "description": "What makes this a low-emission option",
        "assumptions": "Key assumptions for this scenario"
      },
      "medium": {
        "emissions_kg_co2e": 0.0,
        "energy_mj": 0.0,
        "cost_usd": 0.0,
        "description": "Industry average practices",
        "assumptions": "Key assumptions for this scenario"
      },
      "high": {
        "emissions_kg_co2e": 0.0,
        "energy_mj": 0.0,
        "cost_usd": 0.0,
        "description": "What makes this a high-emission option",
        "assumptions": "Key assumptions for this scenario"
      }
    }
  ],
  "totals": {
    "low": { "emissions_kg_co2e": 0.0, "energy_mj": 0.0, "cost_usd": 0.0 },
    "medium": { "emissions_kg_co2e": 0.0, "energy_mj": 0.0, "cost_usd": 0.0 },
    "high": { "emissions_kg_co2e": 0.0, "energy_mj": 0.0, "cost_usd": 0.0 }
  },
  "recommendations": [
    "Actionable recommendation 1",
    "Actionable recommendation 2",
    "Actionable recommendation 3"
  ],
  "hotspots": [
    {
      "stage": "Stage name",
      "issue": "What makes this stage a hotspot",
      "reduction_potential": "Potential % reduction and how"
    }
  ]
}

Use realistic, research-backed emission factors. For energy, use primary energy. For costs, use approximate 2024 USD market prices. Ensure values are consistent—the total should equal the sum of all stages. Be specific and quantitative.`;

      const response = await openaiClient.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.4,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error("No response from AI");
      }

      const result = JSON.parse(content);
      res.json(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ message: "Failed to perform LCA analysis: " + message });
    }
  });

  // ============================================================
  // IEA Technology Readiness Level (TRL) Data API
  // Data Source: IEA ETP Clean Energy Technology Guide
  // https://www.iea.org/data-and-statistics/data-tools/etp-clean-energy-technology-guide
  // IEA uses an extended 11-level TRL scale for clean energy technologies
  // ============================================================

  const ieaTrlData = {
    source: {
      name: "IEA ETP Clean Energy Technology Guide",
      organization: "International Energy Agency (IEA)",
      url: "https://www.iea.org/data-and-statistics/data-tools/etp-clean-energy-technology-guide",
      description: "Interactive database tracking ~600 clean energy technology designs and components across the entire energy system, assessing technology maturity using TRL 1-11 scale.",
      citation: "IEA (2024), ETP Clean Energy Technology Guide, IEA, Paris",
      lastUpdated: "2024",
      coverage: "~600 individual technology designs and components",
      supportedBy: "Governments of Canada, Germany, Japan, and the European Commission"
    },
    trlScale: [
      { level: 1, name: "Initial idea", phase: "Concept", description: "Basic principles observed and reported. Technology concept and/or application formulated.", color: "#DC2626" },
      { level: 2, name: "Application formulated", phase: "Concept", description: "Technology concept and/or application formulated. Active R&D initiated with analytical and paper studies.", color: "#DC2626" },
      { level: 3, name: "Concept needs validation", phase: "Prototype", description: "Analytical and experimental critical function and/or proof of concept. Solution needs to be prototyped and applied.", color: "#EA580C" },
      { level: 4, name: "Early prototype", phase: "Prototype", description: "Component and/or system validation in laboratory environment. Prototype proven in test conditions.", color: "#EA580C" },
      { level: 5, name: "Large prototype", phase: "Prototype", description: "Laboratory scale, similar system validation in relevant environment. Components proven in deployment conditions.", color: "#D97706" },
      { level: 6, name: "Full prototype at scale", phase: "Prototype", description: "Engineering/pilot-scale, similar (prototypical) system demonstrated. Full prototype at scale proven at scale.", color: "#D97706" },
      { level: 7, name: "Pre-commercial demonstration", phase: "Demonstration", description: "System prototype demonstration in operational environment. Pre-commercial demonstration, working in expected conditions.", color: "#CA8A04" },
      { level: 8, name: "First-of-a-kind commercial", phase: "Demonstration", description: "System complete and qualified through test and demonstration. First-of-a-kind commercial system.", color: "#65A30D" },
      { level: 9, name: "Commercial operation in relevant environment", phase: "Early adoption", description: "System proven in operational environment. Commercially available, needs evolutionary improvement.", color: "#16A34A" },
      { level: 10, name: "Integration needed at scale", phase: "Early adoption", description: "Solution is commercial and competitive but needs integration efforts when deployed at scale.", color: "#0D9488" },
      { level: 11, name: "Proof of stability reached", phase: "Mature", description: "Predictable growth. Technology is mature and integrated into the wider system.", color: "#2563EB" }
    ],
    sectors: [
      "Power Generation", "Energy Storage", "Transport", "Industry", "Buildings", "Carbon Capture & Hydrogen", "Fuels & Bioenergy"
    ],
    technologies: [
      // Power Generation
      { id: "pg-1", name: "Utility-scale solar PV (crystalline silicon)", sector: "Power Generation", trl: 11, category: "Solar", description: "Conventional crystalline silicon PV modules for utility-scale power plants. Dominant commercial technology with >95% market share.", yearAssessed: 2024, netZeroRole: "Critical", keyPlayers: ["LONGi", "JinkoSolar", "Trina Solar", "Canadian Solar", "JA Solar"] },
      { id: "pg-2", name: "Perovskite solar cells", sector: "Power Generation", trl: 6, category: "Solar", description: "Next-generation PV using perovskite absorber layers. Promising efficiency gains and lower manufacturing costs, but durability challenges remain.", yearAssessed: 2024, netZeroRole: "High potential", keyPlayers: ["Oxford PV", "Swift Solar", "Tandem PV", "Saule Technologies"] },
      { id: "pg-3", name: "Perovskite-silicon tandem cells", sector: "Power Generation", trl: 5, category: "Solar", description: "Tandem architecture combining perovskite and silicon for efficiencies exceeding 30%. Lab record >33%.", yearAssessed: 2024, netZeroRole: "High potential", keyPlayers: ["Oxford PV", "LONGi", "CSEM", "Helmholtz-Zentrum Berlin"] },
      { id: "pg-4", name: "Cadmium telluride (CdTe) thin-film PV", sector: "Power Generation", trl: 11, category: "Solar", description: "Thin-film PV technology with strong market presence. Lower material costs and competitive efficiency.", yearAssessed: 2024, netZeroRole: "Important", keyPlayers: ["First Solar"] },
      { id: "pg-5", name: "Floating solar PV", sector: "Power Generation", trl: 9, category: "Solar", description: "Solar PV systems deployed on water bodies. Reduces land use conflicts and can improve panel efficiency through cooling.", yearAssessed: 2024, netZeroRole: "Moderate", keyPlayers: ["Ciel & Terre", "Sungrow", "Ocean Sun", "BayWa r.e."] },
      { id: "pg-6", name: "Building-integrated PV (BIPV)", sector: "Power Generation", trl: 9, category: "Solar", description: "PV materials integrated into building components (facades, windows, roofing). Dual function as building material and energy generator.", yearAssessed: 2024, netZeroRole: "Moderate", keyPlayers: ["Tesla", "SunPower", "Hanergy", "Onyx Solar"] },
      { id: "pg-7", name: "Onshore wind (conventional)", sector: "Power Generation", trl: 11, category: "Wind", description: "Large-scale horizontal-axis wind turbines for onshore deployment. Mature technology with ongoing incremental improvements.", yearAssessed: 2024, netZeroRole: "Critical", keyPlayers: ["Vestas", "Siemens Gamesa", "GE Vernova", "Goldwind", "Envision"] },
      { id: "pg-8", name: "Offshore wind (fixed-bottom)", sector: "Power Generation", trl: 10, category: "Wind", description: "Wind turbines installed on fixed foundations in shallow to moderate water depths (<60m). Rapidly scaling market.", yearAssessed: 2024, netZeroRole: "Critical", keyPlayers: ["Siemens Gamesa", "Vestas", "GE Vernova", "MingYang"] },
      { id: "pg-9", name: "Floating offshore wind", sector: "Power Generation", trl: 7, category: "Wind", description: "Wind turbines on floating platforms for deep water (>60m) deployment. Unlocks vast offshore wind resources.", yearAssessed: 2024, netZeroRole: "High potential", keyPlayers: ["Equinor (Hywind)", "Principle Power", "BW Ideol", "SBM Offshore"] },
      { id: "pg-10", name: "Airborne wind energy", sector: "Power Generation", trl: 4, category: "Wind", description: "Systems using tethered kites or drones to harvest wind energy at higher altitudes with stronger, more consistent winds.", yearAssessed: 2024, netZeroRole: "Niche", keyPlayers: ["Makani (Alphabet)", "Ampyx Power", "SkySails", "Kitemill"] },
      { id: "pg-11", name: "Small modular reactors (SMRs)", sector: "Power Generation", trl: 6, category: "Nuclear", description: "Factory-fabricated nuclear reactors with output typically <300 MWe. Various designs including light water, molten salt, and gas-cooled.", yearAssessed: 2024, netZeroRole: "High potential", keyPlayers: ["NuScale", "Rolls-Royce SMR", "X-energy", "GE Hitachi", "Kairos Power"] },
      { id: "pg-12", name: "Advanced nuclear fusion", sector: "Power Generation", trl: 3, category: "Nuclear", description: "Controlled nuclear fusion for power generation. Multiple approaches including magnetic confinement (tokamak) and inertial confinement.", yearAssessed: 2024, netZeroRole: "Transformative if achieved", keyPlayers: ["ITER", "Commonwealth Fusion", "TAE Technologies", "Helion Energy"] },
      { id: "pg-13", name: "Generation III+ nuclear reactors", sector: "Power Generation", trl: 10, category: "Nuclear", description: "Advanced fission reactors with enhanced safety features. EPR, AP1000, and VVER-1200 designs deployed or under construction.", yearAssessed: 2024, netZeroRole: "Important", keyPlayers: ["EDF", "Westinghouse", "Rosatom", "CGNPC", "KHNP"] },
      { id: "pg-14", name: "Concentrated solar power (CSP) with storage", sector: "Power Generation", trl: 9, category: "Solar", description: "Solar thermal power plants using mirrors/lenses to concentrate sunlight. Integrated thermal storage enables dispatchable power.", yearAssessed: 2024, netZeroRole: "Moderate", keyPlayers: ["Abengoa", "BrightSource", "SolarReserve", "ACWA Power"] },
      { id: "pg-15", name: "Enhanced geothermal systems (EGS)", sector: "Power Generation", trl: 5, category: "Geothermal", description: "Engineered subsurface heat exchangers in hot dry rock formations. Greatly expands geothermal potential beyond natural hydrothermal sites.", yearAssessed: 2024, netZeroRole: "High potential", keyPlayers: ["Fervo Energy", "Eavor", "Sage Geosystems", "Quaise Energy"] },
      { id: "pg-16", name: "Conventional geothermal (hydrothermal)", sector: "Power Generation", trl: 11, category: "Geothermal", description: "Power generation from naturally occurring hydrothermal resources. Well-established technology limited by geographic availability.", yearAssessed: 2024, netZeroRole: "Moderate", keyPlayers: ["Ormat Technologies", "Enel Green Power", "Calpine", "Star Energy"] },
      { id: "pg-17", name: "Ocean tidal stream energy", sector: "Power Generation", trl: 7, category: "Marine", description: "Underwater turbines that capture kinetic energy from tidal currents. Predictable resource but challenging marine environment.", yearAssessed: 2024, netZeroRole: "Niche", keyPlayers: ["Orbital Marine Power", "Simec Atlantis", "Nova Innovation", "Verdant Power"] },
      { id: "pg-18", name: "Wave energy converters", sector: "Power Generation", trl: 5, category: "Marine", description: "Devices that convert ocean wave motion into electricity. Multiple design concepts being tested at pre-commercial scale.", yearAssessed: 2024, netZeroRole: "Niche", keyPlayers: ["CorPower Ocean", "Carnegie Clean Energy", "Eco Wave Power", "CalWave"] },

      // Energy Storage
      { id: "es-1", name: "Lithium-ion batteries (NMC/NCA)", sector: "Energy Storage", trl: 11, category: "Batteries", description: "Nickel manganese cobalt and nickel cobalt aluminum lithium-ion chemistries. Dominant in EVs and stationary storage.", yearAssessed: 2024, netZeroRole: "Critical", keyPlayers: ["CATL", "LG Energy Solution", "BYD", "Panasonic", "Samsung SDI"] },
      { id: "es-2", name: "Lithium iron phosphate (LFP) batteries", sector: "Energy Storage", trl: 11, category: "Batteries", description: "LFP chemistry offering longer cycle life, improved safety, and lower cost, though lower energy density. Growing market share.", yearAssessed: 2024, netZeroRole: "Critical", keyPlayers: ["CATL", "BYD", "EVE Energy", "Gotion High-Tech"] },
      { id: "es-3", name: "Sodium-ion batteries", sector: "Energy Storage", trl: 8, category: "Batteries", description: "Batteries using abundant sodium instead of lithium. Lower energy density but cheaper materials. Emerging for stationary storage and low-cost EVs.", yearAssessed: 2024, netZeroRole: "Important", keyPlayers: ["CATL", "HiNa Battery", "Faradion (Reliance)", "Natron Energy"] },
      { id: "es-4", name: "Solid-state batteries", sector: "Energy Storage", trl: 5, category: "Batteries", description: "Batteries replacing liquid electrolyte with solid material. Promise higher energy density, faster charging, and improved safety.", yearAssessed: 2024, netZeroRole: "High potential", keyPlayers: ["QuantumScape", "Solid Power", "Toyota", "Samsung SDI", "ProLogium"] },
      { id: "es-5", name: "Vanadium redox flow batteries", sector: "Energy Storage", trl: 9, category: "Flow Batteries", description: "Flow batteries using vanadium electrolyte for long-duration energy storage. Scalable capacity independent of power rating.", yearAssessed: 2024, netZeroRole: "Moderate", keyPlayers: ["Invinity Energy", "Rongke Power", "CellCube", "VRB Energy"] },
      { id: "es-6", name: "Iron-air batteries", sector: "Energy Storage", trl: 6, category: "Batteries", description: "Batteries using iron anode and air cathode for ultra-low cost long-duration storage (100+ hours). Uses abundant, cheap materials.", yearAssessed: 2024, netZeroRole: "High potential", keyPlayers: ["Form Energy", "ESS Inc.", "Electric Iron"] },
      { id: "es-7", name: "Pumped-storage hydropower", sector: "Energy Storage", trl: 11, category: "Mechanical Storage", description: "Mature technology pumping water uphill to store energy. Largest form of grid energy storage globally (>160 GW installed).", yearAssessed: 2024, netZeroRole: "Important", keyPlayers: ["Voith Hydro", "Andritz", "GE Vernova", "Hitachi"] },
      { id: "es-8", name: "Compressed air energy storage (CAES)", sector: "Energy Storage", trl: 8, category: "Mechanical Storage", description: "Stores energy by compressing air in underground caverns. Two commercial plants operating, advanced adiabatic designs in development.", yearAssessed: 2024, netZeroRole: "Moderate", keyPlayers: ["Hydrostor", "Highview Power", "Corre Energy", "Apex CAES"] },
      { id: "es-9", name: "Gravity-based energy storage", sector: "Energy Storage", trl: 5, category: "Mechanical Storage", description: "Stores energy by lifting heavy masses using surplus electricity. Various designs using towers, mine shafts, and rail systems.", yearAssessed: 2024, netZeroRole: "Niche", keyPlayers: ["Energy Vault", "Gravitricity", "ARES North America"] },
      { id: "es-10", name: "Thermal energy storage (molten salt)", sector: "Energy Storage", trl: 9, category: "Thermal Storage", description: "Stores thermal energy in molten salt for CSP and industrial heat applications. Up to 10+ hours of storage demonstrated.", yearAssessed: 2024, netZeroRole: "Moderate", keyPlayers: ["Abengoa", "SolarReserve", "Aalborg CSP", "Malta Inc."] },

      // Transport
      { id: "tr-1", name: "Battery electric vehicles (passenger)", sector: "Transport", trl: 11, category: "Electric Vehicles", description: "Fully electric passenger cars and SUVs. Rapidly growing market share with improving range and declining costs.", yearAssessed: 2024, netZeroRole: "Critical", keyPlayers: ["Tesla", "BYD", "Volkswagen Group", "Hyundai/Kia", "BMW"] },
      { id: "tr-2", name: "Battery electric trucks (heavy-duty)", sector: "Transport", trl: 8, category: "Electric Vehicles", description: "Electric trucks for medium and heavy-duty freight. Battery range improving for shorter routes, charging infrastructure expanding.", yearAssessed: 2024, netZeroRole: "Important", keyPlayers: ["Tesla (Semi)", "Daimler (eActros)", "Volvo Trucks", "BYD", "Nikola"] },
      { id: "tr-3", name: "Hydrogen fuel cell vehicles (passenger)", sector: "Transport", trl: 9, category: "Hydrogen Vehicles", description: "Passenger cars powered by PEM fuel cells. Limited deployment due to fueling infrastructure and cost challenges.", yearAssessed: 2024, netZeroRole: "Moderate", keyPlayers: ["Toyota (Mirai)", "Hyundai (Nexo)", "Honda", "BMW"] },
      { id: "tr-4", name: "Hydrogen fuel cell trucks", sector: "Transport", trl: 7, category: "Hydrogen Vehicles", description: "Heavy-duty trucks using hydrogen fuel cells for long-haul freight. Prototype deployments underway for demanding long-distance applications.", yearAssessed: 2024, netZeroRole: "High potential", keyPlayers: ["Hyundai", "Nikola", "Daimler/Volvo (cellcentric)", "Toyota/Hino"] },
      { id: "tr-5", name: "Sustainable aviation fuel (HEFA)", sector: "Transport", trl: 9, category: "Aviation", description: "Hydroprocessed esters and fatty acids from waste oils/fats. Currently the most commercially advanced SAF pathway.", yearAssessed: 2024, netZeroRole: "Important", keyPlayers: ["Neste", "World Energy", "SkyNRG", "TotalEnergies"] },
      { id: "tr-6", name: "Sustainable aviation fuel (Power-to-Liquid / e-fuels)", sector: "Transport", trl: 6, category: "Aviation", description: "Synthetic kerosene produced from green hydrogen and captured CO₂. Potentially unlimited feedstock but high energy requirements.", yearAssessed: 2024, netZeroRole: "Critical long-term", keyPlayers: ["HIF Global", "Synhelion", "Norsk e-Fuel", "Infinium"] },
      { id: "tr-7", name: "Electric short-haul aircraft", sector: "Transport", trl: 5, category: "Aviation", description: "Battery-electric aircraft for short-range flights (<500 km). Weight limitations of batteries restrict range and passenger capacity.", yearAssessed: 2024, netZeroRole: "Moderate", keyPlayers: ["Heart Aerospace", "Eviation (Alice)", "Joby Aviation", "Lilium"] },
      { id: "tr-8", name: "Ammonia-fueled shipping", sector: "Transport", trl: 5, category: "Shipping", description: "Ship engines running on ammonia as a zero-carbon fuel. Engine development and bunkering infrastructure in early stages.", yearAssessed: 2024, netZeroRole: "High potential", keyPlayers: ["MAN Energy Solutions", "Wärtsilä", "Samsung Heavy Industries", "NYK Line"] },
      { id: "tr-9", name: "Methanol-fueled shipping", sector: "Transport", trl: 8, category: "Shipping", description: "Ship engines using green methanol as alternative marine fuel. Growing fleet of methanol-capable vessels ordered.", yearAssessed: 2024, netZeroRole: "Important", keyPlayers: ["Maersk", "MAN Energy Solutions", "Methanex", "Stena Line"] },
      { id: "tr-10", name: "Electric buses", sector: "Transport", trl: 10, category: "Electric Vehicles", description: "Battery electric buses for urban transit. Widespread deployment globally, particularly in China. Cost-competitive in many markets.", yearAssessed: 2024, netZeroRole: "Important", keyPlayers: ["BYD", "Yutong", "Proterra", "Solaris", "NFI Group"] },

      // Industry
      { id: "in-1", name: "Green hydrogen for steelmaking (DRI-EAF)", sector: "Industry", trl: 7, category: "Steel", description: "Direct reduced iron using green hydrogen followed by electric arc furnace steelmaking. Eliminates coal dependency in primary steel.", yearAssessed: 2024, netZeroRole: "Critical", keyPlayers: ["SSAB/HYBRIT", "H2 Green Steel", "ArcelorMittal", "thyssenkrupp", "Salzgitter"] },
      { id: "in-2", name: "Electric arc furnace (recycled steel)", sector: "Industry", trl: 11, category: "Steel", description: "Steel production from scrap using electric arc furnaces. Lower emissions when powered by clean electricity. ~30% of global steel.", yearAssessed: 2024, netZeroRole: "Important", keyPlayers: ["Nucor", "Steel Dynamics", "CMC", "Gerdau"] },
      { id: "in-3", name: "CCUS in cement production", sector: "Industry", trl: 7, category: "Cement", description: "Carbon capture applied to cement kilns. Critical pathway as ~60% of cement CO₂ emissions come from process reactions (calcination).", yearAssessed: 2024, netZeroRole: "Critical", keyPlayers: ["HeidelbergCement", "Holcim", "CEMEX", "Norcem (Brevik)"] },
      { id: "in-4", name: "Novel clinker substitutes in cement", sector: "Industry", trl: 6, category: "Cement", description: "Low-carbon alternatives to Portland cement clinker including calcined clay, geopolymers, and carbonation-based cements.", yearAssessed: 2024, netZeroRole: "Important", keyPlayers: ["Holcim", "Solidia Technologies", "CarbonCure", "Brimstone"] },
      { id: "in-5", name: "Electrification of industrial heat (low-temp)", sector: "Industry", trl: 9, category: "Industrial Heat", description: "Electric heating technologies for processes below 400°C including heat pumps, resistance heating, and infrared. Well-established for low-temperature.", yearAssessed: 2024, netZeroRole: "Important", keyPlayers: ["Siemens", "ABB", "Oilon", "Vattenfall"] },
      { id: "in-6", name: "Electrification of industrial heat (high-temp)", sector: "Industry", trl: 5, category: "Industrial Heat", description: "Electric technologies for process heat above 1000°C. Includes plasma torches, induction, microwave, and electric kilns.", yearAssessed: 2024, netZeroRole: "High potential", keyPlayers: ["Linde", "SMS group", "SGL Carbon", "Boston Metal"] },
      { id: "in-7", name: "Green hydrogen for ammonia production", sector: "Industry", trl: 8, category: "Chemicals", description: "Ammonia synthesis using electrolytic green hydrogen instead of natural gas-derived hydrogen. Direct replacement in Haber-Bosch process.", yearAssessed: 2024, netZeroRole: "Critical", keyPlayers: ["Yara", "CF Industries", "Fortescue", "ACME Group", "ThyssenKrupp Uhde"] },
      { id: "in-8", name: "Electrochemical ethylene production", sector: "Industry", trl: 3, category: "Chemicals", description: "Direct electrochemical conversion of CO₂ and water to ethylene using renewable electricity. Could replace steam cracking.", yearAssessed: 2024, netZeroRole: "Transformative if achieved", keyPlayers: ["Twelve (Opus 12)", "Dioxycle", "Various universities"] },
      { id: "in-9", name: "Mechanical/chemical recycling of plastics", sector: "Industry", trl: 8, category: "Chemicals", description: "Advanced recycling of plastic waste through pyrolysis, depolymerization, or dissolution to recover monomers or produce feedstock.", yearAssessed: 2024, netZeroRole: "Important", keyPlayers: ["BASF (ChemCycling)", "Eastman", "PureCycle", "Plastic Energy", "Agilyx"] },
      { id: "in-10", name: "Inert anode aluminum smelting", sector: "Industry", trl: 5, category: "Metals", description: "Aluminum smelting using inert (non-carbon) anodes that emit oxygen instead of CO₂. Eliminates direct process emissions.", yearAssessed: 2024, netZeroRole: "Important", keyPlayers: ["ELYSIS (Alcoa/Rio Tinto)", "Rusal"] },

      // Buildings
      { id: "bu-1", name: "Air-source heat pumps", sector: "Buildings", trl: 11, category: "Heating & Cooling", description: "Mature technology for space heating and cooling using ambient air as heat source. COP of 3-5 for modern units.", yearAssessed: 2024, netZeroRole: "Critical", keyPlayers: ["Daikin", "Mitsubishi Electric", "Carrier", "Bosch", "Viessmann"] },
      { id: "bu-2", name: "Ground-source heat pumps", sector: "Buildings", trl: 11, category: "Heating & Cooling", description: "Heat pumps using stable ground temperatures. Higher efficiency than air-source but higher installation cost. COP of 4-6.", yearAssessed: 2024, netZeroRole: "Important", keyPlayers: ["NIBE", "WaterFurnace", "Vaillant", "Stiebel Eltron"] },
      { id: "bu-3", name: "District heating with large heat pumps", sector: "Buildings", trl: 9, category: "Heating & Cooling", description: "Large-scale heat pumps (>1 MW) integrated into district heating networks. Using waste heat, rivers, or seawater as heat sources.", yearAssessed: 2024, netZeroRole: "Important", keyPlayers: ["Johnson Controls", "MAN Energy Solutions", "Siemens", "Star Refrigeration"] },
      { id: "bu-4", name: "Hydrogen-ready boilers", sector: "Buildings", trl: 7, category: "Heating & Cooling", description: "Boilers designed to run on hydrogen or hydrogen-natural gas blends. Enables potential gas network decarbonization.", yearAssessed: 2024, netZeroRole: "Moderate", keyPlayers: ["Bosch", "Vaillant", "Worcester Bosch", "Baxi"] },
      { id: "bu-5", name: "Vacuum insulation panels (VIPs)", sector: "Buildings", trl: 9, category: "Insulation", description: "Ultra-thin insulation panels with thermal conductivity 5-10x better than conventional materials. Space-saving for retrofits.", yearAssessed: 2024, netZeroRole: "Moderate", keyPlayers: ["va-Q-tec", "Panasonic", "Porextherm", "Kingspan"] },
      { id: "bu-6", name: "Smart building energy management", sector: "Buildings", trl: 10, category: "Controls", description: "AI-driven building automation systems optimizing HVAC, lighting, and energy use. Cloud-connected with predictive capabilities.", yearAssessed: 2024, netZeroRole: "Important", keyPlayers: ["Siemens", "Honeywell", "Johnson Controls", "Schneider Electric", "Google Nest"] },
      { id: "bu-7", name: "Electrochromic (smart) windows", sector: "Buildings", trl: 9, category: "Building Envelope", description: "Windows that can be electronically tinted to control heat gain and glare. Reduces cooling loads by 20-30%.", yearAssessed: 2024, netZeroRole: "Moderate", keyPlayers: ["View Inc.", "SageGlass (Saint-Gobain)", "ChromoGenics", "Kinestral"] },
      { id: "bu-8", name: "Phase change materials for thermal storage", sector: "Buildings", trl: 7, category: "Thermal Storage", description: "Materials that absorb/release heat during phase transitions (solid-liquid). Integrated into building materials for passive temperature regulation.", yearAssessed: 2024, netZeroRole: "Moderate", keyPlayers: ["Phase Change Energy Solutions", "Entropy Solutions", "Rubitherm", "PureTemp"] },

      // Carbon Capture & Hydrogen
      { id: "ch-1", name: "Alkaline water electrolysis", sector: "Carbon Capture & Hydrogen", trl: 9, category: "Electrolysis", description: "Mature electrolysis technology for green hydrogen production. Well-proven at scale with large stack sizes available.", yearAssessed: 2024, netZeroRole: "Critical", keyPlayers: ["NEL Hydrogen", "thyssenkrupp Uhde", "McPhy", "John Cockerill"] },
      { id: "ch-2", name: "PEM electrolysis", sector: "Carbon Capture & Hydrogen", trl: 9, category: "Electrolysis", description: "Proton exchange membrane electrolysis for green hydrogen. Fast response time, compact design, suited for variable renewable input.", yearAssessed: 2024, netZeroRole: "Critical", keyPlayers: ["ITM Power", "Plug Power", "Siemens Energy", "Cummins"] },
      { id: "ch-3", name: "Solid oxide electrolysis (SOEC)", sector: "Carbon Capture & Hydrogen", trl: 7, category: "Electrolysis", description: "High-temperature electrolysis using solid oxide cells. Highest efficiency when waste heat is available. Also enables co-electrolysis (H₂O + CO₂).", yearAssessed: 2024, netZeroRole: "High potential", keyPlayers: ["Bloom Energy", "Topsoe", "Sunfire", "Ceres Power"] },
      { id: "ch-4", name: "Anion exchange membrane (AEM) electrolysis", sector: "Carbon Capture & Hydrogen", trl: 5, category: "Electrolysis", description: "Emerging electrolysis technology combining benefits of alkaline (no precious metals) and PEM (compact, responsive). Lower cost potential.", yearAssessed: 2024, netZeroRole: "Moderate", keyPlayers: ["Enapter", "Iridium-free startups"] },
      { id: "ch-5", name: "Post-combustion CO₂ capture (amine-based)", sector: "Carbon Capture & Hydrogen", trl: 9, category: "Carbon Capture", description: "Captures CO₂ from flue gas using amine solvents. Most commercially deployed CCUS technology. Applied to power and industrial plants.", yearAssessed: 2024, netZeroRole: "Critical", keyPlayers: ["Shell Cansolv", "Fluor", "MHI", "Aker Carbon Capture"] },
      { id: "ch-6", name: "Direct air capture (solid sorbent)", sector: "Carbon Capture & Hydrogen", trl: 6, category: "Carbon Removal", description: "Captures CO₂ directly from ambient air using solid sorbent materials. Higher energy efficiency potential but lower throughput per unit.", yearAssessed: 2024, netZeroRole: "High potential", keyPlayers: ["Climeworks", "Global Thermostat", "Heirloom Carbon"] },
      { id: "ch-7", name: "Direct air capture (liquid solvent)", sector: "Carbon Capture & Hydrogen", trl: 6, category: "Carbon Removal", description: "DAC using liquid solvent (potassium hydroxide solution). Can process very large air volumes. High temperature heat requirement for regeneration.", yearAssessed: 2024, netZeroRole: "High potential", keyPlayers: ["Carbon Engineering (Oxy)", "1PointFive"] },
      { id: "ch-8", name: "Bioenergy with CCS (BECCS)", sector: "Carbon Capture & Hydrogen", trl: 7, category: "Carbon Removal", description: "Combines bioenergy combustion/processing with CO₂ capture for net-negative emissions. Biomass sustainability is key constraint.", yearAssessed: 2024, netZeroRole: "Important", keyPlayers: ["Drax", "Stockholm Exergi", "Illinois Industrial CCS"] },
      { id: "ch-9", name: "Blue hydrogen (SMR + CCS)", sector: "Carbon Capture & Hydrogen", trl: 9, category: "Hydrogen Production", description: "Hydrogen from natural gas reforming with carbon capture. Bridge technology while green hydrogen scales. Capture rates 90-95%.", yearAssessed: 2024, netZeroRole: "Moderate (transition)", keyPlayers: ["Air Liquide", "Linde", "Shell", "Air Products"] },
      { id: "ch-10", name: "CO₂ mineralization/carbonation", sector: "Carbon Capture & Hydrogen", trl: 7, category: "Carbon Utilization", description: "Permanently stores CO₂ by reacting it with minerals to form stable carbonates. Can be applied to concrete curing or mine tailings.", yearAssessed: 2024, netZeroRole: "Moderate", keyPlayers: ["CarbonCure", "Solidia", "44.01", "Carbfix"] },

      // Fuels & Bioenergy
      { id: "fb-1", name: "Cellulosic ethanol", sector: "Fuels & Bioenergy", trl: 8, category: "Biofuels", description: "Ethanol produced from non-food biomass (wood, agricultural residues, grasses). Avoids food-vs-fuel debate. Higher production costs.", yearAssessed: 2024, netZeroRole: "Moderate", keyPlayers: ["POET-DSM", "Clariant", "Raízen", "Versalis"] },
      { id: "fb-2", name: "Renewable diesel / HVO", sector: "Fuels & Bioenergy", trl: 11, category: "Biofuels", description: "Hydroprocessed vegetable oil / hydrotreated renewable diesel from waste fats and oils. Drop-in fuel compatible with existing diesel engines.", yearAssessed: 2024, netZeroRole: "Important", keyPlayers: ["Neste", "Diamond Green Diesel", "TotalEnergies", "Eni"] },
      { id: "fb-3", name: "Green hydrogen-based e-methanol", sector: "Fuels & Bioenergy", trl: 7, category: "E-fuels", description: "Methanol synthesized from green hydrogen and captured CO₂. Versatile fuel and chemical feedstock. Growing interest for shipping.", yearAssessed: 2024, netZeroRole: "Important", keyPlayers: ["European Energy", "Ørsted", "Maersk", "Liquid Wind"] },
      { id: "fb-4", name: "Green ammonia (as energy carrier)", sector: "Fuels & Bioenergy", trl: 7, category: "E-fuels", description: "Ammonia produced from green hydrogen as a hydrogen carrier and direct fuel. High energy density, established transport infrastructure.", yearAssessed: 2024, netZeroRole: "High potential", keyPlayers: ["Yara", "Fortescue", "ACME Group", "CF Industries"] },
      { id: "fb-5", name: "Biogas upgrading to biomethane", sector: "Fuels & Bioenergy", trl: 10, category: "Biogas", description: "Purification of raw biogas from anaerobic digestion to pipeline-quality biomethane. Multiple upgrading technologies (membrane, PSA, water scrubbing).", yearAssessed: 2024, netZeroRole: "Moderate", keyPlayers: ["Wärtsilä", "Air Liquide", "Greenlane Renewables", "EnviTec Biogas"] },
      { id: "fb-6", name: "Fischer-Tropsch e-fuels (Power-to-Liquid)", sector: "Fuels & Bioenergy", trl: 6, category: "E-fuels", description: "Liquid hydrocarbons synthesized from green H₂ and CO₂ via Fischer-Tropsch process. Produces drop-in aviation and diesel fuels.", yearAssessed: 2024, netZeroRole: "Critical long-term", keyPlayers: ["Synhelion", "HIF Global", "Infinium", "INERATEC"] },
      { id: "fb-7", name: "Advanced biodiesel (algae-based)", sector: "Fuels & Bioenergy", trl: 4, category: "Biofuels", description: "Biodiesel from microalgae cultivation. Very high yield per hectare but production costs remain high. Requires breakthroughs in cultivation economics.", yearAssessed: 2024, netZeroRole: "Niche", keyPlayers: ["Sapphire Energy", "Algenol", "Solazyme", "Euglena Co."] }
    ]
  };

  app.get("/api/trl/technologies", (req, res) => {
    try {
      const { sector, minTrl, maxTrl, category, search, phase } = req.query;
      let filtered = [...ieaTrlData.technologies];

      if (sector && typeof sector === 'string' && sector !== 'all') {
        filtered = filtered.filter(t => t.sector === sector);
      }
      if (minTrl) {
        filtered = filtered.filter(t => t.trl >= parseInt(minTrl as string));
      }
      if (maxTrl) {
        filtered = filtered.filter(t => t.trl <= parseInt(maxTrl as string));
      }
      if (category && typeof category === 'string' && category !== 'all') {
        filtered = filtered.filter(t => t.category === category);
      }
      if (phase && typeof phase === 'string' && phase !== 'all') {
        const phaseMap: Record<string, number[]> = {
          "Concept": [1, 2],
          "Prototype": [3, 4, 5, 6],
          "Demonstration": [7, 8],
          "Early adoption": [9, 10],
          "Mature": [11]
        };
        const levels = phaseMap[phase] || [];
        filtered = filtered.filter(t => levels.includes(t.trl));
      }
      if (search && typeof search === 'string') {
        const q = search.toLowerCase();
        filtered = filtered.filter(t =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.keyPlayers.some(p => p.toLowerCase().includes(q))
        );
      }

      res.json({
        source: ieaTrlData.source,
        trlScale: ieaTrlData.trlScale,
        sectors: ieaTrlData.sectors,
        technologies: filtered,
        totalCount: ieaTrlData.technologies.length,
        filteredCount: filtered.length,
        categories: Array.from(new Set(ieaTrlData.technologies.map(t => t.category))).sort(),
        sectorBreakdown: ieaTrlData.sectors.map(s => ({
          sector: s,
          count: ieaTrlData.technologies.filter(t => t.sector === s).length,
          avgTrl: parseFloat((ieaTrlData.technologies.filter(t => t.sector === s).reduce((sum, t) => sum + t.trl, 0) / ieaTrlData.technologies.filter(t => t.sector === s).length).toFixed(1))
        })),
        trlDistribution: Array.from({ length: 11 }, (_, i) => ({
          level: i + 1,
          count: ieaTrlData.technologies.filter(t => t.trl === i + 1).length
        }))
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ message: "Failed to fetch TRL data: " + message });
    }
  });

  app.post("/api/trl/analyze", async (req, res) => {
    try {
      const { sector, companyDescription, technologies: selectedTechIds } = req.body;
      if (!sector && !companyDescription) {
        return res.status(400).json({ message: "Please provide a sector or company description for analysis" });
      }
      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({ message: "OpenAI API key is not configured." });
      }

      const relevantTechs = selectedTechIds?.length
        ? ieaTrlData.technologies.filter((t: any) => selectedTechIds.includes(t.id))
        : sector
          ? ieaTrlData.technologies.filter((t: any) => t.sector === sector)
          : ieaTrlData.technologies;

      const techSummary = relevantTechs.map((t: any) => `- ${t.name} (TRL ${t.trl}, ${t.category}, ${t.sector}): ${t.description} Net-zero role: ${t.netZeroRole}. Key players: ${t.keyPlayers.join(', ')}.`).join('\n');

      const OpenAI = (await import("openai")).default;
      const openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

      const prompt = `You are an expert in clean energy technology assessment and climate risk analysis. Using the IEA ETP Clean Energy Technology Guide data below, provide a comprehensive technology risk and opportunity analysis.

${companyDescription ? `Company/Organization Context: ${companyDescription}` : ''}
${sector ? `Sector Focus: ${sector}` : ''}

IEA ETP Technology Readiness Data (Source: IEA ETP Clean Energy Technology Guide, 2024):
${techSummary}

Provide a JSON response with:
{
  "executiveSummary": "2-3 paragraph executive summary of the technology landscape and risk/opportunity profile",
  "technologyRiskAssessment": [
    {
      "technologyName": "name from data",
      "trl": number,
      "riskLevel": "Low|Medium|High|Critical",
      "riskScore": number (1-10),
      "riskType": "Deployment|Obsolescence|Cost|Supply Chain|Regulatory|Integration",
      "timeHorizon": "Short-term (1-3 years)|Medium-term (3-7 years)|Long-term (7-15 years)",
      "assessment": "2-3 sentence risk assessment",
      "opportunities": "key opportunities if this technology matures",
      "mitigationStrategies": ["strategy1", "strategy2"]
    }
  ],
  "sectorOutlook": {
    "overallReadiness": "Early Stage|Developing|Advancing|Mature",
    "keyTrends": ["trend1", "trend2", "trend3"],
    "criticalGaps": ["gap1", "gap2"],
    "investmentPriorities": ["priority1", "priority2", "priority3"],
    "timelineToCommercialization": "summary of when key technologies will reach commercial maturity"
  },
  "strategicRecommendations": [
    {
      "priority": "High|Medium|Low",
      "recommendation": "specific recommendation",
      "rationale": "why this matters",
      "relatedTechnologies": ["tech names"]
    }
  ],
  "climateImpactAssessment": {
    "emissionReductionPotential": "estimated total emission reduction potential",
    "criticalPathTechnologies": ["technologies most critical for net-zero"],
    "innovationGaps": ["areas where R&D breakthroughs are most needed"],
    "policyImplications": ["relevant policy considerations"]
  }
}`;

      const response = await openaiClient.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.4,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error("No response from AI");
      }

      const result = JSON.parse(content);
      result.dataSource = ieaTrlData.source;
      result.technologiesAnalyzed = relevantTechs.length;
      result.analyzedAt = new Date().toISOString();
      res.json(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ message: "Failed to perform TRL analysis: " + message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
