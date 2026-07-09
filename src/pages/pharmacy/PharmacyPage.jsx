import { useState } from 'react';
import {
  AlertTriangle,
  Boxes,
  FileBarChart2,
  PackagePlus,
  ShoppingCart,
  Store,
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Table from '../../components/common/Table';
import FormModal from '../../components/common/FormModal';
import ExportReportModal from '../../components/reports/ExportReportModal';
import { useToast } from '../../context/ToastContext';
import { validateForm, rules, isValid } from '../../utils/validators';

const initialInventory = [
  { id: 'MED-101', name: 'Paracetamol 500mg', category: 'Analgesic', stock: 120, unit: 'Boxes', expiry: '2026-10-10' },
  { id: 'MED-102', name: 'Amoxicillin 250mg', category: 'Antibiotic', stock: 48, unit: 'Boxes', expiry: '2026-08-15' },
  { id: 'MED-103', name: 'Vitamin D3', category: 'Supplement', stock: 80, unit: 'Strip', expiry: '2027-01-22' },
];

const purchaseEntries = [
  { id: 'PUR-201', supplier: 'MediSupply Co.', medicine: 'Paracetamol', qty: 100, cost: '₹12,500' },
  { id: 'PUR-202', supplier: 'LifeCare Pharma', medicine: 'Amoxicillin', qty: 60, cost: '₹18,000' },
];

const sales = [
  { id: 'SAL-301', patient: 'Rahul Menon', medicine: 'Vitamin D3', qty: 10, amount: '₹1,200' },
  { id: 'SAL-302', patient: 'Meera Joseph', medicine: 'Paracetamol', qty: 5, amount: '₹650' },
];

const alerts = [
  { medicine: 'Amoxicillin 250mg', expiry: '2026-08-15', status: 'Expiring soon' },
  { medicine: 'Insulin 100IU', expiry: '2026-07-18', status: 'Critical' },
];

const reportColumns = [
  { key: 'id', header: 'Medicine ID' },
  { key: 'name', header: 'Medicine' },
  { key: 'category', header: 'Category' },
  { key: 'stock', header: 'Stock' },
  { key: 'unit', header: 'Unit' },
  { key: 'expiry', header: 'Expiry' },
];

const emptyMedicine = {
  name: '', category: '', batch: '', expiry: '', purchasePrice: '', sellingPrice: '', stock: '', supplier: '',
};
const medicineSchema = {
  name: [rules.required('Medicine name is required')],
  category: [rules.required('Category is required')],
  expiry: [rules.required('Expiry date is required')],
  stock: [rules.required('Initial stock is required'), rules.numeric(), rules.positive()],
};

export default function PharmacyPage() {
  const toast = useToast();
  const [inventory, setInventory] = useState(initialInventory);
  const [showMedicineModal, setShowMedicineModal] = useState(false);
  const [medicineForm, setMedicineForm] = useState(emptyMedicine);
  const [medicineErrors, setMedicineErrors] = useState({});
  const [showReportModal, setShowReportModal] = useState(false);

  const handleOpenMedicineModal = () => {
    setMedicineForm(emptyMedicine);
    setMedicineErrors({});
    setShowMedicineModal(true);
  };

  const handleSaveMedicine = (e) => {
    e.preventDefault();
    const errors = validateForm(medicineForm, medicineSchema);
    setMedicineErrors(errors);
    if (!isValid(errors)) {
      toast.error('Please fix the highlighted fields');
      return;
    }
    const newMedicine = {
      id: `MED-${100 + inventory.length + 1}`,
      name: medicineForm.name,
      category: medicineForm.category,
      stock: Number(medicineForm.stock),
      unit: 'Boxes',
      expiry: medicineForm.expiry,
    };
    setInventory((current) => [...current, newMedicine]);
    setShowMedicineModal(false);
    toast.success(`"${newMedicine.name}" added to inventory`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink-900">Pharmacy Module</h1>
          <p className="text-sm text-ink-600 mt-1">Track inventory, purchases, sales, expiry and reports from one pharmacy dashboard.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'Medicine Inventory', value: '324', detail: 'Active SKUs', icon: Boxes },
          { label: 'Low Stock Items', value: '12', detail: 'Need reorder', icon: Store },
          { label: 'Today Sales', value: '₹28,400', detail: '18 billing entries', icon: ShoppingCart },
          { label: 'Expiry Alerts', value: '4', detail: 'Action required', icon: AlertTriangle },
        ].map(({ label, value, detail, icon: Icon }) => (
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
        title="Medicine Inventory"
        action={<Button icon={PackagePlus} onClick={handleOpenMedicineModal}>Add Medicine</Button>}
      >
        <Table columns={reportColumns} data={inventory} />
      </Card>

      {/* Popup: Add Medicine Form */}
      <FormModal
        isOpen={showMedicineModal}
        onClose={() => setShowMedicineModal(false)}
        onSubmit={handleSaveMedicine}
        title="Add Medicine Form"
        submitLabel="Save Medicine"
      >
        <Input
          label="Medicine Name"
          placeholder="Enter medicine name"
          value={medicineForm.name}
          onChange={(e) => setMedicineForm({ ...medicineForm, name: e.target.value })}
          error={medicineErrors.name}
        />
        <Select
          label="Category"
          value={medicineForm.category}
          onChange={(e) => setMedicineForm({ ...medicineForm, category: e.target.value })}
          options={[{ value: 'Analgesic', label: 'Analgesic' }, { value: 'Antibiotic', label: 'Antibiotic' }, { value: 'Supplement', label: 'Supplement' }]}
          error={medicineErrors.category}
        />
        <Input
          label="Batch Number"
          placeholder="Enter batch number"
          value={medicineForm.batch}
          onChange={(e) => setMedicineForm({ ...medicineForm, batch: e.target.value })}
        />
        <Input
          label="Expiry Date"
          type="date"
          value={medicineForm.expiry}
          onChange={(e) => setMedicineForm({ ...medicineForm, expiry: e.target.value })}
          error={medicineErrors.expiry}
        />
        <Input
          label="Purchase Price"
          type="number"
          placeholder="₹0.00"
          value={medicineForm.purchasePrice}
          onChange={(e) => setMedicineForm({ ...medicineForm, purchasePrice: e.target.value })}
        />
        <Input
          label="Selling Price"
          type="number"
          placeholder="₹0.00"
          value={medicineForm.sellingPrice}
          onChange={(e) => setMedicineForm({ ...medicineForm, sellingPrice: e.target.value })}
        />
        <Input
          label="Initial Stock"
          type="number"
          placeholder="0"
          value={medicineForm.stock}
          onChange={(e) => setMedicineForm({ ...medicineForm, stock: e.target.value })}
          error={medicineErrors.stock}
        />
        <Select
          label="Supplier"
          value={medicineForm.supplier}
          onChange={(e) => setMedicineForm({ ...medicineForm, supplier: e.target.value })}
          options={[{ value: 'medisupply', label: 'MediSupply Co.' }, { value: 'lifecare', label: 'LifeCare Pharma' }]}
        />
      </FormModal>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card title="Purchase Entry">
          <Table
            columns={[
              { key: 'id', header: 'Purchase ID' },
              { key: 'supplier', header: 'Supplier' },
              { key: 'medicine', header: 'Medicine' },
              { key: 'qty', header: 'Qty' },
              { key: 'cost', header: 'Cost' },
            ]}
            data={purchaseEntries}
          />
        </Card>

        <Card title="Sales Billing">
          <Table
            columns={[
              { key: 'id', header: 'Sales ID' },
              { key: 'patient', header: 'Patient' },
              { key: 'medicine', header: 'Medicine' },
              { key: 'qty', header: 'Qty' },
              { key: 'amount', header: 'Amount' },
            ]}
            data={sales}
          />
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card title="Stock Management">
          <div className="space-y-3">
            {inventory.map((item) => (
              <div key={item.id} className="rounded-lg border border-line p-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-ink-900">{item.name}</p>
                    <p className="text-sm text-ink-600">Current stock: {item.stock} {item.unit}</p>
                  </div>
                  <span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700">{item.stock > 50 ? 'Healthy' : 'Reorder'}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Expiry Alerts">
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.medicine} className="rounded-lg border border-line p-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-ink-900">{alert.medicine}</p>
                    <p className="text-sm text-ink-600">Expires on {alert.expiry}</p>
                  </div>
                  <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">{alert.status}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card title="Pharmacy Reports">
        <div className="rounded-lg border border-line bg-surface p-4">
          <div className="flex items-center gap-2 text-teal-700">
            <FileBarChart2 className="h-4 w-4" />
            <span className="text-sm font-semibold">Monthly pharmacy insights</span>
          </div>
          <p className="mt-3 text-sm text-ink-700">Sales trending upward, stock turnover improved, and urgent reorder alerts are active for low-volume medicines.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button icon={FileBarChart2} onClick={() => setShowReportModal(true)}>Generate Report</Button>
          </div>
        </div>
      </Card>

      {/* Generate Report — exports the current inventory as PDF / Excel / CSV */}
      <ExportReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        title="Pharmacy Report"
        columns={reportColumns}
        rows={inventory}
      />
    </div>
  );
}
