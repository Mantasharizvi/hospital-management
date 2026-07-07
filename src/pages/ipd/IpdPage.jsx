import {
  BedDouble,
  ClipboardPlus,
  FileCheck2,
  HeartPulse,
  Receipt,
  ShieldCheck,
  Stethoscope,
  UserRoundPlus,
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Table from '../../components/common/Table';

const statCards = [
  { label: 'Admissions Today', value: '18', detail: '3 critical cases', icon: UserRoundPlus },
  { label: 'Occupied Beds', value: '87/120', detail: '72% utilization', icon: BedDouble },
  { label: 'Active Treatments', value: '42', detail: '6 pending reviews', icon: HeartPulse },
  { label: 'Discharges Pending', value: '9', detail: '2 due today', icon: FileCheck2 },
];

const admissions = [
  { id: 'IPD-401', patient: 'Ananya Roy', ward: 'ICU', bed: 'ICU-02', status: 'Admitted' },
  { id: 'IPD-402', patient: 'Nikhil Rao', ward: 'Ward A', bed: 'A-14', status: 'Monitoring' },
  { id: 'IPD-403', patient: 'Priya Kumar', ward: 'Ward B', bed: 'B-09', status: 'Recovery' },
];

const wards = [
  { name: 'ICU', beds: 12, occupied: 10, status: 'Critical Care' },
  { name: 'Ward A', beds: 24, occupied: 17, status: 'General Care' },
  { name: 'Ward B', beds: 18, occupied: 14, status: 'Maternity' },
];

const treatmentRecords = [
  { date: '07 Jul', note: 'IV antibiotics started', doctor: 'Dr. Mehta' },
  { date: '06 Jul', note: 'Vitals reassessed', doctor: 'Dr. Sinha' },
  { date: '05 Jul', note: 'Physiotherapy recommended', doctor: 'Dr. Nair' },
];

export default function IpdPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink-900">IPD Module</h1>
          <p className="text-sm text-ink-600 mt-1">Track admissions, bed occupancy, treatment, discharge and inpatient billing with a streamlined view.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map(({ label, value, detail, icon: Icon }) => (
          <Card key={label} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-ink-600">{label}</p>
                <p className="mt-2 text-2xl font-semibold text-ink-900">{value}</p>
                <p className="mt-1 text-xs text-teal-700">{detail}</p>
              </div>
              <div className="rounded-lg bg-teal-50 p-2 text-teal-700">
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card title="Admission Form">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Input label="Patient Name" placeholder="Enter inpatient name" />
          <Input label="Admission Date" placeholder="07 Jul 2026" />
          <Input label="Ward Preference" placeholder="ICU / Ward A / Ward B" />
          <Input label="Attending Doctor" placeholder="Dr. Mehta" />
          <Input label="Emergency Contact" placeholder="Contact number" />
          <Input label="Insurance ID" placeholder="Policy number" />
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-ink-900 mb-1.5">Admission Reason</label>
            <textarea
              rows="3"
              className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              placeholder="Briefly describe condition and requirement"
            />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button icon={ClipboardPlus}>Admit Patient</Button>
          <Button variant="secondary">Save Draft</Button>
        </div>
      </Card>

      <Card title="Ward Management">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {wards.map((ward) => (
            <div key={ward.name} className="rounded-lg border border-line p-4">
              <div className="flex items-center justify-between gap-3">
                <h4 className="font-semibold text-ink-900">{ward.name}</h4>
                <span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700">{ward.status}</span>
              </div>
              <p className="mt-3 text-sm text-ink-600">Beds: {ward.occupied}/{ward.beds} occupied</p>
              <div className="mt-3 h-2 rounded-full bg-surface">
                <div className="h-2 rounded-full bg-teal-600" style={{ width: `${(ward.occupied / ward.beds) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Bed Allocation">
        <Table
          columns={[
            { key: 'id', header: 'Admission ID' },
            { key: 'patient', header: 'Patient' },
            { key: 'ward', header: 'Ward' },
            { key: 'bed', header: 'Bed No.' },
            { key: 'status', header: 'Status' },
          ]}
          data={admissions}
        />
      </Card>

      <Card title="Treatment Records">
        <div className="space-y-3">
          {treatmentRecords.map((record) => (
            <div key={`${record.date}-${record.note}`} className="rounded-lg border border-line p-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-ink-900">{record.note}</p>
                  <p className="text-sm text-ink-600">Dr. {record.doctor}</p>
                </div>
                <span className="rounded-full bg-surface px-2.5 py-1 text-xs font-semibold text-ink-600">{record.date}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card title="Discharge Summary">
          <div className="rounded-lg border border-line bg-surface p-4 space-y-3">
            <div className="flex items-center gap-2 text-teal-700">
              <ShieldCheck className="h-4 w-4" />
              <span className="text-sm font-semibold">Recommended discharge criteria</span>
            </div>
            <p className="text-sm text-ink-700">Patient stable, oral intake adequate, vitals normalized and follow-up appointment scheduled for next week.</p>
            <Button icon={FileCheck2}>Finalize Summary</Button>
          </div>
        </Card>

        <Card title="IPD Billing">
          <div className="rounded-lg border border-line bg-surface p-4 space-y-3">
            <div className="flex items-center justify-between text-sm text-ink-700">
              <span>Room Charges</span>
              <span>₹4,800</span>
            </div>
            <div className="flex items-center justify-between text-sm text-ink-700">
              <span>Medicine & Supplies</span>
              <span>₹2,150</span>
            </div>
            <div className="flex items-center justify-between text-sm text-ink-700">
              <span>Procedure Fee</span>
              <span>₹1,250</span>
            </div>
            <div className="border-t border-line pt-3 flex items-center justify-between font-semibold text-ink-900">
              <span>Total</span>
              <span>₹8,200</span>
            </div>
            <Button icon={Receipt} fullWidth>Generate IPD Bill</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
