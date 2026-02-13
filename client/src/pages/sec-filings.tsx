import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Search,
  FileText,
  Building2,
  Calendar,
  ExternalLink,
  Loader2,
  ChevronRight,
  Download,
  X,
  Info,
} from "lucide-react";

interface CompanyResult {
  cik: string;
  ticker: string;
  name: string;
}

interface FilingResult {
  accessionNumber: string;
  filingDate: string;
  reportDate: string;
  form: string;
  primaryDocument: string;
  description: string;
  filingUrl: string;
  documentUrl: string;
}

interface CompanyInfo {
  name: string;
  cik: string;
  ticker: string;
  sic: string;
  sicDescription: string;
  stateOfIncorporation: string;
  fiscalYearEnd: string;
}

export default function SecFilingsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<CompanyResult | null>(null);
  const [formType, setFormType] = useState("10-K");
  const [viewingFiling, setViewingFiling] = useState<FilingResult | null>(null);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    if (searchTimeout) clearTimeout(searchTimeout);
    const timeout = setTimeout(() => {
      setDebouncedQuery(value);
    }, 400);
    setSearchTimeout(timeout);
  }, [searchTimeout]);

  const { data: searchResults, isLoading: isSearching } = useQuery<CompanyResult[]>({
    queryKey: [`/api/sec/search?q=${encodeURIComponent(debouncedQuery)}`],
    enabled: debouncedQuery.length >= 1 && !selectedCompany,
  });

  const { data: filingsData, isLoading: isLoadingFilings } = useQuery<{
    company: CompanyInfo;
    filings: FilingResult[];
  }>({
    queryKey: [`/api/sec/filings/${selectedCompany?.cik}?formType=${formType}`],
    enabled: !!selectedCompany,
  });

  const { data: filingContent, isLoading: isLoadingContent } = useQuery<{ content: string }>({
    queryKey: ['/api/sec/filing-content', selectedCompany?.cik, viewingFiling?.accessionNumber, viewingFiling?.primaryDocument],
    enabled: !!viewingFiling && !!selectedCompany,
  });

  const handleSelectCompany = (company: CompanyResult) => {
    setSelectedCompany(company);
    setSearchQuery(company.name);
    setDebouncedQuery("");
    setViewingFiling(null);
  };

  const handleClearCompany = () => {
    setSelectedCompany(null);
    setSearchQuery("");
    setDebouncedQuery("");
    setViewingFiling(null);
  };

  const handleViewFiling = (filing: FilingResult) => {
    setViewingFiling(filing);
  };

  const handleCloseFiling = () => {
    setViewingFiling(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Separator orientation="vertical" className="h-6" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-blue-600" />
                  SEC Filing Explorer
                </h1>
                <p className="text-sm text-gray-500">Search and view SEC EDGAR 10-K filings for any public company</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg mb-6">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">About SEC 10-K Filings</p>
                <p>
                  10-K is an annual report required by the SEC that provides a comprehensive overview of a company's
                  financial performance, including audited financial statements, risk factors, management discussion,
                  and business operations. Data is sourced directly from the SEC EDGAR system.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by company name or ticker symbol (e.g., Apple, AAPL, Tesla)..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10 pr-10"
                />
                {selectedCompany && (
                  <button
                    onClick={handleClearCompany}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                {!selectedCompany && debouncedQuery.length >= 1 && searchResults && searchResults.length > 0 && (
                  <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto">
                    {searchResults.map((company) => (
                      <button
                        key={company.cik}
                        onClick={() => handleSelectCompany(company)}
                        className="w-full px-4 py-3 text-left hover:bg-blue-50 flex items-center justify-between border-b border-gray-100 last:border-b-0"
                      >
                        <div>
                          <div className="font-medium text-gray-900">{company.name}</div>
                          <div className="text-sm text-gray-500">CIK: {company.cik}</div>
                        </div>
                        <Badge variant="outline" className="font-mono">
                          {company.ticker}
                        </Badge>
                      </button>
                    ))}
                  </div>
                )}

                {isSearching && (
                  <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto text-blue-600" />
                    <p className="text-sm text-gray-500 mt-2">Searching SEC EDGAR...</p>
                  </div>
                )}

                {!selectedCompany && !isSearching && debouncedQuery.length >= 1 && searchResults && searchResults.length === 0 && (
                  <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center">
                    <p className="text-sm text-gray-500">No companies found matching "{debouncedQuery}"</p>
                    <p className="text-xs text-gray-400 mt-1">Try searching by ticker symbol (e.g., AAPL) or full company name</p>
                  </div>
                )}
              </div>

              <Select value={formType} onValueChange={setFormType}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10-K">10-K</SelectItem>
                  <SelectItem value="10-Q">10-Q</SelectItem>
                  <SelectItem value="8-K">8-K</SelectItem>
                  <SelectItem value="DEF 14A">DEF 14A</SelectItem>
                  <SelectItem value="S-1">S-1</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {selectedCompany && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className={viewingFiling ? "lg:col-span-1" : "lg:col-span-3"}>
              {filingsData?.company && (
                <Card className="mb-4">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <Building2 className="w-8 h-8 text-blue-600 flex-shrink-0" />
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">{filingsData.company.name}</h2>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {filingsData.company.ticker && (
                            <Badge variant="secondary" className="font-mono">{filingsData.company.ticker}</Badge>
                          )}
                          <Badge variant="outline">CIK: {filingsData.company.cik}</Badge>
                          {filingsData.company.sicDescription && (
                            <Badge variant="outline">{filingsData.company.sicDescription}</Badge>
                          )}
                          {filingsData.company.stateOfIncorporation && (
                            <Badge variant="outline">Inc: {filingsData.company.stateOfIncorporation}</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {isLoadingFilings ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
                    <p className="text-gray-500 mt-3">Loading {formType} filings from SEC EDGAR...</p>
                  </CardContent>
                </Card>
              ) : filingsData?.filings && filingsData.filings.length > 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      {formType} Filings ({filingsData.filings.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {filingsData.filings.map((filing) => (
                        <div
                          key={filing.accessionNumber}
                          className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                            viewingFiling?.accessionNumber === filing.accessionNumber
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                          }`}
                          onClick={() => handleViewFiling(filing)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="text-xs">{filing.form}</Badge>
                                <span className="text-sm font-medium text-gray-900 truncate">
                                  {filing.description || filing.primaryDocument}
                                </span>
                              </div>
                              <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  Filed: {filing.filingDate}
                                </span>
                                {filing.reportDate && (
                                  <span>Report: {filing.reportDate}</span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 ml-2">
                              <a
                                href={filing.filingUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="text-gray-400 hover:text-blue-600"
                                title="View on SEC.gov"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                              <ChevronRight className="w-4 h-4 text-gray-400" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : filingsData ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto" />
                    <p className="text-gray-500 mt-3">No {formType} filings found for this company</p>
                  </CardContent>
                </Card>
              ) : null}
            </div>

            {viewingFiling && (
              <div className="lg:col-span-2">
                <Card className="sticky top-4">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <FileText className="w-5 h-5 text-blue-600" />
                          {viewingFiling.form} - {viewingFiling.description || viewingFiling.primaryDocument}
                        </CardTitle>
                        <p className="text-sm text-gray-500 mt-1">
                          Filed: {viewingFiling.filingDate} | Report Period: {viewingFiling.reportDate}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <a
                          href={viewingFiling.documentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button variant="outline" size="sm">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            SEC.gov
                          </Button>
                        </a>
                        <Button variant="ghost" size="sm" onClick={handleCloseFiling}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {isLoadingContent ? (
                      <div className="py-12 text-center">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
                        <p className="text-gray-500 mt-3">Loading filing content from SEC EDGAR...</p>
                        <p className="text-xs text-gray-400 mt-1">Large filings may take a moment</p>
                      </div>
                    ) : filingContent?.content ? (
                      <div className="max-h-[70vh] overflow-y-auto border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono leading-relaxed">
                          {filingContent.content}
                        </pre>
                      </div>
                    ) : (
                      <div className="py-12 text-center">
                        <p className="text-gray-500">Unable to load filing content</p>
                        <a
                          href={viewingFiling.documentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm mt-2 inline-block"
                        >
                          View directly on SEC.gov
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}

        {!selectedCompany && !debouncedQuery && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => { handleSearchChange("AAPL"); setSearchQuery("AAPL"); }}>
              <CardContent className="pt-6 text-center">
                <Building2 className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900">Apple Inc.</h3>
                <p className="text-sm text-gray-500 mt-1">AAPL - Technology</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => { handleSearchChange("XOM"); setSearchQuery("XOM"); }}>
              <CardContent className="pt-6 text-center">
                <Building2 className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900">Exxon Mobil Corp</h3>
                <p className="text-sm text-gray-500 mt-1">XOM - Energy</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => { handleSearchChange("TSLA"); setSearchQuery("TSLA"); }}>
              <CardContent className="pt-6 text-center">
                <Building2 className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900">Tesla Inc.</h3>
                <p className="text-sm text-gray-500 mt-1">TSLA - Automotive</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
