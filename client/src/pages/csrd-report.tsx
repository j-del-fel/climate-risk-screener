import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, FileText, Loader2, ChevronDown, ChevronUp, Download, Copy, CheckCircle2, Landmark, BookOpen, ChevronRight } from "lucide-react";

interface ReportSection {
  id: string;
  title: string;
  content: string;
  subsections?: Array<{ title: string; content: string }>;
}

interface ReportResult {
  companyName: string;
  industry: string;
  framework: string;
  generatedAt: string;
  executiveSummary: string;
  sections: ReportSection[];
  recommendations: string[];
  dataSources: string[];
}

export default function CsrdReportPage() {
  const [companyName, setCompanyName] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [geography, setGeography] = useState("");
  const [revenue, setRevenue] = useState("");
  const [employees, setEmployees] = useState("");
  const [description, setDescription] = useState("");
  const [materialTopics, setMaterialTopics] = useState("");
  const [reportResult, setReportResult] = useState<ReportResult | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const generateMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/csrd-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName,
          geography: geography || undefined,
          revenue: revenue || undefined,
          employees: employees || undefined,
          description: description || undefined,
          materialTopics: materialTopics || undefined
        }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Report generation failed");
      }
      return response.json();
    },
    onSuccess: (data) => {
      setReportResult(data);
      toast({ title: "Report Generated", description: `CSRD report for ${companyName} created successfully.` });
    },
    onError: (error) => {
      toast({ title: "Generation Failed", description: error.message, variant: "destructive" });
    }
  });

  const toggleSection = (id: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAll = () => {
    if (reportResult) {
      setExpandedSections(new Set(reportResult.sections.map(s => s.id)));
    }
  };

  const collapseAll = () => setExpandedSections(new Set());

  const copyReport = () => {
    if (!reportResult) return;
    let text = `CSRD Report — ${reportResult.companyName}\nIndustry: ${reportResult.industry}\nGenerated: ${new Date(reportResult.generatedAt).toLocaleDateString()}\n\n`;
    text += `EXECUTIVE SUMMARY\n${reportResult.executiveSummary}\n\n`;
    reportResult.sections.forEach(section => {
      text += `${"=".repeat(60)}\n${section.title}\n${"=".repeat(60)}\n${section.content}\n\n`;
      section.subsections?.forEach(sub => {
        text += `--- ${sub.title} ---\n${sub.content}\n\n`;
      });
    });
    text += `RECOMMENDATIONS\n${reportResult.recommendations.map((r, i) => `${i + 1}. ${r}`).join("\n")}\n\n`;
    text += `DATA SOURCES\n${reportResult.dataSources.map((d, i) => `${i + 1}. ${d}`).join("\n")}`;
    navigator.clipboard.writeText(text);
    toast({ title: "Copied", description: "Report copied to clipboard" });
  };

  const downloadReport = () => {
    if (!reportResult) return;
    let text = `CSRD Report — ${reportResult.companyName}\nIndustry: ${reportResult.industry}\nGenerated: ${new Date(reportResult.generatedAt).toLocaleDateString()}\n\n`;
    text += `EXECUTIVE SUMMARY\n${reportResult.executiveSummary}\n\n`;
    reportResult.sections.forEach(section => {
      text += `${"=".repeat(60)}\n${section.title}\n${"=".repeat(60)}\n${section.content}\n\n`;
      section.subsections?.forEach(sub => {
        text += `--- ${sub.title} ---\n${sub.content}\n\n`;
      });
    });
    text += `RECOMMENDATIONS\n${reportResult.recommendations.map((r, i) => `${i + 1}. ${r}`).join("\n")}\n\n`;
    text += `DATA SOURCES\n${reportResult.dataSources.map((d, i) => `${i + 1}. ${d}`).join("\n")}`;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `csrd-report-${reportResult.companyName.toLowerCase().replace(/\s+/g, "-")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Landmark className="text-blue-700 w-5 h-5" />
                <h1 className="text-xl font-semibold text-gray-900">CSRD Report Writer</h1>
              </div>
            </div>
            <Link href="/csrd-education">
              <Button variant="outline" size="sm">
                <BookOpen className="w-4 h-4 mr-2" />
                Learn About CSRD
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!reportResult ? (
          <div className="max-w-2xl mx-auto">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Generate CSRD Report</h2>
              <p className="text-gray-600">
                Create an AI-powered CSRD-aligned sustainability report covering all ESRS standards.
                Only company name is required — additional details improve report quality.
              </p>
            </div>

            <Card>
              <CardContent className="p-6 space-y-6">
                <div>
                  <Label htmlFor="companyName" className="text-sm font-semibold">Company Name *</Label>
                  <Input
                    id="companyName"
                    placeholder="e.g., Siemens AG"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <Button
                  variant="ghost"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="w-full justify-between text-gray-600"
                >
                  Additional Details (Optional)
                  {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </Button>

                {showAdvanced && (
                  <div className="space-y-4 border-t pt-4">
                    <div>
                      <Label htmlFor="geography" className="text-sm">Geography / Headquarters</Label>
                      <Input id="geography" placeholder="e.g., Germany, European Union" value={geography} onChange={(e) => setGeography(e.target.value)} className="mt-1" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="revenue" className="text-sm">Revenue Range</Label>
                        <Input id="revenue" placeholder="e.g., EUR 10B+" value={revenue} onChange={(e) => setRevenue(e.target.value)} className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="employees" className="text-sm">Employees</Label>
                        <Input id="employees" placeholder="e.g., 50,000+" value={employees} onChange={(e) => setEmployees(e.target.value)} className="mt-1" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="description" className="text-sm">Business Description</Label>
                      <Textarea id="description" placeholder="Brief description of main business activities, products, and services..." value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1" rows={3} />
                    </div>
                    <div>
                      <Label htmlFor="materialTopics" className="text-sm">Key Material Topics</Label>
                      <Input id="materialTopics" placeholder="e.g., climate change, supply chain labor, circular economy" value={materialTopics} onChange={(e) => setMaterialTopics(e.target.value)} className="mt-1" />
                    </div>
                  </div>
                )}

                <Button
                  onClick={() => generateMutation.mutate()}
                  disabled={!companyName.trim() || generateMutation.isPending}
                  className="w-full bg-blue-700 hover:bg-blue-800"
                  size="lg"
                >
                  {generateMutation.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Generating CSRD Report (this may take a minute)...
                    </>
                  ) : (
                    <>
                      <FileText className="w-5 h-5 mr-2" />
                      Generate CSRD Report
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{reportResult.companyName} — CSRD Report</h2>
                <p className="text-gray-600">Industry: {reportResult.industry} | Generated: {new Date(reportResult.generatedAt).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={copyReport}><Copy className="w-4 h-4 mr-1" /> Copy</Button>
                <Button variant="outline" size="sm" onClick={downloadReport}><Download className="w-4 h-4 mr-1" /> Download</Button>
                <Button variant="outline" size="sm" onClick={() => setReportResult(null)}><FileText className="w-4 h-4 mr-1" /> New Report</Button>
              </div>
            </div>

            <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg text-blue-900">Executive Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-line">{reportResult.executiveSummary}</p>
              </CardContent>
            </Card>

            <div className="flex gap-2 mb-4">
              <Button variant="outline" size="sm" onClick={expandAll}>Expand All</Button>
              <Button variant="outline" size="sm" onClick={collapseAll}>Collapse All</Button>
            </div>

            <div className="space-y-4 mb-6">
              {reportResult.sections.map((section, idx) => (
                <Card key={section.id}>
                  <CardHeader
                    className="cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => toggleSection(section.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">{idx + 1}</Badge>
                        <CardTitle className="text-base">{section.title}</CardTitle>
                      </div>
                      {expandedSections.has(section.id) ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                    </div>
                  </CardHeader>
                  {expandedSections.has(section.id) && (
                    <CardContent className="pt-0">
                      <p className="text-gray-700 mb-4 whitespace-pre-line">{section.content}</p>
                      {section.subsections?.map((sub, i) => (
                        <div key={i} className="ml-4 mb-4 pl-4 border-l-2 border-blue-200">
                          <h4 className="font-semibold text-gray-900 mb-2">{sub.title}</h4>
                          <p className="text-gray-600 text-sm whitespace-pre-line">{sub.content}</p>
                        </div>
                      ))}
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="text-lg text-green-900">Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {reportResult.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-gray-200 bg-gray-50">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900">Data Sources & References</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {reportResult.dataSources.map((source, i) => (
                      <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-gray-400 shrink-0">{i + 1}.</span>
                        {source}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
