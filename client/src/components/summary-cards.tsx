import { TrendingUp, Lightbulb, BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { RiskAssessment } from "@shared/schema";

interface SummaryCardsProps {
  riskAssessments: RiskAssessment[];
}

export function SummaryCards({ riskAssessments }: SummaryCardsProps) {
  const highRiskItems = riskAssessments.filter(
    (risk) => (risk.overallRisk || 0) >= 4
  ).length;

  const opportunities = riskAssessments.filter(
    (risk) => risk.category === "opportunity"
  ).length;

  const averageScore =
    riskAssessments.length > 0
      ? (
          riskAssessments.reduce((sum, risk) => sum + (risk.overallRisk || 0), 0) /
          riskAssessments.length
        ).toFixed(1)
      : "0.0";

  const getScoreCategory = (score: number) => {
    if (score >= 4) return "High risk profile";
    if (score >= 3) return "Medium risk profile";
    return "Lower risk profile";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* High Risk Items */}
      <Card className="border border-gray-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">High Risk Items</p>
              <p className="text-2xl font-bold text-destructive">{highRiskItems}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <TrendingUp className="w-5 h-5 text-destructive" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <TrendingUp className="w-4 h-4 mr-1 text-destructive" />
            <span>
              {highRiskItems > 0 ? "Requires immediate attention" : "No high risks identified"}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Opportunities */}
      <Card className="border border-gray-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Opportunities</p>
              <p className="text-2xl font-bold text-secondary">{opportunities}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Lightbulb className="w-5 h-5 text-secondary" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <TrendingUp className="w-4 h-4 mr-1 text-secondary" />
            <span>
              {opportunities > 0 ? "Ready for development" : "Limited opportunities identified"}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Overall Score */}
      <Card className="border border-gray-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overall Score</p>
              <p className="text-2xl font-bold text-accent">{averageScore}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <BarChart3 className="w-5 h-5 text-accent" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <BarChart3 className="w-4 h-4 mr-1" />
            <span>{getScoreCategory(parseFloat(averageScore))}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
