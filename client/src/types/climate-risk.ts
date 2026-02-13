export interface ClimateRiskCategory {
  id: string;
  category: 'transition' | 'physical' | 'opportunity';
  subcategory: string;
  title: string;
  description: string;
  icon: string;
  impactScore?: number;
  likelihoodScore?: number;
  timeHorizon?: 'short' | 'medium' | 'long';
  overallRisk?: number;
  narrative?: string;
  reasoning?: string;
  sources?: string[];
}

export interface QuestionOption {
  value: string;
  label: string;
  risk?: string;
  description?: string;
  multiplier?: number;
}

export interface AssessmentQuestion {
  id: string;
  questionText: string;
  questionType: 'multiple_choice' | 'text' | 'scale';
  category: string;
  options?: QuestionOption[];
  order: number;
}

export interface AssessmentData {
  id?: string;
  companyName: string;
  industry?: string; // Auto-determined by AI
  naicsCode?: string; // Auto-determined NAICS code
  assessmentFramework?: string; // 'standard' or 'advanced'
  businessContext: Record<string, any>;
  currentStep: number;
  isComplete: boolean;
}

export interface AnalysisStatus {
  isAnalyzing: boolean;
  progress: number;
  currentTask: string;
}
