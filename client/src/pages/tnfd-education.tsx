import { useState } from "react";
import { ArrowLeft, TreePine, Leaf, Globe, BookOpen, ExternalLink, ChevronRight, Target, Search, BarChart3, FileText, Shield, Users, Layers, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";

export default function TnfdEducationPage() {
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
                <TreePine className="text-emerald-600 w-5 h-5" />
                <h1 className="text-xl font-semibold text-gray-900">TNFD Framework</h1>
              </div>
            </div>
            <Link href="/tnfd-risk">
              <Button size="sm" className="bg-emerald-700 hover:bg-emerald-800">
                <ChevronRight className="w-4 h-4 mr-2" />
                Run TNFD Risk Assessment
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What is the TNFD?</h2>
          <Card className="bg-gradient-to-r from-teal-50 to-emerald-50 border-teal-200">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-700 mb-4">
                    The <strong>Taskforce on Nature-related Financial Disclosures (TNFD)</strong> is a global, market-led
                    initiative that provides a risk management and disclosure framework for organizations to report and act
                    on evolving nature-related dependencies, impacts, risks, and opportunities. Launched formally in June 2021
                    and releasing its final recommendations (v1.0) in September 2023, the TNFD builds on the structure of the
                    TCFD (Task Force on Climate-related Financial Disclosures) and extends it to address the full breadth of
                    nature and biodiversity.
                  </p>
                  <p className="text-gray-700 mb-4">
                    Nature underpins economic activity globally — the World Economic Forum estimates that <strong>$44 trillion
                    of economic value generation</strong> (more than half of global GDP) is moderately or highly dependent on
                    nature. Yet nature loss is accelerating: 1 million species face extinction, 75% of terrestrial environments
                    have been significantly altered, and 66% of marine environments show cumulative impacts.
                  </p>
                  <p className="text-gray-700">
                    The TNFD helps organizations understand how they both depend on and impact nature, and translates those
                    relationships into financial risks and opportunities that investors, lenders, and insurers need to evaluate.
                    Over 320 organizations have committed to adopting the TNFD recommendations.
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-4 border border-teal-200">
                    <h4 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-teal-600" />
                      Nature-related Dependencies
                    </h4>
                    <p className="text-sm text-gray-600">Aspects of ecosystem services that an organization or sector relies on to function — such as clean water, pollination, climate regulation, and flood protection. Loss of these services creates operational and financial risk.</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-teal-200">
                    <h4 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                      <Globe className="w-4 h-4 text-teal-600" />
                      Nature-related Impacts
                    </h4>
                    <p className="text-sm text-gray-600">The effects an organization has on nature through its operations and value chain — including land use change, pollution, resource exploitation, invasive species introduction, and climate change contributions.</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-teal-200">
                    <h4 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                      <Target className="w-4 h-4 text-teal-600" />
                      Nature-related Risks & Opportunities
                    </h4>
                    <p className="text-sm text-gray-600">Financial risks arising from nature loss (physical, transition, systemic) and opportunities from nature-positive actions — including new markets, cost savings, resilience improvements, and reputational benefits.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-600" />
                TCFD vs TNFD Comparison
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-amber-300">
                      <th className="text-left py-2 pr-4 font-semibold text-gray-900">Dimension</th>
                      <th className="text-left py-2 pr-4 font-semibold text-gray-900">TCFD</th>
                      <th className="text-left py-2 font-semibold text-gray-900">TNFD</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    <tr className="border-b border-amber-200">
                      <td className="py-2 pr-4 font-medium">Focus Area</td>
                      <td className="py-2 pr-4">Climate change (GHG emissions, energy transition)</td>
                      <td className="py-2">Nature and biodiversity (land, ocean, freshwater, atmosphere)</td>
                    </tr>
                    <tr className="border-b border-amber-200">
                      <td className="py-2 pr-4 font-medium">Risk Types</td>
                      <td className="py-2 pr-4">Physical and transition risks from climate change</td>
                      <td className="py-2">Physical, transition, and systemic risks from nature loss</td>
                    </tr>
                    <tr className="border-b border-amber-200">
                      <td className="py-2 pr-4 font-medium">Data Sources</td>
                      <td className="py-2 pr-4">GHG inventories, climate models, energy data</td>
                      <td className="py-2">IBAT, ENCORE, spatial biodiversity data, ecosystem assessments</td>
                    </tr>
                    <tr className="border-b border-amber-200">
                      <td className="py-2 pr-4 font-medium">Reporting Scope</td>
                      <td className="py-2 pr-4">Scope 1, 2, 3 emissions across value chain</td>
                      <td className="py-2">Dependencies and impacts across direct operations, upstream, downstream, and financed activities</td>
                    </tr>
                    <tr className="border-b border-amber-200">
                      <td className="py-2 pr-4 font-medium">Key Metrics</td>
                      <td className="py-2 pr-4">GHG emissions (tCO2e), carbon intensity, temperature alignment</td>
                      <td className="py-2">Species abundance, ecosystem extent and condition, water use, land use change, pollution</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-medium">Framework Age</td>
                      <td className="py-2 pr-4">Final recommendations June 2017; widely adopted</td>
                      <td className="py-2">Final recommendations September 2023; adoption accelerating</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="leap" className="mb-8">
          <TabsList className="grid grid-cols-4 w-full max-w-2xl">
            <TabsTrigger value="leap">LEAP Approach</TabsTrigger>
            <TabsTrigger value="disclosures">Disclosures</TabsTrigger>
            <TabsTrigger value="nature">Nature & Biodiversity</TabsTrigger>
            <TabsTrigger value="implementation">Implementation</TabsTrigger>
          </TabsList>

          <TabsContent value="leap" className="mt-6">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-gray-900 mb-2">The LEAP Approach</h3>
              <p className="text-gray-600">
                LEAP is the TNFD's integrated assessment process for identifying and assessing nature-related issues.
                It provides a systematic, science-based approach that organizations can use to understand their
                relationship with nature and develop appropriate risk management and disclosure strategies.
              </p>
            </div>

            <div className="grid gap-6">
              <Card className="border-l-4 border-l-teal-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-lg">L</div>
                    Locate — Interface with Nature
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">
                    The first phase identifies where an organization's assets, operations, and value chains interface with
                    nature. This involves mapping the geographic locations of business activities and understanding which
                    biomes, ecosystems, and ecologically sensitive areas are affected.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-teal-50 rounded-lg p-4">
                      <p className="text-xs font-medium text-teal-700 mb-2 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> Key Activities
                      </p>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Identify business activities across the value chain</li>
                        <li>• Map geographic locations of operations and suppliers</li>
                        <li>• Screen for proximity to ecologically sensitive areas</li>
                        <li>• Assess priority locations using spatial data tools (IBAT, ENCORE)</li>
                        <li>• Identify biomes and ecosystems at the interface</li>
                      </ul>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-xs font-medium text-gray-500 mb-2 flex items-center gap-1">
                        <FileText className="w-3 h-3" /> Example Outputs
                      </p>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Heat map of nature interfaces across value chain</li>
                        <li>• List of priority locations for deeper assessment</li>
                        <li>• Identification of Key Biodiversity Areas (KBAs) at risk</li>
                        <li>• Biome and ecosystem classification of operational areas</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-emerald-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-lg">E</div>
                    Evaluate — Dependencies & Impacts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">
                    The second phase evaluates the organization's dependencies on ecosystem services and its impacts
                    on nature at priority locations. This involves analyzing how business processes rely on natural
                    inputs and how they affect the state of nature.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-emerald-50 rounded-lg p-4">
                      <p className="text-xs font-medium text-emerald-700 mb-2 flex items-center gap-1">
                        <Search className="w-3 h-3" /> Key Activities
                      </p>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Identify ecosystem services the business depends on</li>
                        <li>• Evaluate impact drivers (land use, pollution, resource use, invasive species, climate change)</li>
                        <li>• Assess the current state of nature at priority locations</li>
                        <li>• Use ENCORE to map sector-specific dependencies</li>
                        <li>• Engage stakeholders including Indigenous Peoples and local communities</li>
                      </ul>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-xs font-medium text-gray-500 mb-2 flex items-center gap-1">
                        <FileText className="w-3 h-3" /> Example Outputs
                      </p>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Dependency and impact materiality matrix</li>
                        <li>• Assessment of ecosystem service criticality</li>
                        <li>• Impact pathway analysis for each driver</li>
                        <li>• Stakeholder engagement records and findings</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-lg">A</div>
                    Assess — Material Risks & Opportunities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">
                    The third phase translates identified dependencies and impacts into material financial risks and
                    opportunities. This involves assessing physical risks (from nature degradation), transition risks
                    (from regulatory and market shifts), and systemic risks (from ecosystem tipping points).
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-green-50 rounded-lg p-4">
                      <p className="text-xs font-medium text-green-700 mb-2 flex items-center gap-1">
                        <BarChart3 className="w-3 h-3" /> Key Activities
                      </p>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Assess nature-related physical, transition, and systemic risks</li>
                        <li>• Identify nature-positive opportunities</li>
                        <li>• Determine financial materiality of each risk/opportunity</li>
                        <li>• Conduct scenario analysis for different nature futures</li>
                        <li>• Integrate findings with existing enterprise risk management</li>
                      </ul>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-xs font-medium text-gray-500 mb-2 flex items-center gap-1">
                        <FileText className="w-3 h-3" /> Example Outputs
                      </p>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Nature-related risk register with financial quantification</li>
                        <li>• Opportunity assessment with business case analysis</li>
                        <li>• Scenario analysis results (e.g., nature-positive vs. continued decline)</li>
                        <li>• Materiality determination documentation</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-lime-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-lime-100 flex items-center justify-center text-lime-700 font-bold text-lg">P</div>
                    Prepare — Respond & Report
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">
                    The final phase focuses on developing strategies, setting targets, and preparing disclosures aligned
                    with the TNFD recommendations. This includes integrating findings into business strategy, setting
                    science-based targets for nature, and reporting transparently to stakeholders.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-lime-50 rounded-lg p-4">
                      <p className="text-xs font-medium text-lime-700 mb-2 flex items-center gap-1">
                        <Target className="w-3 h-3" /> Key Activities
                      </p>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Develop nature-related strategy and action plans</li>
                        <li>• Set science-based targets for nature (SBTs for Nature)</li>
                        <li>• Design metrics and KPIs for tracking performance</li>
                        <li>• Prepare TNFD-aligned disclosures</li>
                        <li>• Engage with investors and stakeholders on nature strategy</li>
                      </ul>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-xs font-medium text-gray-500 mb-2 flex items-center gap-1">
                        <FileText className="w-3 h-3" /> Example Outputs
                      </p>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• TNFD-aligned disclosure report</li>
                        <li>• Nature transition plan with targets and milestones</li>
                        <li>• Board-approved nature strategy</li>
                        <li>• Performance monitoring dashboard and reporting framework</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-6 bg-teal-50 border-teal-200">
              <CardContent className="p-4">
                <h4 className="font-semibold text-teal-900 mb-2">LEAP is Iterative, Not Linear</h4>
                <p className="text-sm text-teal-800">
                  The LEAP approach is designed to be iterative. Organizations may revisit earlier phases as new information
                  emerges or as their understanding of nature-related issues deepens. The TNFD recommends starting with a
                  scoping exercise and progressively increasing the depth and breadth of assessment over time, applying the
                  principle of proportionality based on the severity and likelihood of impacts and dependencies.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="disclosures" className="mt-6">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Disclosure Recommendations</h3>
              <p className="text-gray-600">
                The TNFD's 14 recommended disclosures are organized around four pillars that mirror the TCFD structure,
                ensuring consistency and enabling integrated climate-nature reporting. Each pillar addresses a critical
                dimension of how organizations govern, strategize, manage, and measure their nature-related issues.
              </p>
            </div>

            <div className="grid gap-6">
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-3">
                    <Users className="w-5 h-5 text-blue-600" />
                    Governance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">
                    Disclose the organization's governance around nature-related dependencies, impacts, risks, and opportunities.
                  </p>
                  <div className="space-y-3">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h5 className="font-semibold text-gray-900 text-sm mb-1">A. Board Oversight</h5>
                      <p className="text-sm text-gray-600">Describe the board's oversight of nature-related dependencies, impacts, risks, and opportunities. Include the frequency of board review, committees responsible, and how nature-related issues inform board decisions on strategy and risk management.</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h5 className="font-semibold text-gray-900 text-sm mb-1">B. Management's Role</h5>
                      <p className="text-sm text-gray-600">Describe management's role in assessing and managing nature-related dependencies, impacts, risks, and opportunities. Include organizational structure, specific roles and responsibilities, and processes for informing management.</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h5 className="font-semibold text-gray-900 text-sm mb-1">C. Human Rights Policies</h5>
                      <p className="text-sm text-gray-600">Describe the organization's human rights policies and engagement activities with respect to Indigenous Peoples, Local Communities, affected and other stakeholders in the organization's assessment of, and response to, nature-related dependencies, impacts, risks, and opportunities.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-emerald-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-3">
                    <Target className="w-5 h-5 text-emerald-600" />
                    Strategy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">
                    Disclose the actual and potential impacts of nature-related risks and opportunities on the organization's businesses, strategy, and financial planning where such information is material.
                  </p>
                  <div className="space-y-3">
                    <div className="bg-emerald-50 rounded-lg p-4">
                      <h5 className="font-semibold text-gray-900 text-sm mb-1">A. Nature-related Risks & Opportunities</h5>
                      <p className="text-sm text-gray-600">Describe the nature-related dependencies, impacts, risks, and opportunities the organization has identified over the short, medium, and long term. Include the location of assets and activities at risk and the biomes and ecosystems involved.</p>
                    </div>
                    <div className="bg-emerald-50 rounded-lg p-4">
                      <h5 className="font-semibold text-gray-900 text-sm mb-1">B. Impact on Business & Financial Planning</h5>
                      <p className="text-sm text-gray-600">Describe the effect nature-related risks and opportunities have had on the organization's business model, value chain, strategy, and financial planning, including any transition plans or analysis.</p>
                    </div>
                    <div className="bg-emerald-50 rounded-lg p-4">
                      <h5 className="font-semibold text-gray-900 text-sm mb-1">C. Resilience of Strategy</h5>
                      <p className="text-sm text-gray-600">Describe the resilience of the organization's strategy to nature-related risks and opportunities, taking into consideration different scenarios. Include how the organization uses scenario analysis to inform its strategy.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-amber-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-3">
                    <Shield className="w-5 h-5 text-amber-600" />
                    Risk & Impact Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">
                    Disclose how the organization identifies, assesses, prioritizes, and manages nature-related dependencies,
                    impacts, risks, and opportunities. A key TNFD addition beyond TCFD is the explicit inclusion of impact
                    management alongside risk management.
                  </p>
                  <div className="space-y-3">
                    <div className="bg-amber-50 rounded-lg p-4">
                      <h5 className="font-semibold text-gray-900 text-sm mb-1">A(i). Identification & Assessment of Nature-related Dependencies, Impacts, Risks & Opportunities</h5>
                      <p className="text-sm text-gray-600">Describe the organization's processes for identifying and assessing nature-related dependencies, impacts, risks, and opportunities in its direct operations and across its upstream and downstream value chains.</p>
                    </div>
                    <div className="bg-amber-50 rounded-lg p-4">
                      <h5 className="font-semibold text-gray-900 text-sm mb-1">A(ii). Prioritization</h5>
                      <p className="text-sm text-gray-600">Describe how the organization prioritizes nature-related dependencies, impacts, risks, and opportunities to determine which are material. Explain the criteria used to determine materiality, including consideration of stakeholder views.</p>
                    </div>
                    <div className="bg-amber-50 rounded-lg p-4">
                      <h5 className="font-semibold text-gray-900 text-sm mb-1">B. Management Processes</h5>
                      <p className="text-sm text-gray-600">Describe the organization's processes for managing nature-related dependencies, impacts, risks, and opportunities, including how these are integrated into the organization's overall risk management processes.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-3">
                    <BarChart3 className="w-5 h-5 text-purple-600" />
                    Metrics & Targets
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">
                    Disclose the metrics and targets used to assess and manage material nature-related dependencies,
                    impacts, risks, and opportunities.
                  </p>
                  <div className="space-y-3">
                    <div className="bg-purple-50 rounded-lg p-4">
                      <h5 className="font-semibold text-gray-900 text-sm mb-1">A. Assessment Metrics</h5>
                      <p className="text-sm text-gray-600">Disclose the metrics used by the organization to assess and manage material nature-related risks and opportunities in line with its strategy and risk management processes. Include core global and core sector disclosure metrics.</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4">
                      <h5 className="font-semibold text-gray-900 text-sm mb-1">B. Dependency & Impact Metrics</h5>
                      <p className="text-sm text-gray-600">Disclose the metrics used by the organization to assess and manage dependencies and impacts on nature. Include metrics related to land/freshwater/ocean use change, resource exploitation, pollution, invasive species, and climate change.</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4">
                      <h5 className="font-semibold text-gray-900 text-sm mb-1">C. Targets & Performance</h5>
                      <p className="text-sm text-gray-600">Describe the targets and goals used by the organization to manage nature-related dependencies, impacts, risks, and opportunities, and performance against targets. Include alignment with science-based targets and the Global Biodiversity Framework.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="nature" className="mt-6">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Nature & Biodiversity Concepts</h3>
              <p className="text-gray-600">
                Understanding key concepts in nature and biodiversity is essential for effective TNFD implementation.
                Nature encompasses all living and non-living components of the natural world, while biodiversity refers
                to the variety of life at genetic, species, and ecosystem levels.
              </p>
            </div>

            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Globe className="w-5 h-5 text-teal-600" />
                Realms and Biomes
              </h4>
              <div className="grid md:grid-cols-3 gap-4">
                <Card className="border-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TreePine className="w-5 h-5 text-green-600" />
                      <h5 className="font-semibold text-gray-900">Terrestrial</h5>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Land-based ecosystems including forests, grasslands, deserts, tundra, and wetlands. Terrestrial biomes
                      provide critical services including carbon storage, water filtration, soil formation, and food production.
                    </p>
                    <Badge variant="outline" className="border-green-500 text-green-700 text-xs">14 major biome types</Badge>
                  </CardContent>
                </Card>
                <Card className="border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Layers className="w-5 h-5 text-blue-600" />
                      <h5 className="font-semibold text-gray-900">Freshwater</h5>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Rivers, lakes, wetlands, and groundwater systems. Although freshwater covers less than 1% of Earth's
                      surface, it supports 10% of all known species and provides essential services for agriculture, industry,
                      and human consumption.
                    </p>
                    <Badge variant="outline" className="border-blue-500 text-blue-700 text-xs">Supports 10% of species</Badge>
                  </CardContent>
                </Card>
                <Card className="border-cyan-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="w-5 h-5 text-cyan-600" />
                      <h5 className="font-semibold text-gray-900">Marine</h5>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Oceans, coastal areas, coral reefs, and deep-sea ecosystems. Marine biomes cover 71% of Earth's surface,
                      regulate climate, absorb 30% of CO2 emissions, and provide protein for 3 billion people.
                    </p>
                    <Badge variant="outline" className="border-cyan-500 text-cyan-700 text-xs">71% of Earth's surface</Badge>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Leaf className="w-5 h-5 text-emerald-600" />
                Ecosystem Services
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="bg-teal-50 border-teal-200">
                  <CardContent className="p-4">
                    <h5 className="font-semibold text-gray-900 mb-2">Provisioning Services</h5>
                    <p className="text-sm text-gray-600 mb-2">Products obtained from ecosystems.</p>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Food and fiber (crops, livestock, fisheries)</li>
                      <li>• Fresh water supply and filtration</li>
                      <li>• Raw materials (timber, minerals, genetic resources)</li>
                      <li>• Medicinal resources and biochemicals</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card className="bg-emerald-50 border-emerald-200">
                  <CardContent className="p-4">
                    <h5 className="font-semibold text-gray-900 mb-2">Regulating Services</h5>
                    <p className="text-sm text-gray-600 mb-2">Benefits obtained from ecosystem regulation.</p>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Climate regulation and carbon sequestration</li>
                      <li>• Flood and erosion control</li>
                      <li>• Pollination and pest control</li>
                      <li>• Water purification and disease regulation</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card className="bg-purple-50 border-purple-200">
                  <CardContent className="p-4">
                    <h5 className="font-semibold text-gray-900 mb-2">Cultural Services</h5>
                    <p className="text-sm text-gray-600 mb-2">Non-material benefits from ecosystems.</p>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Recreation and ecotourism</li>
                      <li>• Spiritual and aesthetic values</li>
                      <li>• Educational and scientific knowledge</li>
                      <li>• Cultural heritage and identity</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card className="bg-amber-50 border-amber-200">
                  <CardContent className="p-4">
                    <h5 className="font-semibold text-gray-900 mb-2">Supporting Services</h5>
                    <p className="text-sm text-gray-600 mb-2">Services necessary for other ecosystem services.</p>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Nutrient cycling (nitrogen, phosphorus)</li>
                      <li>• Soil formation and maintenance</li>
                      <li>• Primary production (photosynthesis)</li>
                      <li>• Habitat provision and biodiversity maintenance</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-teal-600" />
                Biodiversity Metrics
              </h4>
              <div className="grid md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <Badge className="mb-2 bg-teal-100 text-teal-800 border-teal-300">Core Metric</Badge>
                    <h5 className="font-semibold text-gray-900 mb-1">Species Abundance</h5>
                    <p className="text-sm text-gray-600">Measures the number of individuals of each species in a given area. The Living Planet Index shows a 69% decline in monitored wildlife populations since 1970, indicating severe biodiversity erosion.</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <Badge className="mb-2 bg-emerald-100 text-emerald-800 border-emerald-300">Core Metric</Badge>
                    <h5 className="font-semibold text-gray-900 mb-1">Ecosystem Integrity</h5>
                    <p className="text-sm text-gray-600">Assesses the condition and functioning of ecosystems relative to a natural reference state. Includes metrics on ecosystem extent (area), condition (health), and connectivity (fragmentation).</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <Badge className="mb-2 bg-green-100 text-green-800 border-green-300">Core Metric</Badge>
                    <h5 className="font-semibold text-gray-900 mb-1">Genetic Diversity</h5>
                    <p className="text-sm text-gray-600">Measures the variation in genes within and between populations. Genetic diversity is critical for species' ability to adapt to changing conditions. Loss reduces resilience and increases extinction risk.</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="mb-6">
              <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
                <CardContent className="p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Leaf className="w-5 h-5 text-emerald-600" />
                    The Nature-Positive Concept
                  </h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg p-4 border border-emerald-200">
                      <h5 className="font-semibold text-gray-900 mb-2 text-sm">Definition</h5>
                      <p className="text-sm text-gray-600">Nature-positive means halting and reversing nature loss by 2030, measured against a 2020 baseline, leading to full recovery by 2050. It is the nature equivalent of "net-zero" for climate.</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-emerald-200">
                      <h5 className="font-semibold text-gray-900 mb-2 text-sm">Why It Matters</h5>
                      <p className="text-sm text-gray-600">The Kunming-Montreal Global Biodiversity Framework (GBF), adopted in December 2022, set a global goal of halting biodiversity loss by 2030 and achieving recovery by 2050. This creates clear policy direction and regulatory expectations.</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-emerald-200">
                      <h5 className="font-semibold text-gray-900 mb-2 text-sm">Business Implications</h5>
                      <p className="text-sm text-gray-600">Companies will face increasing pressure to demonstrate nature-positive contributions. Early movers can access green finance, reduce regulatory risk, strengthen supply chains, and enhance brand value through biodiversity commitments.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-teal-600" />
                Key Data Sources & Tools
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <h5 className="font-semibold text-gray-900 mb-1">IBAT (Integrated Biodiversity Assessment Tool)</h5>
                    <p className="text-sm text-gray-600 mb-2">Provides authoritative biodiversity data including proximity to protected areas, Key Biodiversity Areas (KBAs), and IUCN Red List species. Essential for the Locate phase of LEAP.</p>
                    <a href="https://www.ibat-alliance.org/" target="_blank" rel="noopener noreferrer" className="text-teal-600 text-sm hover:underline flex items-center gap-1">
                      ibat-alliance.org <ExternalLink className="w-3 h-3" />
                    </a>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <h5 className="font-semibold text-gray-900 mb-1">ENCORE (Exploring Natural Capital Opportunities, Risks and Exposure)</h5>
                    <p className="text-sm text-gray-600 mb-2">Maps how sectors and sub-industries depend on and impact nature. Developed by UNEP-WCMC and the Natural Capital Finance Alliance. Critical for the Evaluate phase of LEAP.</p>
                    <a href="https://encore.naturalcapital.finance/" target="_blank" rel="noopener noreferrer" className="text-teal-600 text-sm hover:underline flex items-center gap-1">
                      encore.naturalcapital.finance <ExternalLink className="w-3 h-3" />
                    </a>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <h5 className="font-semibold text-gray-900 mb-1">SBTN (Science Based Targets Network)</h5>
                    <p className="text-sm text-gray-600 mb-2">Provides methods and guidance for companies to set science-based targets for nature, covering freshwater, land, ocean, and biodiversity. Partners with SBTi for integrated climate-nature targets.</p>
                    <a href="https://sciencebasedtargetsnetwork.org/" target="_blank" rel="noopener noreferrer" className="text-teal-600 text-sm hover:underline flex items-center gap-1">
                      sciencebasedtargetsnetwork.org <ExternalLink className="w-3 h-3" />
                    </a>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <h5 className="font-semibold text-gray-900 mb-1">GBF Targets (Kunming-Montreal Global Biodiversity Framework)</h5>
                    <p className="text-sm text-gray-600 mb-2">23 action-oriented targets for 2030 adopted by 196 nations. Key targets include protecting 30% of land and sea ("30x30"), reducing pollution, and reforming harmful subsidies.</p>
                    <a href="https://www.cbd.int/gbf/" target="_blank" rel="noopener noreferrer" className="text-teal-600 text-sm hover:underline flex items-center gap-1">
                      cbd.int/gbf <ExternalLink className="w-3 h-3" />
                    </a>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="implementation" className="mt-6">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Implementation Guide</h3>
              <p className="text-gray-600">
                Practical guidance for organizations beginning their TNFD journey — from initial scoping
                to full disclosure. The TNFD recommends a phased approach, starting with readily available
                data and progressively deepening assessment over time.
              </p>
            </div>

            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <ChevronRight className="w-5 h-5 text-emerald-600" />
                Getting Started: 6 Steps
              </h4>
              <div className="grid gap-3">
                {[
                  { step: 1, title: "Build Internal Awareness & Governance", description: "Educate board and senior management on nature-related risks. Establish governance structures including board-level oversight and cross-functional working groups. Assign clear responsibilities for TNFD implementation." },
                  { step: 2, title: "Conduct Initial Scoping Assessment", description: "Use ENCORE and IBAT to identify your sector's key nature dependencies and impacts. Map your direct operations and key supply chain locations. Identify which biomes and ecosystems you interact with most significantly." },
                  { step: 3, title: "Apply the LEAP Approach at Priority Locations", description: "Begin with your most material locations and value chain segments. Locate nature interfaces, Evaluate dependencies and impacts, Assess risks and opportunities, and Prepare responses. Start high-level and progressively deepen." },
                  { step: 4, title: "Engage Stakeholders & Gather Data", description: "Consult with Indigenous Peoples and local communities where relevant. Engage suppliers on nature-related data. Work with industry peers and initiatives (e.g., sector-specific TNFD guidance). Begin collecting baseline biodiversity and ecosystem data." },
                  { step: 5, title: "Set Targets & Develop Strategy", description: "Align with the Global Biodiversity Framework targets. Consider setting Science Based Targets for Nature (SBTs for Nature). Develop a nature transition plan with clear milestones. Integrate nature considerations into business strategy and capital allocation." },
                  { step: 6, title: "Prepare & Publish Disclosures", description: "Prepare TNFD-aligned disclosures across all four pillars (Governance, Strategy, Risk & Impact Management, Metrics & Targets). Start with qualitative disclosures and progressively add quantitative data. Submit to the TNFD early adopters register." }
                ].map((item) => (
                  <Card key={item.step} className="border-l-4 border-l-emerald-400">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm flex-shrink-0">
                          {item.step}
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-900 mb-1">{item.title}</h5>
                          <p className="text-sm text-gray-600">{item.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-600" />
                Sector-Specific Considerations
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="border-green-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Leaf className="w-4 h-4 text-green-600" />
                      Agriculture & Food
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-2">Agriculture is both highly dependent on nature (pollination, soil health, water) and a major driver of nature loss (land conversion, pesticides, fertilizer runoff).</p>
                    <div className="bg-green-50 rounded p-3">
                      <p className="text-xs font-medium text-green-700 mb-1">Priority Areas</p>
                      <p className="text-sm text-gray-700">Deforestation-free supply chains, regenerative agriculture practices, water stewardship, pollinator protection, soil health metrics, agrobiodiversity conservation.</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-amber-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-amber-600" />
                      Mining & Extractives
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-2">Mining has significant direct impacts on nature through land use change, water use, and pollution. Operations are often located near or within ecologically sensitive areas.</p>
                    <div className="bg-amber-50 rounded p-3">
                      <p className="text-xs font-medium text-amber-700 mb-1">Priority Areas</p>
                      <p className="text-sm text-gray-700">No-go zones near protected areas, biodiversity offset strategies, mine rehabilitation, water quality management, tailings dam safety, cumulative impact assessment.</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-blue-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-blue-600" />
                      Financial Services
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-2">Financial institutions face nature-related risks through their lending, investment, and insurance portfolios. Assessing financed nature impacts requires engagement with portfolio companies.</p>
                    <div className="bg-blue-50 rounded p-3">
                      <p className="text-xs font-medium text-blue-700 mb-1">Priority Areas</p>
                      <p className="text-sm text-gray-700">Portfolio-level nature risk screening, engagement with high-impact sectors, nature-positive investment products, integration into credit risk models, TNFD-aligned fund disclosures.</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-purple-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Shield className="w-4 h-4 text-purple-600" />
                      Real Estate & Infrastructure
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-2">Real estate and infrastructure directly impact nature through land use, habitat fragmentation, and resource consumption. Green building and nature-based solutions offer significant opportunities.</p>
                    <div className="bg-purple-50 rounded p-3">
                      <p className="text-xs font-medium text-purple-700 mb-1">Priority Areas</p>
                      <p className="text-sm text-gray-700">Site-level biodiversity assessments, biodiversity net gain requirements, green infrastructure, nature-based flood protection, urban ecology integration, sustainable materials sourcing.</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-600" />
                Tools & Resources
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { name: "ENCORE Tool", description: "Sector-level mapping of dependencies and impacts on nature. Free to use. Covers 167 production processes across all GICS sectors.", url: "https://encore.naturalcapital.finance/" },
                  { name: "IBAT", description: "Geospatial screening for proximity to protected areas, KBAs, and threatened species. Subscription-based with free tier for initial screening.", url: "https://www.ibat-alliance.org/" },
                  { name: "Science Based Targets for Nature", description: "Methods for setting measurable, science-based targets for freshwater, land, ocean, and biodiversity aligned with the GBF.", url: "https://sciencebasedtargetsnetwork.org/" },
                  { name: "TNFD Online Platform", description: "Official TNFD resources including guidance documents, sector guidance, additional guidance on the LEAP approach, and disclosure templates.", url: "https://tnfd.global/" }
                ].map((tool) => (
                  <Card key={tool.name}>
                    <CardContent className="p-4">
                      <h5 className="font-semibold text-gray-900 mb-1">{tool.name}</h5>
                      <p className="text-sm text-gray-600 mb-2">{tool.description}</p>
                      <a href={tool.url} target="_blank" rel="noopener noreferrer" className="text-teal-600 text-sm hover:underline flex items-center gap-1">
                        Visit Resource <ExternalLink className="w-3 h-3" />
                      </a>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-600" />
                Key Milestones & Timeline
              </h4>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {[
                      { date: "June 2021", event: "TNFD formally launched", detail: "Co-chaired by Elizabeth Maruma Mrema (CBD) and David Craig (Refinitiv). 34 Taskforce members from financial institutions, corporates, and market service providers." },
                      { date: "March 2022 — November 2022", event: "Beta framework releases (v0.1 to v0.3)", detail: "Iterative development with market consultation. LEAP approach progressively refined. Over 1,000 organizations participated in pilot testing." },
                      { date: "September 2023", event: "TNFD v1.0 Final Recommendations released", detail: "14 recommended disclosures across four pillars. Core global and core sector metrics. Additional guidance for financial institutions and specific sectors." },
                      { date: "December 2022", event: "Kunming-Montreal Global Biodiversity Framework adopted", detail: "196 nations adopted 23 targets for 2030 including Target 15 requiring large businesses and financial institutions to assess and disclose nature-related risks, dependencies, and impacts. Directly supports TNFD adoption." },
                      { date: "January 2024", event: "TNFD Early Adopters initiative", detail: "Over 320 organizations across 46 countries committed to making TNFD-aligned disclosures. Sectors include financial services, agriculture, mining, technology, and consumer goods." },
                      { date: "2024-2025", event: "ISSB and regulatory alignment", detail: "ISSB considering nature-related standards building on TNFD. EU CSRD and ESRS require nature-related disclosures. Several jurisdictions exploring mandatory TNFD-aligned reporting requirements." },
                      { date: "2025 and beyond", event: "Mainstreaming and mandatory adoption", detail: "Convergence between climate and nature reporting. Integration with ISSB standards. Expansion of mandatory disclosure requirements across jurisdictions. Development of nature-related scenario analysis methodologies." }
                    ].map((milestone, idx) => (
                      <div key={idx} className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <Badge variant="outline" className="border-emerald-500 text-emerald-700 whitespace-nowrap">{milestone.date}</Badge>
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-900 text-sm">{milestone.event}</h5>
                          <p className="text-sm text-gray-600">{milestone.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <Card className="mb-8 bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Key Resources & Further Reading</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { title: "TNFD Recommendations v1.0", org: "TNFD", url: "https://tnfd.global/recommendations-of-the-tnfd/", desc: "Official TNFD disclosure recommendations and guidance" },
                { title: "Science Based Targets for Nature", org: "SBTN", url: "https://sciencebasedtargetsnetwork.org/", desc: "Methods for setting science-based nature targets" },
                { title: "ENCORE Tool", org: "UNEP-WCMC", url: "https://encore.naturalcapital.finance/", desc: "Explore natural capital dependencies and impacts by sector" },
                { title: "IBAT Biodiversity Data", org: "IBAT Alliance", url: "https://www.ibat-alliance.org/", desc: "Authoritative biodiversity screening and assessment tool" },
                { title: "Kunming-Montreal GBF", org: "CBD", url: "https://www.cbd.int/gbf/", desc: "Global Biodiversity Framework with 23 targets for 2030" },
                { title: "IPBES Global Assessment", org: "IPBES", url: "https://ipbes.net/global-assessment", desc: "Comprehensive assessment of biodiversity and ecosystem services" }
              ].map((resource) => (
                <a
                  key={resource.title}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white rounded-lg p-4 border border-emerald-200 hover:border-emerald-400 hover:shadow-md transition-all group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 text-sm group-hover:text-emerald-700">{resource.title}</h4>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-emerald-600 flex-shrink-0" />
                  </div>
                  <p className="text-xs text-emerald-600 mb-1">{resource.org}</p>
                  <p className="text-xs text-gray-500">{resource.desc}</p>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-bold mb-2">Ready to Assess Your Nature-Related Risks?</h3>
            <p className="text-emerald-100 mb-4 max-w-2xl mx-auto">
              Apply the TNFD framework to your organization by running a TNFD-aligned nature-related risk assessment.
              Identify your dependencies on nature, evaluate impacts, and discover opportunities for
              nature-positive business strategies.
            </p>
            <Link href="/tnfd-risk">
              <Button size="lg" variant="secondary" className="bg-white text-emerald-700 hover:bg-emerald-50">
                <TreePine className="w-5 h-5 mr-2" />
                Run TNFD Risk Assessment
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}