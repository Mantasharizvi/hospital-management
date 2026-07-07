import { useState } from 'react';
import {
  CalendarDays,
  ClipboardList,
  FileText,
  History,
  Pill,
  Receipt,
  Stethoscope,
  UserPlus,
  Users,
  X,
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Table from '../../components/common/Table';

const statCards = [
  { label: 'Today Visits', value: '128', detail: '+12% vs yesterday', icon: Users },
  { label: 'Pending Appointments', value: '24', detail: '4 urgent cases', icon: CalendarDays },
  { label: 'Prescriptions Issued', value: '81', detail: '12 repeat orders', icon: Pill },
  { label: 'Bills Generated', value: '57', detail: '₹3.2L collected', icon: Receipt },
];

const patients = [
  { id: 'OPD-101', name: 'Aarav Sharma', age: 34, doctor: 'Dr. Nair', status: 'Consulted', visit: '09:30 AM' },
  { id: 'OPD-102', name: 'Meera Joseph', age: 28, doctor: 'Dr. Rao', status: 'Waiting', visit: '10:15 AM' },
  { id: 'OPD-103', name: 'Rahul Menon', age: 47, doctor: 'Dr. Shah', status: 'Pending Lab', visit: '11:00 AM' },
];

const appointments = [
  {
    id: 'APT-201',
    patient: 'Sana Begum',
    doctor: 'Dr. Nair',
    department: 'Cardiology',
    date: '07 Jul 2026',
    time: '09:00 AM',
    status: 'Confirmed',
    payment: 'Paid',
    type: 'Offline',
  },
  {
    id: 'APT-202',
    patient: 'Kiran Das',
    doctor: 'Dr. Rao',
    department: 'ENT',
    date: '08 Jul 2026',
    time: '10:30 AM',
    status: 'Pending',
    payment: 'Unpaid',
    type: 'Online',
  },
  {
    id: 'APT-203',
    patient: 'Jaya Pillai',
    doctor: 'Dr. Shah',
    department: 'Orthopedic',
    date: '08 Jul 2026',
    time: '12:00 PM',
    status: 'Completed',
    payment: 'Paid',
    type: 'Offline',
  },
];

const prescriptions = [
  { medicine: 'Paracetamol 500mg', dosage: '1-0-1', duration: '3 days' },
  { medicine: 'Vitamin D3', dosage: '1-0-0', duration: '30 days' },
  { medicine: 'Amoxicillin', dosage: '1-1-1', duration: '5 days' },
];

const history = [
  'Previous migraine episodes over 6 months',
  'Blood pressure monitored at 128/82',
  'No known allergies to penicillin',
  'Recommended follow-up in 2 weeks',
];

export default function OpdPage() {
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink-900">OPD Module</h1>
          <p className="text-sm text-ink-600 mt-1">Manage patient registration, consultations, prescriptions, billing and history in one workspace.</p>
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

      <Card title="Patient Registration Form">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Input label="Patient Name" placeholder="Enter patient name" />
          <Input label="Mobile Number" placeholder="Enter phone number" />
          <Input label="Age" type="number" placeholder="Enter age" />
          <Input label="Gender" placeholder="Male / Female / Other" />
          <Input label="Department" placeholder="General Medicine" />
          <Input label="Preferred Doctor" placeholder="Dr. Nair" />
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-ink-900 mb-1.5">Chief Complaint</label>
            <textarea
              rows="3"
              className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              placeholder="Describe symptoms or reason for visit"
            />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button icon={UserPlus}>Register Patient</Button>
          <Button variant="secondary">Reset Form</Button>
        </div>
      </Card>

      <Card title="Patient List">
        <Table
          columns={[
            { key: 'id', header: 'Patient ID' },
            { key: 'name', header: 'Patient' },
            { key: 'age', header: 'Age' },
            { key: 'doctor', header: 'Doctor' },
            { key: 'status', header: 'Status' },
            { key: 'visit', header: 'Visit Time' },
          ]}
          data={patients}
        />
      </Card>

      <div className="grid grid-cols-1 gap-6">
        <Card title="Appointment Management" action={<Button size="sm" variant="secondary">Export</Button>}>
          <div className="mb-4 flex justify-end">
            <button
              type="button"
              onClick={() => setIsAppointmentModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-full bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-teal-600/30 animate-pulse"
            >
              <ClipboardList className="h-4 w-4" />
              Add New Appointment
            </button>
          </div>
          <div className="mb-4">
            <Table
              columns={[
                { key: 'id', header: 'Appointment ID' },
                { key: 'patient', header: 'Patient Name' },
                { key: 'doctor', header: 'Doctor' },
                { key: 'department', header: 'Department' },
                { key: 'date', header: 'Date' },
                { key: 'time', header: 'Time Slot' },
                {
                  key: 'status',
                  header: 'Status',
                  render: (row) => (
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${row.status === 'Confirmed' ? 'bg-teal-50 text-teal-700' : row.status === 'Completed' ? 'bg-surface text-ink-700' : 'bg-amber-50 text-amber-700'}`}>
                      {row.status}
                    </span>
                  ),
                },
                {
                  key: 'payment',
                  header: 'Payment Status',
                  render: (row) => (
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${row.payment === 'Paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                      {row.payment}
                    </span>
                  ),
                },
                {
                  key: 'actions',
                  header: 'Actions',
                  render: () => (
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost">View</Button>
                      <Button size="sm" variant="secondary">Edit</Button>
                      <Button size="sm" variant="danger">Delete</Button>
                    </div>
                  ),
                },
              ]}
              data={appointments}
            />
          </div>
        </Card>
      </div>

      {isAppointmentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 px-4 py-6">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="font-display text-xl font-semibold text-ink-900">Add New Appointment</h3>
                <p className="text-sm text-ink-600">Create a new OPD appointment for the selected patient.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAppointmentModalOpen(false)}
                className="rounded-full p-2 text-ink-500 hover:bg-surface hover:text-ink-700"
                aria-label="Close appointment form"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <Select label="Select Patient" options={[{ value: 'sana', label: 'Sana Begum' }, { value: 'kiran', label: 'Kiran Das' }]} />
                <Button variant="secondary" className="w-fit self-end">Add New Patient</Button>
                <Select label="Select Doctor" options={[{ value: 'dr-nair', label: 'Dr. Nair' }, { value: 'dr-rao', label: 'Dr. Rao' }]} />
                <Select label="Select Department" options={[{ value: 'cardiology', label: 'Cardiology' }, { value: 'ent', label: 'ENT' }]} />
                <Input label="Choose Date" type="date" />
                <Input label="Choose Time Slot" type="time" />
                <Input label="Reason for Visit" placeholder="Enter reason for visit" className="md:col-span-2" />
                <Select label="Consultation Type" options={[{ value: 'offline', label: 'Offline' }, { value: 'online', label: 'Online' }]} />
                <Select label="Appointment Status" options={[{ value: 'pending', label: 'Pending' }, { value: 'confirmed', label: 'Confirmed' }]} />
              </div>
              <div className="flex flex-wrap gap-3">
                <Button icon={ClipboardList}>Save Appointment</Button>
                <Button variant="secondary" onClick={() => setIsAppointmentModalOpen(false)}>Cancel</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card title="Doctor Consultation Page">
          <div className="space-y-4">
            <div className="rounded-lg border border-line bg-surface p-4">
              <div className="flex items-center gap-2 text-teal-700">
                <Stethoscope className="h-4 w-4" />
                <span className="text-sm font-semibold">Current Consultation</span>
              </div>
              <p className="mt-2 text-sm text-ink-700">Patient complaint: recurring fever and fatigue. Observed mild dehydration and fatigue. Recommend CBC and urine routine.</p>
            </div>
            <div className="grid gap-3">
              <Input label="Observation Notes" placeholder="Add notes here" />
              <Input label="Next Review Date" placeholder="Select date" />
              <Button icon={ClipboardList}>Save Consultation</Button>
            </div>
          </div>
        </Card>

        <Card title="Prescription Page">
          <div className="space-y-3">
            {prescriptions.map((item) => (
              <div key={item.medicine} className="rounded-lg border border-line p-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-ink-900">{item.medicine}</p>
                    <p className="text-sm text-ink-600">Dosage: {item.dosage}</p>
                  </div>
                  <span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700">{item.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card title="Billing and Invoice UI">
          <div className="rounded-lg border border-line bg-surface p-4 space-y-3">
            <div className="flex items-center justify-between text-sm text-ink-700">
              <span>Consultation Fee</span>
              <span>₹500</span>
            </div>
            <div className="flex items-center justify-between text-sm text-ink-700">
              <span>Lab Charges</span>
              <span>₹300</span>
            </div>
            <div className="flex items-center justify-between text-sm text-ink-700">
              <span>Medicine Charges</span>
              <span>₹420</span>
            </div>
            <div className="border-t border-line pt-3 flex items-center justify-between font-semibold text-ink-900">
              <span>Total</span>
              <span>₹1,220</span>
            </div>
            <Button icon={Receipt} fullWidth>Generate Invoice</Button>
          </div>
        </Card>

        <Card title="Patient History Section">
          <div className="rounded-lg border border-line p-4">
            <div className="flex items-center gap-2 text-teal-700">
              <History className="h-4 w-4" />
              <span className="text-sm font-semibold">Recent History</span>
            </div>
            <ul className="mt-3 space-y-2 text-sm text-ink-700">
              {history.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <FileText className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
}
