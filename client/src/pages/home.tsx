import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Save, Download, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { Stepper } from "@/components/stepper";
import { QuestionnairePanel } from "@/components/questionnaire-panel";
import { RiskAssessmentTable } from "@/components/risk-assessment-table";
import { SummaryCards } from "@/components/summary-cards";
import { AIAnalysisModal } from "@/components/ai-analysis-modal";
import type { AssessmentData, AnalysisStatus, AssessmentQuestion } from "@/types/climate-risk";
import type { Assessment, RiskAssessment, Question } from "@shared/schema";

export default function Home() {
  const [currentAssessmentId, setCurrentAssessmentId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [analysisStatus, setAnalysisStatus] = useState<AnalysisStatus>({
    isAnalyzing: false,
    progress: 0,
    currentTask: ""
  });
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
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

  const generateAnalysisMutation = useMutation({
    mutationFn: async (assessmentId: string) => {
      setAnalysisStatus({
        isAnalyzing: true,
        progress: 0,
        currentTask: "Initializing AI analysis..."
      });

      const response = await fetch(`/api/assessments/${assessmentId}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Analysis failed");
      }

      return response.json();
    },
    onSuccess: (data) => {
      setAnalysisStatus({
        isAnalyzing: false,
        progress: 100,
        currentTask: "Analysis completed successfully"
      });
      setCurrentStep(3);
      queryClient.invalidateQueries({ queryKey: ["/api/assessments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/assessments", currentAssessmentId, "risks"] });
      toast({
        title: "AI Analysis Complete",
        description: `Generated risk assessments for ${data.risks?.length || 0} categories.`,
      });
    },
    onError: (error) => {
      setAnalysisStatus({
        isAnalyzing: false,
        progress: 0,
        currentTask: "Analysis failed"
      });
      toast({
        title: "Analysis Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleStartAssessment = async (data: { companyName: string; industry: string }) => {
    await createAssessmentMutation.mutateAsync({
      companyName: data.companyName,
      industry: data.industry,
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

    await generateAnalysisMutation.mutateAsync(currentAssessmentId);
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

    // Create CSV export data
    const csvData = [
      ["Category", "Subcategory", "Impact Score", "Likelihood Score", "Vulnerability Score", "Time Horizon", "Overall Risk", "Narrative", "Reasoning", "Peer Comparison"],
      ...(riskAssessments || []).map(risk => [
        risk.category,
        risk.subcategory,
        risk.impactScore || "",
        risk.likelihoodScore || "",
        (risk as any).vulnerabilityScore || "",
        risk.timeHorizon || "",
        risk.overallRisk || "",
        risk.narrative || "",
        risk.reasoning || "",
        (risk as any).peerComparison ? JSON.stringify((risk as any).peerComparison) : ""
      ])
    ];

    const csvContent = csvData.map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.download = `climate-risk-assessment-${currentAssessment?.companyName || 'assessment'}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: "Assessment data has been downloaded as CSV file.",
    });
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
              <div className="flex items-center space-x-2">
                <Leaf className="text-secondary text-xl" />
                <h1 className="text-xl font-semibold text-gray-900">Climate Risk Screener</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Save className="w-4 h-4 mr-2" />
                Save Progress
              </Button>
              <Button onClick={handleExport} size="sm" disabled={!riskAssessments?.length}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
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
                    <p className="text-sm text-gray-600">
                      Ready to analyze climate risks and opportunities for {currentAssessment?.companyName} 
                      in the {currentAssessment?.industry} sector.
                    </p>
                    <Button
                      onClick={handleRunAnalysis}
                      disabled={generateAnalysisMutation.isPending}
                      className="w-full"
                    >
                      {generateAnalysisMutation.isPending ? "Analyzing..." : "Run AI Analysis"}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Analysis completed. Review your results and export when ready.
                    </p>
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
    </div>
  );
}
