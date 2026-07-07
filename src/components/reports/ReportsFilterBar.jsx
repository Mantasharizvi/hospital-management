import { Download, Printer } from 'lucide-react';
import Select from '../common/Select';
import Button from '../common/Button';
import { dateRanges } from '../../data/reportsData';

export default function ReportsFilterBar({ range, onRangeChange, onExport, onPrint }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
      <div className="w-full sm:w-48">
        <Select
          value={range}
          onChange={(e) => onRangeChange(e.target.value)}
          options={dateRanges.map((r) => ({ value: r, label: r }))}
          placeholder="Last 7 days"
        />
      </div>

      <div className="flex gap-2 sm:ml-auto">
        <Button variant="secondary" icon={Printer} onClick={onPrint}>
          Print
        </Button>
        <Button icon={Download} onClick={onExport}>
          Export Report
        </Button>
      </div>
    </div>
  );
}
