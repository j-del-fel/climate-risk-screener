import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Save, Download, Leaf, ArrowLeft, Calculator, CheckCircle, FolderOpen, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { Link, useRoute } from "wouter";
import { Stepper } from "@/components/stepper";
import { QuestionnairePanel } from "@/components/questionnaire-panel";
import { RiskAssessmentTable } from "@/components/risk-assessment-table";
import { SummaryCards } from "@/components/summary-cards";
import { AIAnalysisModal } from "@/components/ai-analysis-modal";
import type { AssessmentData, AnalysisStatus, AssessmentQuestion } from "@/types/climate-risk";
import type { Assessment, RiskAssessment, Question } from "@shared/schema";

export default function Assessment() {
  const [match, params] = useRoute("/assessment/:id");
  const assessmentId = params?.id;
  
  const [currentAssessmentId, setCurrentAssessmentId] = useState<string | null>(assessmentId || null);
  const [currentStep, setCurrentStep] = useState(1);
  const [analysisStatus, setAnalysisStatus] = useState<AnalysisStatus>({
    isAnalyzing: false,
    progress: 0,
    currentTask: ""
  });
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [showScenarioView, setShowScenarioView] = useState(false);
  const [hasScenarioAnalysis, setHasScenarioAnalysis] = useState(false);
  const [showDownloadConfirmation, setShowDownloadConfirmation] = useState<{ show: boolean; fileName: string }>({ show: false, fileName: "" });
  const { toast } = useToast();

  const { data: questions } = useQuery<Question[]>({
    queryKey: ["/api/questions"],
  });

  const { data: currentAssessment } = useQuery<Assessment>({
    queryKey: ["/api/assessments", currentAssessmentId],
    enabled: !!currentAssessmentId,
  });

  const { data: riskAssessments } = useQuery<RiskAssessment[]>({
    queryKey: ["/api/assessments", currentAssessmentId, "risks"],
    enabled: !!currentAssessmentId,
  });

  const createAssessmentMutation = useMutation({
    mutationFn: async (data: Omit<AssessmentData, 'id'>) => {
      const response = await fetch("/api/assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create assessment");
      return response.json();
    },
    onSuccess: (data) => {
      setCurrentAssessmentId(data.id);
      setCurrentStep(2);
      queryClient.invalidateQueries({ queryKey: ["/api/assessments"] });
      toast({
        title: "Assessment Started",
        description: "Your climate risk assessment has been initialized.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to start assessment: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const generateRiskAnalysisMutation = useMutation({
    mutationFn: async (assessmentId: string) => {
      setAnalysisStatus({
        isAnalyzing: true,
        progress: 0,
        currentTask: "Analyzing climate transition risks..."
      });

      const response = await fetch(`/api/assessments/${assessmentId}/analyze-risks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Risk analysis failed");
      }

      return response.json();
    },
    onSuccess: (data) => {
      setAnalysisStatus({
        isAnalyzing: false,
        progress: 100,
        currentTask: "Risk analysis completed successfully"
      });
      setCurrentStep(2.5); // Intermediate step to show opportunity option
      queryClient.invalidateQueries({ queryKey: ["/api/assessments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/assessments", currentAssessmentId, "risks"] });
      toast({
        title: "Risk Analysis Complete",
        description: `Generated risk assessments for ${data.risks?.length || 0} categories.`,
      });
    },
    onError: (error) => {
      setAnalysisStatus({
        isAnalyzing: false,
        progress: 0,
        currentTask: "Risk analysis failed"
      });
      toast({
        title: "Risk Analysis Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const generateOpportunityAnalysisMutation = useMutation({
    mutationFn: async (assessmentId: string) => {
      setAnalysisStatus({
        isAnalyzing: true,
        progress: 0,
        currentTask: "Analyzing climate opportunities..."
      });

      const response = await fetch(`/api/assessments/${assessmentId}/analyze-opportunities`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Opportunity analysis failed");
      }

      return response.json();
    },
    onSuccess: (data) => {
      setAnalysisStatus({
        isAnalyzing: false,
        progress: 100,
        currentTask: "Opportunity analysis completed successfully"
      });
      setCurrentStep(3);
      queryClient.invalidateQueries({ queryKey: ["/api/assessments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/assessments", currentAssessmentId, "risks"] });
      toast({
        title: "Opportunity Analysis Complete",
        description: `Generated opportunity assessments for ${data.opportunities?.length || 0} categories.`,
      });
    },
    onError: (error) => {
      setAnalysisStatus({
        isAnalyzing: false,
        progress: 0,
        currentTask: "Opportunity analysis failed"
      });
      toast({
        title: "Opportunity Analysis Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const generateScenarioAnalysisMutation = useMutation({
    mutationFn: async (assessmentId: string) => {
      setAnalysisStatus({
        isAnalyzing: true,
        progress: 0,
        currentTask: "Generating scenario projections..."
      });

      const response = await fetch(`/api/assessments/${assessmentId}/analyze-scenarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Scenario analysis failed");
      }

      return response.json();
    },
    onSuccess: (data) => {
      setAnalysisStatus({
        isAnalyzing: false,
        progress: 100,
        currentTask: "Scenario analysis completed successfully"
      });
      setHasScenarioAnalysis(true);
      queryClient.invalidateQueries({ queryKey: ["/api/assessments", currentAssessmentId, "risks"] });
      toast({
        title: "Scenario Analysis Complete",
        description: `Generated projections across ${data.scenariosAnalyzed} scenarios for ${data.risks?.length || 0} risk categories.`,
      });
    },
    onError: (error) => {
      setAnalysisStatus({
        isAnalyzing: false,
        progress: 0,
        currentTask: "Scenario analysis failed"
      });
      toast({
        title: "Scenario Analysis Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleStartAssessment = async (data: { companyName: string; assessmentFramework: string }) => {
    await createAssessmentMutation.mutateAsync({
      companyName: data.companyName,
      assessmentFramework: data.assessmentFramework,
      businessContext: {},
      currentStep: 1,
      isComplete: false,
    });
  };

  const handleRunAnalysis = async () => {
    if (!currentAssessmentId) return;
    
    // Simulate analysis progress
    setAnalysisStatus({
      isAnalyzing: true,
      progress: 10,
      currentTask: "Analyzing sector-specific risks..."
    });

    setTimeout(() => {
      setAnalysisStatus(prev => ({
        ...prev,
        progress: 30,
        currentTask: "Researching policy and regulatory landscape..."
      }));
    }, 1000);

    setTimeout(() => {
      setAnalysisStatus(prev => ({
        ...prev,
        progress: 60,
        currentTask: "Evaluating transition pathways and opportunities..."
      }));
    }, 2000);

    setTimeout(() => {
      setAnalysisStatus(prev => ({
        ...prev,
        progress: 90,
        currentTask: "Generating narratives and sourcing references..."
      }));
    }, 3000);

    await generateRiskAnalysisMutation.mutateAsync(currentAssessmentId);
  };

  const handleExport = () => {
    if (!currentAssessment || !riskAssessments) {
      toast({
        title: "Export Failed",
        description: "No assessment data available to export.",
        variant: "destructive",
      });
      return;
    }

    // Helper function to escape CSV fields and clean up Unicode characters
    const escapeCSV = (field: any): string => {
      if (field === null || field === undefined) return "";
      let str = String(field);
      
      // Replace problematic Unicode characters with their ASCII equivalents
      str = str
        .replace(/[\u2018\u2019]/g, "'")  // Smart single quotes
        .replace(/[\u201C\u201D]/g, '"')  // Smart double quotes
        .replace(/[\u2013\u2014]/g, "-")  // Em-dash and en-dash
        .replace(/[\u2026]/g, "...")      // Ellipsis
        .replace(/[\u00A0]/g, " ")       // Non-breaking space
        .replace(/[^\x00-\x7F]/g, "");   // Remove any remaining non-ASCII characters
      
      // If field contains comma, quote, or newline, wrap in quotes and escape internal quotes
      if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
        return '"' + str.replace(/"/g, '""') + '"';
      }
      return str;
    };

    // Get current date for versioning
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Create comprehensive documentation content
    const documentationContent = [
      ["CLIMATE RISK SCREENER - METHODOLOGY & DOCUMENTATION"],
      [""],
      ["System Information"],
      ["Software Name", "Climate Transition Risk and Opportunity Screener"],
      ["Version", "2.1.0"],
      ["Release Date", "September 2025"],
      ["Framework Alignment", "TCFD (Task Force on Climate-related Financial Disclosures)"],
      ["AI Model", "OpenAI GPT-5 (August 2025 Release)"],
      [""],
      ["SYSTEM DESIGN & ARCHITECTURE"],
      [""],
      ["Overview"],
      ["This system provides comprehensive climate transition risk and opportunity"],
      ["screening based on established TCFD frameworks. It uses AI-powered analysis"],
      ["to assess climate-related financial risks across transition risks, physical"],
      ["risks, and climate opportunities for organizations."],
      [""],
      ["Core Methodology"],
      ["1. Company Classification: Automatic industry detection using NAICS codes"],
      ["2. Risk Analysis: Fixed subcategories for transition risks following TCFD"],
      ["3. Opportunity Analysis: Dynamic subcategories generated specific to company"],
      ["4. AI-Powered Assessment: GPT-5 model analyzes each risk/opportunity"],
      ["5. Peer Comparison: Ranking against industry competitors (1-6 scale)"],
      ["6. Source Citation: Authoritative sources backing all assessments"],
      [""],
      ["SCORING METHODOLOGY"],
      [""],
      ["Impact Score (1-5)"],
      ["1 = Very Low: Minimal financial or operational impact"],
      ["2 = Low: Limited impact on specific business areas"],
      ["3 = Medium: Moderate impact across multiple areas"],
      ["4 = High: Significant impact on core business operations"],
      ["5 = Very High: Severe impact threatening business viability"],
      [""],
      ["Likelihood Score (1-5)"],
      ["1 = Very Unlikely: <10% probability within time horizon"],
      ["2 = Unlikely: 10-30% probability"],
      ["3 = Possible: 30-50% probability"],
      ["4 = Likely: 50-75% probability"],
      ["5 = Very Likely: >75% probability"],
      [""],
      ["Vulnerability Score (1-5)"],
      ["1 = Very Low: Strong adaptive capacity and resilience"],
      ["2 = Low: Good adaptive capacity with some vulnerabilities"],
      ["3 = Medium: Moderate adaptive capacity"],
      ["4 = High: Limited adaptive capacity"],
      ["5 = Very High: Minimal adaptive capacity, highly exposed"],
      [""],
      ["TIME HORIZONS"],
      ["Short-term: 0-3 years (immediate regulatory/market changes)"],
      ["Medium-term: 3-10 years (transition pathway milestones)"],
      ["Long-term: 10+ years (structural economic transformation)"],
      [""],
      ["RISK CATEGORIES (Fixed Subcategories)"],
      [""],
      ["Transition Risks - Policy & Legal"],
      ["- Carbon pricing mechanisms and regulations"],
      ["- Enhanced emissions reporting obligations"],
      ["- Exposure to litigation risks"],
      [""],
      ["Transition Risks - Technology"],
      ["- Substitution of existing products and services"],
      ["- Unsuccessful investment in new technologies"],
      [""],
      ["Transition Risks - Market"],
      ["- Changing customer behavior and preferences"],
      ["- Increased cost of raw materials"],
      ["- Uncertainty in market signals"],
      [""],
      ["Transition Risks - Reputation"],
      ["- Shift in consumer preferences"],
      ["- Stigmatization of sector"],
      ["- Increased shareholder concern/negative feedback"],
      [""],
      ["OPPORTUNITY CATEGORIES (Dynamic Subcategories)"],
      ["Generated specifically for each company based on industry and business model:"],
      ["- Resource Efficiency: Operational improvements and cost savings"],
      ["- Energy Source: Renewable energy adoption and diversification"],
      ["- Products and Services: New climate-focused offerings"],
      ["- Markets: Access to green markets and incentives"],
      ["- Resilience: Business continuity and adaptive capacity"],
      [""],
      ["PEER COMPARISON METHODOLOGY"],
      ["Companies are ranked against 5 industry peers on a 1-6 scale:"],
      ["1 = Best positioned (lowest risk/highest opportunity)"],
      ["6 = Worst positioned (highest risk/lowest opportunity)"],
      ["Peer selection based on industry classification and business model similarity"],
      [""],
      ["OUTPUT INTERPRETATION"],
      [""],
      ["Narrative: AI-generated 2-3 sentence company-specific summary"],
      ["Reasoning: Detailed explanation of scores with company context"],
      ["Overall Risk: Weighted calculation of impact, likelihood, vulnerability"],
      ["High-Value Opportunities: Opportunities with impact or likelihood >= 4"],
      ["Sources: 3-4 authoritative sources supporting each assessment"],
      [""],
      ["SOURCE VALIDATION"],
      ["All sources are from recognized authorities:"],
      ["- Government agencies and regulatory bodies"],
      ["- International organizations (TCFD, IEA, IPCC)"],
      ["- Major consultancies (McKinsey, BCG, Deloitte)"],
      ["- Academic institutions and research organizations"],
      ["- Industry associations and standards bodies"],
      [""],
      ["LIMITATIONS & DISCLAIMERS"],
      ["- Assessments are based on current information and may change"],
      ["- Results should be validated with internal expertise"],
      ["- System provides screening-level analysis, not detailed risk modeling"],
      ["- Peer comparisons are indicative and may not reflect all factors"],
      ["- Sources are current as of analysis date and should be verified"],
      [""],
      ["TCFD ALIGNMENT"],
      ["This system aligns with TCFD recommendations across four pillars:"],
      ["1. Governance: Risk identification and assessment processes"],
      ["2. Strategy: Business impact assessment and scenario planning"],
      ["3. Risk Management: Systematic risk identification and evaluation"],
      ["4. Metrics & Targets: Quantitative scoring and peer benchmarking"],
      [""],
      ["DATA EXPORT INFORMATION"],
      ["Export Date", currentDate],
      ["Company Analyzed", currentAssessment?.companyName || ""],
      ["Industry Classification", currentAssessment?.industry || ""],
      ["NAICS Code", (currentAssessment as any)?.naicsCode || ""],
      ["Total Risk/Opportunity Items", (riskAssessments || []).length.toString()],
      ["Analysis Completion", "Two-step process: Risks first, then optional opportunities"],
      [""],
      ["=== END OF DOCUMENTATION ==="],
      [""],
      [""],
      ["ASSESSMENT DATA BEGINS BELOW"],
      [""],
    ];

    // Create CSV export data with proper headers
    const dataHeaders = [
      "Company Name", "Industry", "NAICS Code",
      "Category", "Subcategory", "Impact Score", "Likelihood Score", "Vulnerability Score", 
      "Overall Risk", "Narrative", "Reasoning", "Peer Companies", 
      "Impact Ranking", "Likelihood Ranking", "Vulnerability Ranking", "Peer Rationale",
      "Source 1 Title", "Source 1 URL", "Source 1 Organization", "Source 1 Relevance",
      "Source 2 Title", "Source 2 URL", "Source 2 Organization", "Source 2 Relevance",
      "Source 3 Title", "Source 3 URL", "Source 3 Organization", "Source 3 Relevance"
    ];

    const dataRows = (riskAssessments || []).map(risk => {
      const peerComparison = (risk as any).peerComparison;
      const sources = Array.isArray(risk.sources) ? risk.sources : [];
      
      // Extract source information (up to 3 sources)
      const getSourceData = (index: number) => {
        const source = sources[index];
        if (!source) return ['', '', '', ''];
        if (typeof source === 'string') {
          return [`Source ${index + 1}`, source, '', ''];
        }
        return [
          source.title || '',
          source.url || '',
          source.organization || '',
          source.relevance || ''
        ];
      };
      
      return [
        escapeCSV(currentAssessment?.companyName || ""),
        escapeCSV(currentAssessment?.industry || ""),
        escapeCSV((currentAssessment as any)?.naicsCode || ""),
        escapeCSV(risk.category),
        escapeCSV(risk.subcategory),
        escapeCSV(risk.impactScore || ""),
        escapeCSV(risk.likelihoodScore || ""),
        escapeCSV((risk as any).vulnerabilityScore || ""),
        escapeCSV(risk.overallRisk || ""),
        escapeCSV(risk.narrative || ""),
        escapeCSV(risk.reasoning || ""),
        escapeCSV(peerComparison?.peers ? peerComparison.peers.join('; ') : ""),
        escapeCSV(peerComparison?.rankings?.impact || ""),
        escapeCSV(peerComparison?.rankings?.likelihood || ""),
        escapeCSV(peerComparison?.rankings?.vulnerability || ""),
        escapeCSV(peerComparison?.rationale || ""),
        // Source 1
        ...getSourceData(0).map(escapeCSV),
        // Source 2
        ...getSourceData(1).map(escapeCSV),
        // Source 3
        ...getSourceData(2).map(escapeCSV)
      ];
    });

    // Combine documentation and data into single CSV
    const combinedContent = [
      ...documentationContent,
      [dataHeaders.join(",")],
      ...dataRows.map(row => row.join(","))
    ].map(row => Array.isArray(row) ? row.map(cell => escapeCSV(cell)).join(",") : row).join("\n");

    // Add UTF-8 BOM to ensure Excel recognizes the encoding properly
    const BOM = "\uFEFF";
    const blob = new Blob([BOM + combinedContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    const fileName = `climate-risk-assessment-${currentAssessment?.companyName || 'assessment'}-with-documentation.csv`;
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setShowDownloadConfirmation({ show: true, fileName });
  };

  const handleRunOpportunityAnalysis = async () => {
    if (!currentAssessmentId) return;
    
    // Simulate analysis progress for opportunities
    setAnalysisStatus({
      isAnalyzing: true,
      progress: 10,
      currentTask: "Generating industry-specific opportunities..."
    });

    setTimeout(() => {
      setAnalysisStatus(prev => ({
        ...prev,
        progress: 50,
        currentTask: "Analyzing competitive advantages and market positioning..."
      }));
    }, 1000);

    setTimeout(() => {
      setAnalysisStatus(prev => ({
        ...prev,
        progress: 90,
        currentTask: "Finalizing opportunity assessments..."
      }));
    }, 2000);

    await generateOpportunityAnalysisMutation.mutateAsync(currentAssessmentId);
  };

  const handleRunScenarioAnalysis = async () => {
    if (!currentAssessmentId) return;
    
    // Simulate analysis progress for scenario projections
    setAnalysisStatus({
      isAnalyzing: true,
      progress: 10,
      currentTask: "Analyzing NGFS climate scenarios..."
    });

    setTimeout(() => {
      setAnalysisStatus(prev => ({
        ...prev,
        progress: 40,
        currentTask: "Projecting risk scores across scenarios..."
      }));
    }, 1000);

    setTimeout(() => {
      setAnalysisStatus(prev => ({
        ...prev,
        progress: 80,
        currentTask: "Generating scenario heat maps..."
      }));
    }, 2000);

    await generateScenarioAnalysisMutation.mutateAsync(currentAssessmentId);
  };

  const steps: Array<{ title: string; status: "complete" | "current" | "pending" }> = [
    { title: "Assessment Setup", status: currentStep >= 1 ? "complete" : "pending" },
    { title: "Risk Screening", status: currentStep >= 2 ? "complete" : "pending" },
    { title: "Results & Export", status: currentStep >= 3 ? "complete" : "pending" }
  ];

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-600">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Leaf className="text-secondary text-xl" />
                <h1 className="text-xl font-semibold text-gray-900">Climate Risk Assessment</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Save className="w-4 h-4 mr-2" />
                Save Progress
              </Button>
              <Button onClick={handleExport} size="sm" disabled={!(riskAssessments?.length)}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              {currentStep >= 3 && (
                <>
                  <Link href={`/financial-impact/${currentAssessmentId}`}>
                    <Button size="sm" variant="outline" data-testid="button-financial-impact">
                      <Calculator className="w-4 h-4 mr-2" />
                      Financial Impact Analysis
                    </Button>
                  </Link>
                  <Link href="/">
                    <Button size="sm">
                      Run Another Analysis
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Progress Stepper */}
        <div className="mb-8">
          <Stepper steps={steps} currentStep={currentStep} />
        </div>

        {currentStep === 1 && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Start Your Climate Risk Assessment</h2>
              <QuestionnairePanel
                questions={(questions || []).map(q => ({
                  id: q.id,
                  questionText: q.questionText,
                  questionType: q.questionType as 'multiple_choice' | 'text' | 'scale',
                  category: q.category,
                  options: q.options as any,
                  order: q.order
                }))}
                onComplete={handleStartAssessment}
                isLoading={createAssessmentMutation.isPending}
              />
            </div>
          </div>
        )}

        {currentStep >= 2 && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Assessment Controls Panel */}
            <div className="xl:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">AI Analysis Controls</h2>
                {!(riskAssessments?.length) ? (
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-3 rounded-lg border">
                      <h3 className="text-sm font-semibold text-blue-900 mb-2">Company Classification</h3>
                      <div className="text-sm text-blue-800 space-y-1">
                        <p><strong>Company:</strong> {currentAssessment?.companyName}</p>
                        <p><strong>Industry:</strong> {currentAssessment?.industry}</p>
                        {(currentAssessment as any)?.naicsCode && (
                          <p><strong>NAICS Code:</strong> {(currentAssessment as any).naicsCode}</p>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      Ready to analyze climate risks and opportunities for {currentAssessment?.companyName} 
                      in the {currentAssessment?.industry} sector.
                    </p>
                    <Button
                      onClick={handleRunAnalysis}
                      disabled={generateRiskAnalysisMutation.isPending}
                      className="w-full"
                    >
                      {generateRiskAnalysisMutation.isPending ? "Analyzing Risks..." : "Run Risk Analysis"}
                    </Button>
                  </div>
                ) : currentStep === 2.5 ? (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600 mb-2">
                      ✅ Risk analysis completed! 
                    </p>
                    <p className="text-sm text-gray-600">
                      Would you like to analyze climate opportunities specific to {currentAssessment?.companyName}?
                    </p>
                    <div className="space-y-2">
                      <Button
                        onClick={handleRunOpportunityAnalysis}
                        disabled={generateOpportunityAnalysisMutation.isPending}
                        className="w-full"
                      >
                        {generateOpportunityAnalysisMutation.isPending ? "Analyzing Opportunities..." : "Add Opportunity Analysis"}
                      </Button>
                      <Button variant="outline" onClick={() => setCurrentStep(3)} className="w-full">
                        Skip to Results
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Analysis completed. Review your results and export when ready.
                    </p>
                    
                    {/* Scenario Analysis Controls */}
                    {!hasScenarioAnalysis && (
                      <div className="border-t pt-4 space-y-3">
                        <div className="bg-green-50 p-3 rounded-lg border">
                          <h3 className="text-sm font-semibold text-green-900 mb-1">Enhanced Analysis</h3>
                          <p className="text-xs text-green-800">
                            Project your risk scores across all 7 NGFS climate scenarios
                          </p>
                        </div>
                        <Button 
                          onClick={handleRunScenarioAnalysis}
                          disabled={generateScenarioAnalysisMutation.isPending}
                          variant="secondary"
                          className="w-full"
                        >
                          {generateScenarioAnalysisMutation.isPending ? "Generating Scenarios..." : "Run Scenario Analysis"}
                        </Button>
                      </div>
                    )}

                    {/* View Toggle Controls */}
                    {hasScenarioAnalysis && (
                      <div className="border-t pt-4 space-y-3">
                        <div className="bg-blue-50 p-3 rounded-lg border">
                          <h3 className="text-sm font-semibold text-blue-900 mb-2">View Results</h3>
                          <div className="flex space-x-2">
                            <Button 
                              size="sm"
                              variant={!showScenarioView ? "default" : "outline"}
                              onClick={() => setShowScenarioView(false)}
                              className="flex-1"
                            >
                              Baseline Scores
                            </Button>
                            <Button 
                              size="sm"
                              variant={showScenarioView ? "default" : "outline"}
                              onClick={() => setShowScenarioView(true)}
                              className="flex-1"
                            >
                              Scenario Analysis
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    <Button onClick={handleExport} className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Export Results
                    </Button>
                  </div>
                )}
              </div>

              {/* AI Analysis Status */}
              {analysisStatus.isAnalyzing && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">AI Analysis Status</div>
                        <div className="text-xs text-gray-500">{analysisStatus.currentTask}</div>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-primary">{analysisStatus.progress}%</div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${analysisStatus.progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Risk Assessment Table */}
            <div className="xl:col-span-2">
              <RiskAssessmentTable
                riskAssessments={riskAssessments || []}
                onUpdateRisk={(id, updates) => {
                  // Handle manual risk updates
                  console.log("Updating risk:", id, updates);
                }}
                onShowAnalysisModal={() => setShowAnalysisModal(true)}
                showScenarioView={showScenarioView}
                hasScenarioAnalysis={hasScenarioAnalysis}
                assessmentFramework={currentAssessment?.assessmentFramework || 'standard'}
              />

              {/* Summary Cards */}
              {(riskAssessments?.length ?? 0) > 0 && (
                <div className="mt-6">
                  <SummaryCards riskAssessments={riskAssessments || []} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* AI Analysis Modal */}
      <AIAnalysisModal
        isOpen={showAnalysisModal}
        onClose={() => setShowAnalysisModal(false)}
        analysisResults={riskAssessments || []}
      />

      {/* Download Confirmation Dialog */}
      <Dialog open={showDownloadConfirmation.show} onOpenChange={(open) => setShowDownloadConfirmation({ show: open, fileName: "" })}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <span>Download Complete!</span>
            </DialogTitle>
            <DialogDescription className="pt-4 space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg border">
                <p className="text-sm font-medium text-gray-900 mb-1">File saved:</p>
                <p className="text-sm text-gray-600 font-mono break-all">{showDownloadConfirmation.fileName}</p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div className="flex items-start gap-3">
                  <FolderOpen className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-blue-900 mb-2">How to find your file:</p>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>1. Open the <strong>Files</strong> app</li>
                      <li>2. Tap <strong>Browse</strong> at the bottom</li>
                      <li>3. Go to <strong>Downloads</strong> folder</li>
                      <li>4. Look for your CSV file</li>
                    </ul>
                  </div>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowDownloadConfirmation({ show: false, fileName: "" })}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}