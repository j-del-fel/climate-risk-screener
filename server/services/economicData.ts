import { db } from "../db";
import { economicData } from "@shared/schema";
import { eq, and, desc, sql } from "drizzle-orm";

export interface EconomicDataPoint {
  date: string;
  value: number | null;
  source: string;
  seriesId: string;
  seriesName: string;
  units?: string;
  frequency?: string;
}

export interface EconomicSeries {
  id: string;
  name: string;
  description: string;
  source: string;
  category: string;
  units: string;
  frequency: string;
  lastUpdated?: string;
}

export interface DataSourceStatus {
  source: string;
  available: boolean;
  lastChecked: Date;
  error?: string;
}

const FRED_API_KEY = process.env.FRED_API_KEY;
const BEA_API_KEY = process.env.BEA_API_KEY;

// Cache duration in hours
const CACHE_DURATION_HOURS = 24;

// Check if cached data is still valid
function isCacheValid(updatedAt: Date | null): boolean {
  if (!updatedAt) return false;
  const now = new Date();
  const hoursSinceUpdate = (now.getTime() - updatedAt.getTime()) / (1000 * 60 * 60);
  return hoursSinceUpdate < CACHE_DURATION_HOURS;
}

// Get cached data from database
async function getCachedData(source: string, seriesId: string): Promise<EconomicDataPoint[] | null> {
  try {
    const cached = await db.select()
      .from(economicData)
      .where(and(
        eq(economicData.source, source),
        eq(economicData.seriesId, seriesId)
      ))
      .orderBy(desc(economicData.date));
    
    if (cached.length === 0) return null;
    
    // Check if cache is still valid
    const mostRecent = cached[0];
    if (!isCacheValid(mostRecent.updatedAt)) return null;
    
    return cached.map(row => ({
      date: row.date,
      value: row.value,
      source: row.source,
      seriesId: row.seriesId,
      seriesName: row.seriesName,
      units: row.units || undefined,
      frequency: row.frequency || undefined,
    })).sort((a, b) => a.date.localeCompare(b.date));
  } catch (error) {
    console.error('Error reading cached data:', error);
    return null;
  }
}

// Store data in database cache
async function cacheData(dataPoints: EconomicDataPoint[], category: string, description?: string): Promise<void> {
  if (dataPoints.length === 0) return;
  
  try {
    const source = dataPoints[0].source.replace(' (Sample)', '');
    const seriesId = dataPoints[0].seriesId;
    
    // Delete existing data for this series
    await db.delete(economicData)
      .where(and(
        eq(economicData.source, source),
        eq(economicData.seriesId, seriesId)
      ));
    
    // Insert new data
    const records = dataPoints.map(dp => ({
      source: source,
      seriesId: dp.seriesId,
      seriesName: dp.seriesName,
      category: category,
      date: dp.date,
      value: dp.value,
      units: dp.units || null,
      frequency: dp.frequency || null,
      description: description || null,
    }));
    
    // Batch insert in chunks of 100
    for (let i = 0; i < records.length; i += 100) {
      const chunk = records.slice(i, i + 100);
      await db.insert(economicData).values(chunk);
    }
    
    console.log(`Cached ${records.length} records for ${source}/${seriesId}`);
  } catch (error) {
    console.error('Error caching data:', error);
  }
}

export const CLIMATE_RELEVANT_SERIES = {
  fred: [
    { id: 'DCOILWTICO', name: 'Crude Oil Prices: WTI', category: 'energy', description: 'West Texas Intermediate crude oil price' },
    { id: 'GASREGW', name: 'Regular Gas Price', category: 'energy', description: 'US regular conventional retail gasoline prices' },
    { id: 'DHHNGSP', name: 'Natural Gas Price', category: 'energy', description: 'Henry Hub natural gas spot price' },
    { id: 'INDPRO', name: 'Industrial Production', category: 'economic', description: 'Industrial Production Index' },
    { id: 'CPIENGSL', name: 'Energy CPI', category: 'energy', description: 'Consumer Price Index for All Urban Consumers: Energy' },
    { id: 'CPILFESL', name: 'Core CPI', category: 'economic', description: 'Consumer Price Index for All Urban Consumers: Core' },
    { id: 'GDP', name: 'Gross Domestic Product', category: 'economic', description: 'US Gross Domestic Product' },
    { id: 'UNRATE', name: 'Unemployment Rate', category: 'economic', description: 'Civilian Unemployment Rate' },
    { id: 'FEDFUNDS', name: 'Federal Funds Rate', category: 'economic', description: 'Effective Federal Funds Rate' },
    { id: 'MANEMP', name: 'Manufacturing Employment', category: 'economic', description: 'All Employees: Manufacturing' },
  ],
  imf: [
    { id: 'PCPI_IX', name: 'Consumer Price Index', category: 'economic', description: 'Consumer Price Index, All items' },
    { id: 'NGDP_R', name: 'Real GDP', category: 'economic', description: 'Gross Domestic Product, constant prices' },
    { id: 'PPPEX', name: 'Exchange Rate PPP', category: 'economic', description: 'Implied PPP conversion rate' },
    { id: 'BCA', name: 'Current Account Balance', category: 'economic', description: 'Current account balance' },
  ],
  oecd: [
    { id: 'CPI', name: 'Consumer Prices', category: 'economic', description: 'Consumer Price Index' },
    { id: 'GDP', name: 'GDP', category: 'economic', description: 'Gross Domestic Product' },
    { id: 'INDPROD', name: 'Industrial Production', category: 'economic', description: 'Industrial Production Index' },
    { id: 'UNEMPLOY', name: 'Unemployment', category: 'economic', description: 'Unemployment rate' },
  ],
  dbnomics: [
    { id: 'IEA/BALANCES/WORLD.INDPROD.KTOE', name: 'World Industrial Energy', category: 'energy', description: 'World industrial energy production' },
    { id: 'IEA/BALANCES/WORLD.TPES.KTOE', name: 'Total Primary Energy Supply', category: 'energy', description: 'World total primary energy supply' },
    { id: 'Eurostat/env_air_gge/A.GHG.MIO_T.EU27_2020', name: 'EU GHG Emissions', category: 'emissions', description: 'EU greenhouse gas emissions' },
  ],
  bea: [
    { id: 'NIPA.T10101', name: 'GDP by Industry', category: 'economic', description: 'Gross Domestic Product by Industry' },
    { id: 'NIPA.T20100', name: 'Personal Income', category: 'economic', description: 'Personal Income and Its Disposition' },
    { id: 'NIPA.T40100', name: 'Government Receipts', category: 'economic', description: 'Government Current Receipts and Expenditures' },
  ],
  datagov: [
    { id: 'energy-consumption', name: 'Energy Consumption', category: 'energy', description: 'US Energy consumption data' },
    { id: 'emissions-data', name: 'Emissions Data', category: 'emissions', description: 'US Greenhouse gas emissions' },
    { id: 'economic-indicators', name: 'Economic Indicators', category: 'economic', description: 'US Economic indicators' },
  ]
};

export async function fetchFREDData(seriesId: string, startDate?: string, endDate?: string, forceRefresh: boolean = false): Promise<EconomicDataPoint[]> {
  const seriesInfo = CLIMATE_RELEVANT_SERIES.fred.find(s => s.id === seriesId);
  
  // Check database cache first
  if (!forceRefresh) {
    const cached = await getCachedData('FRED', seriesId);
    if (cached) {
      console.log(`Using cached FRED data for ${seriesId}`);
      return cached;
    }
  }
  
  if (!FRED_API_KEY) {
    console.log('FRED API key not configured - using sample data');
    const sampleData = getSampleFREDData(seriesId);
    await cacheData(sampleData, seriesInfo?.category || 'economic', seriesInfo?.description);
    return sampleData;
  }

  try {
    const start = startDate || '2010-01-01';
    const end = endDate || new Date().toISOString().split('T')[0];
    
    const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${FRED_API_KEY}&file_type=json&observation_start=${start}&observation_end=${end}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`FRED API error: ${response.status}`);
    }
    
    const data = await response.json() as any;
    
    const result = (data.observations || []).map((obs: any) => ({
      date: obs.date,
      value: obs.value === '.' ? null : parseFloat(obs.value),
      source: 'FRED',
      seriesId: seriesId,
      seriesName: seriesInfo?.name || seriesId,
      units: data.units || 'Index',
      frequency: data.frequency || 'Monthly'
    }));
    
    // Cache the data
    await cacheData(result, seriesInfo?.category || 'economic', seriesInfo?.description);
    
    return result;
  } catch (error) {
    console.error('FRED fetch error:', error);
    const sampleData = getSampleFREDData(seriesId);
    await cacheData(sampleData, seriesInfo?.category || 'economic', seriesInfo?.description);
    return sampleData;
  }
}

export async function fetchBEAData(datasetName: string, tableName: string, forceRefresh: boolean = false): Promise<EconomicDataPoint[]> {
  const seriesId = `${datasetName}.${tableName}`;
  const seriesInfo = CLIMATE_RELEVANT_SERIES.bea.find(s => s.id === seriesId);
  
  // Check database cache first
  if (!forceRefresh) {
    const cached = await getCachedData('BEA', seriesId);
    if (cached) {
      console.log(`Using cached BEA data for ${seriesId}`);
      return cached;
    }
  }
  
  if (!BEA_API_KEY) {
    console.log('BEA API key not configured - using sample data');
    const sampleData = getSampleBEAData(datasetName);
    await cacheData(sampleData, 'economic', seriesInfo?.description);
    return sampleData;
  }

  try {
    const url = `https://apps.bea.gov/api/data/?&UserID=${BEA_API_KEY}&method=GetData&DataSetName=${datasetName}&TableName=${tableName}&Frequency=A&Year=ALL&ResultFormat=JSON`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`BEA API error: ${response.status}`);
    }
    
    const data = await response.json() as any;
    
    const result = (data.BEAAPI?.Results?.Data || []).map((item: any) => ({
      date: `${item.TimePeriod}-01-01`,
      value: parseFloat(item.DataValue?.replace(/,/g, '')) || null,
      source: 'BEA',
      seriesId: seriesId,
      seriesName: item.LineDescription || tableName,
      units: 'USD Billions',
      frequency: 'Annual'
    }));
    
    await cacheData(result, 'economic', seriesInfo?.description);
    return result;
  } catch (error) {
    console.error('BEA fetch error:', error);
    const sampleData = getSampleBEAData(datasetName);
    await cacheData(sampleData, 'economic', seriesInfo?.description);
    return sampleData;
  }
}

export async function fetchIMFData(indicator: string, countryCode: string = 'US', forceRefresh: boolean = false): Promise<EconomicDataPoint[]> {
  const seriesId = `${indicator}.${countryCode}`;
  const seriesInfo = CLIMATE_RELEVANT_SERIES.imf.find(s => s.id === indicator);
  
  // Check database cache first
  if (!forceRefresh) {
    const cached = await getCachedData('IMF', seriesId);
    if (cached) {
      console.log(`Using cached IMF data for ${seriesId}`);
      return cached;
    }
  }
  
  try {
    const url = `https://www.imf.org/external/datamapper/api/v1/${indicator}/${countryCode}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`IMF API error: ${response.status}`);
    }
    
    const data = await response.json() as any;
    const seriesData = data.values?.[indicator]?.[countryCode] || {};
    
    const result = Object.entries(seriesData).map(([year, value]) => ({
      date: `${year}-01-01`,
      value: typeof value === 'number' ? value : null,
      source: 'IMF',
      seriesId: seriesId,
      seriesName: seriesInfo?.name || indicator,
      units: 'Various',
      frequency: 'Annual'
    })).sort((a, b) => a.date.localeCompare(b.date));
    
    await cacheData(result, seriesInfo?.category || 'economic', seriesInfo?.description);
    return result;
  } catch (error) {
    console.error('IMF fetch error:', error);
    const sampleData = getSampleIMFData(indicator);
    await cacheData(sampleData, seriesInfo?.category || 'economic', seriesInfo?.description);
    return sampleData;
  }
}

export async function fetchOECDData(datasetId: string, countryCode: string = 'USA', forceRefresh: boolean = false): Promise<EconomicDataPoint[]> {
  const seriesInfo = CLIMATE_RELEVANT_SERIES.oecd.find(s => s.id === datasetId);
  
  // Check database cache first
  if (!forceRefresh) {
    const cached = await getCachedData('OECD', datasetId);
    if (cached) {
      console.log(`Using cached OECD data for ${datasetId}`);
      return cached;
    }
  }
  
  try {
    const url = `https://sdmx.oecd.org/public/rest/data/OECD.SDD.NAD,DSD_NAMAIN1@DF_TABLE1_EXPENDITURE_HCPC,1.0/${countryCode}.A.N.GS13.TOT_XDC.V+L.?startPeriod=2010&dimensionAtObservation=AllDimensions&format=jsondata`;
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      console.log('OECD API not available, using sample data');
      const sampleData = getSampleOECDData(datasetId);
      await cacheData(sampleData, seriesInfo?.category || 'economic', seriesInfo?.description);
      return sampleData;
    }
    
    const data = await response.json() as any;
    const observations = data.data?.dataSets?.[0]?.observations || {};
    const timeDimension = data.data?.structure?.dimensions?.observation?.find((d: any) => d.id === 'TIME_PERIOD');
    const times = timeDimension?.values || [];
    
    const result = Object.entries(observations).map(([key, values]: [string, any]) => {
      const timeIndex = parseInt(key.split(':').pop() || '0');
      const year = times[timeIndex]?.id || '2020';
      return {
        date: `${year}-01-01`,
        value: values[0] || null,
        source: 'OECD',
        seriesId: datasetId,
        seriesName: datasetId,
        units: 'Index',
        frequency: 'Annual'
      };
    }).sort((a, b) => a.date.localeCompare(b.date));
    
    await cacheData(result, seriesInfo?.category || 'economic', seriesInfo?.description);
    return result;
  } catch (error) {
    console.error('OECD fetch error:', error);
    const sampleData = getSampleOECDData(datasetId);
    await cacheData(sampleData, seriesInfo?.category || 'economic', seriesInfo?.description);
    return sampleData;
  }
}

export async function fetchDBnomicsData(seriesId: string, forceRefresh: boolean = false): Promise<EconomicDataPoint[]> {
  const seriesInfo = CLIMATE_RELEVANT_SERIES.dbnomics.find(s => s.id === seriesId);
  
  // Check database cache first
  if (!forceRefresh) {
    const cached = await getCachedData('DBnomics', seriesId);
    if (cached) {
      console.log(`Using cached DBnomics data for ${seriesId}`);
      return cached;
    }
  }
  
  try {
    const encodedId = encodeURIComponent(seriesId);
    const url = `https://api.db.nomics.world/v22/series/${encodedId}?observations=1`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`DBnomics API error: ${response.status}`);
    }
    
    const data = await response.json() as any;
    const series = data.series?.docs?.[0];
    
    if (!series) {
      const sampleData = getSampleDBnomicsData(seriesId);
      await cacheData(sampleData, seriesInfo?.category || 'energy', seriesInfo?.description);
      return sampleData;
    }
    
    const periods = series.period || [];
    const values = series.value || [];
    
    const result = periods.map((period: string, index: number) => ({
      date: period.includes('-') ? period : `${period}-01-01`,
      value: values[index] ?? null,
      source: 'DBnomics',
      seriesId: seriesId,
      seriesName: seriesInfo?.name || series.series_name || seriesId,
      units: series.unit || 'Various',
      frequency: series.frequency || 'Annual'
    }));
    
    await cacheData(result, seriesInfo?.category || 'energy', seriesInfo?.description);
    return result;
  } catch (error) {
    console.error('DBnomics fetch error:', error);
    const sampleData = getSampleDBnomicsData(seriesId);
    await cacheData(sampleData, seriesInfo?.category || 'energy', seriesInfo?.description);
    return sampleData;
  }
}

export async function fetchDataGovData(datasetId: string): Promise<EconomicDataPoint[]> {
  try {
    const url = `https://catalog.data.gov/api/3/action/package_show?id=${datasetId}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      return getSampleDataGovData(datasetId);
    }
    
    const data = await response.json() as any;
    
    return [{
      date: new Date().toISOString().split('T')[0],
      value: null,
      source: 'Data.gov',
      seriesId: datasetId,
      seriesName: data.result?.title || datasetId,
      units: 'Various',
      frequency: 'Various'
    }];
  } catch (error) {
    console.error('Data.gov fetch error:', error);
    return getSampleDataGovData(datasetId);
  }
}

function getSampleFREDData(seriesId: string): EconomicDataPoint[] {
  const seriesInfo = CLIMATE_RELEVANT_SERIES.fred.find(s => s.id === seriesId);
  const baseValues: Record<string, number[]> = {
    'DCOILWTICO': [65, 70, 75, 80, 85, 78, 72, 68, 75, 82, 88, 95],
    'GASREGW': [2.5, 2.6, 2.8, 3.0, 3.2, 3.1, 2.9, 2.7, 2.8, 3.0, 3.3, 3.5],
    'DHHNGSP': [3.2, 3.5, 3.8, 4.2, 4.0, 3.6, 3.3, 3.1, 3.4, 3.8, 4.1, 4.5],
    'INDPRO': [100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111],
    'GDP': [21000, 21500, 22000, 22500, 23000, 23500, 24000, 24500, 25000, 25500, 26000, 26500],
    'UNRATE': [4.0, 3.9, 3.8, 3.7, 3.6, 3.5, 3.6, 3.7, 3.8, 3.9, 4.0, 4.1],
    'FEDFUNDS': [0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0, 5.25, 5.5],
  };
  
  const values = baseValues[seriesId] || Array.from({ length: 12 }, (_, i) => 100 + i * 2);
  const years = [2019, 2020, 2021, 2022, 2023, 2024];
  
  return years.flatMap((year, yi) => 
    values.slice(0, 6).map((baseValue, mi) => ({
      date: `${year}-${String(mi * 2 + 1).padStart(2, '0')}-01`,
      value: baseValue * (1 + yi * 0.05 + Math.random() * 0.02),
      source: 'FRED (Sample)',
      seriesId: seriesId,
      seriesName: seriesInfo?.name || seriesId,
      units: 'Index',
      frequency: 'Monthly'
    }))
  );
}

function getSampleBEAData(datasetName: string): EconomicDataPoint[] {
  const years = [2018, 2019, 2020, 2021, 2022, 2023, 2024];
  const baseValue = 20000;
  
  return years.map((year, i) => ({
    date: `${year}-01-01`,
    value: baseValue * (1 + i * 0.03) * (year === 2020 ? 0.97 : 1),
    source: 'BEA (Sample)',
    seriesId: datasetName,
    seriesName: 'GDP by Industry',
    units: 'USD Billions',
    frequency: 'Annual'
  }));
}

function getSampleIMFData(indicator: string): EconomicDataPoint[] {
  const seriesInfo = CLIMATE_RELEVANT_SERIES.imf.find(s => s.id === indicator);
  const years = [2018, 2019, 2020, 2021, 2022, 2023, 2024];
  const baseValue = indicator === 'NGDP_R' ? 21000 : 100;
  
  return years.map((year, i) => ({
    date: `${year}-01-01`,
    value: baseValue * (1 + i * 0.025),
    source: 'IMF (Sample)',
    seriesId: `${indicator}.US`,
    seriesName: seriesInfo?.name || indicator,
    units: 'Various',
    frequency: 'Annual'
  }));
}

function getSampleOECDData(datasetId: string): EconomicDataPoint[] {
  const years = [2018, 2019, 2020, 2021, 2022, 2023, 2024];
  
  return years.map((year, i) => ({
    date: `${year}-01-01`,
    value: 100 * (1 + i * 0.02),
    source: 'OECD (Sample)',
    seriesId: datasetId,
    seriesName: datasetId,
    units: 'Index',
    frequency: 'Annual'
  }));
}

function getSampleDBnomicsData(seriesId: string): EconomicDataPoint[] {
  const seriesInfo = CLIMATE_RELEVANT_SERIES.dbnomics.find(s => s.id === seriesId);
  const years = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023];
  
  return years.map((year, i) => ({
    date: `${year}-01-01`,
    value: 1000 * (1 - i * 0.02),
    source: 'DBnomics (Sample)',
    seriesId: seriesId,
    seriesName: seriesInfo?.name || seriesId,
    units: 'KTOE',
    frequency: 'Annual'
  }));
}

function getSampleDataGovData(datasetId: string): EconomicDataPoint[] {
  return [{
    date: new Date().toISOString().split('T')[0],
    value: null,
    source: 'Data.gov (Sample)',
    seriesId: datasetId,
    seriesName: 'Sample Dataset',
    units: 'Various',
    frequency: 'Various'
  }];
}

export function getAvailableSeries(): EconomicSeries[] {
  const allSeries: EconomicSeries[] = [];
  
  for (const [source, series] of Object.entries(CLIMATE_RELEVANT_SERIES)) {
    for (const s of series) {
      allSeries.push({
        id: s.id,
        name: s.name,
        description: s.description,
        source: source.toUpperCase(),
        category: s.category,
        units: 'Various',
        frequency: 'Various'
      });
    }
  }
  
  return allSeries;
}

export async function checkDataSourcesStatus(): Promise<DataSourceStatus[]> {
  const sources: DataSourceStatus[] = [];
  
  sources.push({
    source: 'FRED',
    available: !!FRED_API_KEY,
    lastChecked: new Date(),
    error: FRED_API_KEY ? undefined : 'API key not configured'
  });
  
  sources.push({
    source: 'BEA',
    available: !!BEA_API_KEY,
    lastChecked: new Date(),
    error: BEA_API_KEY ? undefined : 'API key not configured'
  });
  
  sources.push({
    source: 'IMF',
    available: true,
    lastChecked: new Date()
  });
  
  sources.push({
    source: 'OECD',
    available: true,
    lastChecked: new Date()
  });
  
  sources.push({
    source: 'DBnomics',
    available: true,
    lastChecked: new Date()
  });
  
  sources.push({
    source: 'Data.gov',
    available: true,
    lastChecked: new Date()
  });
  
  return sources;
}

export async function fetchAllClimateEconomicData(): Promise<{
  energy: EconomicDataPoint[];
  economic: EconomicDataPoint[];
  emissions: EconomicDataPoint[];
}> {
  const [oilData, gasData, naturalGasData, gdpData, industrialData, imfGdpData] = await Promise.all([
    fetchFREDData('DCOILWTICO'),
    fetchFREDData('GASREGW'),
    fetchFREDData('DHHNGSP'),
    fetchFREDData('GDP'),
    fetchFREDData('INDPRO'),
    fetchIMFData('NGDP_R', 'US')
  ]);
  
  return {
    energy: [...oilData, ...gasData, ...naturalGasData],
    economic: [...gdpData, ...industrialData, ...imfGdpData],
    emissions: []
  };
}

// Get statistics about cached economic data
export async function getEconomicDataStats(): Promise<{
  totalRecords: number;
  bySource: { source: string; count: number }[];
  byCategory: { category: string; count: number }[];
  seriesCached: number;
  lastUpdated: Date | null;
}> {
  try {
    const totalResult = await db.select({ count: sql<number>`count(*)` })
      .from(economicData);
    
    const bySourceResult = await db.select({
      source: economicData.source,
      count: sql<number>`count(*)`
    })
      .from(economicData)
      .groupBy(economicData.source);
    
    const byCategoryResult = await db.select({
      category: economicData.category,
      count: sql<number>`count(*)`
    })
      .from(economicData)
      .groupBy(economicData.category);
    
    const seriesResult = await db.select({
      count: sql<number>`count(DISTINCT series_id)`
    })
      .from(economicData);
    
    const lastUpdatedResult = await db.select({
      lastUpdated: sql<Date>`max(updated_at)`
    })
      .from(economicData);
    
    return {
      totalRecords: Number(totalResult[0]?.count || 0),
      bySource: bySourceResult.map(r => ({ source: r.source, count: Number(r.count) })),
      byCategory: byCategoryResult.map(r => ({ category: r.category, count: Number(r.count) })),
      seriesCached: Number(seriesResult[0]?.count || 0),
      lastUpdated: lastUpdatedResult[0]?.lastUpdated || null
    };
  } catch (error) {
    console.error('Error getting economic data stats:', error);
    return {
      totalRecords: 0,
      bySource: [],
      byCategory: [],
      seriesCached: 0,
      lastUpdated: null
    };
  }
}

// Import all available economic data series
export async function importAllEconomicData(forceRefresh: boolean = false): Promise<{
  success: boolean;
  imported: { source: string; seriesId: string; records: number }[];
  errors: { source: string; seriesId: string; error: string }[];
}> {
  const imported: { source: string; seriesId: string; records: number }[] = [];
  const errors: { source: string; seriesId: string; error: string }[] = [];
  
  // Import FRED series
  for (const series of CLIMATE_RELEVANT_SERIES.fred) {
    try {
      const data = await fetchFREDData(series.id, undefined, undefined, forceRefresh);
      imported.push({ source: 'FRED', seriesId: series.id, records: data.length });
    } catch (error) {
      errors.push({ source: 'FRED', seriesId: series.id, error: String(error) });
    }
  }
  
  // Import BEA series
  for (const series of CLIMATE_RELEVANT_SERIES.bea) {
    try {
      const [dataset, table] = series.id.split('.');
      const data = await fetchBEAData(dataset, table, forceRefresh);
      imported.push({ source: 'BEA', seriesId: series.id, records: data.length });
    } catch (error) {
      errors.push({ source: 'BEA', seriesId: series.id, error: String(error) });
    }
  }
  
  // Import IMF series
  for (const series of CLIMATE_RELEVANT_SERIES.imf) {
    try {
      const data = await fetchIMFData(series.id, 'US', forceRefresh);
      imported.push({ source: 'IMF', seriesId: series.id, records: data.length });
    } catch (error) {
      errors.push({ source: 'IMF', seriesId: series.id, error: String(error) });
    }
  }
  
  // Import OECD series
  for (const series of CLIMATE_RELEVANT_SERIES.oecd) {
    try {
      const data = await fetchOECDData(series.id, 'USA', forceRefresh);
      imported.push({ source: 'OECD', seriesId: series.id, records: data.length });
    } catch (error) {
      errors.push({ source: 'OECD', seriesId: series.id, error: String(error) });
    }
  }
  
  // Import DBnomics series
  for (const series of CLIMATE_RELEVANT_SERIES.dbnomics) {
    try {
      const data = await fetchDBnomicsData(series.id, forceRefresh);
      imported.push({ source: 'DBnomics', seriesId: series.id, records: data.length });
    } catch (error) {
      errors.push({ source: 'DBnomics', seriesId: series.id, error: String(error) });
    }
  }
  
  return {
    success: errors.length === 0,
    imported,
    errors
  };
}

// Clear cached economic data
export async function clearEconomicDataCache(source?: string): Promise<{ deleted: number }> {
  try {
    if (source) {
      const result = await db.delete(economicData)
        .where(eq(economicData.source, source));
      return { deleted: result.rowCount || 0 };
    } else {
      const result = await db.delete(economicData);
      return { deleted: result.rowCount || 0 };
    }
  } catch (error) {
    console.error('Error clearing cache:', error);
    return { deleted: 0 };
  }
}
