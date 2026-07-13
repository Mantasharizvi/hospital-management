import { useState } from 'react';
import {
  Users,
  UserPlus,
  Shield,
  Lock,
  UserCheck,
  Edit2,
  Eye,
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Table from '../../components/common/Table';
import Modal from '../../components/common/Modal';
import FormModal from '../../components/common/FormModal';
import UserProfileModal from '../../components/common/UserProfileModal';
import { useToast } from '../../context/ToastContext';
import { validateForm, rules, isValid } from '../../utils/validators';

const statCards = [
  { label: 'Total Users', value: '42', detail: '8 active today', icon: Users },
  { label: 'Active Roles', value: '5', detail: 'Admin, Doctor, Nurse, Receptionist, Lab Tech', icon: Shield },
  { label: 'Pending Approvals', value: '3', detail: '2 new registrations', icon: UserCheck },
  { label: 'Last Login', value: 'Today', detail: '02:45 PM', icon: Lock },
];

const initialUsers = [
  { id: 'USR-001', name: 'Dr. Rajesh Sharma', email: 'rajesh@medicore.com', role: 'Admin', status: 'Active', department: 'Administration', lastLogin: 'Today 02:45 PM', memberSince: '01 Jan 2025' },
  { id: 'USR-002', name: 'Dr. Priya Nair', email: 'priya@medicore.com', role: 'Doctor', status: 'Active', department: 'Cardiology', lastLogin: 'Today 10:30 AM', memberSince: '15 Feb 2025' },
  { id: 'USR-003', name: 'Arjun Menon', email: 'arjun@medicore.com', role: 'Nurse', status: 'Active', department: 'ICU', lastLogin: 'Today 08:15 AM', memberSince: '20 Mar 2025' },
  { id: 'USR-004', name: 'Sneha Verma', email: 'sneha@medicore.com', role: 'Receptionist', status: 'Inactive', department: 'Front Desk', lastLogin: 'Yesterday 06:30 PM', memberSince: '10 Apr 2025' },
];

const roles = [
  { id: 'ROLE-01', name: 'Admin', users: 3, permissions: 'All' },
  { id: 'ROLE-02', name: 'Doctor', users: 8, permissions: '15' },
  { id: 'ROLE-03', name: 'Nurse', users: 12, permissions: '12' },
  { id: 'ROLE-04', name: 'Receptionist', users: 6, permissions: '8' },
  { id: 'ROLE-05', name: 'Lab Technician', users: 5, permissions: '6' },
];

const permissions = [
  { id: 'PERM-001', name: 'View Patients', category: 'Patient Management', enabled: true },
  { id: 'PERM-002', name: 'Add Patients', category: 'Patient Management', enabled: true },
  { id: 'PERM-003', name: 'Edit Patients', category: 'Patient Management', enabled: false },
  { id: 'PERM-004', name: 'Delete Patients', category: 'Patient Management', enabled: false },
  { id: 'PERM-005', name: 'View Prescriptions', category: 'Prescription', enabled: true },
  { id: 'PERM-006', name: 'Issue Prescriptions', category: 'Prescription', enabled: false },
];

const emptyNewUser = { name: '', email: '', department: '', role: '', phone: '', license: '' };

const newUserSchema = {
  name: [rules.required('Full name is required')],
  email: [rules.required('Email is required'), rules.email()],
  department: [rules.required('Department is required')],
  role: [rules.required('Role is required')],
  phone: [rules.phone('Enter a valid contact number')],
};

export default function UserManagementPage() {
  const toast = useToast();
  const [usersList, setUsersList] = useState(initialUsers);
  const [rolesList, setRolesList] = useState(roles);

  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserForm, setNewUserForm] = useState(emptyNewUser);
  const [newUserErrors, setNewUserErrors] = useState({});

  const [showCreateRoleModal, setShowCreateRoleModal] = useState(false);
  const [showEditRoleModal, setShowEditRoleModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRoleForm, setNewRoleForm] = useState({ name: '', description: '', permissions: [] });

  const handleOpenUserProfile = (user) => {
    setSelectedUser(user);
    setShowProfileModal(true);
  };

  const handleSaveProfile = (updated) => {
    setUsersList((current) => current.map((u) => (u.id === updated.id ? updated : u)));
    setSelectedUser(updated);
  };

  const handleOpenAddUser = () => {
    setNewUserForm(emptyNewUser);
    setNewUserErrors({});
    setShowAddUserModal(true);
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    const errors = validateForm(newUserForm, newUserSchema);
    setNewUserErrors(errors);
    if (!isValid(errors)) {
      toast.error('Please fix the highlighted fields');
      return;
    }

    const newUser = {
      id: `USR-${String(usersList.length + 1).padStart(3, '0')}`,
      name: newUserForm.name,
      email: newUserForm.email,
      role: newUserForm.role,
      status: 'Active',
      department: newUserForm.department,
      lastLogin: '—',
      memberSince: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    };
    setUsersList((current) => [...current, newUser]);
    setShowAddUserModal(false);
    toast.success(`User "${newUser.name}" added successfully`);
  };

  const handleCreateRoleClick = () => {
    setNewRoleForm({ name: '', description: '', permissions: [] });
    setShowCreateRoleModal(true);
  };

  const handleEditRoleClick = () => setShowEditRoleModal(true);

  const handleCreateRole = () => {
    if (!newRoleForm.name.trim()) {
      toast.error('Please enter a role name');
      return;
    }
    const newRole = {
      id: `ROLE-${String(rolesList.length + 1).padStart(2, '0')}`,
      name: newRoleForm.name,
      users: 0,
      permissions: newRoleForm.permissions.length.toString(),
    };
    setRolesList([...rolesList, newRole]);
    setShowCreateRoleModal(false);
    setNewRoleForm({ name: '', description: '', permissions: [] });
    toast.success(`Role "${newRole.name}" created successfully`);
  };

  const handleSelectRole = (role) => setEditingRole(role);

  const handleSaveEditRole = () => {
    if (!editingRole.name.trim()) {
      toast.error('Please enter a role name');
      return;
    }
    setRolesList(rolesList.map((role) => (role.id === editingRole.id ? editingRole : role)));
    setShowEditRoleModal(false);
    setEditingRole(null);
    toast.success(`Role "${editingRole.name}" updated successfully`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink-900">User Management</h1>
          <p className="text-sm text-ink-600 mt-1">Manage users, roles, permissions and access control for the hospital system.</p>
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
        title="User List"
        action={<Button icon={UserPlus} onClick={handleOpenAddUser}>Add User</Button>}
      >
        <Table
          columns={[
            { key: 'id', header: 'User ID' },
            { key: 'name', header: 'Name' },
            { key: 'email', header: 'Email' },
            { key: 'role', header: 'Role' },
            { key: 'status', header: 'Status' },
            {
              key: 'action',
              header: 'Action',
              render: (row) => (
                <Button size="sm" variant="secondary" icon={Eye} onClick={() => handleOpenUserProfile(row)}>
                  Profile
                </Button>
              ),
            },
          ]}
          data={usersList}
        />
      </Card>

      <Card title="Role Management">
        <Table
          columns={[
            { key: 'id', header: 'Role ID' },
            { key: 'name', header: 'Role Name' },
            { key: 'users', header: 'Users' },
            { key: 'permissions', header: 'Permissions' },
          ]}
          data={rolesList}
        />
        <div className="mt-4 flex gap-3">
          <Button icon={UserPlus} onClick={handleCreateRoleClick}>Create Role</Button>
          <Button variant="secondary" icon={Edit2} onClick={handleEditRoleClick}>Edit Roles</Button>
        </div>
      </Card>

      {/* Add New User — opens in a popup, matching every other form in the app */}
      <FormModal
        isOpen={showAddUserModal}
        onClose={() => setShowAddUserModal(false)}
        onSubmit={handleAddUser}
        title="Add New User"
        submitLabel="Add User"
      >
        <Input
          label="Full Name"
          placeholder="Enter full name"
          value={newUserForm.name}
          onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
          error={newUserErrors.name}
        />
        <Input
          label="Email Address"
          type="email"
          placeholder="user@medicore.com"
          value={newUserForm.email}
          onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
          error={newUserErrors.email}
        />
        <Input
          label="Department"
          placeholder="e.g. Cardiology"
          value={newUserForm.department}
          onChange={(e) => setNewUserForm({ ...newUserForm, department: e.target.value })}
          error={newUserErrors.department}
        />
        <Input
          label="Role"
          placeholder="e.g. Doctor, Nurse"
          value={newUserForm.role}
          onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
          error={newUserErrors.role}
        />
        <Input
          label="Contact Number"
          placeholder="+91 XXXXXXXXXX"
          value={newUserForm.phone}
          onChange={(e) => setNewUserForm({ ...newUserForm, phone: e.target.value })}
          error={newUserErrors.phone}
        />
        <Input
          label="License Number"
          placeholder="If applicable"
          value={newUserForm.license}
          onChange={(e) => setNewUserForm({ ...newUserForm, license: e.target.value })}
        />
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-ink-900 mb-1.5">Permissions</label>
          <div className="grid grid-cols-2 gap-3">
            {['View Patients', 'Add Patients', 'View Prescriptions', 'Issue Prescriptions'].map((p) => (
              <label key={p} className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4 rounded border-line" />
                <span className="text-sm text-ink-700">{p}</span>
              </label>
            ))}
          </div>
        </div>
      </FormModal>

      {/* Create Role Modal */}
      <Modal
        isOpen={showCreateRoleModal}
        onClose={() => setShowCreateRoleModal(false)}
        title="Create New Role"
        size="md"
      >
        <div className="px-6 py-4 space-y-4">
          <Input
            label="Role Name"
            placeholder="e.g., Senior Doctor, Pharmacist"
            value={newRoleForm.name}
            onChange={(e) => setNewRoleForm({ ...newRoleForm, name: e.target.value })}
          />
          <div>
            <label className="block text-sm font-medium text-ink-900 mb-1.5">Description</label>
            <textarea
              rows="3"
              className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              placeholder="Describe the role and its responsibilities"
              value={newRoleForm.description}
              onChange={(e) => setNewRoleForm({ ...newRoleForm, description: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-900 mb-2">Assign Permissions</label>
            <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto">
              {permissions.map((perm) => (
                <label key={perm.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newRoleForm.permissions.includes(perm.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setNewRoleForm({ ...newRoleForm, permissions: [...newRoleForm.permissions, perm.id] });
                      } else {
                        setNewRoleForm({
                          ...newRoleForm,
                          permissions: newRoleForm.permissions.filter((p) => p !== perm.id),
                        });
                      }
                    }}
                    className="w-4 h-4 rounded border-line"
                  />
                  <span className="text-sm text-ink-700">{perm.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-3 px-6 py-4 border-t border-line bg-surface rounded-b-xl">
          <Button onClick={handleCreateRole} fullWidth>Create Role</Button>
          <Button variant="secondary" onClick={() => setShowCreateRoleModal(false)} fullWidth>Cancel</Button>
        </div>
      </Modal>

      {/* Edit Role Modal */}
      <Modal
        isOpen={showEditRoleModal}
        onClose={() => { setShowEditRoleModal(false); setEditingRole(null); }}
        title="Edit Role"
        size="lg"
      >
        <div className="px-6 py-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-ink-900 mb-2">Select Role to Edit</label>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                {rolesList.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => handleSelectRole(role)}
                    className={`p-3 rounded-lg border-2 text-left transition-colors ${
                      editingRole?.id === role.id
                        ? 'border-teal-600 bg-teal-50'
                        : 'border-line bg-white hover:border-teal-300'
                    }`}
                  >
                    <p className="font-medium text-ink-900">{role.name}</p>
                    <p className="text-xs text-ink-600">{role.users} users</p>
                  </button>
                ))}
              </div>
            </div>

            {editingRole && (
              <div className="space-y-4 border-t border-line pt-4">
                <Input
                  label="Role Name"
                  value={editingRole.name}
                  onChange={(e) => setEditingRole({ ...editingRole, name: e.target.value })}
                />
                <div>
                  <label className="block text-sm font-medium text-ink-900 mb-2">Permissions</label>
                  <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto">
                    {permissions.map((perm) => (
                      <label key={perm.id} className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked={perm.enabled} className="w-4 h-4 rounded border-line" />
                        <span className="text-sm text-ink-700">{perm.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-3 px-6 py-4 border-t border-line bg-surface rounded-b-xl">
          <Button onClick={handleSaveEditRole} disabled={!editingRole} fullWidth>Save Changes</Button>
          <Button
            variant="secondary"
            onClick={() => { setShowEditRoleModal(false); setEditingRole(null); }}
            fullWidth
          >
            Cancel
          </Button>
        </div>
      </Modal>

      {/* User Profile Modal — shared, reusable component (also used for "My Profile" in the header) */}
      <UserProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        user={selectedUser}
        onSave={handleSaveProfile}
      />
    </div>
  );
}
