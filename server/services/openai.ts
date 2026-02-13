import OpenAI from "openai";
import { sectorDataService } from "./sectorData";
import type { SectorProfile, SectorScenarioImpact } from "@shared/schema";
import { getWeightsForRisk, calculateResidualRisk, mapIndustryToSector, getCategoryGroup, type RiskWeights } from "./sectorWeightings";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || "default_key" 
});

interface SectorContext {
  profile: SectorProfile | null | undefined;
  scenarioImpacts: SectorScenarioImpact[];
}

export interface RiskAnalysisRequest {
  industry: string;
  carbonIntensity: string;
  geography: string[];
  revenue: string;
  companyName: string;
  category: string;
  subcategory: string;
  assessmentFramework?: string; // 'standard' or 'advanced'
  sectorContext?: SectorContext; // Real sector data from Climate TRACE, World Bank, NGFS
}

export interface RiskAnalysisResponse {
  category: string;
  subcategory: string;
  // Standard framework metrics
  impactScore?: number;
  likelihoodScore?: number;
  vulnerabilityScore?: number;
  // Advanced framework metrics for risks
  exposureScore?: number;
  strategicMisalignmentScore?: number;
  mitigationReadinessScore?: number;
  // Advanced framework metrics for opportunities
  marketReadinessScore?: number;
  valueCreationScore?: number;
  feasibilityScore?: number;
  
  overallRisk: number;
  narrative: string;
  reasoning: string;
  peerComparison: {
    peers: string[];
    rankings: {
      impact?: number; // 1-6 ranking among peers (1=best, 6=worst)
      likelihood?: number;
      vulnerability?: number;
      exposure?: number;
      strategicMisalignment?: number;
      mitigationReadiness?: number;
      marketReadiness?: number;
      valueCreation?: number;
      feasibility?: number;
    };
    rationale: string;
  };
  sources: Array<{ title: string; url: string; organization: string; relevance: string }> | string[];
}

export async function generateRiskAnalysis(request: RiskAnalysisRequest): Promise<RiskAnalysisResponse> {
  try {
    const framework = request.assessmentFramework || 'standard';
    const isRisk = request.category !== 'opportunity';
    
    // Build sector context string from real data if available
    let sectorContextStr = "";
    if (request.sectorContext?.profile) {
      const p = request.sectorContext.profile;
      sectorContextStr = `
REAL SECTOR DATA (from Climate TRACE, World Bank, NGFS - use these facts):
Sector: ${p.sectorName}
- Annual Emissions: ${p.annualEmissionsMtCo2?.toLocaleString() || 'N/A'} Mt CO2e
- Emissions Intensity: ${p.emissionsIntensity || 'N/A'} tCO2/$M revenue
- Emissions Trend: ${p.emissionsTrend || 'N/A'}
- GDP Contribution: ${p.gdpContributionPercent || 'N/A'}% of global GDP
- Transition Risk Level: ${p.transitionRiskLevel || 'N/A'}
- Key Risks: ${p.keyRisks?.join(', ') || 'N/A'}
- Key Opportunities: ${p.keyOpportunities?.join(', ') || 'N/A'}
`;
      // Add scenario impacts if available
      if (request.sectorContext.scenarioImpacts?.length > 0) {
        const nz2050 = request.sectorContext.scenarioImpacts.find(s => s.scenarioName === 'Net Zero 2050' && s.year === 2030);
        const cp = request.sectorContext.scenarioImpacts.find(s => s.scenarioName === 'Current Policies' && s.year === 2030);
        if (nz2050 || cp) {
          sectorContextStr += `
NGFS Scenario Projections (2030):
`;
          if (nz2050) {
            sectorContextStr += `- Net Zero 2050: GDP Impact ${nz2050.gdpImpactPercent}%, Carbon Price $${nz2050.carbonPriceUsd}/tCO2, Investment Needed $${nz2050.investmentRequiredBillions}B
`;
          }
          if (cp) {
            sectorContextStr += `- Current Policies: GDP Impact ${cp.gdpImpactPercent}%, Stranded Asset Risk ${cp.strandedAssetRiskPercent}%
`;
          }
        }
      }
    }

    let prompt = `
You are a climate risk analysis expert. Analyze the following business for climate transition risks/opportunities based on TCFD framework.

Company: ${request.companyName}
Business Context:
- Industry: ${request.industry}
- Carbon Intensity: ${request.carbonIntensity}
- Geographic Exposure: ${request.geography.join(', ')}
- Revenue Size: ${request.revenue}
${sectorContextStr}
Risk/Opportunity Category: ${request.category}
Specific Risk/Opportunity: ${request.subcategory}

This subcategory was specifically generated for ${request.companyName} based on their industry (${request.industry}) and business context. Provide analysis that is highly specific to this company's unique situation within this risk/opportunity area.${sectorContextStr ? ' USE THE REAL SECTOR DATA PROVIDED ABOVE to ground your analysis in factual industry metrics.' : ''}
`;

    if (framework === 'advanced') {
      if (isRisk) {
        prompt += `
Provide analysis in JSON format using the ADVANCED RISK FRAMEWORK with:
{
  "exposureScore": (1-5 integer, where 5 is highest exposure to this risk),
  "vulnerabilityScore": (1-5 integer, where 5 is most vulnerable/least adaptive capacity),
  "strategicMisalignmentScore": (1-5 integer, where 5 is complete misalignment with low-carbon transition),
  "mitigationReadinessScore": (1-5 integer, where 1 is fully prepared/5 is completely unprepared),
  "overallRisk": (calculated weighted score as decimal),
  "narrative": "Company-specific 2-3 sentence summary addressing ${request.companyName}'s unique exposure, vulnerability, strategic position, and mitigation readiness",
  "reasoning": "Detailed company-specific explanation for each of the four metrics (exposure, vulnerability, strategic misalignment, mitigation readiness), referencing ${request.companyName}'s business model and market position",
  "peerComparison": {
    "peers": ["list of 5 major companies in the same industry/sector as realistic peers"],
    "rankings": {
      "exposure": (integer 1-6, where 1=lowest exposure, 6=highest exposure among peers),
      "vulnerability": (integer 1-6, where 1=least vulnerable, 6=most vulnerable),
      "strategicMisalignment": (integer 1-6, where 1=best aligned, 6=most misaligned),
      "mitigationReadiness": (integer 1-6, where 1=most prepared, 6=least prepared)
    },
    "rationale": "Explain ${request.companyName}'s relative position for exposure, vulnerability, strategic alignment, and mitigation readiness"
  },
  "sources": [SOURCE FORMAT BELOW]
}

METRIC DEFINITIONS FOR RISKS:
- Exposure: Degree of direct exposure to this specific climate risk factor
- Vulnerability: Inherent susceptibility and adaptive capacity
- Strategic Misalignment: How misaligned current strategy is with low-carbon transition
- Mitigation Readiness: Preparedness and capability to mitigate this risk (1=ready, 5=unprepared)
`;
      } else {
        prompt += `
Provide analysis in JSON format using the ADVANCED OPPORTUNITY FRAMEWORK with:
{
  "strategicMisalignmentScore": (1-5 integer, where 1 is fully aligned opportunity/5 is completely misaligned),
  "marketReadinessScore": (1-5 integer, where 5 is market is ready now/1 is not ready),
  "valueCreationScore": (1-5 integer, where 5 is highest value creation potential),
  "feasibilityScore": (1-5 integer, where 5 is most feasible to execute),
  "overallRisk": (calculated weighted opportunity score as decimal, higher is better),
  "narrative": "Company-specific 2-3 sentence summary addressing ${request.companyName}'s strategic fit, market conditions, value potential, and execution feasibility",
  "reasoning": "Detailed company-specific explanation for each of the four metrics (strategic alignment, market readiness, value creation, feasibility), referencing ${request.companyName}'s capabilities and market position",
  "peerComparison": {
    "peers": ["list of 5 major companies in the same industry/sector as realistic peers"],
    "rankings": {
      "strategicMisalignment": (integer 1-6, where 1=best strategic fit, 6=worst fit),
      "marketReadiness": (integer 1-6, where 1=lowest market readiness, 6=highest market readiness),
      "valueCreation": (integer 1-6, where 1=lowest value potential, 6=highest value potential),
      "feasibility": (integer 1-6, where 1=least feasible, 6=most feasible)
    },
    "rationale": "Explain ${request.companyName}'s relative position for strategic fit, market readiness, value creation, and feasibility"
  },
  "sources": [SOURCE FORMAT BELOW]
}

METRIC DEFINITIONS FOR OPPORTUNITIES:
- Strategic Misalignment: How well opportunity aligns with current strategy (1=perfect fit, 5=poor fit)
- Market Readiness: Current market readiness and demand for this opportunity
- Value Creation: Potential financial and strategic value
- Feasibility: Technical and organizational capability to execute
`;
      }
    } else {
      // Standard framework
      prompt += `
Provide analysis in JSON format using the STANDARD FRAMEWORK with:
{
  "impactScore": (1-5 integer, where 5 is highest impact),
  "likelihoodScore": (1-5 integer, where 5 is most likely),
  "vulnerabilityScore": (1-5 integer, where 5 is most vulnerable/exposed),
  "overallRisk": (calculated weighted score as decimal),
  "narrative": "Company-specific 2-3 sentence summary addressing ${request.companyName}'s unique situation and context, including relevant time horizon (short 0-3y, medium 3-10y, long 10y+)",
  "reasoning": "Detailed company-specific explanation for the impact, likelihood, and vulnerability scores, referencing ${request.companyName}'s business model and market position",
  "peerComparison": {
    "peers": ["list of 5 major companies in the same industry/sector as realistic peers"],
    "rankings": {
      "impact": (integer 1-6, where 1=lowest impact among peers, 6=highest impact),
      "likelihood": (integer 1-6, where 1=lowest likelihood among peers, 6=highest likelihood),
      "vulnerability": (integer 1-6, where 1=least vulnerable among peers, 6=most vulnerable)
    },
    "rationale": "Explain ${request.companyName}'s relative position compared to the peer group for this specific risk category"
  },
  "sources": [SOURCE FORMAT BELOW]
}
`;
    }

    prompt += `
CRITICAL REQUIREMENTS FOR SOURCES:
- Provide 3-4 specific, real, authoritative sources that directly inform your analysis
- Sources must be from recognized organizations: TCFD, IEA, IPCC, government agencies, major consultancies (McKinsey, BCG, Deloitte), academic institutions, or industry associations
- Each source must have a real, working URL
- Format: [{"title": "...", "url": "...", "organization": "...", "relevance": "..."}]

Consider:
- Company-specific factors unique to ${request.companyName}
- Sector-specific risk multipliers based on carbon intensity
- Geographic regulatory environments and physical risk exposure
- Time horizon implications (short 0-3y, medium 3-10y, long 10y+)
- Latest policy developments, technology trends, and market shifts
- TCFD, ISSB, and other climate disclosure framework guidance

Provide realistic scores based on current climate policy and market trends. Make the analysis specific to ${request.companyName} rather than generic industry commentary.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    // Build response based on framework
    const baseResponse: RiskAnalysisResponse = {
      category: request.category,
      subcategory: request.subcategory,
      overallRisk: Math.max(0, Math.min(5, result.overallRisk || 3)),
      narrative: result.narrative || "Analysis pending",
      reasoning: result.reasoning || "Detailed reasoning will be provided once analysis is complete",
      peerComparison: {
        peers: Array.isArray(result.peerComparison?.peers) ? result.peerComparison.peers.slice(0, 5) : [],
        rankings: {},
        rationale: result.peerComparison?.rationale || "Peer comparison analysis will be provided once complete"
      },
      sources: Array.isArray(result.sources) ? result.sources.slice(0, 4).map((source: any) => {
        if (typeof source === 'string') {
          return { title: "Climate Risk Resource", url: source, organization: "Climate Authority", relevance: "General climate risk guidance" };
        }
        return {
          title: source.title || "Climate Risk Resource",
          url: source.url || "#",
          organization: source.organization || "Climate Authority",
          relevance: source.relevance || "Supports risk analysis"
        };
      }) : [
        { title: "TCFD Transition Risk Framework", url: "https://www.tcfdhub.org/resource/transition-risk-framework/", organization: "TCFD", relevance: "Framework for assessing climate transition risks" },
        { title: "Climate Risks and Opportunities Assessment Guide", url: "https://www.carbontrust.com/our-work-and-impact/guides-reports-and-tools/transition-planning-how-to-assess-your-climate-risks-and-opportunities", organization: "Carbon Trust", relevance: "Methodology for identifying climate opportunities" }
      ]
    };

    if (framework === 'advanced') {
      if (isRisk) {
        baseResponse.exposureScore = Math.max(1, Math.min(5, Math.round(result.exposureScore || 3)));
        baseResponse.vulnerabilityScore = Math.max(1, Math.min(5, Math.round(result.vulnerabilityScore || 3)));
        baseResponse.strategicMisalignmentScore = Math.max(1, Math.min(5, Math.round(result.strategicMisalignmentScore || 3)));
        baseResponse.mitigationReadinessScore = Math.max(1, Math.min(5, Math.round(result.mitigationReadinessScore || 3)));
        baseResponse.peerComparison.rankings = {
          exposure: Math.max(1, Math.min(6, Math.round(result.peerComparison?.rankings?.exposure || 3))),
          vulnerability: Math.max(1, Math.min(6, Math.round(result.peerComparison?.rankings?.vulnerability || 3))),
          strategicMisalignment: Math.max(1, Math.min(6, Math.round(result.peerComparison?.rankings?.strategicMisalignment || 3))),
          mitigationReadiness: Math.max(1, Math.min(6, Math.round(result.peerComparison?.rankings?.mitigationReadiness || 3)))
        };
      } else {
        baseResponse.strategicMisalignmentScore = Math.max(1, Math.min(5, Math.round(result.strategicMisalignmentScore || 3)));
        baseResponse.marketReadinessScore = Math.max(1, Math.min(5, Math.round(result.marketReadinessScore || 3)));
        baseResponse.valueCreationScore = Math.max(1, Math.min(5, Math.round(result.valueCreationScore || 3)));
        baseResponse.feasibilityScore = Math.max(1, Math.min(5, Math.round(result.feasibilityScore || 3)));
        baseResponse.peerComparison.rankings = {
          strategicMisalignment: Math.max(1, Math.min(6, Math.round(result.peerComparison?.rankings?.strategicMisalignment || 3))),
          marketReadiness: Math.max(1, Math.min(6, Math.round(result.peerComparison?.rankings?.marketReadiness || 3))),
          valueCreation: Math.max(1, Math.min(6, Math.round(result.peerComparison?.rankings?.valueCreation || 3))),
          feasibility: Math.max(1, Math.min(6, Math.round(result.peerComparison?.rankings?.feasibility || 3)))
        };
      }
    } else {
      // Standard framework: Use sector-dependent weighted additive formula
      baseResponse.impactScore = Math.max(1, Math.min(5, Math.round(result.impactScore || 3)));
      baseResponse.likelihoodScore = Math.max(1, Math.min(5, Math.round(result.likelihoodScore || 3)));
      baseResponse.vulnerabilityScore = Math.max(1, Math.min(5, Math.round(result.vulnerabilityScore || 3)));
      baseResponse.peerComparison.rankings = {
        impact: Math.max(1, Math.min(6, Math.round(result.peerComparison?.rankings?.impact || 3))),
        likelihood: Math.max(1, Math.min(6, Math.round(result.peerComparison?.rankings?.likelihood || 3))),
        vulnerability: Math.max(1, Math.min(6, Math.round(result.peerComparison?.rankings?.vulnerability || 3)))
      };
      
      // Calculate residual risk using sector-dependent weighted additive formula
      const sectorCode = mapIndustryToSector(request.industry);
      // Map the category to the correct category group (e.g., "transition" -> "Policy / Legal")
      const categoryGroup = getCategoryGroup(request.category, request.subcategory);
      const weights = getWeightsForRisk(sectorCode, categoryGroup, request.subcategory);
      baseResponse.overallRisk = calculateResidualRisk(
        baseResponse.likelihoodScore,
        baseResponse.impactScore,
        baseResponse.vulnerabilityScore,
        weights
      );
    }

    return baseResponse;
  } catch (error) {
    console.error("OpenAI API error:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to generate risk analysis: ${errorMessage}`);
  }
}

const FIXED_RISK_CATEGORIES = {
  "Policy / Legal": [
    "Carbon pricing and reporting obligations",
    "Mandates on and regulation of existing products and services",
    "Exposure to litigation"
  ],
  "Technology": [
    "Substitution of existing products and services",
    "Unsuccessful investment in new technologies"
  ],
  "Market": [
    "Changing customer behavior",
    "Increased cost of raw materials",
    "Uncertainty in market signals"
  ],
  "Reputation": [
    "Shift in consumer preferences",
    "Stigmatization of sector",
    "Increased shareholder concern/negative feedback"
  ]
};

const MAIN_OPPORTUNITY_CATEGORIES = [
  "Resource Efficiency",
  "Energy Source",
  "Products and Services",
  "Markets",
  "Resilience"
];

export interface SubcategoryGenerationRequest {
  companyName: string;
  industry: string;
  carbonIntensity: string;
  geography: string[];
  revenue: string;
}

export interface IndustryDetectionRequest {
  companyName: string;
}

export interface IndustryDetectionResponse {
  industry: string;
  naicsCode: string;
  naicsDescription: string;
  confidence: number;
  reasoning: string;
}

export async function detectIndustryFromCompanyName(request: IndustryDetectionRequest): Promise<IndustryDetectionResponse> {
  try {
    const prompt = `
You are an industry classification expert. Analyze the company name and determine the most appropriate industry classification and NAICS code.

Company Name: ${request.companyName}

Provide analysis in JSON format with:
{
  "industry": "Primary industry name (e.g., 'Technology', 'Oil & Gas', 'Automotive', 'Retail')",
  "naicsCode": "Most specific 4 or 6-digit NAICS code that applies",
  "naicsDescription": "Official NAICS description for this code",
  "confidence": (decimal 0-1, where 1 is highest confidence),
  "reasoning": "Brief explanation of why this classification was chosen based on the company name and known business activities"
}

Considerations:
- Use your knowledge of well-known companies to determine their primary business activity
- For less known companies, analyze the company name for industry indicators (e.g., "Technologies", "Energy", "Bank", "Motors")
- Provide the most specific NAICS code possible (6-digit preferred, 4-digit minimum)
- If the company is a conglomerate, choose the primary/largest business segment
- Consider recent business activities and main revenue sources
- Be conservative with confidence scores - use 0.9+ only for very well-known companies

Examples:
- "Apple Inc." → Technology/Electronics (NAICS 334220 - Radio and Television Broadcasting and Wireless Communications Equipment Manufacturing)
- "ExxonMobil" → Oil & Gas (NAICS 211120 - Crude Petroleum Extraction)
- "Tesla" → Automotive (NAICS 336111 - Automobile Manufacturing)
- "JPMorgan Chase" → Financial Services (NAICS 522110 - Commercial Banking)
`;

    const response = await openai.chat.completions.create({
      model: "gpt-5", // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    // Validate and sanitize the response
    return {
      industry: result.industry || "General Business",
      naicsCode: result.naicsCode || "999999",
      naicsDescription: result.naicsDescription || "Unclassified Establishments",
      confidence: Math.max(0, Math.min(1, result.confidence || 0.5)),
      reasoning: result.reasoning || "Industry classification based on company name analysis"
    };
  } catch (error) {
    console.error("OpenAI industry detection error:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to detect industry: ${errorMessage}`);
  }
}


export async function generateOpportunitySubcategories(request: SubcategoryGenerationRequest): Promise<{ [category: string]: string[] }> {
  try {
    const prompt = `
You are a climate risk expert. Generate specific, relevant subcategories for climate transition opportunities for the following company:

Company: ${request.companyName}
Industry: ${request.industry}
Carbon Intensity: ${request.carbonIntensity}
Geographic Exposure: ${request.geography.join(', ')}
Revenue Size: ${request.revenue}

For each opportunity category below, generate exactly 3 specific, relevant subcategories that are tailored to this company's industry and business model:

Opportunity Categories:
- Resource Efficiency: (efficiency gains relevant to this industry)
- Energy Source: (energy transition opportunities for this sector)
- Products and Services: (new offerings this company could develop)
- Markets: (new markets this company could enter)
- Resilience: (adaptation strategies for this business type)

Provide response in JSON format:
{
  "Resource Efficiency": ["subcategory1", "subcategory2", "subcategory3"],
  "Energy Source": ["subcategory1", "subcategory2", "subcategory3"],
  "Products and Services": ["subcategory1", "subcategory2", "subcategory3"],
  "Markets": ["subcategory1", "subcategory2", "subcategory3"],
  "Resilience": ["subcategory1", "subcategory2", "subcategory3"]
}

Make subcategories specific to the ${request.industry} industry and ${request.companyName}'s business model.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-5", // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return result || {};
  } catch (error) {
    console.error("OpenAI subcategory generation error:", error);
    // Fallback to basic opportunity subcategories if generation fails
    return {
      "Resource Efficiency": ["Operational efficiency gains", "Resource optimization", "Waste reduction"],
      "Energy Source": ["Renewable energy adoption", "Energy diversification", "Energy independence"],
      "Products and Services": ["New product development", "Service innovation", "Market differentiation"],
      "Markets": ["New market access", "Customer base expansion", "Revenue diversification"],
      "Resilience": ["Business continuity", "Risk management", "Adaptive capabilities"]
    };
  }
}

const TCFD_RISK_CATEGORIES: { [key: string]: string[] } = {
  "Transition Risk - Policy & Legal": [
    "Carbon pricing and emissions trading schemes",
    "Mandated emissions reduction targets and reporting",
    "Litigation risk from climate-related claims"
  ],
  "Transition Risk - Technology": [
    "Substitution of products/services with lower-emission alternatives",
    "Cost of transitioning to clean technology",
    "Early retirement of existing assets and stranded assets"
  ],
  "Transition Risk - Market": [
    "Shifting consumer preferences toward sustainable products",
    "Increased cost of raw materials and energy",
    "Uncertainty in market signals and repricing of assets"
  ],
  "Transition Risk - Reputation": [
    "Stakeholder concerns about climate commitments",
    "Greenwashing litigation and credibility risk",
    "Sector stigmatization and social license to operate"
  ],
  "Physical Risk - Acute": [
    "Increased severity of extreme weather events",
    "Wildfire exposure and asset damage",
    "Flooding and storm surge impacts on operations"
  ],
  "Physical Risk - Chronic": [
    "Rising mean temperatures and heat stress",
    "Sea level rise and coastal asset exposure",
    "Changes in precipitation patterns and water availability"
  ],
  "Opportunity - Resource Efficiency": [
    "Energy efficiency improvements and cost savings",
    "Water and waste reduction opportunities",
    "Material circularity and recycling revenue"
  ],
  "Opportunity - Energy Source": [
    "Shift to renewable energy and decentralized generation",
    "Green hydrogen and alternative fuel adoption",
    "Power purchase agreements and energy independence"
  ],
  "Opportunity - Products & Services": [
    "Low-carbon product development and innovation",
    "Climate adaptation solutions and services",
    "Green finance and sustainability-linked products"
  ],
  "Opportunity - Markets & Resilience": [
    "Access to new markets via sustainability leadership",
    "Supply chain resilience and diversification",
    "Climate adaptation and business continuity improvements"
  ]
};

export async function generateTcfdRiskAnalysis(request: RiskAnalysisRequest): Promise<RiskAnalysisResponse> {
  try {
    let sectorContextStr = "";
    if (request.sectorContext?.profile) {
      const p = request.sectorContext.profile;
      sectorContextStr = `
REAL SECTOR DATA (from Climate TRACE, World Bank, NGFS - use these facts):
Sector: ${p.sectorName}
- Annual Emissions: ${p.annualEmissionsMtCo2?.toLocaleString() || 'N/A'} Mt CO2e
- Emissions Intensity: ${p.emissionsIntensity || 'N/A'} tCO2/$M revenue
- Emissions Trend: ${p.emissionsTrend || 'N/A'}
- GDP Contribution: ${p.gdpContributionPercent || 'N/A'}% of global GDP
- Transition Risk Level: ${p.transitionRiskLevel || 'N/A'}
`;
    }

    const isOpportunity = request.category.startsWith("Opportunity");

    const prompt = `
You are a TCFD (Task Force on Climate-related Financial Disclosures) expert analyst. Analyze the following business 
for climate-related financial risks and opportunities strictly following the TCFD framework recommendations.

Company: ${request.companyName}
Business Context:
- Industry: ${request.industry}
- Carbon Intensity: ${request.carbonIntensity}
- Geographic Exposure: ${request.geography.join(', ')}
- Revenue Size: ${request.revenue}
${sectorContextStr}
TCFD Category: ${request.category}
Specific ${isOpportunity ? 'Opportunity' : 'Risk'}: ${request.subcategory}

Analyze this specific TCFD ${isOpportunity ? 'opportunity' : 'risk'} for ${request.companyName}. Frame your analysis using:
1. TCFD governance - How would board/management oversight apply?
2. TCFD strategy - How does this affect business strategy, financial planning, and scenario analysis?
3. TCFD risk management - How should this be identified, assessed, and managed?
4. TCFD metrics and targets - What metrics and targets should be disclosed?

Consider time horizons: Short-term (0-3 years), Medium-term (3-10 years), Long-term (10-30 years).

Provide analysis in JSON format:
{
  "impactScore": (1-5 integer, where 5 is most severe financial impact),
  "likelihoodScore": (1-5 integer, where 5 is most likely to materialize),
  "vulnerabilityScore": (1-5 integer, where 5 is most vulnerable/least adaptive capacity),
  "overallRisk": (calculated weighted score as decimal),
  "narrative": "Company-specific 2-3 sentence summary addressing ${request.companyName}'s TCFD-relevant exposure, including estimated financial magnitude where possible",
  "reasoning": "Detailed TCFD-aligned explanation covering governance implications, strategy impacts, risk management recommendations, and suggested metrics/targets. Reference specific time horizons and NGFS scenarios where relevant.",
  "peerComparison": {
    "peers": ["list of 5 major companies in the same industry"],
    "rankings": {
      "impact": (integer 1-6, 1=lowest impact, 6=highest),
      "likelihood": (integer 1-6, 1=lowest likelihood, 6=highest),
      "vulnerability": (integer 1-6, 1=least vulnerable, 6=most vulnerable)
    },
    "rationale": "Compare ${request.companyName}'s TCFD risk/opportunity position relative to peers"
  },
  "sources": [{"title": "...", "url": "...", "organization": "...", "relevance": "..."}]
}

CRITICAL SOURCE REQUIREMENTS:
- Provide 3-4 sources from: TCFD, FSB, NGFS, IPCC, IEA, CDP, SASB/ISSB, Climate Action 100+, PRI, Bank of England, ECB
- Each source must have a real URL
- Focus on TCFD framework and climate-related financial disclosure sources

Make this analysis specific to ${request.companyName}, not generic.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");

    return {
      category: request.category,
      subcategory: request.subcategory,
      impactScore: Math.max(1, Math.min(5, Math.round(result.impactScore || 3))),
      likelihoodScore: Math.max(1, Math.min(5, Math.round(result.likelihoodScore || 3))),
      vulnerabilityScore: Math.max(1, Math.min(5, Math.round(result.vulnerabilityScore || 3))),
      overallRisk: Math.max(0, Math.min(5, result.overallRisk || 3)),
      narrative: result.narrative || "TCFD risk analysis pending",
      reasoning: result.reasoning || "Detailed TCFD-aligned reasoning will be provided once analysis is complete",
      peerComparison: {
        peers: Array.isArray(result.peerComparison?.peers) ? result.peerComparison.peers.slice(0, 5) : [],
        rankings: {
          impact: Math.max(1, Math.min(6, Math.round(result.peerComparison?.rankings?.impact || 3))),
          likelihood: Math.max(1, Math.min(6, Math.round(result.peerComparison?.rankings?.likelihood || 3))),
          vulnerability: Math.max(1, Math.min(6, Math.round(result.peerComparison?.rankings?.vulnerability || 3)))
        },
        rationale: result.peerComparison?.rationale || "Peer comparison analysis pending"
      },
      sources: Array.isArray(result.sources) ? result.sources.slice(0, 4).map((source: any) => {
        if (typeof source === 'string') {
          return { title: "TCFD Resource", url: source, organization: "TCFD Authority", relevance: "TCFD framework guidance" };
        }
        return {
          title: source.title || "TCFD Resource",
          url: source.url || "#",
          organization: source.organization || "TCFD Authority",
          relevance: source.relevance || "Supports TCFD risk analysis"
        };
      }) : [
        { title: "TCFD Recommendations", url: "https://www.fsb-tcfd.org/recommendations/", organization: "FSB TCFD", relevance: "Core TCFD framework recommendations" },
        { title: "NGFS Scenarios", url: "https://www.ngfs.net/ngfs-scenarios-portal/", organization: "NGFS", relevance: "Climate scenario analysis for financial risk" }
      ]
    };
  } catch (error) {
    console.error("OpenAI TCFD risk analysis error:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to generate TCFD risk analysis: ${errorMessage}`);
  }
}

export async function generateTcfdRiskAssessment(
  industry: string,
  companyName: string,
  businessContext: any
): Promise<RiskAnalysisResponse[]> {
  let sectorContext: SectorContext | undefined;
  try {
    const sectorCode = sectorDataService.mapIndustryToSectorCode(industry);
    if (sectorCode) {
      const [profile, scenarioImpacts] = await Promise.all([
        sectorDataService.getSectorProfile(sectorCode),
        sectorDataService.getSectorScenarioImpacts(sectorCode)
      ]);
      sectorContext = { profile, scenarioImpacts };
    }
  } catch (error) {
    console.log("Could not fetch sector data for TCFD risk:", error);
  }

  const riskCategories: Array<{category: string, subcategory: string}> = [];
  Object.entries(TCFD_RISK_CATEGORIES).forEach(([category, subcategories]) => {
    subcategories.forEach(subcategory => {
      riskCategories.push({ category, subcategory });
    });
  });

  const analyses = await Promise.all(
    riskCategories.map(({ category, subcategory }) =>
      generateTcfdRiskAnalysis({
        industry,
        companyName,
        carbonIntensity: businessContext.carbonIntensity || 'medium',
        geography: businessContext.geography || ['north_america'],
        revenue: businessContext.revenue || '10m_100m',
        category,
        subcategory,
        sectorContext
      })
    )
  );

  return analyses;
}

const TNFD_RISK_CATEGORIES: { [key: string]: string[] } = {
  "Dependencies - Land & Freshwater": [
    "Agricultural land use and soil health dependency",
    "Freshwater withdrawal and aquifer depletion",
    "Pollination and biological pest control reliance"
  ],
  "Dependencies - Ocean & Coastal": [
    "Marine resource extraction and fisheries dependency",
    "Coastal infrastructure and storm protection services",
    "Ocean-based supply chain and shipping route exposure"
  ],
  "Impacts - Pollution & Waste": [
    "Chemical and nutrient pollution to water bodies",
    "Plastic and solid waste generation across value chain",
    "Air emissions affecting local biodiversity"
  ],
  "Impacts - Land Use Change": [
    "Deforestation and habitat conversion in supply chains",
    "Urban expansion and greenfield development",
    "Agricultural intensification and monoculture expansion"
  ],
  "Risks - Ecosystem Service Loss": [
    "Loss of pollination and crop productivity decline",
    "Water purification and regulation service degradation",
    "Carbon sequestration capacity reduction"
  ],
  "Risks - Regulatory & Legal": [
    "Biodiversity regulations and protected area expansion",
    "Nature-related litigation and liability exposure",
    "Mandatory TNFD-aligned disclosure requirements"
  ],
  "Risks - Market & Reputation": [
    "Consumer and investor scrutiny on nature impacts",
    "Supply chain disruption from ecosystem degradation",
    "Loss of social license from biodiversity harm"
  ],
  "Opportunities - Nature-Based Solutions": [
    "Ecosystem restoration and natural capital investment",
    "Carbon and biodiversity credit generation",
    "Nature-based infrastructure and green corridors"
  ],
  "Opportunities - Sustainable Products": [
    "Certified sustainable and deforestation-free products",
    "Circular economy and bio-based material innovation",
    "Regenerative agriculture and sustainable sourcing"
  ],
  "Opportunities - Nature-Positive Finance": [
    "Biodiversity-linked bonds and green financing instruments",
    "Natural capital accounting and valuation leadership",
    "Blended finance for landscape-level conservation"
  ]
};

export async function generateTnfdRiskAnalysis(request: RiskAnalysisRequest): Promise<RiskAnalysisResponse> {
  try {
    let sectorContextStr = "";
    if (request.sectorContext?.profile) {
      const p = request.sectorContext.profile;
      sectorContextStr = `
REAL SECTOR DATA (from Climate TRACE, World Bank, NGFS - use these facts):
Sector: ${p.sectorName}
- Annual Emissions: ${p.annualEmissionsMtCo2?.toLocaleString() || 'N/A'} Mt CO2e
- Emissions Intensity: ${p.emissionsIntensity || 'N/A'} tCO2/$M revenue
- Emissions Trend: ${p.emissionsTrend || 'N/A'}
- GDP Contribution: ${p.gdpContributionPercent || 'N/A'}% of global GDP
- Transition Risk Level: ${p.transitionRiskLevel || 'N/A'}
`;
    }

    const isOpportunity = request.category.startsWith("Opportunities");

    const prompt = `
You are a TNFD (Taskforce on Nature-related Financial Disclosures) expert analyst. Analyze the following business 
for nature-related financial risks and opportunities strictly following the TNFD LEAP approach (Locate, Evaluate, 
Assess, Prepare) and TNFD disclosure recommendations.

Company: ${request.companyName}
Business Context:
- Industry: ${request.industry}
- Carbon Intensity: ${request.carbonIntensity}
- Geographic Exposure: ${request.geography.join(', ')}
- Revenue Size: ${request.revenue}
${sectorContextStr}
TNFD Category: ${request.category}
Specific ${isOpportunity ? 'Opportunity' : 'Risk/Dependency/Impact'}: ${request.subcategory}

Analyze this specific TNFD ${isOpportunity ? 'opportunity' : 'nature-related factor'} for ${request.companyName}. Frame your analysis using:
1. LOCATE - Where does the company interface with nature? What biomes and ecosystems are relevant?
2. EVALUATE - What are the company's nature-related dependencies and impacts?
3. ASSESS - What are the material nature-related risks and opportunities?
4. PREPARE - What should the company disclose and what actions should it take?

Consider the Kunming-Montreal Global Biodiversity Framework targets and planetary boundaries.
Consider dependencies on ecosystem services (provisioning, regulating, cultural, supporting).

Provide analysis in JSON format:
{
  "impactScore": (1-5 integer, where 5 is most severe impact on nature or from nature loss),
  "likelihoodScore": (1-5 integer, where 5 is most likely to materialize),
  "vulnerabilityScore": (1-5 integer, where 5 is most vulnerable/least adaptive capacity),
  "overallRisk": (calculated weighted score as decimal),
  "narrative": "Company-specific 2-3 sentence summary addressing ${request.companyName}'s nature-related exposure, including ecosystem services and biodiversity dependencies",
  "reasoning": "Detailed TNFD LEAP-aligned explanation covering location-specific nature interfaces, dependency/impact evaluation, risk/opportunity assessment, and disclosure preparation guidance. Reference specific biomes, ecosystem services, and biodiversity metrics.",
  "peerComparison": {
    "peers": ["list of 5 major companies in the same industry"],
    "rankings": {
      "impact": (integer 1-6, 1=lowest impact, 6=highest),
      "likelihood": (integer 1-6, 1=lowest likelihood, 6=highest),
      "vulnerability": (integer 1-6, 1=least vulnerable, 6=most vulnerable)
    },
    "rationale": "Compare ${request.companyName}'s nature-related risk/opportunity position relative to peers"
  },
  "sources": [{"title": "...", "url": "...", "organization": "...", "relevance": "..."}]
}

CRITICAL SOURCE REQUIREMENTS:
- Provide 3-4 sources from: TNFD, SBTN, IPBES, UNEP-WCMC, IUCN, CBD, WWF, WRI, ENCORE, GRI, IBAT
- Each source must have a real URL
- Focus on TNFD framework, nature-related risk, and biodiversity disclosure sources

Make this analysis specific to ${request.companyName}, not generic.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");

    return {
      category: request.category,
      subcategory: request.subcategory,
      impactScore: Math.max(1, Math.min(5, Math.round(result.impactScore || 3))),
      likelihoodScore: Math.max(1, Math.min(5, Math.round(result.likelihoodScore || 3))),
      vulnerabilityScore: Math.max(1, Math.min(5, Math.round(result.vulnerabilityScore || 3))),
      overallRisk: Math.max(0, Math.min(5, result.overallRisk || 3)),
      narrative: result.narrative || "TNFD nature-related risk analysis pending",
      reasoning: result.reasoning || "Detailed TNFD LEAP-aligned reasoning will be provided once analysis is complete",
      peerComparison: {
        peers: Array.isArray(result.peerComparison?.peers) ? result.peerComparison.peers.slice(0, 5) : [],
        rankings: {
          impact: Math.max(1, Math.min(6, Math.round(result.peerComparison?.rankings?.impact || 3))),
          likelihood: Math.max(1, Math.min(6, Math.round(result.peerComparison?.rankings?.likelihood || 3))),
          vulnerability: Math.max(1, Math.min(6, Math.round(result.peerComparison?.rankings?.vulnerability || 3)))
        },
        rationale: result.peerComparison?.rationale || "Peer comparison analysis pending"
      },
      sources: Array.isArray(result.sources) ? result.sources.slice(0, 4).map((source: any) => {
        if (typeof source === 'string') {
          return { title: "TNFD Resource", url: source, organization: "TNFD Authority", relevance: "TNFD framework guidance" };
        }
        return {
          title: source.title || "TNFD Resource",
          url: source.url || "#",
          organization: source.organization || "TNFD Authority",
          relevance: source.relevance || "Supports TNFD nature-related risk analysis"
        };
      }) : [
        { title: "TNFD Recommendations v1.0", url: "https://tnfd.global/recommendations-of-the-tnfd/", organization: "TNFD", relevance: "Core TNFD framework recommendations" },
        { title: "ENCORE Tool", url: "https://encore.naturalcapital.finance/", organization: "UNEP-WCMC", relevance: "Natural capital dependency and impact analysis" }
      ]
    };
  } catch (error) {
    console.error("OpenAI TNFD risk analysis error:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to generate TNFD risk analysis: ${errorMessage}`);
  }
}

export async function generateTnfdRiskAssessment(
  industry: string,
  companyName: string,
  businessContext: any
): Promise<RiskAnalysisResponse[]> {
  let sectorContext: SectorContext | undefined;
  try {
    const sectorCode = sectorDataService.mapIndustryToSectorCode(industry);
    if (sectorCode) {
      const [profile, scenarioImpacts] = await Promise.all([
        sectorDataService.getSectorProfile(sectorCode),
        sectorDataService.getSectorScenarioImpacts(sectorCode)
      ]);
      sectorContext = { profile, scenarioImpacts };
    }
  } catch (error) {
    console.log("Could not fetch sector data for TNFD risk:", error);
  }

  const riskCategories: Array<{category: string, subcategory: string}> = [];
  Object.entries(TNFD_RISK_CATEGORIES).forEach(([category, subcategories]) => {
    subcategories.forEach(subcategory => {
      riskCategories.push({ category, subcategory });
    });
  });

  const analyses = await Promise.all(
    riskCategories.map(({ category, subcategory }) =>
      generateTnfdRiskAnalysis({
        industry,
        companyName,
        carbonIntensity: businessContext.carbonIntensity || 'medium',
        geography: businessContext.geography || ['north_america'],
        revenue: businessContext.revenue || '10m_100m',
        category,
        subcategory,
        sectorContext
      })
    )
  );

  return analyses;
}

const ECOLOGICAL_RISK_CATEGORIES: { [key: string]: string[] } = {
  "Natural Capital Depletion": [
    "Non-renewable resource dependency and depletion rates",
    "Soil degradation and land productivity loss",
    "Groundwater and freshwater depletion"
  ],
  "Ecosystem Services Disruption": [
    "Pollination and biological pest control loss",
    "Water purification and flood regulation degradation",
    "Carbon sequestration and climate regulation decline"
  ],
  "Planetary Boundary Transgression": [
    "Climate change boundary exceedance exposure",
    "Biodiversity loss and biosphere integrity risk",
    "Biogeochemical flow disruption (nitrogen/phosphorus)"
  ],
  "Throughput & Material Limits": [
    "Linear production model vulnerability",
    "Critical material scarcity and supply constraints",
    "Energy throughput and thermodynamic efficiency limits"
  ],
  "Biodiversity & Habitat Loss": [
    "Supply chain dependency on biodiversity-rich regions",
    "Regulatory risk from habitat protection laws",
    "Ecosystem collapse cascading effects"
  ],
  "Circular Economy Transition": [
    "Extended producer responsibility and waste regulation",
    "Product-as-service business model disruption",
    "Material recovery and recyclability requirements"
  ]
};

export async function generateEcologicalRiskAnalysis(request: RiskAnalysisRequest): Promise<RiskAnalysisResponse> {
  try {
    let sectorContextStr = "";
    if (request.sectorContext?.profile) {
      const p = request.sectorContext.profile;
      sectorContextStr = `
REAL SECTOR DATA (from Climate TRACE, World Bank, NGFS - use these facts):
Sector: ${p.sectorName}
- Annual Emissions: ${p.annualEmissionsMtCo2?.toLocaleString() || 'N/A'} Mt CO2e
- Emissions Intensity: ${p.emissionsIntensity || 'N/A'} tCO2/$M revenue
- Emissions Trend: ${p.emissionsTrend || 'N/A'}
- GDP Contribution: ${p.gdpContributionPercent || 'N/A'}% of global GDP
- Transition Risk Level: ${p.transitionRiskLevel || 'N/A'}
`;
    }

    const prompt = `
You are an ecological economics and ecological risk expert. You analyze business risks through the lens of ecological economics - 
treating the economy as a subsystem of the biosphere, recognizing natural capital as non-substitutable, and applying concepts from 
planetary boundaries, ecosystem services valuation, throughput limits, and strong sustainability.

This is NOT a standard climate transition risk assessment. Instead, analyze risks using these ecological economics foundations:
- Herman Daly's steady-state economics and throughput limits
- Georgescu-Roegen's entropy law applied to material/energy flows
- Costanza's ecosystem services valuation
- Rockstrom's planetary boundaries framework
- Kate Raworth's Doughnut Economics
- TNFD (Taskforce on Nature-related Financial Disclosures) framework
- Strong sustainability (natural capital is NOT substitutable by human-made capital)

Company: ${request.companyName}
Business Context:
- Industry: ${request.industry}
- Carbon Intensity: ${request.carbonIntensity}
- Geographic Exposure: ${request.geography.join(', ')}
- Revenue Size: ${request.revenue}
${sectorContextStr}
Ecological Risk Category: ${request.category}
Specific Risk: ${request.subcategory}

Analyze this specific ecological risk for ${request.companyName}. Consider:
1. Natural capital dependency - what natural resources/services does this business depend on?
2. Ecosystem service exposure - which ecosystem services could degrade and affect operations?
3. Planetary boundary proximity - how close is this industry to relevant planetary boundaries?
4. Throughput constraints - what material/energy throughput limits apply?
5. Biodiversity dependency - how does biodiversity loss affect this business?
6. Regulatory trajectory - what ecological regulations are emerging?

Provide analysis in JSON format:
{
  "impactScore": (1-5 integer, where 5 is most severe ecological impact on business),
  "likelihoodScore": (1-5 integer, where 5 is most likely to materialize),
  "vulnerabilityScore": (1-5 integer, where 5 is most vulnerable/least adaptive capacity),
  "overallRisk": (calculated weighted score as decimal),
  "narrative": "Company-specific 2-3 sentence summary grounded in ecological economics concepts, addressing ${request.companyName}'s natural capital dependency and ecosystem service exposure",
  "reasoning": "Detailed explanation using ecological economics language - reference planetary boundaries, natural capital stocks, ecosystem service flows, throughput limits, entropy, and strong sustainability. Explain why conventional risk analysis might UNDERESTIMATE this risk.",
  "peerComparison": {
    "peers": ["list of 5 major companies in the same industry"],
    "rankings": {
      "impact": (integer 1-6, 1=lowest ecological impact risk, 6=highest),
      "likelihood": (integer 1-6, 1=lowest likelihood, 6=highest),
      "vulnerability": (integer 1-6, 1=least vulnerable to ecological risk, 6=most vulnerable)
    },
    "rationale": "Compare ${request.companyName}'s ecological risk position to peers, considering natural capital dependency and ecosystem service reliance"
  },
  "sources": [{"title": "...", "url": "...", "organization": "...", "relevance": "..."}]
}

CRITICAL SOURCE REQUIREMENTS:
- Provide 3-4 sources from: TNFD, IPBES, Stockholm Resilience Centre, Costanza/Daly/Raworth publications, TEEB, Natural Capital Coalition, WWF, UNEP-FI, Science-Based Targets Network
- Each source must have a real URL
- Focus on ecological economics and nature-related financial risk sources

Make this analysis specific to ${request.companyName}, not generic. Emphasize what CONVENTIONAL financial analysis misses about ecological risk.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");

    return {
      category: request.category,
      subcategory: request.subcategory,
      impactScore: Math.max(1, Math.min(5, Math.round(result.impactScore || 3))),
      likelihoodScore: Math.max(1, Math.min(5, Math.round(result.likelihoodScore || 3))),
      vulnerabilityScore: Math.max(1, Math.min(5, Math.round(result.vulnerabilityScore || 3))),
      overallRisk: Math.max(0, Math.min(5, result.overallRisk || 3)),
      narrative: result.narrative || "Ecological risk analysis pending",
      reasoning: result.reasoning || "Detailed ecological reasoning will be provided once analysis is complete",
      peerComparison: {
        peers: Array.isArray(result.peerComparison?.peers) ? result.peerComparison.peers.slice(0, 5) : [],
        rankings: {
          impact: Math.max(1, Math.min(6, Math.round(result.peerComparison?.rankings?.impact || 3))),
          likelihood: Math.max(1, Math.min(6, Math.round(result.peerComparison?.rankings?.likelihood || 3))),
          vulnerability: Math.max(1, Math.min(6, Math.round(result.peerComparison?.rankings?.vulnerability || 3)))
        },
        rationale: result.peerComparison?.rationale || "Peer comparison analysis pending"
      },
      sources: Array.isArray(result.sources) ? result.sources.slice(0, 4).map((source: any) => {
        if (typeof source === 'string') {
          return { title: "Ecological Risk Resource", url: source, organization: "Ecological Authority", relevance: "Ecological risk guidance" };
        }
        return {
          title: source.title || "Ecological Risk Resource",
          url: source.url || "#",
          organization: source.organization || "Ecological Authority",
          relevance: source.relevance || "Supports ecological risk analysis"
        };
      }) : [
        { title: "TNFD Framework", url: "https://tnfd.global/", organization: "TNFD", relevance: "Nature-related financial disclosure framework" },
        { title: "Planetary Boundaries", url: "https://www.stockholmresilience.org/research/planetary-boundaries.html", organization: "Stockholm Resilience Centre", relevance: "Safe operating space for humanity" }
      ]
    };
  } catch (error) {
    console.error("OpenAI ecological risk analysis error:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to generate ecological risk analysis: ${errorMessage}`);
  }
}

export async function generateEcologicalRiskAssessment(
  industry: string,
  companyName: string,
  businessContext: any
): Promise<RiskAnalysisResponse[]> {
  let sectorContext: SectorContext | undefined;
  try {
    const sectorCode = sectorDataService.mapIndustryToSectorCode(industry);
    if (sectorCode) {
      const [profile, scenarioImpacts] = await Promise.all([
        sectorDataService.getSectorProfile(sectorCode),
        sectorDataService.getSectorScenarioImpacts(sectorCode)
      ]);
      sectorContext = { profile, scenarioImpacts };
    }
  } catch (error) {
    console.log("Could not fetch sector data for ecological risk:", error);
  }

  const riskCategories: Array<{category: string, subcategory: string}> = [];
  Object.entries(ECOLOGICAL_RISK_CATEGORIES).forEach(([category, subcategories]) => {
    subcategories.forEach(subcategory => {
      riskCategories.push({ category, subcategory });
    });
  });

  const analyses = await Promise.all(
    riskCategories.map(({ category, subcategory }) =>
      generateEcologicalRiskAnalysis({
        industry,
        companyName,
        carbonIntensity: businessContext.carbonIntensity || 'medium',
        geography: businessContext.geography || ['north_america'],
        revenue: businessContext.revenue || '10m_100m',
        category,
        subcategory,
        sectorContext
      })
    )
  );

  return analyses;
}

export async function generateRiskAssessment(
  industry: string, 
  companyName: string,
  businessContext: any,
  assessmentFramework?: string
): Promise<RiskAnalysisResponse[]> {
  // Fetch real sector data for context
  let sectorContext: SectorContext | undefined;
  try {
    const sectorCode = sectorDataService.mapIndustryToSectorCode(industry);
    if (sectorCode) {
      const [profile, scenarioImpacts] = await Promise.all([
        sectorDataService.getSectorProfile(sectorCode),
        sectorDataService.getSectorScenarioImpacts(sectorCode)
      ]);
      sectorContext = { profile, scenarioImpacts };
      console.log(`Enhanced AI analysis with real sector data for ${sectorCode}`);
    }
  } catch (error) {
    console.log("Could not fetch sector data, proceeding without it:", error);
  }

  // Build array of all risk categories and their fixed subcategories
  const riskCategories: Array<{category: string, subcategory: string}> = [];
  
  // Add all fixed risk subcategories
  Object.entries(FIXED_RISK_CATEGORIES).forEach(([category, subcategories]) => {
    subcategories.forEach(subcategory => {
      riskCategories.push({ category, subcategory });
    });
  });

  const analyses = await Promise.all(
    riskCategories.map(({ category, subcategory }) =>
      generateRiskAnalysis({
        industry,
        companyName,
        carbonIntensity: businessContext.carbonIntensity || 'medium',
        geography: businessContext.geography || ['north_america'],
        revenue: businessContext.revenue || '10m_100m',
        category,
        subcategory,
        assessmentFramework,
        sectorContext
      })
    )
  );

  return analyses;
}

export async function generateOpportunityAssessment(
  industry: string, 
  companyName: string,
  businessContext: any,
  assessmentFramework?: string
): Promise<RiskAnalysisResponse[]> {
  // Fetch real sector data for context
  let sectorContext: SectorContext | undefined;
  try {
    const sectorCode = sectorDataService.mapIndustryToSectorCode(industry);
    if (sectorCode) {
      const [profile, scenarioImpacts] = await Promise.all([
        sectorDataService.getSectorProfile(sectorCode),
        sectorDataService.getSectorScenarioImpacts(sectorCode)
      ]);
      sectorContext = { profile, scenarioImpacts };
      console.log(`Enhanced opportunity analysis with real sector data for ${sectorCode}`);
    }
  } catch (error) {
    console.log("Could not fetch sector data, proceeding without it:", error);
  }

  // First, generate company-specific opportunity subcategories
  const subcategoryRequest: SubcategoryGenerationRequest = {
    companyName,
    industry,
    carbonIntensity: businessContext.carbonIntensity || 'medium',
    geography: businessContext.geography || ['north_america'],
    revenue: businessContext.revenue || '10m_100m'
  };
  
  const generatedOpportunitySubcategories = await generateOpportunitySubcategories(subcategoryRequest);
  
  // Build array of all opportunity categories and their subcategories
  const opportunityCategories: Array<{category: string, subcategory: string}> = [];
  
  // Add all dynamically generated opportunity subcategories
  Object.entries(generatedOpportunitySubcategories).forEach(([category, subcategories]) => {
    subcategories.forEach(subcategory => {
      opportunityCategories.push({ category, subcategory });
    });
  });

  const analyses = await Promise.all(
    opportunityCategories.map(({ category, subcategory }) =>
      generateRiskAnalysis({
        industry,
        companyName,
        carbonIntensity: businessContext.carbonIntensity || 'medium',
        geography: businessContext.geography || ['north_america'],
        revenue: businessContext.revenue || '10m_100m',
        category,
        subcategory,
        assessmentFramework,
        sectorContext
      })
    )
  );

  return analyses;
}

export interface ReportRequest {
  companyName: string;
  industry?: string;
  geography?: string;
  revenue?: string;
  employees?: string;
  description?: string;
  materialTopics?: string;
}

export interface ReportSection {
  id: string;
  title: string;
  content: string;
  subsections?: Array<{ title: string; content: string }>;
}

export interface ReportResponse {
  companyName: string;
  industry: string;
  framework: string;
  generatedAt: string;
  executiveSummary: string;
  sections: ReportSection[];
  recommendations: string[];
  dataSources: string[];
}

async function generateFrameworkReport(framework: string, prompt: string, request: ReportRequest, industry: string): Promise<ReportResponse> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    temperature: 0.7,
    max_tokens: 8000
  });

  const parsed = JSON.parse(response.choices[0].message.content || "{}");
  return {
    companyName: request.companyName,
    industry,
    framework,
    generatedAt: new Date().toISOString(),
    executiveSummary: parsed.executiveSummary || "",
    sections: parsed.sections || [],
    recommendations: parsed.recommendations || [],
    dataSources: parsed.dataSources || []
  };
}

function buildCompanyContext(request: ReportRequest, industry: string): string {
  let ctx = `- Company Name: ${request.companyName}\n- Industry: ${industry}`;
  if (request.geography) ctx += `\n- Geography: ${request.geography}`;
  if (request.revenue) ctx += `\n- Revenue Range: ${request.revenue}`;
  if (request.employees) ctx += `\n- Employee Count: ${request.employees}`;
  if (request.description) ctx += `\n- Business Description: ${request.description}`;
  if (request.materialTopics) ctx += `\n- Key Focus Areas: ${request.materialTopics}`;
  return ctx;
}

export async function generateCsrdReport(request: ReportRequest): Promise<ReportResponse> {
  const industry = request.industry || "General";
  const companyCtx = buildCompanyContext(request, industry);
  const prompt = `You are an expert sustainability consultant specializing in EU CSRD/ESRS reporting. Generate a comprehensive CSRD-aligned sustainability report for the company described below.

COMPANY INFORMATION:
${companyCtx}

Generate a detailed CSRD report with the following JSON structure. Each section should contain substantive, specific content (at least 2-3 detailed paragraphs per section). Use real regulatory references, sector-specific data where possible, and actionable guidance.

Return JSON with this structure:
{
  "executiveSummary": "A comprehensive executive summary (3-4 paragraphs) covering CSRD applicability, key material topics, reporting readiness, and strategic recommendations",
  "sections": [
    {"id": "esrs2_governance", "title": "ESRS 2 — Governance", "content": "Main governance section content", "subsections": [{"title": "Board Oversight of Sustainability", "content": "Detailed content"}, {"title": "Management's Role in Due Diligence", "content": "Detailed content"}, {"title": "Sustainability Governance Structure", "content": "Detailed content"}]},
    {"id": "esrs2_strategy", "title": "ESRS 2 — Strategy", "content": "Strategy overview", "subsections": [{"title": "Business Model & Value Chain", "content": "Detailed content"}, {"title": "Sustainability Strategy & Targets", "content": "Detailed content"}, {"title": "Financial Effects of Sustainability Risks", "content": "Detailed content"}]},
    {"id": "double_materiality", "title": "Double Materiality Assessment", "content": "Overview of DMA approach", "subsections": [{"title": "Impact Materiality Analysis", "content": "Detailed content"}, {"title": "Financial Materiality Analysis", "content": "Detailed content"}, {"title": "Material Topics Identified", "content": "Detailed content"}]},
    {"id": "esrs_e1", "title": "ESRS E1 — Climate Change", "content": "Climate change overview", "subsections": [{"title": "GHG Emissions (Scope 1, 2, 3)", "content": "Detailed content"}, {"title": "Climate Transition Plan", "content": "Detailed content"}, {"title": "Climate Risk & Opportunity Assessment", "content": "Detailed content"}]},
    {"id": "esrs_e2_e5", "title": "ESRS E2-E5 — Environment", "content": "Overview of environmental topics", "subsections": [{"title": "Pollution (E2)", "content": "Detailed content"}, {"title": "Water & Marine Resources (E3)", "content": "Detailed content"}, {"title": "Biodiversity & Ecosystems (E4)", "content": "Detailed content"}, {"title": "Resource Use & Circular Economy (E5)", "content": "Detailed content"}]},
    {"id": "esrs_s1_s4", "title": "ESRS S1-S4 — Social", "content": "Overview of social topics", "subsections": [{"title": "Own Workforce (S1)", "content": "Detailed content"}, {"title": "Workers in the Value Chain (S2)", "content": "Detailed content"}, {"title": "Affected Communities (S3)", "content": "Detailed content"}, {"title": "Consumers & End-Users (S4)", "content": "Detailed content"}]},
    {"id": "esrs_g1", "title": "ESRS G1 — Business Conduct", "content": "Governance topic overview", "subsections": [{"title": "Corporate Culture & Anti-Corruption", "content": "Detailed content"}, {"title": "Whistleblower Protection", "content": "Detailed content"}, {"title": "Political Engagement & Payment Practices", "content": "Detailed content"}]},
    {"id": "metrics_targets", "title": "Metrics, Targets & KPIs", "content": "Overview of metrics approach", "subsections": [{"title": "Climate & Environmental Metrics", "content": "Detailed content"}, {"title": "Social & Workforce Metrics", "content": "Detailed content"}, {"title": "Target Setting & Progress Tracking", "content": "Detailed content"}]},
    {"id": "eu_taxonomy", "title": "EU Taxonomy Alignment", "content": "EU Taxonomy overview", "subsections": [{"title": "Eligible & Aligned Activities", "content": "Detailed content"}, {"title": "Technical Screening Criteria", "content": "Detailed content"}, {"title": "Do No Significant Harm Assessment", "content": "Detailed content"}]},
    {"id": "assurance_next_steps", "title": "Assurance Readiness & Next Steps", "content": "Assurance planning", "subsections": [{"title": "Data Quality & Internal Controls", "content": "Detailed content"}, {"title": "Assurance Engagement Planning", "content": "Detailed content"}, {"title": "Implementation Roadmap", "content": "Detailed content"}]}
  ],
  "recommendations": ["5-8 specific, actionable recommendations for CSRD compliance"],
  "dataSources": ["List of 5-8 authoritative data sources and frameworks referenced"]
}`;

  return generateFrameworkReport("CSRD/ESRS", prompt, request, industry);
}

export async function generateTcfdReport(request: ReportRequest): Promise<ReportResponse> {
  const industry = request.industry || "General";
  const companyCtx = buildCompanyContext(request, industry);
  const prompt = `You are an expert climate risk consultant specializing in TCFD reporting. Generate a comprehensive TCFD-aligned climate disclosure report for the company described below.

COMPANY INFORMATION:
${companyCtx}

Generate a detailed TCFD report following the 4-pillar structure. Each section should contain substantive, specific content with sector-relevant analysis. Use real regulatory references and climate science.

Return JSON with this structure:
{
  "executiveSummary": "A comprehensive executive summary (3-4 paragraphs) covering climate risk exposure, key findings, strategic positioning, and recommendations",
  "sections": [
    {"id": "governance", "title": "Governance", "content": "Overview of climate governance", "subsections": [{"title": "Board Oversight of Climate Risks & Opportunities", "content": "Board structure, committees, climate competence, frequency of review"}, {"title": "Management's Role in Climate Risk Assessment", "content": "Management responsibilities, reporting lines, decision-making"}, {"title": "Integration with Enterprise Risk Management", "content": "How climate is embedded in ERM framework"}]},
    {"id": "strategy", "title": "Strategy", "content": "Overview of climate strategy", "subsections": [{"title": "Climate-Related Risks Identified", "content": "Transition and physical risks by time horizon"}, {"title": "Climate-Related Opportunities", "content": "Resource efficiency, energy, products, markets, resilience"}, {"title": "Scenario Analysis", "content": "Analysis under 1.5C and 3C+ scenarios with financial implications"}, {"title": "Impact on Business Model & Financial Planning", "content": "Revenue, expenditure, capital allocation impacts"}]},
    {"id": "risk_management", "title": "Risk Management", "content": "Overview of climate risk management", "subsections": [{"title": "Process for Identifying Climate Risks", "content": "Identification methodology, scope, value chain"}, {"title": "Process for Managing Climate Risks", "content": "Mitigation, transfer, acceptance strategies"}, {"title": "Integration with Overall Risk Management", "content": "Enterprise-wide integration"}]},
    {"id": "metrics_targets", "title": "Metrics & Targets", "content": "Overview of climate metrics", "subsections": [{"title": "GHG Emissions (Scope 1, 2, 3)", "content": "Emissions measurement, methodology, trends"}, {"title": "Climate-Related Metrics", "content": "Carbon intensity, energy use, water stress, climate VaR"}, {"title": "Targets & Performance", "content": "Emissions reduction, renewable energy, net-zero targets"}]},
    {"id": "transition_risks", "title": "Transition Risk Deep Dive", "content": "Transition risk analysis", "subsections": [{"title": "Policy & Legal Risks", "content": "Carbon pricing, regulations, litigation, stranded assets"}, {"title": "Technology Risks", "content": "Disruption, substitution, R&D requirements"}, {"title": "Market & Reputation Risks", "content": "Consumer preferences, stigmatization, stakeholder pressure"}]},
    {"id": "physical_risks", "title": "Physical Risk Deep Dive", "content": "Physical risk analysis", "subsections": [{"title": "Acute Physical Risks", "content": "Extreme weather, flooding, wildfires, storms"}, {"title": "Chronic Physical Risks", "content": "Temperature rise, sea level rise, water stress"}, {"title": "Supply Chain Exposure", "content": "Value chain climate vulnerability"}]},
    {"id": "financial_impact", "title": "Financial Impact Assessment", "content": "Financial impact analysis", "subsections": [{"title": "Revenue & Cost Implications", "content": "Climate impacts on revenue and costs"}, {"title": "Capital Expenditure & Investment", "content": "Climate-related CapEx, green investment"}, {"title": "Balance Sheet & Financing", "content": "Asset valuation, cost of capital, green financing"}]},
    {"id": "action_plan", "title": "Recommendations & Action Plan", "content": "Strategic recommendations", "subsections": [{"title": "Short-Term Actions (1-2 years)", "content": "Immediate priorities"}, {"title": "Medium-Term Strategy (3-5 years)", "content": "Strategic climate resilience initiatives"}, {"title": "Long-Term Vision (5-10+ years)", "content": "Net-zero pathway and positioning"}]}
  ],
  "recommendations": ["5-8 specific, actionable recommendations for TCFD reporting and climate resilience"],
  "dataSources": ["List of 5-8 authoritative data sources and frameworks referenced"]
}`;

  return generateFrameworkReport("TCFD", prompt, request, industry);
}

export async function generateTnfdReport(request: ReportRequest): Promise<ReportResponse> {
  const industry = request.industry || "General";
  const companyCtx = buildCompanyContext(request, industry);
  const prompt = `You are an expert nature and biodiversity consultant specializing in TNFD reporting. Generate a comprehensive TNFD-aligned nature-related financial disclosure report for the company described below.

COMPANY INFORMATION:
${companyCtx}

Generate a detailed TNFD report following the LEAP approach and 4-pillar structure. Each section should contain substantive, specific content with nature and biodiversity focus. Reference the Kunming-Montreal Global Biodiversity Framework, ecosystem services, and sector-specific nature dependencies.

Return JSON with this structure:
{
  "executiveSummary": "A comprehensive executive summary (3-4 paragraphs) covering nature-related dependencies, impacts, risks, opportunities, and strategic recommendations",
  "sections": [
    {"id": "governance", "title": "Governance", "content": "Overview of nature-related governance", "subsections": [{"title": "Board Oversight of Nature-Related Issues", "content": "Board structure, nature competency, oversight"}, {"title": "Management's Role in Nature Risk Assessment", "content": "Management responsibilities, LEAP implementation"}, {"title": "Stakeholder Engagement on Nature", "content": "Engagement with communities, NGOs, experts"}]},
    {"id": "strategy", "title": "Strategy", "content": "Overview of nature-related strategy", "subsections": [{"title": "Nature-Related Dependencies & Impacts", "content": "Dependencies on and impacts to nature across value chain"}, {"title": "Nature-Related Risks & Opportunities", "content": "Transition, physical, systemic nature risks and opportunities"}, {"title": "Scenario Analysis for Nature", "content": "Nature-positive vs continued degradation scenarios"}, {"title": "Impact on Business Strategy", "content": "How nature affects business model and planning"}]},
    {"id": "risk_management", "title": "Risk & Impact Management", "content": "LEAP-based nature risk management", "subsections": [{"title": "LEAP: Locate", "content": "Interface with nature: locations, biomes, protected areas, KBAs"}, {"title": "LEAP: Evaluate", "content": "Dependencies and impacts: ecosystem services, direct/indirect impacts"}, {"title": "LEAP: Assess", "content": "Material risks and opportunities: financial materiality of nature issues"}, {"title": "LEAP: Prepare", "content": "Response strategies: mitigation hierarchy, nature-positive targets"}]},
    {"id": "metrics_targets", "title": "Metrics & Targets", "content": "Overview of nature-related metrics", "subsections": [{"title": "Core Nature Metrics", "content": "Land use, freshwater use, pollution, ecosystem extent"}, {"title": "Biodiversity Metrics", "content": "Species abundance, habitat quality, ecosystem integrity"}, {"title": "Nature-Positive Targets", "content": "SBTN targets, GBF alignment, net-gain commitments"}]},
    {"id": "dependencies", "title": "Nature Dependencies Assessment", "content": "Ecosystem service dependencies overview", "subsections": [{"title": "Ecosystem Service Dependencies", "content": "Water, pollination, soil, climate regulation dependencies"}, {"title": "Supply Chain Nature Dependencies", "content": "Raw material sourcing, commodity nature dependencies"}, {"title": "Dependency Risk Hotspots", "content": "Geographic concentration of dependencies"}]},
    {"id": "impacts", "title": "Nature Impacts Assessment", "content": "Impacts on nature overview", "subsections": [{"title": "Direct Operational Impacts", "content": "Land use change, emissions, water discharge"}, {"title": "Value Chain Impacts", "content": "Upstream and downstream nature impacts"}, {"title": "Cumulative & Systemic Impacts", "content": "Contribution to nature loss and tipping points"}]},
    {"id": "biodiversity", "title": "Biodiversity & Protected Areas", "content": "Biodiversity considerations", "subsections": [{"title": "Operations Near Sensitive Areas", "content": "Protected areas, KBAs, Ramsar sites proximity"}, {"title": "Species & Habitat Considerations", "content": "Threatened species, habitat degradation, restoration"}, {"title": "GBF Alignment", "content": "Alignment with Kunming-Montreal GBF targets"}]},
    {"id": "recommendations", "title": "Recommendations & Nature-Positive Pathway", "content": "Strategic recommendations", "subsections": [{"title": "Immediate Actions", "content": "Priority actions for nature risk management"}, {"title": "Nature-Positive Transition", "content": "Strategy for nature-positive outcomes"}, {"title": "Monitoring & Reporting Improvements", "content": "Data gaps and disclosure roadmap"}]}
  ],
  "recommendations": ["5-8 specific, actionable recommendations for TNFD reporting and nature-positive transition"],
  "dataSources": ["List of 5-8 authoritative data sources (TNFD, SBTN, ENCORE, IBAT, GBF, IPBES, etc.)"]
}`;

  return generateFrameworkReport("TNFD", prompt, request, industry);
}
