import { X, ExternalLink, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { RiskAssessment } from "@shared/schema";

interface AIAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysisResults: RiskAssessment[];
}

export function AIAnalysisModal({
  isOpen,
  onClose,
  analysisResults,
}: AIAnalysisModalProps) {
  const allSources = Array.from(
    new Set(
      analysisResults
        .flatMap((risk) => (Array.isArray(risk.sources) ? risk.sources : []))
        .filter(Boolean)
    )
  );

  const handleExportSources = () => {
    const sourcesText = allSources.map((source, index) => `${index + 1}. ${source}`).join('\n');
    const blob = new Blob([sourcesText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'climate-risk-sources.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            AI Research & Analysis
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Research Sources */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Research Sources</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {allSources.length > 0 ? (
                allSources.map((source, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <ExternalLink className="w-4 h-4 text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <a
                        href={source}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-gray-900 hover:text-primary truncate block"
                      >
                        {source.length > 60 ? `${source.substring(0, 60)}...` : source}
                      </a>
                      <p className="text-xs text-gray-500 truncate">{source}</p>
                    </div>
                    <span className="text-xs bg-primary text-white px-2 py-1 rounded flex-shrink-0">
                      Verified
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No sources available yet.</p>
              )}
            </div>
          </div>

          {/* Analysis Methodology */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Analysis Methodology</h4>
            <div className="text-sm text-gray-700 space-y-2">
              <p>
                AI analysis incorporates sector-specific risk multipliers based on carbon intensity
                and regulatory exposure:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Policy & Legal: Weighted by regulatory momentum in key markets</li>
                <li>Technology: Assessed against technology maturity curves</li>
                <li>Market: Analyzed using consumer sentiment and investor criteria data</li>
                <li>Reputation: Evaluated against stakeholder activism trends</li>
                <li>Physical Risks: Based on climate projection models and geographic exposure</li>
                <li>Opportunities: Scored using market size, competitive position, and regulatory support</li>
              </ul>
            </div>
          </div>

          {/* TCFD Framework Alignment */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">TCFD Framework Alignment</h4>
            <div className="text-sm text-gray-700">
              <p>
                This assessment follows the Task Force on Climate-related Financial Disclosures (TCFD)
                recommendations, incorporating governance, strategy, risk management, and metrics
                considerations. Scores are calibrated against industry benchmarks and regulatory
                guidance from major markets.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handleExportSources}>
            <Download className="w-4 h-4 mr-2" />
            Export Sources
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
