const SEC_USER_AGENT = 'ClimateRiskScreener/1.0 (climate-risk-tool@example.com)';
const SEC_BASE_URL = 'https://data.sec.gov';
const EDGAR_SEARCH_URL = 'https://efts.sec.gov/LATEST/search-index';

interface CompanyTicker {
  cik_str: number;
  ticker: string;
  title: string;
}

interface CompanySearchResult {
  cik: string;
  ticker: string;
  name: string;
}

interface Filing {
  accessionNumber: string;
  filingDate: string;
  reportDate: string;
  form: string;
  primaryDocument: string;
  primaryDocDescription: string;
  fileNumber: string;
  filmNumber: string;
  items: string;
  size: number;
  isXBRL: number;
  isInlineXBRL: number;
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

interface EdgarSearchHit {
  _id: string;
  _source: {
    file_date: string;
    period_of_report: string;
    entity_name: string;
    file_num: string;
    form_type: string;
    file_description?: string;
    biz_locations?: string;
    biz_phone?: string;
    inc_states?: string;
    display_date_filed?: string;
    entity_id?: string;
  };
}

let companyTickersCache: CompanyTicker[] | null = null;
let tickersCacheTime: number = 0;
const TICKERS_CACHE_DURATION = 24 * 60 * 60 * 1000;

async function fetchWithUserAgent(url: string): Promise<Response> {
  return fetch(url, {
    headers: {
      'User-Agent': SEC_USER_AGENT,
      'Accept': 'application/json',
    },
  });
}

async function loadCompanyTickers(): Promise<CompanyTicker[]> {
  if (companyTickersCache && Date.now() - tickersCacheTime < TICKERS_CACHE_DURATION) {
    return companyTickersCache;
  }

  try {
    const response = await fetchWithUserAgent('https://www.sec.gov/files/company_tickers.json');
    if (!response.ok) {
      throw new Error(`Failed to fetch company tickers: ${response.status}`);
    }
    const data = await response.json() as Record<string, CompanyTicker>;
    companyTickersCache = Object.values(data);
    tickersCacheTime = Date.now();
    return companyTickersCache;
  } catch (error) {
    console.error('Error loading company tickers:', error);
    return [];
  }
}

export async function searchCompanies(query: string, limit: number = 20): Promise<CompanySearchResult[]> {
  const tickers = await loadCompanyTickers();
  const q = query.toUpperCase().trim();

  const exactTickerMatches: CompanySearchResult[] = [];
  const startsWithMatches: CompanySearchResult[] = [];
  const containsMatches: CompanySearchResult[] = [];

  for (const company of tickers) {
    const ticker = company.ticker.toUpperCase();
    const title = company.title.toUpperCase();
    const cik = String(company.cik_str).padStart(10, '0');

    const result: CompanySearchResult = {
      cik: cik,
      ticker: company.ticker,
      name: company.title,
    };

    if (ticker === q) {
      exactTickerMatches.push(result);
    } else if (ticker.startsWith(q) || title.startsWith(q)) {
      startsWithMatches.push(result);
    } else if (title.includes(q) || ticker.includes(q)) {
      containsMatches.push(result);
    }
  }

  return [...exactTickerMatches, ...startsWithMatches, ...containsMatches].slice(0, limit);
}

export async function getCompanyFilings(cik: string, formType: string = '10-K', count: number = 20): Promise<{ company: { name: string; cik: string; ticker: string; sic: string; sicDescription: string; stateOfIncorporation: string; fiscalYearEnd: string }; filings: FilingResult[] }> {
  const paddedCik = cik.padStart(10, '0');

  const response = await fetchWithUserAgent(`${SEC_BASE_URL}/submissions/CIK${paddedCik}.json`);
  if (!response.ok) {
    throw new Error(`Failed to fetch filings for CIK ${cik}: ${response.status}`);
  }

  const data = await response.json() as any;

  const company = {
    name: data.name || '',
    cik: paddedCik,
    ticker: data.tickers?.[0] || '',
    sic: data.sic || '',
    sicDescription: data.sicDescription || '',
    stateOfIncorporation: data.stateOfIncorporation || '',
    fiscalYearEnd: data.fiscalYearEnd || '',
  };

  const recentFilings = data.filings?.recent;
  if (!recentFilings) {
    return { company, filings: [] };
  }

  const filings: FilingResult[] = [];
  const forms = recentFilings.form || [];
  const accessionNumbers = recentFilings.accessionNumber || [];
  const filingDates = recentFilings.filingDate || [];
  const reportDates = recentFilings.reportDate || [];
  const primaryDocuments = recentFilings.primaryDocument || [];
  const primaryDocDescriptions = recentFilings.primaryDocDescription || [];

  for (let i = 0; i < forms.length && filings.length < count; i++) {
    if (forms[i] === formType || (formType === '10-K' && forms[i] === '10-K/A')) {
      const accession = accessionNumbers[i].replace(/-/g, '');
      filings.push({
        accessionNumber: accessionNumbers[i],
        filingDate: filingDates[i],
        reportDate: reportDates[i],
        form: forms[i],
        primaryDocument: primaryDocuments[i],
        description: primaryDocDescriptions[i] || forms[i],
        filingUrl: `https://www.sec.gov/Archives/edgar/data/${parseInt(cik)}/${accession}/${accessionNumbers[i]}-index.htm`,
        documentUrl: `https://www.sec.gov/Archives/edgar/data/${parseInt(cik)}/${accession}/${primaryDocuments[i]}`,
      });
    }
  }

  return { company, filings };
}

export async function getFilingDocument(cik: string, accessionNumber: string, document: string): Promise<string> {
  const accession = accessionNumber.replace(/-/g, '');
  const url = `https://www.sec.gov/Archives/edgar/data/${parseInt(cik)}/${accession}/${document}`;

  const response = await fetch(url, {
    headers: {
      'User-Agent': SEC_USER_AGENT,
      'Accept': 'text/html, text/plain, application/xhtml+xml',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch filing document: ${response.status}`);
  }

  const contentType = response.headers.get('content-type') || '';
  let text = await response.text();

  if (contentType.includes('html') || contentType.includes('xhtml') || document.endsWith('.htm') || document.endsWith('.html')) {
    text = stripHtmlToText(text);
  }

  if (text.length > 500000) {
    text = text.substring(0, 500000) + '\n\n[Document truncated - showing first 500,000 characters]';
  }

  return text;
}

function stripHtmlToText(html: string): string {
  let text = html;

  text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  text = text.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');

  text = text.replace(/<br\s*\/?>/gi, '\n');
  text = text.replace(/<\/p>/gi, '\n\n');
  text = text.replace(/<\/div>/gi, '\n');
  text = text.replace(/<\/tr>/gi, '\n');
  text = text.replace(/<\/td>/gi, '\t');
  text = text.replace(/<\/th>/gi, '\t');
  text = text.replace(/<\/h[1-6]>/gi, '\n\n');
  text = text.replace(/<\/li>/gi, '\n');
  text = text.replace(/<li[^>]*>/gi, '  • ');
  text = text.replace(/<hr[^>]*>/gi, '\n---\n');

  text = text.replace(/<[^>]+>/g, '');

  text = text.replace(/&nbsp;/gi, ' ');
  text = text.replace(/&amp;/gi, '&');
  text = text.replace(/&lt;/gi, '<');
  text = text.replace(/&gt;/gi, '>');
  text = text.replace(/&quot;/gi, '"');
  text = text.replace(/&#39;/gi, "'");
  text = text.replace(/&rsquo;/gi, "'");
  text = text.replace(/&lsquo;/gi, "'");
  text = text.replace(/&rdquo;/gi, '"');
  text = text.replace(/&ldquo;/gi, '"');
  text = text.replace(/&mdash;/gi, '—');
  text = text.replace(/&ndash;/gi, '–');
  text = text.replace(/&#\d+;/g, '');

  text = text.replace(/\t+/g, '\t');
  text = text.replace(/ +/g, ' ');
  text = text.replace(/\n\s*\n\s*\n/g, '\n\n');
  text = text.trim();

  return text;
}

export async function searchEdgarFullText(query: string, formType: string = '10-K', dateFrom?: string, dateTo?: string): Promise<{ total: number; results: Array<{ entityName: string; fileDate: string; formType: string; fileNum: string; periodOfReport: string; id: string }> }> {
  try {
    const params = new URLSearchParams({
      q: `"${query}"`,
      forms: formType,
    });
    if (dateFrom) params.set('dateRange', 'custom');
    if (dateFrom) params.set('startdt', dateFrom);
    if (dateTo) params.set('enddt', dateTo);

    const response = await fetchWithUserAgent(`${EDGAR_SEARCH_URL}?${params.toString()}`);
    if (!response.ok) {
      return { total: 0, results: [] };
    }

    const data = await response.json() as any;
    const hits = data.hits?.hits || [];

    return {
      total: data.hits?.total?.value || 0,
      results: hits.slice(0, 20).map((hit: EdgarSearchHit) => ({
        entityName: hit._source.entity_name,
        fileDate: hit._source.file_date,
        formType: hit._source.form_type,
        fileNum: hit._source.file_num,
        periodOfReport: hit._source.period_of_report,
        id: hit._id,
      })),
    };
  } catch (error) {
    console.error('EDGAR full-text search error:', error);
    return { total: 0, results: [] };
  }
}
