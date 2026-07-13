import { useState } from 'react';
import {
  CalendarDays,
  ClipboardList,
  Eye,
  Edit2,
  FileText,
  History,
  Pill,
  Receipt,
  Stethoscope,
  Trash2,
  UserPlus,
  Users,
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Table from '../../components/common/Table';
import Modal from '../../components/common/Modal';
import FormModal from '../../components/common/FormModal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import ExportReportModal from '../../components/reports/ExportReportModal';
import { useToast } from '../../context/ToastContext';
import { validateForm, rules, isValid } from '../../utils/validators';
import { printInvoice } from '../../utils/printInvoice';

const statCards = [
  { label: 'Today Visits', value: '128', detail: '+12% vs yesterday', icon: Users },
  { label: 'Pending Appointments', value: '24', detail: '4 urgent cases', icon: CalendarDays },
  { label: 'Prescriptions Issued', value: '81', detail: '12 repeat orders', icon: Pill },
  { label: 'Bills Generated', value: '57', detail: '₹3.2L collected', icon: Receipt },
];

const initialPatients = [
  { id: 'OPD-101', name: 'Aarav Sharma', age: 34, doctor: 'Dr. Nair', status: 'Consulted', visit: '09:30 AM' },
  { id: 'OPD-102', name: 'Meera Joseph', age: 28, doctor: 'Dr. Rao', status: 'Waiting', visit: '10:15 AM' },
  { id: 'OPD-103', name: 'Rahul Menon', age: 47, doctor: 'Dr. Shah', status: 'Pending Lab', visit: '11:00 AM' },
];

const initialAppointments = [
  {
    id: 'APT-201', patient: 'Sana Begum', doctor: 'Dr. Nair', department: 'Cardiology',
    date: '07 Jul 2026', time: '09:00 AM', status: 'Confirmed', payment: 'Paid', type: 'Offline',
  },
  {
    id: 'APT-202', patient: 'Kiran Das', doctor: 'Dr. Rao', department: 'ENT',
    date: '08 Jul 2026', time: '10:30 AM', status: 'Pending', payment: 'Unpaid', type: 'Online',
  },
  {
    id: 'APT-203', patient: 'Jaya Pillai', doctor: 'Dr. Shah', department: 'Orthopedic',
    date: '08 Jul 2026', time: '12:00 PM', status: 'Completed', payment: 'Paid', type: 'Offline',
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

const emptyPatient = { name: '', mobile: '', age: '', gender: '', department: '', doctor: '', complaint: '' };
const patientSchema = {
  name: [rules.required('Patient name is required')],
  mobile: [rules.required('Mobile number is required'), rules.phone()],
  age: [rules.required('Age is required'), rules.numeric(), rules.positive()],
};

const emptyAppointment = { patient: '', doctor: '', department: '', date: '', time: '', reason: '', type: 'offline', status: 'pending' };
const appointmentSchema = {
  patient: [rules.required('Please select a patient')],
  doctor: [rules.required('Please select a doctor')],
  date: [rules.required('Date is required')],
  time: [rules.required('Time slot is required')],
};

const emptyConsultation = {
  notes: '', reviewDate: '', medicine: '', consultationFee: '', labCharges: '', medicineCharges: '',
};

const appointmentColumns = [
  { key: 'id', header: 'Appointment ID' },
  { key: 'patient', header: 'Patient Name' },
  { key: 'doctor', header: 'Doctor' },
  { key: 'department', header: 'Department' },
  { key: 'date', header: 'Date' },
  { key: 'time', header: 'Time Slot' },
  { key: 'status', header: 'Status' },
  { key: 'payment', header: 'Payment Status' },
];

export default function OpdPage() {
  const toast = useToast();

  const [patients, setPatients] = useState(initialPatients);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [patientForm, setPatientForm] = useState(emptyPatient);
  const [patientErrors, setPatientErrors] = useState({});

  const [appointments, setAppointments] = useState(initialAppointments);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [appointmentForm, setAppointmentForm] = useState(emptyAppointment);
  const [appointmentErrors, setAppointmentErrors] = useState({});
  const [editingAppointmentId, setEditingAppointmentId] = useState(null);

  const [viewAppointment, setViewAppointment] = useState(null);
  const [deleteAppointmentId, setDeleteAppointmentId] = useState(null);
  const [showExportModal, setShowExportModal] = useState(false);

  const [consultation, setConsultation] = useState(emptyConsultation);

  // ---------- Patient registration (popup form) ----------
  const handleOpenPatientModal = () => {
    setPatientForm(emptyPatient);
    setPatientErrors({});
    setShowPatientModal(true);
  };

  const handleRegisterPatient = (e) => {
    e.preventDefault();
    const errors = validateForm(patientForm, patientSchema);
    setPatientErrors(errors);
    if (!isValid(errors)) {
      toast.error('Please fix the highlighted fields');
      return;
    }
    const newPatient = {
      id: `OPD-${100 + patients.length + 1}`,
      name: patientForm.name,
      age: patientForm.age,
      doctor: patientForm.doctor || 'Unassigned',
      status: 'Waiting',
      visit: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };
    setPatients((current) => [...current, newPatient]);
    setShowPatientModal(false);
    toast.success(`Patient "${newPatient.name}" registered successfully`);
  };

  // ---------- Appointment management (create / view / edit / delete / export) ----------
  const handleOpenNewAppointment = () => {
    setEditingAppointmentId(null);
    setAppointmentForm(emptyAppointment);
    setAppointmentErrors({});
    setIsAppointmentModalOpen(true);
  };

  const handleOpenEditAppointment = (row) => {
    setEditingAppointmentId(row.id);
    setAppointmentForm({
      patient: row.patient, doctor: row.doctor, department: row.department,
      date: row.date, time: row.time, reason: row.reason || '',
      type: row.type?.toLowerCase() || 'offline', status: row.status?.toLowerCase() || 'pending',
    });
    setAppointmentErrors({});
    setIsAppointmentModalOpen(true);
  };

  const handleSaveAppointment = (e) => {
    e.preventDefault();
    const errors = validateForm(appointmentForm, appointmentSchema);
    setAppointmentErrors(errors);
    if (!isValid(errors)) {
      toast.error('Please fix the highlighted fields');
      return;
    }

    const statusLabel = appointmentForm.status === 'confirmed' ? 'Confirmed' : 'Pending';
    const typeLabel = appointmentForm.type === 'online' ? 'Online' : 'Offline';

    if (editingAppointmentId) {
      setAppointments((current) =>
        current.map((a) =>
          a.id === editingAppointmentId
            ? { ...a, ...appointmentForm, status: statusLabel, type: typeLabel }
            : a
        )
      );
      toast.success('Appointment updated successfully');
    } else {
      const newAppointment = {
        id: `APT-${200 + appointments.length + 1}`,
        ...appointmentForm,
        status: statusLabel,
        type: typeLabel,
        payment: 'Unpaid',
      };
      setAppointments((current) => [...current, newAppointment]);
      toast.success('Appointment created successfully');
    }
    setIsAppointmentModalOpen(false);
  };

  const handleConfirmDelete = () => {
    setAppointments((current) => current.filter((a) => a.id !== deleteAppointmentId));
    toast.success('Appointment deleted');
    setDeleteAppointmentId(null);
  };

  // ---------- Billing ----------
  const handleGenerateInvoice = () => {
    printInvoice({
      title: 'OPD Invoice',
      invoiceNo: `INV-OPD-${Date.now().toString().slice(-6)}`,
      patientName: patients[0]?.name || 'Walk-in Patient',
      lineItems: [
        { label: 'Consultation Fee', amount: Number(consultation.consultationFee) || 500 },
        { label: 'Lab Charges', amount: Number(consultation.labCharges) || 300 },
        { label: 'Medicine Charges', amount: Number(consultation.medicineCharges) || 420 },
      ],
      total:
        (Number(consultation.consultationFee) || 500) +
        (Number(consultation.labCharges) || 300) +
        (Number(consultation.medicineCharges) || 420),
    });
    toast.success('Invoice sent to printer');
  };

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

      <Card
        title="Patient List"
        action={<Button icon={UserPlus} onClick={handleOpenPatientModal}>Register Patient</Button>}
      >
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
        <Card
          title="Appointment Management"
          action={
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" icon={ClipboardList} onClick={() => setShowExportModal(true)}>
                Export
              </Button>
              <Button size="sm" icon={ClipboardList} onClick={handleOpenNewAppointment}>
                Add New Appointment
              </Button>
            </div>
          }
        >
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
                render: (row) => (
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" icon={Eye} onClick={() => setViewAppointment(row)}>View</Button>
                    <Button size="sm" variant="secondary" icon={Edit2} onClick={() => handleOpenEditAppointment(row)}>Edit</Button>
                    <Button size="sm" variant="danger" icon={Trash2} onClick={() => setDeleteAppointmentId(row.id)}>Delete</Button>
                  </div>
                ),
              },
            ]}
            data={appointments}
          />
        </Card>
      </div>

      {/* Add / Edit appointment popup */}
      <FormModal
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
        onSubmit={handleSaveAppointment}
        title={editingAppointmentId ? 'Edit Appointment' : 'Add New Appointment'}
        submitLabel={editingAppointmentId ? 'Save Changes' : 'Save Appointment'}
      >
        <Input
          label="Patient Name"
          placeholder="Enter patient name"
          value={appointmentForm.patient}
          onChange={(e) => setAppointmentForm({ ...appointmentForm, patient: e.target.value })}
          error={appointmentErrors.patient}
        />
        <Input
          label="Doctor"
          placeholder="e.g. Dr. Nair"
          value={appointmentForm.doctor}
          onChange={(e) => setAppointmentForm({ ...appointmentForm, doctor: e.target.value })}
          error={appointmentErrors.doctor}
        />
        <Input
          label="Department"
          placeholder="e.g. Cardiology"
          value={appointmentForm.department}
          onChange={(e) => setAppointmentForm({ ...appointmentForm, department: e.target.value })}
        />
        <Input
          label="Choose Date"
          type="date"
          value={appointmentForm.date}
          onChange={(e) => setAppointmentForm({ ...appointmentForm, date: e.target.value })}
          error={appointmentErrors.date}
        />
        <Input
          label="Choose Time Slot"
          type="time"
          value={appointmentForm.time}
          onChange={(e) => setAppointmentForm({ ...appointmentForm, time: e.target.value })}
          error={appointmentErrors.time}
        />
        <Select
          label="Consultation Type"
          value={appointmentForm.type}
          onChange={(e) => setAppointmentForm({ ...appointmentForm, type: e.target.value })}
          options={[{ value: 'offline', label: 'Offline' }, { value: 'online', label: 'Online' }]}
        />
        <Select
          label="Appointment Status"
          value={appointmentForm.status}
          onChange={(e) => setAppointmentForm({ ...appointmentForm, status: e.target.value })}
          options={[{ value: 'pending', label: 'Pending' }, { value: 'confirmed', label: 'Confirmed' }]}
        />
        <Input
          label="Reason for Visit"
          placeholder="Enter reason for visit"
          className="lg:col-span-2"
          value={appointmentForm.reason}
          onChange={(e) => setAppointmentForm({ ...appointmentForm, reason: e.target.value })}
        />
      </FormModal>

      {/* View appointment */}
      <Modal isOpen={!!viewAppointment} onClose={() => setViewAppointment(null)} title="Appointment Details" size="md">
        {viewAppointment && (
          <div className="px-6 py-4 space-y-3 text-sm">
            {[
              ['Appointment ID', viewAppointment.id],
              ['Patient', viewAppointment.patient],
              ['Doctor', viewAppointment.doctor],
              ['Department', viewAppointment.department],
              ['Date', viewAppointment.date],
              ['Time', viewAppointment.time],
              ['Status', viewAppointment.status],
              ['Payment', viewAppointment.payment],
              ['Type', viewAppointment.type],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between border-b border-line pb-2 last:border-0">
                <span className="text-ink-600">{label}</span>
                <span className="font-medium text-ink-900">{value}</span>
              </div>
            ))}
          </div>
        )}
      </Modal>

      {/* Delete confirmation */}
      <ConfirmDialog
        isOpen={!!deleteAppointmentId}
        onClose={() => setDeleteAppointmentId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete appointment?"
        message="This will permanently remove the appointment from the schedule."
      />

      {/* Export appointment table */}
      <ExportReportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title="Appointment Management"
        columns={appointmentColumns}
        rows={appointments}
      />

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
               <Input
                label="Patient ID"
                placeholder="OPD-102"
                value={consultation.patientid}
                onChange={(e) => setConsultation({ ...consultation, medicine: e.target.value })}
              />

              <Input
                label="Observation Notes"
                placeholder="Add notes here"
                value={consultation.notes}
                onChange={(e) => setConsultation({ ...consultation, notes: e.target.value })}
              />
              <Input
                label="Prescribed Medicine"
                placeholder="e.g. Paracetamol 500mg"
                value={consultation.medicine}
                onChange={(e) => setConsultation({ ...consultation, medicine: e.target.value })}
              />
              <Input
                label="Next Review Date"
                type="date"
                value={consultation.reviewDate}
                onChange={(e) => setConsultation({ ...consultation, reviewDate: e.target.value })}
              />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Input
                  label="Consultation Fee"
                  type="number"
                  placeholder="₹0.00"
                  value={consultation.consultationFee}
                  onChange={(e) => setConsultation({ ...consultation, consultationFee: e.target.value })}
                />
                <Input
                  label="Lab Charges"
                  type="number"
                  placeholder="₹0.00"
                  value={consultation.labCharges}
                  onChange={(e) => setConsultation({ ...consultation, labCharges: e.target.value })}
                />
                <Input
                  label="Medicine Charges"
                  type="number"
                  placeholder="₹0.00"
                  value={consultation.medicineCharges}
                  onChange={(e) => setConsultation({ ...consultation, medicineCharges: e.target.value })}
                />
              </div>
              <Button
                icon={ClipboardList}
                onClick={() => toast.success('Consultation saved successfully')}
              >
                Save Consultation
              </Button>
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
              <span>₹{Number(consultation.consultationFee) || 500}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-ink-700">
              <span>Lab Charges</span>
              <span>₹{Number(consultation.labCharges) || 300}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-ink-700">
              <span>Medicine Charges</span>
              <span>₹{Number(consultation.medicineCharges) || 420}</span>
            </div>
            <div className="border-t border-line pt-3 flex items-center justify-between font-semibold text-ink-900">
              <span>Total</span>
              <span>
                ₹{(Number(consultation.consultationFee) || 500) + (Number(consultation.labCharges) || 300) + (Number(consultation.medicineCharges) || 420)}
              </span>
            </div>
            <Button icon={Receipt} fullWidth onClick={handleGenerateInvoice}>Generate Invoice</Button>
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

      {/* Popup: Patient Registration Form */}
      <FormModal
        isOpen={showPatientModal}
        onClose={() => setShowPatientModal(false)}
        onSubmit={handleRegisterPatient}
        title="Patient Registration Form"
        submitLabel="Register Patient"
      >
        <Input
          label="Patient Name"
          placeholder="Enter patient name"
          value={patientForm.name}
          onChange={(e) => setPatientForm({ ...patientForm, name: e.target.value })}
          error={patientErrors.name}
        />
        <Input
          label="Mobile Number"
          placeholder="Enter phone number"
          value={patientForm.mobile}
          onChange={(e) => setPatientForm({ ...patientForm, mobile: e.target.value })}
          error={patientErrors.mobile}
        />
        <Input
          label="Age"
          type="number"
          placeholder="Enter age"
          value={patientForm.age}
          onChange={(e) => setPatientForm({ ...patientForm, age: e.target.value })}
          error={patientErrors.age}
        />
        <Select
          label="Gender"
          value={patientForm.gender}
          onChange={(e) => setPatientForm({ ...patientForm, gender: e.target.value })}
          options={[{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }, { value: 'other', label: 'Other' }]}
        />
        <Input
          label="Department"
          placeholder="General Medicine"
          value={patientForm.department}
          onChange={(e) => setPatientForm({ ...patientForm, department: e.target.value })}
        />
        <Input
          label="Preferred Doctor"
          placeholder="Dr. Nair"
          value={patientForm.doctor}
          onChange={(e) => setPatientForm({ ...patientForm, doctor: e.target.value })}
        />
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-ink-900 mb-1.5">Chief Complaint</label>
          <textarea
            rows="3"
            className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            placeholder="Describe symptoms or reason for visit"
            value={patientForm.complaint}
            onChange={(e) => setPatientForm({ ...patientForm, complaint: e.target.value })}
          />
        </div>
      </FormModal>
    </div>
  );
}
