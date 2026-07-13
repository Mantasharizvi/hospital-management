import { useState } from 'react';
import {
  BedDouble,
  ClipboardPlus,
  FileCheck2,
  HeartPulse,
  Receipt,
  ShieldCheck,
  UserRoundPlus,
  Plus,
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Table from '../../components/common/Table';
import FormModal from '../../components/common/FormModal';
import { useToast } from '../../context/ToastContext';
import { validateForm, rules, isValid } from '../../utils/validators';
import { printInvoice } from '../../utils/printInvoice';

const statCards = [
  { label: 'Admissions Today', value: '18', detail: '3 critical cases', icon: UserRoundPlus },
  { label: 'Occupied Beds', value: '87/120', detail: '72% utilization', icon: BedDouble },
  { label: 'Active Treatments', value: '42', detail: '6 pending reviews', icon: HeartPulse },
  { label: 'Discharges Pending', value: '9', detail: '2 due today', icon: FileCheck2 },
];

const initialAdmissions = [
  { id: 'IPD-401', patient: 'Ananya Roy', ward: 'ICU', bed: 'ICU-02', status: 'Admitted' },
  { id: 'IPD-402', patient: 'Nikhil Rao', ward: 'Ward A', bed: 'A-14', status: 'Monitoring' },
  { id: 'IPD-403', patient: 'Priya Kumar', ward: 'Ward B', bed: 'B-09', status: 'Recovery' },
];

const initialWards = [
  { name: 'ICU', beds: 12, occupied: 10, status: 'Critical Care' },
  { name: 'Ward A', beds: 24, occupied: 17, status: 'General Care' },
  { name: 'Ward B', beds: 18, occupied: 14, status: 'Maternity' },
];

const initialTreatmentRecords = [
  {
    id: 'TRT-501', patientId: 'IPD-401', name: 'IV Antibiotics Started', dateTime: '2026-07-07T09:30',
    doctor: 'Dr. Mehta', details: 'Administered IV ceftriaxone 1g for suspected infection.',
    medicinesGiven: 'Yes', vitals: 'BP 118/76, Pulse 82, Temp 99.1°F, SpO2 97%',
    notes: 'Patient tolerated infusion well, no adverse reaction observed.',
    followUp: 'Repeat vitals in 6 hours, continue antibiotic course.', status: 'Ongoing',
  },
  {
    id: 'TRT-502', patientId: 'IPD-402', name: 'Vitals Reassessed', dateTime: '2026-07-06T20:00',
    doctor: 'Dr. Sinha', details: 'Routine vitals check and neurological assessment.',
    medicinesGiven: 'No', vitals: 'BP 122/80, Pulse 76, Temp 98.6°F, SpO2 98%',
    notes: 'Patient stable, alert and oriented.',
    followUp: 'Continue monitoring, next check in 8 hours.', status: 'Completed',
  },
];

const treatmentColumns = [
  { key: 'patientId', header: 'Patient ID' },
  { key: 'name', header: 'Treatment' },
  { 
    key: 'dateTime', 
    header: 'Date & Time',
    render: (row) => {
      if (!row.dateTime) return '';
      const date = new Date(row.dateTime);
      return date.toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });
    }
  },
  { key: 'doctor', header: 'Doctor' },
  { key: 'details', header: 'Procedure Details' },
  { key: 'medicinesGiven', header: 'Medicines Given' },
  { key: 'vitals', header: 'Vitals (BP / Pulse / Temp / SpO2)' },
  { key: 'notes', header: 'Doctor / Nurse Notes' },
  { key: 'followUp', header: 'Follow-up Plan' },
  {
    key: 'status',
    header: 'Status',
    render: (row) => (
      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${row.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
        {row.status}
      </span>
    ),
  },
];

const emptyAdmission = {
  name: '', admissionDate: '', ward: '', doctor: '', bedNumber: '', contact: '', insurance: '', reason: '',
};

const emptyTreatment = {
  patientId: '', name: '', dateTime: '', doctor: '', details: '', medicinesGiven: 'No', vitals: '', notes: '', followUp: '', status: 'Ongoing'
};

const emptyDischarge = {
  admissionId: '', dischargeDate: '', condition: 'Stable', summaryNotes: 'Patient stable, oral intake adequate, vitals normalized and follow-up appointment scheduled.',
};

const admissionSchema = {
  name: [rules.required('Patient name is required')],
  admissionDate: [rules.required('Admission date is required')],
  ward: [rules.required('Ward preference is required')],
  bedNumber: [rules.required('Bed allocation number is required')],
  contact: [rules.required('Emergency contact is required'), rules.phone()],
};

const treatmentSchema = {
  patientId: [rules.required('Patient ID is required')],
  name: [rules.required('Treatment/Procedure name is required')],
  dateTime: [rules.required('Date and time is required')],
  doctor: [rules.required('Attending doctor is required')],
};

const dischargeSchema = {
  admissionId: [rules.required('Please select a patient to discharge')],
  dischargeDate: [rules.required('Discharge date is required')],
};

export default function IpdPage() {
  const toast = useToast();
  
  // App Dynamic State Data
  const [admissions, setAdmissions] = useState(initialAdmissions);
  const [treatmentRecords, setTreatmentRecords] = useState(initialTreatmentRecords);
  const [wards, setWards] = useState(initialWards);
  
  // Modals Visibility Management
  const [showAdmissionModal, setShowAdmissionModal] = useState(false);
  const [showTreatmentModal, setShowTreatmentModal] = useState(false);
  const [showDischargeModal, setShowDischargeModal] = useState(false);
  
  // Forms Hooks
  const [admissionForm, setAdmissionForm] = useState(emptyAdmission);
  const [treatmentForm, setTreatmentForm] = useState(emptyTreatment);
  const [dischargeForm, setDischargeForm] = useState(emptyDischarge);
  
  // Form Error Trackers
  const [admissionErrors, setAdmissionErrors] = useState({});
  const [treatmentErrors, setTreatmentErrors] = useState({});
  const [dischargeErrors, setDischargeErrors] = useState({});

  // Admission Action Submissions
  const handleOpenAdmissionModal = () => {
    setAdmissionForm(emptyAdmission);
    setAdmissionErrors({});
    setShowAdmissionModal(true);
  };

  const handleAdmitPatient = (e) => {
    e.preventDefault();
    const errors = validateForm(admissionForm, admissionSchema);
    setAdmissionErrors(errors);
    if (!isValid(errors)) {
      toast.error('Please fix the highlighted fields');
      return;
    }

    const newAdmission = {
      id: `IPD-${400 + admissions.length + 1}`,
      patient: admissionForm.name,
      ward: admissionForm.ward,
      bed: admissionForm.bedNumber,
      status: 'Admitted',
    };

    setAdmissions((current) => [...current, newAdmission]);
    
    // Dynamically increment bed occupancy counter inside the local ward data matrix
    setWards((currentWards) =>
      currentWards.map((w) =>
        w.name === admissionForm.ward ? { ...w, occupied: Math.min(w.beds, w.occupied + 1) } : w
      )
    );

    setShowAdmissionModal(false);
    toast.success(`${newAdmission.patient} admitted successfully`);
  };

  // Treatment Log Action Submissions
  const handleOpenTreatmentModal = () => {
    setTreatmentForm(emptyTreatment);
    setTreatmentErrors({});
    setShowTreatmentModal(true);
  };

  const handleAddTreatmentRecord = (e) => {
    e.preventDefault();
    const errors = validateForm(treatmentForm, treatmentSchema);
    setTreatmentErrors(errors);
    if (!isValid(errors)) {
      toast.error('Please fix the highlighted form errors');
      return;
    }
    const newTreatment = {
      id: `TRT-${500 + treatmentRecords.length + 1}`,
      ...treatmentForm
    };
    setTreatmentRecords((current) => [...current, newTreatment]);
    setShowTreatmentModal(false);
    toast.success('Treatment record logs updated successfully');
  };

  // Discharge Processing Form Actions
  const handleOpenDischargeModal = () => {
    setDischargeForm(emptyDischarge);
    setDischargeErrors({});
    setShowDischargeModal(true);
  };

  const handleFinalizeDischarge = (e) => {
    e.preventDefault();
    const errors = validateForm(dischargeForm, dischargeSchema);
    setDischargeErrors(errors);
    if (!isValid(errors)) {
      toast.error('Please select a valid admission profile');
      return;
    }

    const targetAdmission = admissions.find((a) => a.id === dischargeForm.admissionId);
    if (!targetAdmission) return;

    // Update the targeted admission status to Discharged
    setAdmissions((current) =>
      current.map((a) => (a.id === dischargeForm.admissionId ? { ...a, status: 'Discharged' } : a))
    );

    // Free up ward bed slot allocations dynamically
    setWards((currentWards) =>
      currentWards.map((w) =>
        w.name === targetAdmission.ward ? { ...w, occupied: Math.max(0, w.occupied - 1) } : w
      )
    );

    setShowDischargeModal(false);
    toast.success(`Discharge Summary finalized for ${targetAdmission.patient}`);
  };

  const handleGenerateIpdBill = () => {
    printInvoice({
      title: 'IPD Invoice',
      invoiceNo: `INV-IPD-${Date.now().toString().slice(-6)}`,
      patientName: admissions.find(a => a.status === 'Admitted')?.patient || 'Inpatient',
      lineItems: [
        { label: 'Room Charges', amount: 4800 },
        { label: 'Medicine & Supplies', amount: 2150 },
        { label: 'Procedure Fee', amount: 1250 },
      ],
      total: 8200,
    });
    toast.success('Invoice sent to printer');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink-900">IPD Module</h1>
          <p className="text-sm text-ink-600 mt-1">Track admissions, bed occupancy, treatment, discharge and inpatient billing with a streamlined view.</p>
        </div>
      </div>

      {/* Top Cards Statistics info */}
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

      {/* Wards Utilization Metrics Grid */}
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

      {/* Beds Grid allocation */}
      <Card
        title="Bed Allocation"
        action={<Button icon={ClipboardPlus} onClick={handleOpenAdmissionModal}>Admit Patient</Button>}
      >
        <Table
          columns={[
            { key: 'id', header: 'Admission ID' },
            { key: 'patient', header: 'Patient' },
            { key: 'ward', header: 'Ward' },
            { key: 'bed', header: 'Bed No.' },
            { 
              key: 'status', 
              header: 'Status',
              render: (row) => (
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${row.status === 'Admitted' || row.status === 'Monitoring' || row.status === 'Recovery' ? 'bg-teal-50 text-teal-700' : 'bg-ink-100 text-ink-700'}`}>
                  {row.status}
                </span>
              )
            },
          ]}
          data={admissions}
        />
      </Card>

      {/* Treatments Tracker Block Layout */}
      <Card 
        title="Treatment Records"
        action={<Button icon={Plus} onClick={handleOpenTreatmentModal}>Add Treatment Record</Button>}
      >
        <Table columns={treatmentColumns} data={treatmentRecords} />
      </Card>

      {/* Actions and Accounting Split views */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card title="Discharge Summary">
          <div className="rounded-lg border border-line bg-surface p-4 space-y-3">
            <div className="flex items-center gap-2 text-teal-700">
              <ShieldCheck className="h-4 w-4" />
              <span className="text-sm font-semibold">Recommended discharge criteria</span>
            </div>
            <p className="text-sm text-ink-700">Patient stable, oral intake adequate, vitals normalized and follow-up appointment scheduled for next week.</p>
            <Button
              icon={FileCheck2}
              onClick={handleOpenDischargeModal}
            >
              Finalize Summary
            </Button>
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
            <Button icon={Receipt} fullWidth onClick={handleGenerateIpdBill}>Generate IPD Bill</Button>
          </div>
        </Card>
      </div>

      {/* Admission PopUp Trigger Form */}
      <FormModal
        isOpen={showAdmissionModal}
        onClose={() => setShowAdmissionModal(false)}
        onSubmit={handleAdmitPatient}
        title="Admission Form"
        submitLabel="Admit Patient"
      >
        <Input
          label="Patient Name"
          placeholder="Enter inpatient name"
          value={admissionForm.name}
          onChange={(e) => setAdmissionForm({ ...admissionForm, name: e.target.value })}
          error={admissionErrors.name}
        />
        <Input
          label="Admission Date"
          type="date"
          value={admissionForm.admissionDate}
          onChange={(e) => setAdmissionForm({ ...admissionForm, admissionDate: e.target.value })}
          error={admissionErrors.admissionDate}
        />
        <Select
          label="Ward Preference"
          value={admissionForm.ward}
          onChange={(e) => setAdmissionForm({ ...admissionForm, ward: e.target.value })}
          options={[{ value: 'ICU', label: 'ICU' }, { value: 'Ward A', label: 'Ward A' }, { value: 'Ward B', label: 'Ward B' }]}
          error={admissionErrors.ward}
        />
        <Input
          label="Bed Allocation Number"
          placeholder="e.g. ICU-05, A-21"
          value={admissionForm.bedNumber}
          onChange={(e) => setAdmissionForm({ ...admissionForm, bedNumber: e.target.value })}
          error={admissionErrors.bedNumber}
        />
          <Input
          label="Room Charges"
          placeholder="e.g. 5000"
          value={admissionForm.roomCharges}
          onChange={(e) => setAdmissionForm({ ...admissionForm, roomCharges: e.target.value })}
          error={admissionErrors.roomCharges}
        />
        <Input
          label="Attending Doctor"
          placeholder="Dr. Mehta"
          value={admissionForm.doctor}
          onChange={(e) => setAdmissionForm({ ...admissionForm, doctor: e.target.value })}
        />
        <Input
          label="Emergency Contact"
          placeholder="Contact number"
          value={admissionForm.contact}
          onChange={(e) => setAdmissionForm({ ...admissionForm, contact: e.target.value })}
          error={admissionErrors.contact}
        />
        <Input
          label="Insurance ID"
          placeholder="Policy number"
          value={admissionForm.insurance}
          onChange={(e) => setAdmissionForm({ ...admissionForm, insurance: e.target.value })}
        />
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-ink-900 mb-1.5">Admission Reason</label>
          <textarea
            rows="3"
            className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            placeholder="Briefly describe condition and requirement"
            value={admissionForm.reason}
            onChange={(e) => setAdmissionForm({ ...admissionForm, reason: e.target.value })}
          />
        </div>
      </FormModal>

      {/* Treatment Records PopUp Form */}
      <FormModal
        isOpen={showTreatmentModal}
        onClose={() => setShowTreatmentModal(false)}
        onSubmit={handleAddTreatmentRecord}
        title="Add New Treatment Record"
        submitLabel="Log Treatment"
      >
        <Select
          label="Patient ID"
          value={treatmentForm.patientId}
          onChange={(e) => setTreatmentForm({ ...treatmentForm, patientId: e.target.value })}
          options={admissions.filter(a => a.status !== 'Discharged').map(adm => ({ value: adm.id, label: `${adm.id} - ${adm.patient}` }))}
          error={treatmentErrors.patientId}
        />
        <Input
          label="Treatment Title"
          placeholder="e.g. IV Antibiotics / Vitals Check"
          value={treatmentForm.name}
          onChange={(e) => setTreatmentForm({ ...treatmentForm, name: e.target.value })}
          error={treatmentErrors.name}
        />
        <Input
          label="Date & Time"
          type="datetime-local"
          value={treatmentForm.dateTime}
          onChange={(e) => setTreatmentForm({ ...treatmentForm, dateTime: e.target.value })}
          error={treatmentErrors.dateTime}
        />
        <Input
          label="Attending Doctor"
          placeholder="e.g. Dr. Mehta"
          value={treatmentForm.doctor}
          onChange={(e) => setTreatmentForm({ ...treatmentForm, doctor: e.target.value })}
          error={treatmentErrors.doctor}
        />
        <Select
          label="Medicines Given"
          value={treatmentForm.medicinesGiven}
          onChange={(e) => setTreatmentForm({ ...treatmentForm, medicinesGiven: e.target.value })}
          options={[{ value: 'Yes', label: 'Yes' }, { value: 'No', label: 'No' }]}
        />
        <Select
          label="Status"
          value={treatmentForm.status}
          onChange={(e) => setTreatmentForm({ ...treatmentForm, status: e.target.value })}
          options={[{ value: 'Ongoing', label: 'Ongoing' }, { value: 'Completed', label: 'Completed' }]}
        />
        <div className="lg:col-span-2">
          <Input
            label="Vitals Profile"
            placeholder="e.g. BP 120/80, Pulse 72, Temp 98.4°F, SpO2 98%"
            value={treatmentForm.vitals}
            onChange={(e) => setTreatmentForm({ ...treatmentForm, vitals: e.target.value })}
          />
        </div>
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-ink-900 mb-1.5">Procedure Details</label>
          <textarea
            rows="2"
            className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            placeholder="Describe clinical actions executed..."
            value={treatmentForm.details}
            onChange={(e) => setTreatmentForm({ ...treatmentForm, details: e.target.value })}
          />
        </div>
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-ink-900 mb-1.5">Doctor/Nurse Notes</label>
          <textarea
            rows="2"
            className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            placeholder="Observations or comments..."
            value={treatmentForm.notes}
            onChange={(e) => setTreatmentForm({ ...treatmentForm, notes: e.target.value })}
          />
        </div>
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-ink-900 mb-1.5">Follow-up Plan</label>
          <textarea
            rows="2"
            className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            placeholder="Next milestones or scheduled controls..."
            value={treatmentForm.followUp}
            onChange={(e) => setTreatmentForm({ ...treatmentForm, followUp: e.target.value })}
          />
        </div>
          <Input
          label="Medicine & Supplies Cost"
          placeholder="e.g. 4000"
          value={treatmentForm.medicineSuppliesCost}
          onChange={(e) => setTreatmentForm({ ...treatmentForm, medicineSuppliesCost: e.target.value })}
          error={treatmentErrors.medicineSuppliesCost}
        />
         <Input
          label="Procedure Fee"
          placeholder="e.g. 6000"
          value={treatmentForm.procedureFee}
          onChange={(e) => setTreatmentForm({ ...treatmentForm, procedureFee: e.target.value })}
          error={treatmentErrors.procedureFee}
        />
      </FormModal>

      {/* NEW POPUP MODAL: Discharge Summary Form */}
      <FormModal
        isOpen={showDischargeModal}
        onClose={() => setShowDischargeModal(false)}
        onSubmit={handleFinalizeDischarge}
        title="Finalize Patient Discharge Summary"
        submitLabel="Approve & Discharge Inpatient"
      >
        <Select
          label="Select Active Inpatient"
          value={dischargeForm.admissionId}
          onChange={(e) => setDischargeForm({ ...dischargeForm, admissionId: e.target.value })}
          options={admissions
            .filter(a => a.status !== 'Discharged')
            .map(adm => ({ value: adm.id, label: `${adm.id} - ${adm.patient} (${adm.bed})` }))}
          error={dischargeErrors.admissionId}
        />
        <Input
          label="Discharge Date"
          type="date"
          value={dischargeForm.dischargeDate}
          onChange={(e) => setDischargeForm({ ...dischargeForm, dischargeDate: e.target.value })}
          error={dischargeErrors.dischargeDate}
        />
        <Select
          label="Patient Status on Discharge"
          value={dischargeForm.condition}
          onChange={(e) => setDischargeForm({ ...dischargeForm, condition: e.target.value })}
          options={[
            { value: 'Stable', label: 'Cured / Stable' },
            { value: 'Relieved', label: 'Relieved' },
            { value: 'LAMA', label: 'Left Against Medical Advice (LAMA)' },
            { value: 'Referral', label: 'Transferred / Referred' }
          ]}
        />
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-ink-900 mb-1.5">Discharge Summary & Instructions</label>
          <textarea
            rows="4"
            className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            value={dischargeForm.summaryNotes}
            onChange={(e) => setDischargeForm({ ...dischargeForm, summaryNotes: e.target.value })}
          />
        </div>
      </FormModal>
    </div>
  );
}