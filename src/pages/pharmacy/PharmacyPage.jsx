import {
  AlertTriangle,
  Boxes,
  ClipboardPlus,
  FileBarChart2,
  PackagePlus,
  Receipt,
  ShoppingCart,
  Store,
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Table from '../../components/common/Table';

const inventory = [
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

export default function PharmacyPage() {
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

      <Card title="Add Medicine Form">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Input label="Medicine Name" placeholder="Enter medicine name" />
          <Select label="Category" options={[{ value: 'analgesic', label: 'Analgesic' }, { value: 'antibiotic', label: 'Antibiotic' }]} />
          <Input label="Batch Number" placeholder="Enter batch number" />
          <Input label="Expiry Date" type="date" />
          <Input label="Purchase Price" placeholder="₹0.00" />
          <Input label="Selling Price" placeholder="₹0.00" />
          <Input label="Initial Stock" type="number" placeholder="0" />
          <Select label="Supplier" options={[{ value: 'medisupply', label: 'MediSupply Co.' }, { value: 'lifecare', label: 'LifeCare Pharma' }]} />
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button icon={PackagePlus}>Save Medicine</Button>
          <Button variant="secondary">Reset</Button>
        </div>
      </Card>

      <Card title="Medicine Inventory">
        <Table
          columns={[
            { key: 'id', header: 'Medicine ID' },
            { key: 'name', header: 'Medicine' },
            { key: 'category', header: 'Category' },
            { key: 'stock', header: 'Stock' },
            { key: 'unit', header: 'Unit' },
            { key: 'expiry', header: 'Expiry' },
          ]}
          data={inventory}
        />
      </Card>

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
            <Button icon={Receipt}>Generate Report</Button>
            <Button variant="secondary">Export CSV</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
