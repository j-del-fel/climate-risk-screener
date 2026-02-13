import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Gavel, Microchip, TrendingUp, Users, Zap, Cloud, Recycle, Sun, Package, MapPin, Shield, Info, HelpCircle } from "lucide-react";
import type { RiskAssessment } from "@shared/schema";

interface RiskAssessmentTableProps {
  riskAssessments: RiskAssessment[];
  onUpdateRisk: (id: string, updates: Partial<RiskAssessment>) => void;
  onShowAnalysisModal: () => void;
  showScenarioView?: boolean;
  hasScenarioAnalysis?: boolean;
  assessmentFramework?: string;
}

export function RiskAssessmentTable({
  riskAssessments,
  onUpdateRisk,
  onShowAnalysisModal,
  showScenarioView = false,
  hasScenarioAnalysis = false,
  assessmentFramework = 'standard',
}: RiskAssessmentTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedSources, setExpandedSources] = useState<Set<string>>(new Set());

  const toggleSources = (riskId: string) => {
    const newExpanded = new Set(expandedSources);
    if (newExpanded.has(riskId)) {
      newExpanded.delete(riskId);
    } else {
      newExpanded.add(riskId);
    }
    setExpandedSources(newExpanded);
  };

  // Determine which metrics to display based on framework and category
  const getMetricColumns = (category: string) => {
    if (assessmentFramework === 'advanced') {
      if (category === 'opportunity') {
        return [
          { key: 'strategicMisalignmentScore', label: 'Strategic Misalignment' },
          { key: 'marketReadinessScore', label: 'Market Readiness' },
          { key: 'valueCreationScore', label: 'Value Creation' },
          { key: 'feasibilityScore', label: 'Feasibility' },
        ];
      } else {
        // For transition and physical risks
        return [
          { key: 'exposureScore', label: 'Exposure' },
          { key: 'vulnerabilityScore', label: 'Vulnerability' },
          { key: 'strategicMisalignmentScore', label: 'Strategic Misalignment' },
          { key: 'mitigationReadinessScore', label: 'Mitigation Readiness' },
        ];
      }
    } else {
      // Standard framework: same for all categories
      return [
        { key: 'impactScore', label: 'Impact' },
        { key: 'likelihoodScore', label: 'Likelihood' },
        { key: 'vulnerabilityScore', label: 'Vulnerability' },
      ];
    }
  };

  // Render metric cells dynamically (for read-only display)
  const renderMetricCells = (risk: RiskAssessment, isOpportunity: boolean = false) => {
    const metrics = getMetricColumns(risk.category);
    const textColor = isOpportunity ? 'text-emerald-700' : 'text-gray-900';
    
    return metrics.map((metric) => {
      const score = (risk as any)[metric.key] || 3;
      return (
        <td key={metric.key} className="px-4 py-4">
          <div className="flex items-center space-x-2">
            <span className={`text-sm font-bold ${textColor}`}>{score}</span>
            {getScoreIndicator(score)}
          </div>
        </td>
      );
    });
  };

  // Render editable metric cells dynamically
  const renderEditableMetricCells = (risk: RiskAssessment) => {
    const metrics = getMetricColumns(risk.category);
    
    return metrics.map((metric) => {
      const score = (risk as any)[metric.key] || 3;
      return (
        <td key={metric.key} className="px-4 py-4">
          <div className="flex items-center space-x-2">
            <Input
              type="number"
              min="1"
              max="5"
              value={score}
              onChange={(e) =>
                onUpdateRisk(risk.id, { [metric.key]: parseInt(e.target.value) })
              }
              className="w-12 h-8 text-center text-sm"
              data-testid={`input-${metric.key}-${risk.id}`}
            />
            {getScoreIndicator(score)}
          </div>
        </td>
      );
    });
  };

  // Heat map color calculation based on risk score
  const getHeatMapColor = (score: number): string => {
    if (score <= 1.5) return "bg-green-100 text-green-800";
    if (score <= 2.5) return "bg-yellow-100 text-yellow-800";
    if (score <= 3.5) return "bg-orange-100 text-orange-800";
    if (score <= 4.5) return "bg-red-100 text-red-800";
    return "bg-red-200 text-red-900";
  };

  // Process scenario projections data for heat map display
  const processScenarioData = (risk: RiskAssessment) => {
    if (!risk.scenarioProjections) return null;
    
    try {
      const projections = typeof risk.scenarioProjections === 'string' 
        ? JSON.parse(risk.scenarioProjections) 
        : risk.scenarioProjections;
      
      const scenarios = ['Net Zero 2050', 'Below 2°C', 'Delayed Transition', 'Divergent Net Zero', 'NDCs', 'Current Policies', 'Hot House World'];
      const timeHorizons = ['Short-term (2030)', 'Medium-term (2040)', 'Long-term (2050)'];
      
      return { projections, scenarios, timeHorizons };
    } catch (e) {
      return null;
    }
  };

  const getCategoryIcon = (category: string, subcategory: string) => {
    if (category === "transition") {
      switch (subcategory) {
        case "policy_legal": return <Gavel className="w-4 h-4 text-destructive" />;
        case "technology": return <Microchip className="w-4 h-4 text-destructive" />;
        case "market": return <TrendingUp className="w-4 h-4 text-destructive" />;
        case "reputation": return <Users className="w-4 h-4 text-destructive" />;
        default: return <Zap className="w-4 h-4 text-destructive" />;
      }
    } else if (category === "physical") {
      return subcategory === "acute" ? <Zap className="w-4 h-4 text-accent" /> : <Cloud className="w-4 h-4 text-accent" />;
    } else if (category === "opportunity") {
      switch (subcategory) {
        case "resource_efficiency": return <Recycle className="w-4 h-4 text-secondary" />;
        case "energy_source": return <Sun className="w-4 h-4 text-secondary" />;
        case "products_services": return <Package className="w-4 h-4 text-secondary" />;
        case "markets": return <MapPin className="w-4 h-4 text-secondary" />;
        case "resilience": return <Shield className="w-4 h-4 text-secondary" />;
        default: return <Shield className="w-4 h-4 text-secondary" />;
      }
    }
    return <Info className="w-4 h-4" />;
  };

  const getCategoryTitle = (category: string, subcategory: string) => {
    const titles: Record<string, Record<string, { title: string; description: string }>> = {
      transition: {
        policy_legal: { title: "Policy & Legal", description: "Carbon pricing, regulations, litigation" },
        technology: { title: "Technology", description: "Product substitution, tech disruption" },
        market: { title: "Market", description: "Demand shifts, material costs" },
        reputation: { title: "Reputation", description: "Stakeholder concerns, industry stigma" },
      },
      physical: {
        acute: { title: "Acute Physical", description: "Extreme weather events" },
        chronic: { title: "Chronic Physical", description: "Long-term climate pattern shifts" },
      },
      opportunity: {
        resource_efficiency: { title: "Resource Efficiency", description: "Energy/water savings, waste reduction" },
        energy_source: { title: "Energy Source", description: "Low-emission alternatives, incentives" },
        products_services: { title: "Products/Services", description: "New climate solutions, R&D innovation" },
        markets: { title: "Markets", description: "Access to new markets, public sector incentives" },
        resilience: { title: "Resilience", description: "Supply chain diversification, resource substitutes" },
      },
    };
    return titles[category]?.[subcategory] || { title: subcategory, description: "" };
  };

  const getRiskBadge = (score: number) => {
    if (score >= 4) return <Badge variant="destructive">High</Badge>;
    if (score >= 3) return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
    return <Badge className="bg-green-100 text-green-800">Low</Badge>;
  };

  const getScoreIndicator = (score: number) => {
    const color = score >= 4 ? "bg-accent" : score >= 3 ? "bg-yellow-400" : "bg-secondary";
    return <div className={`w-2 h-2 rounded-full ${color}`} />;
  };

  const groupedRisks = riskAssessments.reduce((acc, risk) => {
    const key = risk.category;
    if (!acc[key]) acc[key] = [];
    acc[key].push(risk);
    return acc;
  }, {} as Record<string, RiskAssessment[]>);

  // Separate high-value opportunities based on framework
  const highValueOpportunities = groupedRisks.opportunity?.filter(opp => {
    if (assessmentFramework === 'advanced') {
      // For advanced framework, check any of the opportunity metrics
      return (opp.strategicMisalignmentScore || 0) >= 4 || 
             (opp.marketReadinessScore || 0) >= 4 || 
             (opp.valueCreationScore || 0) >= 4 || 
             (opp.feasibilityScore || 0) >= 4;
    } else {
      // For standard framework, check impact or likelihood
      return (opp.impactScore || 0) >= 4 || (opp.likelihoodScore || 0) >= 4;
    }
  }) || [];

  const categoryHeaders: Record<string, { title: string; bgColor: string; icon: string; description: string }> = {
    "Policy / Legal": { title: "Policy & Legal Risks", bgColor: "bg-red-50", icon: "⚖️", description: "Carbon pricing, regulations, and litigation exposure" },
    "Technology": { title: "Technology Risks", bgColor: "bg-purple-50", icon: "⚙️", description: "Substitution of products and technology investment risks" },
    "Market": { title: "Market Risks", bgColor: "bg-amber-50", icon: "📊", description: "Customer behavior, raw materials, and market signals" },
    "Reputation": { title: "Reputation Risks", bgColor: "bg-rose-50", icon: "🏢", description: "Stakeholder concerns and sector stigmatization" },
    "Physical": { title: "Physical Climate Risks", bgColor: "bg-orange-50", icon: "🌡️", description: "Acute and chronic physical impacts from climate change" },
    opportunity: { title: "Climate Opportunities", bgColor: "bg-green-50", icon: "💡", description: "Potential benefits from climate action and transition" },
    highvalue: { title: "High-Value Opportunities", bgColor: "bg-emerald-100", icon: "🚀", description: "Most significant opportunities with high impact or likelihood" },
  };

  if (!riskAssessments?.length) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Climate Risk & Opportunity Assessment</h2>
            <div className="flex items-center space-x-3">
              <div className="text-sm text-gray-500">
                <Info className="w-4 h-4 mr-1 inline" />
                Scores: 1 (Low) - 5 (High)
              </div>
              <Button variant="ghost" size="sm" onClick={onShowAnalysisModal}>
                <HelpCircle className="w-4 h-4 mr-1" />
                Scoring Guide
              </Button>
            </div>
          </div>
        </div>
        <div className="p-12 text-center">
          <div className="text-gray-400 mb-4">
            <Info className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Risk Assessment Available</h3>
            <p className="text-gray-600">
              Run the AI analysis to generate comprehensive climate risk and opportunity assessments.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Table Header */}
      <div className="px-8 py-6 bg-gradient-to-r from-slate-50 to-gray-50 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Climate Risk & Opportunity Assessment</h2>
            <p className="text-sm text-gray-600">Comprehensive analysis across transition risks, physical risks, and opportunities</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500 bg-white px-3 py-2 rounded-lg border border-gray-200">
              <Info className="w-4 h-4 mr-1 inline" />
              Scores: 1 (Low) - 5 (High)
            </div>
            <Button variant="outline" size="sm" onClick={onShowAnalysisModal} className="bg-white">
              <HelpCircle className="w-4 h-4 mr-1" />
              Scoring Guide
            </Button>
          </div>
        </div>
      </div>

      {/* Conditional Table Container */}
      <div className="overflow-x-auto">
        {showScenarioView && hasScenarioAnalysis ? (
          /* Scenario Analysis Heat Map View */
          <div className="space-y-8 p-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Scenario Analysis Results</h3>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Risk scores projected across all 7 NGFS climate scenarios and multiple time horizons, 
                providing comprehensive insights into future climate risk evolution
              </p>
            </div>

            {/* Heat Map Legend */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
              <h4 className="text-lg font-semibold mb-4 text-gray-900">Risk Intensity Legend</h4>
              <div className="flex flex-wrap justify-center gap-6 text-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-100 border-2 border-green-200 rounded-lg shadow-sm"></div>
                  <span className="font-medium text-gray-700">Low Risk (1.0-1.5)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-yellow-100 border-2 border-yellow-200 rounded-lg shadow-sm"></div>
                  <span className="font-medium text-gray-700">Medium-Low (1.6-2.5)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-orange-100 border-2 border-orange-200 rounded-lg shadow-sm"></div>
                  <span className="font-medium text-gray-700">Medium (2.6-3.5)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-red-100 border-2 border-red-200 rounded-lg shadow-sm"></div>
                  <span className="font-medium text-gray-700">High (3.6-4.5)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-red-200 border-2 border-red-300 rounded-lg shadow-sm"></div>
                  <span className="font-medium text-gray-700">Very High (4.6-5.0)</span>
                </div>
              </div>
            </div>

            {/* Scenario Heat Maps by Category */}
            {Object.entries(groupedRisks).map(([category, risks]) => {
              const categoryInfo = categoryHeaders[category as keyof typeof categoryHeaders];
              if (!categoryInfo) return null;

              return (
                <div key={category} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className={`px-4 py-3 ${categoryInfo.bgColor} border-b`}>
                    <h4 className="font-medium text-gray-900 flex items-center">
                      <span className="mr-2">{categoryInfo.icon}</span>
                      {categoryInfo.title}
                    </h4>
                  </div>

                  {risks.map((risk) => {
                    const scenarioData = processScenarioData(risk);
                    if (!scenarioData) return null;

                    const { projections, scenarios, timeHorizons } = scenarioData;

                    return (
                      <div key={risk.id} className="border-b border-gray-100 last:border-b-0">
                        <div className="px-4 py-3 bg-gray-50">
                          <div className="flex items-center justify-between">
                            <h5 className="font-medium text-sm">{risk.subcategory}</h5>
                            <div className="text-xs text-gray-500">
                              Baseline: {((risk.impactScore || 0) + (risk.likelihoodScore || 0) + (risk.vulnerabilityScore || 0)) / 3}
                            </div>
                          </div>
                        </div>
                        
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="bg-gray-50">
                                <th className="px-2 py-2 text-left font-medium border-r">Time Horizon</th>
                                {scenarios.map((scenario) => (
                                  <th key={scenario} className="px-2 py-2 text-center font-medium border-r min-w-24">
                                    {scenario.replace(/([A-Z])/g, ' $1').trim()}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {timeHorizons.map((timeHorizon) => (
                                <tr key={timeHorizon} className="border-t">
                                  <td className="px-2 py-2 font-medium bg-gray-50 border-r text-xs">
                                    {timeHorizon}
                                  </td>
                                  {scenarios.map((scenario) => {
                                    const score = projections[scenario]?.[timeHorizon] || 3.0;
                                    return (
                                      <td key={`${scenario}-${timeHorizon}`} className="px-2 py-2 border-r">
                                        <div className={`w-full h-8 rounded flex items-center justify-center font-medium text-xs ${getHeatMapColor(score)}`}>
                                          {score.toFixed(1)}
                                        </div>
                                      </td>
                                    );
                                  })}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        ) : (
          /* Baseline Risk Assessment Table */
          <div className="px-8 py-6">
            <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-slate-50">
              <tr className="border-b-2 border-gray-100">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 w-48">
                  Risk/Opportunity Category
                </th>
                {/* Dynamic metric columns based on framework */}
                {assessmentFramework === 'standard' ? (
                  <>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 w-20">
                      Impact
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 w-24">
                      Likelihood
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 w-24">
                      Vulnerability
                    </th>
                  </>
                ) : (
                  <>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 w-24">
                      Metric 1
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 w-24">
                      Metric 2
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 w-24">
                      Metric 3
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 w-24">
                      Metric 4
                    </th>
                  </>
                )}
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 w-20">
                  Overall Risk
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  AI-Generated Analysis
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 w-32">
                  Sources
                </th>
              </tr>
            </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* High-Value Opportunities Section */}
            {highValueOpportunities.length > 0 && (
              <>
                <tr className="bg-emerald-100 border-t-2 border-emerald-300">
                  <td colSpan={assessmentFramework === 'standard' ? 7 : 9} className="px-4 py-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">🚀</span>
                      <div>
                        <span className="text-sm font-bold text-emerald-900 uppercase tracking-wide">
                          High-Value Climate Opportunities
                        </span>
                        <p className="text-xs text-emerald-700 mt-1">
                          Most significant opportunities with high impact or likelihood (Score ≥ 4)
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
                {highValueOpportunities.map((opportunity) => {
                  const categoryInfo = getCategoryTitle(opportunity.category, opportunity.subcategory);
                  return (
                    <tr key={`hv-${opportunity.id}`} className="bg-emerald-50 hover:bg-emerald-100">
                      <td className="px-4 py-4">
                        <div className="flex items-start space-x-3">
                          {getCategoryIcon(opportunity.category, opportunity.subcategory)}
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {opportunity.subcategory} <Badge className="ml-2 bg-emerald-200 text-emerald-800">High Value</Badge>
                            </div>
                            <div className="text-xs text-gray-500">
                              {categoryInfo.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      {renderMetricCells(opportunity, true)}
                      <td className="px-4 py-4">
                        <Badge className="bg-emerald-200 text-emerald-800">Opportunity</Badge>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-gray-700 space-y-2">
                          {opportunity.narrative && (
                            <p className="font-medium text-emerald-800">
                              <strong>Opportunity:</strong> {opportunity.narrative}
                            </p>
                          )}
                          {opportunity.reasoning && (
                            <p>
                              <strong>Details:</strong> {opportunity.reasoning}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="space-y-2">
                          {Array.isArray(opportunity.sources) && opportunity.sources.length > 0 ? (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleSources(opportunity.id)}
                                className="text-xs p-1 h-auto text-emerald-700"
                              >
                                <ExternalLink className="w-3 h-3 mr-1" />
                                {opportunity.sources.length} Sources
                              </Button>
                              {expandedSources.has(opportunity.id) && (
                                <div className="space-y-1 p-2 bg-emerald-100 rounded border border-emerald-300">
                                  {opportunity.sources.slice(0, 4).map((source: any, index: number) => {
                                    const srcData = typeof source === 'string' ? 
                                      { title: `Source ${index + 1}`, url: source, organization: '', relevance: '' } : source;
                                    return (
                                      <div key={index} className="text-xs">
                                        <a
                                          href={srcData.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-emerald-700 hover:text-emerald-900 font-medium flex items-center"
                                        >
                                          <ExternalLink className="w-3 h-3 mr-1 flex-shrink-0" />
                                          {srcData.title}
                                        </a>
                                        {srcData.organization && (
                                          <div className="text-gray-600 ml-4">Source: {srcData.organization}</div>
                                        )}
                                        {srcData.relevance && (
                                          <div className="text-gray-500 ml-4">{srcData.relevance}</div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </>
                          ) : (
                            <span className="text-xs text-gray-400">No sources</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </>
            )}

            {/* Regular Risk and Opportunity Categories */}
            {Object.entries(categoryHeaders).filter(([key]) => key !== 'highvalue').map(([categoryKey, header]) => {
              const categoryRisks = groupedRisks[categoryKey] || [];
              if (!categoryRisks.length) return null;

              return (
                <>
                  {/* Category Header Row */}
                  <tr key={`header-${categoryKey}`} className={header.bgColor}>
                    <td colSpan={assessmentFramework === 'standard' ? 7 : 9} className="px-4 py-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span>{header.icon}</span>
                          <div>
                            <span className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                              {header.title}
                            </span>
                            <p className="text-xs text-gray-600 mt-1">
                              {header.description}
                            </p>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          {categoryRisks.length} items
                        </div>
                      </div>
                    </td>
                  </tr>
                  
                  {/* Category Risk Rows */}
                  {categoryRisks.map((risk) => {
                    const categoryInfo = getCategoryTitle(risk.category, risk.subcategory);
                    const isEditing = editingId === risk.id;

                    return (
                      <tr key={risk.id} className="hover:bg-gray-50" data-testid={`row-risk-${risk.id}`}>
                        <td className="px-4 py-4">
                          <div className="flex items-start space-x-3">
                            {getCategoryIcon(risk.category, risk.subcategory)}
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {categoryInfo.title}
                              </div>
                              <div className="text-xs text-gray-500">
                                {categoryInfo.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        {renderEditableMetricCells(risk)}
                        <td className="px-4 py-4">
                          <div className="flex items-center space-x-2">
                            {getRiskBadge(risk.overallRisk || 3)}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm text-gray-700 space-y-2">
                            {risk.narrative && (
                              <p>
                                <strong>Summary:</strong> {risk.narrative}
                              </p>
                            )}
                            {risk.reasoning && (
                              <p>
                                <strong>Reasoning:</strong> {risk.reasoning}
                              </p>
                            )}
                            {(risk as any).peerComparison?.peers?.length > 0 && (
                              <div className="mt-3 p-2 bg-gray-50 rounded-lg">
                                <p className="text-xs font-semibold text-gray-600 mb-1">Peer Ranking:</p>
                                <div className="text-xs text-gray-600 space-y-1">
                                  <p><strong>Peers:</strong> {(risk as any).peerComparison.peers.join(', ')}</p>
                                  <p><strong>Rankings (1=best, 6=worst):</strong> Impact: {(risk as any).peerComparison.rankings?.impact}/6, Likelihood: {(risk as any).peerComparison.rankings?.likelihood}/6, Vulnerability: {(risk as any).peerComparison.rankings?.vulnerability}/6</p>
                                  {(risk as any).peerComparison.rationale && (
                                    <p><strong>Rationale:</strong> {(risk as any).peerComparison.rationale}</p>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="space-y-2">
                            {Array.isArray(risk.sources) && risk.sources.length > 0 ? (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleSources(risk.id)}
                                  className="text-xs p-1 h-auto"
                                >
                                  <ExternalLink className="w-3 h-3 mr-1" />
                                  {risk.sources.length} Sources
                                </Button>
                                {expandedSources.has(risk.id) && (
                                  <div className="space-y-1 p-2 bg-blue-50 rounded border">
                                    {risk.sources.slice(0, 4).map((source: any, index: number) => {
                                      const srcData = typeof source === 'string' ? 
                                        { title: `Source ${index + 1}`, url: source, organization: '', relevance: '' } : source;
                                      return (
                                        <div key={index} className="text-xs">
                                          <a
                                            href={srcData.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-700 hover:text-blue-900 font-medium flex items-center"
                                          >
                                            <ExternalLink className="w-3 h-3 mr-1 flex-shrink-0" />
                                            {srcData.title}
                                          </a>
                                          {srcData.organization && (
                                            <div className="text-gray-600 ml-4">Source: {srcData.organization}</div>
                                          )}
                                          {srcData.relevance && (
                                            <div className="text-gray-500 ml-4">{srcData.relevance}</div>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </>
                            ) : (
                              <span className="text-xs text-gray-400">No sources</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </>
              );
            })}
          </tbody>
        </table>
          </div>
        )}
      </div>
    </div>
  );
}
