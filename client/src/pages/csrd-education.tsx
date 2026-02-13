import { useState } from "react";
import { ArrowLeft, BookOpen, FileText, ChevronRight, ExternalLink, Shield, Globe, Users, Layers, Target, BarChart3, Building2, Scale, CheckCircle2, AlertTriangle, Landmark, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";

const esrsTopics = [
  {
    standard: "ESRS E1",
    title: "Climate Change",
    description: "GHG emissions (Scope 1, 2, 3), energy consumption, carbon reduction targets, transition plan alignment with Paris Agreement goals.",
    icon: Globe,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200"
  },
  {
    standard: "ESRS E2",
    title: "Pollution",
    description: "Air, water, and soil pollution. Substances of concern, microplastics, pollution prevention measures and remediation efforts.",
    icon: AlertTriangle,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200"
  },
  {
    standard: "ESRS E3",
    title: "Water & Marine Resources",
    description: "Water consumption, withdrawal, discharge. Marine resource use, water stress areas, water management policies.",
    icon: Globe,
    color: "text-cyan-600",
    bgColor: "bg-cyan-50",
    borderColor: "border-cyan-200"
  },
  {
    standard: "ESRS E4",
    title: "Biodiversity & Ecosystems",
    description: "Impacts on biodiversity, ecosystem services, land use change, species protection, nature restoration commitments.",
    icon: Target,
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200"
  },
  {
    standard: "ESRS E5",
    title: "Resource Use & Circular Economy",
    description: "Material flows, waste generation, recycling, product lifecycle design, circular business models and resource efficiency.",
    icon: Layers,
    color: "text-teal-600",
    bgColor: "bg-teal-50",
    borderColor: "border-teal-200"
  },
  {
    standard: "ESRS S1",
    title: "Own Workforce",
    description: "Working conditions, equal treatment, training, health & safety, work-life balance, adequate wages, social dialogue.",
    icon: Users,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200"
  },
  {
    standard: "ESRS S2",
    title: "Workers in the Value Chain",
    description: "Working conditions, forced labor, child labor, fair wages and human rights due diligence across the supply chain.",
    icon: Users,
    color: "text-violet-600",
    bgColor: "bg-violet-50",
    borderColor: "border-violet-200"
  },
  {
    standard: "ESRS S3",
    title: "Affected Communities",
    description: "Community engagement, land rights, indigenous peoples' rights, community health, cultural heritage impacts.",
    icon: Building2,
    color: "text-rose-600",
    bgColor: "bg-rose-50",
    borderColor: "border-rose-200"
  },
  {
    standard: "ESRS S4",
    title: "Consumers & End-Users",
    description: "Product safety, data privacy, responsible marketing, accessibility, product information transparency.",
    icon: Shield,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200"
  },
  {
    standard: "ESRS G1",
    title: "Business Conduct",
    description: "Corporate culture, whistleblower protection, anti-corruption, political engagement, payment practices, animal welfare.",
    icon: Scale,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-200"
  }
];

const timelineEvents = [
  { year: "2014", event: "EU Non-Financial Reporting Directive (NFRD) adopted, covering ~11,700 large companies." },
  { year: "2019", event: "European Green Deal announced, signaling comprehensive sustainability regulation." },
  { year: "Apr 2021", event: "European Commission publishes CSRD proposal to replace NFRD." },
  { year: "Nov 2022", event: "CSRD formally adopted by EU Parliament and Council." },
  { year: "Jan 2023", event: "CSRD enters into force. EFRAG finalizes draft ESRS standards." },
  { year: "Jul 2023", event: "European Commission adopts first set of ESRS as delegated act." },
  { year: "Jan 2024", event: "FY2024 reporting begins for companies already under NFRD (~11,700 large public-interest entities)." },
  { year: "Jan 2025", event: "FY2025 reporting begins for other large companies meeting 2 of 3 criteria (250+ employees, EUR 50M+ revenue, EUR 25M+ assets)." },
  { year: "Jan 2026", event: "FY2026 reporting for listed SMEs (with opt-out until 2028). Voluntary standards for non-listed SMEs available." },
  { year: "Jan 2028", event: "FY2028 reporting for non-EU companies with EUR 150M+ EU revenue and EU subsidiary/branch." }
];

export default function CsrdEducationPage() {
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
                <h1 className="text-xl font-semibold text-gray-900">CSRD Framework</h1>
              </div>
            </div>
            <Link href="/csrd-report">
              <Button size="sm" className="bg-blue-700 hover:bg-blue-800">
                <FileText className="w-4 h-4 mr-2" />
                Generate CSRD Report
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What is the CSRD?</h2>
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-700 mb-4">
                    The <strong>Corporate Sustainability Reporting Directive (CSRD)</strong> is a landmark European Union regulation
                    that fundamentally transforms corporate sustainability reporting. Adopted in November 2022 and entering into force
                    in January 2023, the CSRD replaces the earlier Non-Financial Reporting Directive (NFRD) and dramatically expands
                    the scope, depth, and rigor of sustainability disclosures required from companies operating in or connected to the EU.
                  </p>
                  <p className="text-gray-700 mb-4">
                    The CSRD requires approximately <strong>50,000 companies</strong> (up from ~11,700 under NFRD) to report
                    detailed sustainability information according to the <strong>European Sustainability Reporting Standards (ESRS)</strong>,
                    developed by the European Financial Reporting Advisory Group (EFRAG). This includes large EU companies, listed SMEs,
                    and non-EU companies with significant EU operations.
                  </p>
                  <p className="text-gray-700">
                    A central innovation of the CSRD is the <strong>double materiality</strong> principle, which requires companies to report
                    both how sustainability issues affect the company (financial materiality, or "outside-in") and how the company's
                    activities impact people and the environment (impact materiality, or "inside-out"). Reports must be digitally tagged
                    using XBRL taxonomy and subject to limited assurance by an independent auditor.
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-4 border border-blue-200">
                    <h4 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                      <Scale className="w-4 h-4 text-blue-600" />
                      Double Materiality
                    </h4>
                    <p className="text-sm text-gray-600">Report both how sustainability issues affect your business financially AND how your business impacts people and the planet. This two-way lens is unique to the CSRD and central to the ESRS standards.</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-blue-200">
                    <h4 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                      <ClipboardList className="w-4 h-4 text-blue-600" />
                      ESRS Standards
                    </h4>
                    <p className="text-sm text-gray-600">12 European Sustainability Reporting Standards covering cross-cutting requirements (ESRS 1 & 2), 5 environmental topics, 4 social topics, and 1 governance topic — with detailed disclosure requirements and data points.</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-blue-200">
                    <h4 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-blue-600" />
                      Mandatory Assurance
                    </h4>
                    <p className="text-sm text-gray-600">CSRD reports require limited assurance from an independent auditor or assurance provider, moving toward reasonable assurance over time — ensuring data quality and reliability comparable to financial reporting.</p>
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
                CSRD vs. Other Frameworks
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-amber-300">
                      <th className="text-left py-2 pr-4 font-semibold text-gray-900">Feature</th>
                      <th className="text-left py-2 pr-4 font-semibold text-gray-900">CSRD/ESRS</th>
                      <th className="text-left py-2 pr-4 font-semibold text-gray-900">TCFD</th>
                      <th className="text-left py-2 pr-4 font-semibold text-gray-900">TNFD</th>
                      <th className="text-left py-2 pr-4 font-semibold text-gray-900">GRI</th>
                      <th className="text-left py-2 font-semibold text-gray-900">ISSB/IFRS S1-S2</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    <tr className="border-b border-amber-200">
                      <td className="py-2 pr-4 font-medium">Status</td>
                      <td className="py-2 pr-4">EU law (mandatory)</td>
                      <td className="py-2 pr-4">Voluntary (adopted widely)</td>
                      <td className="py-2 pr-4">Voluntary (market-led)</td>
                      <td className="py-2 pr-4">Voluntary (widely used)</td>
                      <td className="py-2">Voluntary (IOSCO endorsed)</td>
                    </tr>
                    <tr className="border-b border-amber-200">
                      <td className="py-2 pr-4 font-medium">Scope</td>
                      <td className="py-2 pr-4">All ESG (E, S, G)</td>
                      <td className="py-2 pr-4">Climate only</td>
                      <td className="py-2 pr-4">Nature & biodiversity</td>
                      <td className="py-2 pr-4">All ESG topics</td>
                      <td className="py-2">Climate & general sustainability</td>
                    </tr>
                    <tr className="border-b border-amber-200">
                      <td className="py-2 pr-4 font-medium">Materiality</td>
                      <td className="py-2 pr-4">Double materiality</td>
                      <td className="py-2 pr-4">Financial materiality</td>
                      <td className="py-2 pr-4">Double materiality</td>
                      <td className="py-2 pr-4">Impact materiality</td>
                      <td className="py-2">Financial materiality</td>
                    </tr>
                    <tr className="border-b border-amber-200">
                      <td className="py-2 pr-4 font-medium">Assurance</td>
                      <td className="py-2 pr-4">Required (limited → reasonable)</td>
                      <td className="py-2 pr-4">Not required</td>
                      <td className="py-2 pr-4">Not required</td>
                      <td className="py-2 pr-4">Recommended</td>
                      <td className="py-2">Encouraged</td>
                    </tr>
                    <tr className="border-b border-amber-200">
                      <td className="py-2 pr-4 font-medium">Digital Tagging</td>
                      <td className="py-2 pr-4">Required (XBRL)</td>
                      <td className="py-2 pr-4">Not required</td>
                      <td className="py-2 pr-4">Not required</td>
                      <td className="py-2 pr-4">Not required</td>
                      <td className="py-2">Encouraged</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-medium">Companies</td>
                      <td className="py-2 pr-4">~50,000</td>
                      <td className="py-2 pr-4">Varies by jurisdiction</td>
                      <td className="py-2 pr-4">320+ committed</td>
                      <td className="py-2 pr-4">10,000+ reporters</td>
                      <td className="py-2">Varies by jurisdiction</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="esrs" className="mb-8">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="esrs">ESRS Standards</TabsTrigger>
            <TabsTrigger value="materiality">Double Materiality</TabsTrigger>
            <TabsTrigger value="timeline">Timeline & Scope</TabsTrigger>
            <TabsTrigger value="implementation">Implementation</TabsTrigger>
          </TabsList>

          <TabsContent value="esrs">
            <div className="space-y-6">
              <Card className="border-blue-200">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">European Sustainability Reporting Standards (ESRS)</h3>
                  <p className="text-gray-700 mb-4">
                    The ESRS framework consists of 12 standards developed by EFRAG and adopted by the European Commission. They are organized into 
                    cross-cutting standards that apply to all companies, and topical standards covering environmental, social, and governance topics. 
                    Companies must report on all material topics identified through their double materiality assessment. ESRS E1 (Climate Change) 
                    and ESRS 2 (General Disclosures) are mandatory for all in-scope companies regardless of materiality.
                  </p>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-4">
                <Card className="border-gray-300 bg-gray-50">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">ESRS 1 — General Requirements</h4>
                    <p className="text-sm text-gray-600">Defines the architecture of ESRS, including double materiality assessment methodology, reporting boundaries, time horizons, value chain coverage, and the relationship between ESRS standards. Provides the foundation for all other standards.</p>
                  </CardContent>
                </Card>
                <Card className="border-gray-300 bg-gray-50">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">ESRS 2 — General Disclosures</h4>
                    <p className="text-sm text-gray-600">Mandatory for all companies. Covers governance structure, strategy, risk management processes, and metrics/targets at the entity level. Includes disclosures on business model, stakeholder engagement, and the materiality assessment process.</p>
                  </CardContent>
                </Card>
              </div>

              <h3 className="text-lg font-semibold text-gray-900">Topical Standards</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {esrsTopics.map((topic) => (
                  <Card key={topic.standard} className={`${topic.borderColor} ${topic.bgColor}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <topic.icon className={`w-5 h-5 ${topic.color} mt-0.5`} />
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">{topic.standard}</Badge>
                            <h4 className="font-semibold text-gray-900">{topic.title}</h4>
                          </div>
                          <p className="text-sm text-gray-600">{topic.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="materiality">
            <div className="space-y-6">
              <Card className="border-blue-200">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Understanding Double Materiality</h3>
                  <p className="text-gray-700 mb-4">
                    Double materiality is the cornerstone of the CSRD. Unlike single-materiality frameworks that focus either on how issues 
                    affect the company (financial materiality) or how the company affects the world (impact materiality), the CSRD requires both 
                    perspectives simultaneously. A sustainability topic is material if it meets the threshold for either or both dimensions.
                  </p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg p-5 border border-blue-200">
                      <h4 className="font-semibold text-blue-800 mb-3 text-lg">Impact Materiality (Inside-Out)</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        How does the company's business activities, products, services, and value chain relationships cause actual or 
                        potential positive or negative impacts on people and the environment?
                      </p>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" /> Assess impacts across operations and full value chain</li>
                        <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" /> Consider severity (scale, scope, irremediability) for negative impacts</li>
                        <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" /> Evaluate both actual impacts and potential (probable) impacts</li>
                        <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" /> Consider scale and scope for positive impacts</li>
                        <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" /> Engage stakeholders to understand real-world effects</li>
                      </ul>
                    </div>
                    <div className="bg-white rounded-lg p-5 border border-indigo-200">
                      <h4 className="font-semibold text-indigo-800 mb-3 text-lg">Financial Materiality (Outside-In)</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        How do sustainability matters create risks and opportunities that could materially influence the company's 
                        financial position, performance, cash flows, access to finance, or cost of capital?
                      </p>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" /> Identify sustainability-related risks (physical, transition, systemic)</li>
                        <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" /> Assess likelihood and magnitude of financial effects</li>
                        <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" /> Consider short, medium, and long-term time horizons</li>
                        <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" /> Evaluate opportunities from sustainability trends</li>
                        <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" /> Apply thresholds aligned with financial reporting materiality</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Double Materiality Assessment Process</h3>
                  <div className="grid md:grid-cols-4 gap-4">
                    {[
                      { step: "1", title: "Understand Context", desc: "Map your business activities, value chain, stakeholders, and the sustainability context in which you operate." },
                      { step: "2", title: "Identify Topics", desc: "Screen all ESRS topics and sub-topics. Use sector-specific guidance, peer analysis, and stakeholder input." },
                      { step: "3", title: "Assess & Score", desc: "Evaluate each topic for impact materiality (severity, likelihood) and financial materiality (magnitude, likelihood) using defined thresholds." },
                      { step: "4", title: "Determine & Document", desc: "Map results into a double materiality matrix. Document methodology, thresholds, stakeholder input, and governance oversight." }
                    ].map((s) => (
                      <div key={s.step} className="bg-white rounded-lg p-4 border border-green-200">
                        <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm mb-2">{s.step}</div>
                        <h4 className="font-semibold text-gray-900 mb-1 text-sm">{s.title}</h4>
                        <p className="text-xs text-gray-600">{s.desc}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="timeline">
            <div className="space-y-6">
              <Card className="border-blue-200">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">CSRD Phased Implementation Timeline</h3>
                  <div className="space-y-4">
                    {timelineEvents.map((event, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-3 h-3 rounded-full ${index <= 5 ? 'bg-blue-600' : 'bg-gray-300'}`} />
                          {index < timelineEvents.length - 1 && <div className="w-px h-full bg-gray-200 flex-1" />}
                        </div>
                        <div className="pb-4">
                          <Badge variant="outline" className="mb-1">{event.year}</Badge>
                          <p className="text-sm text-gray-700">{event.event}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-purple-200 bg-purple-50">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Who Must Report?</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg p-4 border border-purple-200">
                      <h4 className="font-semibold text-purple-800 mb-2">Large EU Companies</h4>
                      <p className="text-sm text-gray-600 mb-2">Companies meeting at least 2 of 3 criteria:</p>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>250+ employees</li>
                        <li>EUR 50M+ net revenue</li>
                        <li>EUR 25M+ total assets</li>
                      </ul>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-purple-200">
                      <h4 className="font-semibold text-purple-800 mb-2">Listed SMEs</h4>
                      <p className="text-sm text-gray-600 mb-2">Small and medium enterprises listed on EU-regulated markets, except micro-enterprises. Simplified ESRS available (LSME standards).</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-purple-200">
                      <h4 className="font-semibold text-purple-800 mb-2">Non-EU Companies</h4>
                      <p className="text-sm text-gray-600 mb-2">Non-EU parent companies with EUR 150M+ net revenue in the EU for 2 consecutive years AND an EU subsidiary or branch above thresholds. Must report from FY2028.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="implementation">
            <div className="space-y-6">
              <Card className="border-blue-200">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Getting Started with CSRD</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-800">Key Implementation Steps</h4>
                      {[
                        { title: "Gap Analysis", desc: "Assess current sustainability reporting against ESRS requirements. Identify missing data, processes, and governance structures." },
                        { title: "Double Materiality Assessment", desc: "Conduct a comprehensive DMA to determine which ESRS topical standards apply. Engage stakeholders and document methodology." },
                        { title: "Data Collection & Systems", desc: "Establish data collection processes for required data points. Implement sustainability data management systems and internal controls." },
                        { title: "Governance & Oversight", desc: "Assign board-level responsibility. Establish sustainability reporting governance parallel to financial reporting processes." },
                        { title: "Transition Plan", desc: "Develop a climate transition plan aligned with the 1.5°C Paris Agreement goal (required under ESRS E1 if climate is material)." },
                        { title: "Assurance Readiness", desc: "Prepare for limited assurance engagement. Ensure data quality, audit trails, and documentation meet assurance standards." }
                      ].map((step, i) => (
                        <div key={i} className="flex gap-3">
                          <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-xs shrink-0 mt-0.5">{i + 1}</div>
                          <div>
                            <h5 className="font-medium text-gray-900 text-sm">{step.title}</h5>
                            <p className="text-xs text-gray-600">{step.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-800">Common Challenges</h4>
                      {[
                        { title: "Value Chain Data", desc: "Collecting Scope 3 emissions and supply chain data remains a top challenge. Start with estimates and improve over time." },
                        { title: "Double Materiality Methodology", desc: "No single prescribed methodology — requires judgment. EFRAG implementation guidance and sector-specific standards can help." },
                        { title: "Interoperability", desc: "Aligning CSRD/ESRS with ISSB, GRI, TCFD, and TNFD. EFRAG has published interoperability guidance to map requirements." },
                        { title: "Digital Tagging", desc: "Reports must be digitally tagged in XBRL format and filed in the European Single Access Point (ESAP). Requires technical preparation." },
                        { title: "Board Readiness", desc: "Boards need sustainability literacy. Training programs and expert advisors help bridge the knowledge gap." }
                      ].map((challenge, i) => (
                        <div key={i} className="bg-amber-50 rounded-lg p-3 border border-amber-200">
                          <h5 className="font-medium text-gray-900 text-sm flex items-center gap-2">
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                            {challenge.title}
                          </h5>
                          <p className="text-xs text-gray-600 mt-1">{challenge.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-teal-200 bg-teal-50">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Resources</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    {[
                      { title: "EFRAG ESRS Standards", url: "https://www.efrag.org/lab6", org: "EFRAG", desc: "Official ESRS standards, implementation guidance, and Q&A" },
                      { title: "EU CSRD Legislation", url: "https://eur-lex.europa.eu/eli/dir/2022/2464", org: "European Commission", desc: "Full text of the CSRD Directive 2022/2464" },
                      { title: "ESRS-ISSB Interoperability", url: "https://www.efrag.org/lab6", org: "EFRAG/ISSB", desc: "Mapping between ESRS and IFRS S1/S2 sustainability standards" },
                      { title: "GRI-ESRS Compatibility", url: "https://www.globalreporting.org/", org: "GRI", desc: "How GRI reporters can transition to ESRS reporting" },
                      { title: "CSRD Implementation Guide", url: "https://finance.ec.europa.eu/", org: "European Commission", desc: "EC guidance documents on CSRD implementation" },
                      { title: "EU Taxonomy Regulation", url: "https://finance.ec.europa.eu/sustainable-finance/tools-and-standards/eu-taxonomy-sustainable-activities_en", org: "European Commission", desc: "EU Taxonomy alignment required under ESRS E1" }
                    ].map((resource, i) => (
                      <a key={i} href={resource.url} target="_blank" rel="noopener noreferrer" className="bg-white rounded-lg p-4 border border-teal-200 hover:shadow-md transition-shadow block">
                        <h5 className="font-medium text-gray-900 text-sm flex items-center gap-2">
                          {resource.title}
                          <ExternalLink className="w-3 h-3 text-teal-600" />
                        </h5>
                        <p className="text-xs text-gray-500 mt-1">{resource.org}</p>
                        <p className="text-xs text-gray-600 mt-1">{resource.desc}</p>
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <Card className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-3">Ready to Generate Your CSRD Report?</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Use our AI-powered report writer to generate a comprehensive CSRD-aligned sustainability report 
              covering all ESRS standards material to your organization.
            </p>
            <Link href="/csrd-report">
              <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50">
                <FileText className="w-5 h-5 mr-2" />
                Generate CSRD Report
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
