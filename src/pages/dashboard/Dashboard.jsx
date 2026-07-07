import { useMemo, useState } from 'react';
import Card from '../../components/common/Card';
import StatCard from '../../components/dashboard/StatCard';
import RevenueChart from '../../components/dashboard/RevenueChart';
import AppointmentChart from '../../components/dashboard/AppointmentChart';
import DepartmentLoadChart from '../../components/dashboard/DepartmentLoadChart';
import NotificationsPanel from '../../components/dashboard/NotificationsPanel';
import QuickWidgets from '../../components/dashboard/QuickWidgets';
import DashboardToolbar from '../../components/dashboard/DashboardToolbar';
import RecentPatientsTable from '../../components/dashboard/RecentPatientsTable';
import { statCards, recentPatients, notifications, quickWidgets } from '../../data/dashboardData';

export default function Dashboard() {
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('All Departments');
  const [range, setRange] = useState('Last 7 days');

  const filteredPatients = useMemo(() => {
    const term = search.trim().toLowerCase();
    return recentPatients.filter((p) => {
      const matchesSearch =
        !term || p.name.toLowerCase().includes(term) || p.doctor.toLowerCase().includes(term);
      const matchesDept = department === 'All Departments' || p.department === department;
      return matchesSearch && matchesDept;
    });
  }, [search, department]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink-900">Dashboard</h1>
          <p className="text-sm text-ink-600 mt-1">Overview of today's hospital activity.</p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <StatCard key={s.id} {...s} />
        ))}
      </div>

      {/* Revenue + Appointment status */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card title="Revenue Overview" className="xl:col-span-2">
          <RevenueChart />
        </Card>
        <Card title="Appointment Status">
          <AppointmentChart />
        </Card>
      </div>

      {/* Department load + Notifications */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card title="Patient Load by Department" className="xl:col-span-2">
          <DepartmentLoadChart />
        </Card>
        <NotificationsPanel items={notifications} />
      </div>

      {/* Quick widgets */}
      <QuickWidgets
        upcomingAppointments={quickWidgets.upcomingAppointments}
        expiringMedicines={quickWidgets.expiringMedicines}
      />

      {/* Recent patients: search + filter + table */}
      <Card title="Recently Admitted">
        <div className="mb-4">
          <DashboardToolbar
            search={search}
            onSearchChange={setSearch}
            department={department}
            onDepartmentChange={setDepartment}
            range={range}
            onRangeChange={setRange}
          />
        </div>
        <RecentPatientsTable data={filteredPatients} />
      </Card>
    </div>
  );
}
