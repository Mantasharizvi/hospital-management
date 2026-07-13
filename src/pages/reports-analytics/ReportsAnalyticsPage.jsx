import { useMemo, useState } from 'react';
import { Activity, BedDouble, Pill, IndianRupee, TrendingUp, PieChart, Download, Printer } from 'lucide-react';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import StatCard from '../../components/dashboard/StatCard';
import RevenueTrendChart from '../../components/reports/RevenueTrendChart';
import ServiceDistributionChart from '../../components/reports/ServiceDistributionChart';
import ExportReportModal from '../../components/reports/ExportReportModal';
import {
  reportStatCards,
  reportColumns,
  reportDataByTab,
  reportTitleByTab,
} from '../../data/reportsData';

const tabs = [
  { id: 'opd', label: 'OPD Reports', icon: Activity },
  { id: 'ipd', label: 'IPD Reports', icon: BedDouble },
  { id: 'pharmacy', label: 'Pharmacy Reports', icon: Pill },
  { id: 'revenue', label: 'Revenue Reports', icon: IndianRupee },
];

const INR = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

export default function ReportsAnalyticsPage() {
  const [activeTab, setActiveTab] = useState('opd');
  const [showExportModal, setShowExportModal] = useState(false);

  const columns = reportColumns[activeTab];
  const rows = reportDataByTab[activeTab];
  const title = reportTitleByTab[activeTab];

  // Render currency columns with the ₹ formatter on screen, same values the export uses.
  const tableColumns = useMemo(
    () =>
      columns.map((col) =>
        col.formatCurrency
          ? { ...col, render: (row) => INR.format(row[col.key]) }
          : col
      ),
    [columns]
  );

  const handlePrint = () => window.print();

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink-900">Reports & Analytics</h1>
          <p className="text-sm text-ink-600 mt-1">
            Comprehensive reports, analytics dashboard, and data export tools for hospital operations.
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {reportStatCards.map((card) => (
          <StatCard key={card.id} {...card} />
        ))}
      </div>

      {/* Analytics Dashboard — real charts, not static bars */}
      <Card title="Analytics Dashboard">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-lg border border-line p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-ink-900">Revenue Trend</h4>
              <TrendingUp className="w-4 h-4 text-teal-600" />
            </div>
            <RevenueTrendChart />
          </div>

          <div className="rounded-lg border border-line p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-ink-900">Service Distribution</h4>
              <PieChart className="w-4 h-4 text-teal-600" />
            </div>
            <ServiceDistributionChart />
          </div>
        </div>
      </Card>

      {/* Reports Tabs */}
      <Card
        title="Reports"
        action={
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" icon={Printer} onClick={handlePrint}>Print</Button>
            <Button size="sm" icon={Download} onClick={() => setShowExportModal(true)}>Export Report</Button>
          </div>
        }
      >
        <div className="mb-4 flex flex-wrap gap-2 border-b border-line pb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-teal-600 text-white'
                  : 'text-ink-700 hover:bg-surface'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <Table columns={tableColumns} data={rows} />
      </Card>

      {/* Export PDF/Excel/CSV — generates and downloads a real file */}
      <ExportReportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title={title}
        columns={columns}
        rows={rows}
      />
    </div>
  );
}
