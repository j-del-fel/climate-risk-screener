import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, FileText, Calendar, TrendingUp, BarChart3, Leaf, Factory, Database, BookOpen, ArrowRight, FlaskConical, Globe, Calculator, Recycle, Shield, Globe2, TreePine, Landmark, PenLine, Building2, MapPin, Sprout, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import type { Assessment } from "@shared/schema";

export default function Dashboard() {
  const { data: assessments = [] } = useQuery<Assessment[]>({
    queryKey: ["/api/assessments"],
  });

  return (
    <div className="min-h-screen bg-neutral-50">
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
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Climate Risk Assessment</h2>
          <p className="text-gray-600 max-w-2xl">
            Analyze your organization's climate transition risks and opportunities using AI-powered research 
            and TCFD-aligned frameworks. Generate comprehensive assessments with peer comparisons and detailed narratives.
          </p>
        </div>

        {/* Climate Transition Risk Blurb */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white rounded-lg shadow-sm">
                  <BookOpen className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Understanding Climate Transition Risk
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    Learn about the financial risks from shifting to a low-carbon economy, the TCFD framework, 
                    its history, and how scenario analysis helps organizations prepare for climate futures.
                  </p>
                  <Link href="/learn">
                    <Button variant="outline" className="group">
                      Learn More
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white rounded-lg shadow-sm">
                  <FlaskConical className="w-8 h-8 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Methodology & Data Sources
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    Explore the scoring frameworks, financial impact calculations, NGFS scenarios, and 
                    authoritative data sources that power our climate risk assessments.
                  </p>
                  <Link href="/methodology">
                    <Button variant="outline" className="group border-purple-300 text-purple-700 hover:bg-purple-50">
                      View Methodology
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Assessments</p>
                  <p className="text-2xl font-bold text-gray-900">{assessments.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-secondary" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Risk Categories</p>
                  <p className="text-2xl font-bold text-gray-900">11</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-accent" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">AI-Powered Analysis</p>
                  <p className="text-2xl font-bold text-gray-900">✓</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Actions */}
        <div className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">NGFS Climate Scenarios</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Explore and visualize climate scenario data from all NGFS models (REMIND-Magpie, MessageIX Globiom, GCAM, IAM). 
                  Plot temperature pathways, carbon prices, and economic indicators across all 7 scenarios.
                </p>
                <Link href="/ngfs">
                  <Button size="lg" className="w-full" data-testid="button-explore-ngfs">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Plot NGFS Data
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">Transition Risk Screening</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Create a comprehensive climate risk and opportunity assessment with AI-powered analysis. 
                  Includes scenario analysis showing how baseline scores evolve across all 7 NGFS scenarios.
                </p>
                <Link href="/assessment">
                  <Button size="lg" variant="outline" className="w-full" data-testid="button-start-assessment">
                    <Plus className="w-5 h-5 mr-2" />
                    Run Risk Screening
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">Financial Impact Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Transform climate risk scores into quantified financial impacts using NGFS scenario data. 
                  Run standalone analysis or build upon existing risk screening results.
                </p>
                <Link href="/financial-impact">
                  <Button size="lg" variant="secondary" className="w-full" data-testid="button-financial-impact">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Financial Impact Analysis
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">Sector Intelligence</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Access real economic and emissions data from Climate TRACE, World Bank, BEA, and NGFS sources.
                  Explore sector profiles for energy, manufacturing, agriculture, technology, and food & beverage.
                </p>
                <Link href="/sector-intelligence">
                  <Button size="lg" variant="outline" className="w-full border-amber-500 text-amber-700 hover:bg-amber-50" data-testid="button-sector-intelligence">
                    <Factory className="w-5 h-5 mr-2" />
                    Explore Sector Data
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">Economic Data Explorer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Access economic indicators from FRED, BEA, IMF, OECD, DBnomics, and Data.gov.
                  Explore energy prices, GDP, industrial production, and more for climate risk context.
                </p>
                <Link href="/economic-data">
                  <Button size="lg" variant="outline" className="w-full border-blue-500 text-blue-700 hover:bg-blue-50" data-testid="button-economic-data">
                    <Database className="w-5 h-5 mr-2" />
                    Explore Economic Data
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">Physical Risk Screening</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Map-based physical climate risk analysis using CMIP6 and ISIMIP data.
                  Upload asset locations and view flood, drought, heat, and other hazard exposure.
                </p>
                <Link href="/physical-risk">
                  <Button size="lg" variant="outline" className="w-full border-cyan-600 text-cyan-700 hover:bg-cyan-50" data-testid="button-physical-risk">
                    <Globe className="w-5 h-5 mr-2" />
                    Screen Physical Risks
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">Carbon Pricing Tool</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Input your emissions by scope, location, and product. Run LCA-powered analysis 
                  to find alternative processes and calculate carbon cost savings.
                </p>
                <Link href="/carbon-pricing">
                  <Button size="lg" variant="outline" className="w-full border-green-500 text-green-700 hover:bg-green-50" data-testid="button-carbon-pricing">
                    <Calculator className="w-5 h-5 mr-2" />
                    Carbon Pricing Analysis
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">Understanding LCA</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Learn about Life Cycle Assessment methodology, ISO standards, system boundaries, 
                  impact categories, and real-world examples across products and industries.
                </p>
                <Link href="/lca-education">
                  <Button size="lg" variant="outline" className="w-full border-teal-500 text-teal-700 hover:bg-teal-50" data-testid="button-lca-education">
                    <Recycle className="w-5 h-5 mr-2" />
                    Learn About LCA
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">LCA Calculator</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Calculate lifecycle emissions, energy use, and cost for any product. Define system 
                  boundaries and get three scenarios: low, medium, and high emissions pathways.
                </p>
                <Link href="/lca-calculator">
                  <Button size="lg" variant="outline" className="w-full border-blue-500 text-blue-700 hover:bg-blue-50" data-testid="button-lca-calculator">
                    <Calculator className="w-5 h-5 mr-2" />
                    LCA Calculator
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">Technology Readiness (TRL)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Explore IEA clean energy technology readiness levels. Learn about the 11-level TRL scale, 
                  browse ~600 technologies, and run AI-powered technology risk analysis.
                </p>
                <Link href="/trl">
                  <Button size="lg" variant="outline" className="w-full border-amber-500 text-amber-700 hover:bg-amber-50" data-testid="button-trl">
                    <Lightbulb className="w-5 h-5 mr-2" />
                    Technology Readiness
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">Reputational Risk</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Explore climate-related reputational risks by sector. Access curated reports, 
                  news, and research on stakeholder expectations and brand exposure.
                </p>
                <Link href="/reputational-risk">
                  <Button size="lg" variant="outline" className="w-full border-rose-500 text-rose-700 hover:bg-rose-50" data-testid="button-reputational-risk">
                    <Shield className="w-5 h-5 mr-2" />
                    Reputational Risk Analysis
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">Supply Chain Intelligence</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Map global trade flows and supply chain dependencies using UN Comtrade data. 
                  Visualize input/output relationships and climate risks by sector.
                </p>
                <Link href="/supply-chain">
                  <Button size="lg" variant="outline" className="w-full border-indigo-500 text-indigo-700 hover:bg-indigo-50" data-testid="button-supply-chain">
                    <Globe2 className="w-5 h-5 mr-2" />
                    Explore Supply Chains
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">Ecological Economics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Explore ecological economics concepts: planetary boundaries, natural capital, ecosystem services, 
                  and how they reshape our understanding of business risk.
                </p>
                <div className="space-y-2">
                  <Link href="/ecological-economics">
                    <Button size="lg" variant="outline" className="w-full border-green-600 text-green-700 hover:bg-green-50" data-testid="button-ecological-economics">
                      <BookOpen className="w-5 h-5 mr-2" />
                      Learn Ecological Economics
                    </Button>
                  </Link>
                  <Link href="/ecological-risk">
                    <Button size="lg" variant="outline" className="w-full border-emerald-600 text-emerald-700 hover:bg-emerald-50" data-testid="button-ecological-risk">
                      <TreePine className="w-5 h-5 mr-2" />
                      Run Ecological Risk Assessment
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">TNFD Framework</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Assess nature-related financial risks using the TNFD framework. Analyze dependencies, impacts, 
                  risks, and opportunities related to biodiversity and ecosystem services.
                </p>
                <div className="space-y-2">
                  <Link href="/tnfd-risk">
                    <Button size="lg" variant="outline" className="w-full border-emerald-600 text-emerald-700 hover:bg-emerald-50" data-testid="button-tnfd-risk">
                      <TreePine className="w-5 h-5 mr-2" />
                      Run TNFD Risk Assessment
                    </Button>
                  </Link>
                  <Link href="/tnfd-education">
                    <Button size="lg" variant="outline" className="w-full border-teal-600 text-teal-700 hover:bg-teal-50" data-testid="button-tnfd-education">
                      <Leaf className="w-5 h-5 mr-2" />
                      Learn About TNFD
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">TCFD Risk Tool</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Run a comprehensive TCFD-aligned climate risk and opportunity assessment. Covers transition risks, 
                  physical risks, and climate opportunities with AI-powered analysis.
                </p>
                <Link href="/tcfd-risk">
                  <Button size="lg" variant="outline" className="w-full border-blue-600 text-blue-700 hover:bg-blue-50" data-testid="button-tcfd-risk">
                    <Shield className="w-5 h-5 mr-2" />
                    Run TCFD Risk Analysis
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">CSRD Framework</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Learn about the EU Corporate Sustainability Reporting Directive, ESRS standards, double materiality,
                  and generate AI-powered CSRD-aligned sustainability reports.
                </p>
                <div className="space-y-2">
                  <Link href="/csrd-report">
                    <Button size="lg" variant="outline" className="w-full border-blue-700 text-blue-800 hover:bg-blue-50" data-testid="button-csrd-report">
                      <PenLine className="w-5 h-5 mr-2" />
                      Generate CSRD Report
                    </Button>
                  </Link>
                  <Link href="/csrd-education">
                    <Button size="lg" variant="outline" className="w-full border-indigo-600 text-indigo-700 hover:bg-indigo-50" data-testid="button-csrd-education">
                      <Landmark className="w-5 h-5 mr-2" />
                      Learn About CSRD
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">Report Writing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Generate comprehensive AI-powered sustainability reports aligned with major disclosure frameworks.
                  Just enter a company name and get a full report.
                </p>
                <div className="space-y-2">
                  <Link href="/tcfd-report">
                    <Button size="lg" variant="outline" className="w-full border-sky-600 text-sky-700 hover:bg-sky-50" data-testid="button-tcfd-report">
                      <PenLine className="w-5 h-5 mr-2" />
                      Write TCFD Report
                    </Button>
                  </Link>
                  <Link href="/tnfd-report">
                    <Button size="lg" variant="outline" className="w-full border-emerald-600 text-emerald-700 hover:bg-emerald-50" data-testid="button-tnfd-report">
                      <PenLine className="w-5 h-5 mr-2" />
                      Write TNFD Report
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">SEC Filing Explorer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Search and view SEC EDGAR 10-K annual filings for any US public company. Access financial statements,
                  risk factors, and management discussion directly from official SEC records.
                </p>
                <Link href="/sec-filings">
                  <Button size="lg" variant="outline" className="w-full border-slate-600 text-slate-700 hover:bg-slate-50" data-testid="button-sec-filings">
                    <Building2 className="w-5 h-5 mr-2" />
                    Explore SEC Filings
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">Municipal Climate Risk</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Assess climate risks for US cities covering physical hazards and transition risks.
                  Pre-built assessments for 13 major cities with AI-powered analysis for any additional city.
                </p>
                <Link href="/municipal-risk">
                  <Button size="lg" variant="outline" className="w-full border-cyan-600 text-cyan-700 hover:bg-cyan-50" data-testid="button-municipal-risk">
                    <MapPin className="w-5 h-5 mr-2" />
                    Municipal Risk Assessment
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">Agricultural Environmental Programs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Interactive US county map showing every federal, state, and local environmental program available
                  to farms and agricultural companies. Hover over any county to see available programs.
                </p>
                <Link href="/ag-programs">
                  <Button size="lg" variant="outline" className="w-full border-green-600 text-green-700 hover:bg-green-50" data-testid="button-ag-programs">
                    <Sprout className="w-5 h-5 mr-2" />
                    Explore Ag Programs Map
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">Company Dependencies Database</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Explore material, energy, water, and geographic dependencies for major US companies. 
                  Identify overlapping supply chain risks and enable economic simulation across sectors.
                </p>
                <Link href="/company-dependencies">
                  <Button size="lg" variant="outline" className="w-full border-indigo-600 text-indigo-700 hover:bg-indigo-50" data-testid="button-company-dependencies">
                    <Database className="w-5 h-5 mr-2" />
                    Explore Dependencies
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Previous Assessments */}
        {assessments.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Previous Assessments</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assessments.map((assessment) => (
                <Card key={assessment.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{assessment.companyName}</CardTitle>
                      <Badge variant={assessment.isComplete ? "default" : "secondary"}>
                        {assessment.isComplete ? "Complete" : "In Progress"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">Industry: {assessment.industry}</p>
                      <p className="text-sm text-gray-600 flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {assessment.createdAt ? new Date(assessment.createdAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                    <div className="mt-4">
                      <Link href={`/assessment/${assessment.id}`}>
                        <Button variant="outline" size="sm" className="w-full">
                          {assessment.isComplete ? "View Results" : "Continue Assessment"}
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Features Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-2 border-dashed border-gray-200">
            <CardContent className="p-6 text-center">
              <div className="p-3 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">TCFD-Aligned Framework</h3>
              <p className="text-gray-600 text-sm">
                Comprehensive risk assessment covering transition risks, physical risks, and climate opportunities 
                following TCFD recommendations.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-dashed border-gray-200">
            <CardContent className="p-6 text-center">
              <div className="p-3 bg-green-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <BarChart3 className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI-Powered Analysis</h3>
              <p className="text-gray-600 text-sm">
                Automated scoring, narrative generation, and peer comparisons powered by advanced AI research 
                and climate expertise.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-dashed border-gray-200">
            <CardContent className="p-6 text-center">
              <div className="p-3 bg-orange-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <FileText className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Detailed Reporting</h3>
              <p className="text-gray-600 text-sm">
                Export comprehensive assessments with company-specific narratives, peer rankings, 
                and authoritative source citations.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}