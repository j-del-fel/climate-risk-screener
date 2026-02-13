import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { AssessmentQuestion } from "@/types/climate-risk";

interface QuestionnairePanelProps {
  questions: AssessmentQuestion[];
  onComplete: (data: { companyName: string; assessmentFramework: string }) => void;
  isLoading: boolean;
}

export function QuestionnairePanel({
  questions,
  onComplete,
  isLoading,
}: QuestionnairePanelProps) {
  const [companyName, setCompanyName] = useState("");
  const [assessmentFramework, setAssessmentFramework] = useState("standard");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (companyName.trim()) {
      onComplete({ 
        companyName: companyName.trim(),
        assessmentFramework 
      });
    }
  };

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case "high":
        return "text-accent bg-red-100";
      case "medium":
        return "text-accent bg-yellow-100";
      case "low":
        return "text-secondary bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="companyName">Company Name</Label>
        <Input
          id="companyName"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="Enter your company name (e.g., Apple Inc., Tesla, ExxonMobil)"
          required
          data-testid="input-company-name"
        />
        <p className="text-sm text-gray-600">
          Our AI will automatically identify your industry sector and assign the appropriate NAICS code for sector-specific analysis.
        </p>
      </div>

      <div className="space-y-3">
        <Label>Assessment Framework</Label>
        <RadioGroup value={assessmentFramework} onValueChange={setAssessmentFramework}>
          <div className="flex items-start space-x-3 p-4 rounded-lg border-2 border-gray-200 hover:border-blue-300 transition-colors cursor-pointer" onClick={() => setAssessmentFramework("standard")}>
            <RadioGroupItem value="standard" id="standard" data-testid="radio-framework-standard" className="mt-1" />
            <div className="flex-1">
              <Label htmlFor="standard" className="cursor-pointer font-medium text-gray-900">
                Standard Framework
              </Label>
              <p className="text-sm text-gray-600 mt-1">
                Evaluates risks and opportunities using Impact, Likelihood, and Vulnerability metrics
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-4 rounded-lg border-2 border-gray-200 hover:border-blue-300 transition-colors cursor-pointer" onClick={() => setAssessmentFramework("advanced")}>
            <RadioGroupItem value="advanced" id="advanced" data-testid="radio-framework-advanced" className="mt-1" />
            <div className="flex-1">
              <Label htmlFor="advanced" className="cursor-pointer font-medium text-gray-900">
                Advanced Framework
              </Label>
              <p className="text-sm text-gray-600 mt-1">
                <span className="font-medium">For Risks:</span> Exposure, Vulnerability, Strategic Misalignment, Mitigation Readiness<br/>
                <span className="font-medium">For Opportunities:</span> Strategic Misalignment, Market Readiness, Value Creation, Feasibility
              </p>
            </div>
          </div>
        </RadioGroup>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={!companyName.trim() || isLoading}
        data-testid="button-start-assessment"
      >
        {isLoading ? "Starting Assessment..." : "Start Risk Assessment"}
      </Button>
    </form>
  );
}
