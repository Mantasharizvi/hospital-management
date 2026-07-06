import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Tooltip, Filler,
} from 'chart.js';
import { Users, BedDouble, CalendarCheck, Receipt } from 'lucide-react';
import Card from '../../components/common/Card';
import StatusBadge from '../../components/common/StatusBadge';
import Table from '../../components/common/Table';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

const stats = [
  { label: 'Total Patients', value: '2,481', icon: Users, accent: '#0B5566' },
  { label: 'Occupied Beds', value: '186 / 240', icon: BedDouble, accent: '#218A5D' },
  { label: "Today's Appointments", value: '58', icon: CalendarCheck, accent: '#B87A17' },
  { label: 'Pending Bills', value: '₹1,24,300', icon: Receipt, accent: '#C7423C' },
];

const chartData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Admissions',
      data: [12, 19, 14, 22, 18, 9, 15],
      borderColor: '#0E6B7F',
      backgroundColor: 'rgba(14,107,127,0.08)',
      fill: true,
      tension: 0.35,
      pointRadius: 3,
    },
  ],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false } },
    y: { grid: { color: '#E4E9ED' }, beginAtZero: true },
  },
};

const recentPatients = [
  { id: 1, name: 'Ravi Kumar', doctor: 'Dr. Sen', ward: 'ICU - 3', status: 'success' },
  { id: 2, name: 'Meena Shah', doctor: 'Dr. Verma', ward: 'General - 12', status: 'warning' },
  { id: 3, name: 'Arjun Nair', doctor: 'Dr. Rao', ward: 'General - 4', status: 'success' },
  { id: 4, name: 'Sunita Roy', doctor: 'Dr. Sen', ward: 'ICU - 1', status: 'danger' },
];

const columns = [
  { key: 'name', header: 'Patient' },
  { key: 'doctor', header: 'Doctor' },
  { key: 'ward', header: 'Ward / Bed' },
  {
    key: 'status',
    header: 'Condition',
    render: (row) => (
      <StatusBadge status={row.status}>
        {row.status === 'success' ? 'Stable' : row.status === 'warning' ? 'Observation' : 'Critical'}
      </StatusBadge>
    ),
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink-900">Dashboard</h1>
        <p className="text-sm text-ink-600 mt-1">Overview of today's hospital activity.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} accent={s.accent}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-ink-600 mb-1">{s.label}</p>
                <p className="font-display text-xl font-semibold text-ink-900">{s.value}</p>
              </div>
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${s.accent}1A`, color: s.accent }}
              >
                <s.icon className="w-5 h-5" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card title="Admissions this week" className="xl:col-span-2">
          <div className="h-64">
            <Line data={chartData} options={chartOptions} />
          </div>
        </Card>

        <Card title="Recently Admitted">
          <Table columns={columns} data={recentPatients} />
        </Card>
      </div>
    </div>
  );
}
