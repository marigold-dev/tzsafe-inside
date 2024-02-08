// Chart.tsx
import ContractCountBarChart from './ContractCountBarChart';
import data10XTZContractCount from '../data/10XTZContractCount.json';
import dataAllContractCount from '../data/allContractCount.json';
import dataMonthlyActivityContractCount from '../data/monthlyActivityContractCount.json';
import dataMonthlyContractCount from '../data/monthlyContractCount.json';
import dataStatisticsTokenCount from '../data/statisticsTokenCount.json';
import dataStatisticsXTZCount from '../data/statisticsXTZCount.json';
import dataStatisticsOwnerCount from '../data/statisticsOwnerCount.json';
import dataStatisticsThresholdPercentage from '../data/statisticsThresholdPercentage.json';
import dataStatisticsThresholdPercentageSans1Of1 from '../data/statisticsThresholdPercentageSans1Of1.json';
import dataStatisticsThresholdPercentageWith1OfM from '../data/statisticsThresholdPercentageWith1OfM.json';
import React from 'react';

const versions = [ "0.0.6", "0.0.8", "0.0.9", "0.0.10", "0.0.11", "0.0.11b", "0.1.1", "0.3.0", "0.3.1", "0.3.2", "0.3.3", "0.3.4" ]
const percentage = Array.from(new Set([
  ...Object.keys(dataStatisticsThresholdPercentage),
  ...Object.keys(dataStatisticsThresholdPercentageSans1Of1),
  ...Object.keys(dataStatisticsThresholdPercentageWith1OfM)
]))
type DatasetType = { [key: string]: number };

/** count by version */
const dsAllContractCount : DatasetType = dataAllContractCount as DatasetType;
const dsMonthlyContractCount : DatasetType = dataMonthlyContractCount as DatasetType;
const dsMonthlyActivityContractCount : DatasetType = dataMonthlyActivityContractCount as DatasetType;
const ds10XTZContractCount : DatasetType = data10XTZContractCount as DatasetType;

/**  distribution */
const dsStatisticsXTZCount : DatasetType = dataStatisticsXTZCount as DatasetType;
const dsStatisticsTokenCount : DatasetType = dataStatisticsTokenCount as DatasetType;
const dsStatisticsOwnerCount : DatasetType = dataStatisticsOwnerCount as DatasetType;

/** N of M */
const dsStatisticsThresholdPercentage : DatasetType = dataStatisticsThresholdPercentage as DatasetType;
const dsStatisticsThresholdPercentageSans1of1 : DatasetType = dataStatisticsThresholdPercentageSans1Of1 as DatasetType;

/** 1 of M */
const dsStatisticsThresholdPercentageWith1of1 : DatasetType = dataStatisticsThresholdPercentageWith1OfM as DatasetType;


const contractDatasets = [
  {
    label: 'All Contract',
    data: versions.map(key => (key in dsAllContractCount ? dsAllContractCount[key] : -1))
  },
  {
    label: 'Monthely New Contract',
    data: versions.map(key => (key in dsMonthlyContractCount) ? dsMonthlyContractCount[key] : -1),
  },
  {
    label: 'Recent Month Activity of Contract',
    data: versions.map(key => (key in dsMonthlyActivityContractCount) ? dsMonthlyActivityContractCount[key] : -1),
  },
  {
    label: 'Balance > 10XTZ',
    data: versions.map(key => (key in ds10XTZContractCount) ? ds10XTZContractCount[key] : -1),
  },
];

const xtzDataset = [
  {
    label: 'XTZ',
    data: Object.values(dsStatisticsXTZCount)
  }
]

const tokenDataset = [
  {
    label: 'Tokens',
    data: Object.values(dsStatisticsTokenCount)
  }
]

const ownerDataset = [
  { 
    label: 'Owners',
    data: Object.values(dsStatisticsOwnerCount)
  }
]

const nOfm = [
  { 
    label: 'N-of-M',
    data: percentage.map(key => (key in dsStatisticsThresholdPercentage) ? dsStatisticsThresholdPercentage[key] : 0) 
  },
  { 
    label: '1-of-M',
    data: percentage.map(key => (key in dsStatisticsThresholdPercentageWith1of1) ? dsStatisticsThresholdPercentageWith1of1[key] : 0) 
  },
  { 
    label: 'N-of-M without 1-of-1',
    data: percentage.map(key => (key in dsStatisticsThresholdPercentageSans1of1) ? dsStatisticsThresholdPercentageSans1of1[key] : 0) 
  },
]

const Chart: React.FC = () => {
  return (
    <div className="flex-1 container mx-auto flex flex-wrap -mx-2">
      <div className="w-full p-2">
        <h1 className="text-2xl font-bold text-gray-800 text-center">
          Dashboard
        </h1>
        <div className="text-sm text-gray-600 mt-2 mb-2 text-left">
          If x-asia presents -1, it means something wrong with dataset
        </div>
      </div>
      {/* First Row */}
      <div className="w-full p-2 text-left">
        <a href="#version" className="text-blue-600 hover:text-blue-800">About Version</a>
      </div>

      <div id="version" className="w-full p-2">
        <ContractCountBarChart
          datasets={contractDatasets}
          labels={versions}
          xAxisTitle={'Version'}
          yAxisTitle={'Number of safe'}
        />
      </div>

      {/* Second Row: Three Charts (Each One-Third Width) */}
      <div className="w-full p-2 text-left">
        <a href="#distribution" className="text-blue-600 hover:text-blue-800">About Distribution</a>
      </div>
      <div id="distribution" className="w-1/3 p-2">
        <h2 className="text-lg font-bold text-center mb-2">Distribution of Safe by Number of XTZ</h2>
        <ContractCountBarChart
          datasets={xtzDataset}
          labels={Object.keys(dsStatisticsXTZCount)}
          xAxisTitle={'Number of XTZs'}
          yAxisTitle={'Number of safe'}
        />
      </div>
      <div className="w-1/3 p-2">
        <h2 className="text-lg font-bold text-center mb-2">Distribution of Safe by Number of Tokens</h2>
        <ContractCountBarChart
          datasets={tokenDataset}
          labels={Object.keys(dsStatisticsTokenCount)}
          xAxisTitle={'Number of tokens'}
          yAxisTitle={'Number of safe'}
        />
      </div>
      <div className="w-1/3 p-2">
        <h2 className="text-lg font-bold text-center mb-2">Distribution of Safe by Number of Owners</h2>
        <ContractCountBarChart
          datasets={ownerDataset}
          labels={Object.keys(dsStatisticsOwnerCount)}
          xAxisTitle={'Number of owners'}
          yAxisTitle={'Number of safe'}
        />
      </div>

      {/* Third Row: One Chart (Full Width) */}
      <div className="w-full p-2 text-left">
        <a href="#n-of-m" className="text-blue-600 hover:text-blue-800">About N-of-M</a>
        <div className="text-sm text-gray-600 mt-2 mb-2 text-left">
          Note: 1-of-M in 100% means 1-of-1
        </div>
      </div>
      <div id="n-of-m" className="w-full p-2">
        <h2 className="text-lg font-bold text-center mb-2">Distribution of Safe by Number of N-of-M</h2>
        <ContractCountBarChart
          datasets={nOfm}
          labels={percentage}
          xAxisTitle={'N divided by M, represented in percentage form'}
          yAxisTitle={'Number of safe'}
        />
      </div>
    </div>
  );
};

export default Chart;