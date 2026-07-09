import { useState } from 'react';
import {
  Users,
  UserPlus,
  Shield,
  Lock,
  UserCheck,
  Trash2,
  Edit2,
  Settings,
  Eye,
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Table from '../../components/common/Table';
import Modal from '../../components/common/Modal';

const statCards = [
  { label: 'Total Users', value: '42', detail: '8 active today', icon: Users },
  { label: 'Active Roles', value: '5', detail: 'Admin, Doctor, Nurse, Receptionist, Lab Tech', icon: Shield },
  { label: 'Pending Approvals', value: '3', detail: '2 new registrations', icon: UserCheck },
  { label: 'Last Login', value: 'Today', detail: '02:45 PM', icon: Lock },
];

const users = [
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

export default function UserManagementPage() {
  const [rolesList, setRolesList] = useState(roles);
  const [showCreateRoleModal, setShowCreateRoleModal] = useState(false);
  const [showEditRoleModal, setShowEditRoleModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserSettings, setShowUserSettings] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedUserForm, setEditedUserForm] = useState(null);
  const [newRoleForm, setNewRoleForm] = useState({
    name: '',
    description: '',
    permissions: [],
  });

  const handleOpenUserProfile = (user) => {
    setSelectedUser(user);
    setEditedUserForm(user);
    setShowProfileModal(true);
    setShowUserSettings(false);
    setIsEditingProfile(false);
  };

  const handleCloseProfileModal = () => {
    setShowProfileModal(false);
    setShowUserSettings(false);
    setIsEditingProfile(false);
    setSelectedUser(null);
    setEditedUserForm(null);
  };

  const handleEditProfile = () => {
    setIsEditingProfile(true);
    setEditedUserForm({ ...selectedUser });
  };

  const handleSaveProfile = () => {
    setSelectedUser({ ...editedUserForm });
    setIsEditingProfile(false);
    alert(`Profile for ${editedUserForm.name} updated successfully!`);
  };

  const handleCancelEdit = () => {
    setIsEditingProfile(false);
    setEditedUserForm({ ...selectedUser });
  };

  const handleCreateRoleClick = () => {
    setNewRoleForm({ name: '', description: '', permissions: [] });
    setShowCreateRoleModal(true);
  };

  const handleEditRoleClick = () => {
    setShowEditRoleModal(true);
  };

  const handleCreateRole = () => {
    if (!newRoleForm.name.trim()) {
      alert('Please enter a role name');
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
    alert(`Role "${newRoleForm.name}" created successfully!`);
  };

  const handleSelectRole = (role) => {
    setEditingRole(role);
  };

  const handleSaveEditRole = () => {
    if (!editingRole.name.trim()) {
      alert('Please enter a role name');
      return;
    }

    const updatedRoles = rolesList.map((role) =>
      role.id === editingRole.id ? editingRole : role
    );

    setRolesList(updatedRoles);
    setShowEditRoleModal(false);
    setEditingRole(null);
    alert(`Role "${editingRole.name}" updated successfully!`);
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

      <Card title="Add New User">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Input label="Full Name" placeholder="Enter full name" />
          <Input label="Email Address" type="email" placeholder="user@medicore.com" />
          <Input label="Department" placeholder="Select department" />
          <Input label="Role" placeholder="Select role" />
          <Input label="Contact Number" placeholder="+91 XXXXXXXXXX" />
          <Input label="License Number" placeholder="If applicable" />
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-ink-900 mb-1.5">Permissions</label>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4 rounded border-line" />
                <span className="text-sm text-ink-700">View Patients</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4 rounded border-line" />
                <span className="text-sm text-ink-700">Add Patients</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4 rounded border-line" />
                <span className="text-sm text-ink-700">View Prescriptions</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4 rounded border-line" />
                <span className="text-sm text-ink-700">Issue Prescriptions</span>
              </label>
            </div>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button icon={UserPlus}>Add User</Button>
          <Button variant="secondary">Cancel</Button>
        </div>
      </Card>

      <Card title="User List">
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
                <button
                  onClick={() => handleOpenUserProfile(row)}
                  className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 transition-all duration-150 animate-pulse"
                >
                  <Eye className="w-4 h-4" />
                  Profile
                </button>
              ),
            },
          ]}
          data={users}
          headerBgClass="bg-teal-700"
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
          headerBgClass="bg-teal-700"
        />
        <div className="mt-4 flex gap-3">
          <Button icon={UserPlus} onClick={handleCreateRoleClick}>Create Role</Button>
          <Button variant="secondary" icon={Edit2} onClick={handleEditRoleClick}>Edit Roles</Button>
        </div>
      </Card>

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
            onChange={(e) =>
              setNewRoleForm({ ...newRoleForm, name: e.target.value })
            }
          />
          <div>
            <label className="block text-sm font-medium text-ink-900 mb-1.5">
              Description
            </label>
            <textarea
              rows="3"
              className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              placeholder="Describe the role and its responsibilities"
              value={newRoleForm.description}
              onChange={(e) =>
                setNewRoleForm({ ...newRoleForm, description: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-900 mb-2">
              Assign Permissions
            </label>
            <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto">
              {permissions.map((perm) => (
                <label key={perm.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newRoleForm.permissions.includes(perm.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setNewRoleForm({
                          ...newRoleForm,
                          permissions: [...newRoleForm.permissions, perm.id],
                        });
                      } else {
                        setNewRoleForm({
                          ...newRoleForm,
                          permissions: newRoleForm.permissions.filter(
                            (p) => p !== perm.id
                          ),
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
          <Button onClick={handleCreateRole} fullWidth>
            Create Role
          </Button>
          <Button
            variant="secondary"
            onClick={() => setShowCreateRoleModal(false)}
            fullWidth
          >
            Cancel
          </Button>
        </div>
      </Modal>

      {/* Edit Role Modal */}
      <Modal
        isOpen={showEditRoleModal}
        onClose={() => {
          setShowEditRoleModal(false);
          setEditingRole(null);
        }}
        title="Edit Role"
        size="lg"
      >
        <div className="px-6 py-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-ink-900 mb-2">
                Select Role to Edit
              </label>
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
                  onChange={(e) =>
                    setEditingRole({ ...editingRole, name: e.target.value })
                  }
                />
                <div>
                  <label className="block text-sm font-medium text-ink-900 mb-2">
                    Permissions
                  </label>
                  <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto">
                    {permissions.map((perm) => (
                      <label key={perm.id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          defaultChecked={perm.enabled}
                          className="w-4 h-4 rounded border-line"
                        />
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
          <Button
            onClick={handleSaveEditRole}
            disabled={!editingRole}
            fullWidth
          >
            Save Changes
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              setShowEditRoleModal(false);
              setEditingRole(null);
            }}
            fullWidth
          >
            Cancel
          </Button>
        </div>
      </Modal>

      {/* User Profile Modal */}
      <Modal
        isOpen={showProfileModal}
        onClose={handleCloseProfileModal}
        title="User Profile"
        size="lg"
      >
        {!showUserSettings ? (
          <>
            <div className="px-6 py-4 space-y-4">
              {!isEditingProfile ? (
                selectedUser && (
                  <>
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-full bg-teal-100 flex items-center justify-center">
                        <Users className="h-10 w-10 text-teal-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-lg text-ink-900">{selectedUser.name}</p>
                        <p className="text-sm text-ink-600">{selectedUser.role}</p>
                        <p className="text-xs text-ink-500 mt-1">{selectedUser.email}</p>
                      </div>
                    </div>
                    <div className="border-t border-line pt-4 space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-ink-600 uppercase font-semibold">Department</p>
                          <p className="text-sm font-medium text-ink-900 mt-1">{selectedUser.department}</p>
                        </div>
                        <div>
                          <p className="text-xs text-ink-600 uppercase font-semibold">Status</p>
                          <p className="text-sm font-medium text-ink-900 mt-1">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              selectedUser.status === 'Active' 
                                ? 'bg-green-50 text-green-700' 
                                : 'bg-red-50 text-red-700'
                            }`}>
                              {selectedUser.status}
                            </span>
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-ink-600 uppercase font-semibold">Last Login</p>
                          <p className="text-sm font-medium text-ink-900 mt-1">{selectedUser.lastLogin}</p>
                        </div>
                        <div>
                          <p className="text-xs text-ink-600 uppercase font-semibold">Member Since</p>
                          <p className="text-sm font-medium text-ink-900 mt-1">{selectedUser.memberSince}</p>
                        </div>
                      </div>
                    </div>
                  </>
                )
              ) : (
                editedUserForm && (
                  <div className="space-y-4">
                    <Input 
                      label="Full Name" 
                      value={editedUserForm.name}
                      onChange={(e) => setEditedUserForm({ ...editedUserForm, name: e.target.value })}
                    />
                    <Input 
                      label="Email" 
                      type="email"
                      value={editedUserForm.email}
                      onChange={(e) => setEditedUserForm({ ...editedUserForm, email: e.target.value })}
                    />
                    <Input 
                      label="Department" 
                      value={editedUserForm.department}
                      onChange={(e) => setEditedUserForm({ ...editedUserForm, department: e.target.value })}
                    />
                    <Input 
                      label="Role" 
                      value={editedUserForm.role}
                      onChange={(e) => setEditedUserForm({ ...editedUserForm, role: e.target.value })}
                    />
                    <div>
                      <label className="block text-sm font-medium text-ink-900 mb-1.5">Status</label>
                      <select 
                        value={editedUserForm.status}
                        onChange={(e) => setEditedUserForm({ ...editedUserForm, status: e.target.value })}
                        className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                )
              )}
            </div>
            <div className="flex gap-3 px-6 py-4 border-t border-line bg-surface rounded-b-xl">
             {!isEditingProfile ? (
  <>
    <Button
      onClick={handleEditProfile}
      icon={Edit2}
      fullWidth
    >
      Edit Profile
    </Button>

    <Button
      onClick={() => setShowUserSettings(true)}
      icon={Settings}
      fullWidth
    >
      Settings
    </Button>
  </>
) : (
  <>
    <Button
      onClick={handleSaveProfile}
      fullWidth
    >
      Save Changes
    </Button>

    <Button
      variant="secondary"
      onClick={handleCancelEdit}
      fullWidth
    >
      Cancel
    </Button>
  </>
)}
            </div>
          </>
        ) : (
          <>
            <div className="px-6 py-4 space-y-4">
              <div>
                <h4 className="font-semibold text-ink-900 mb-3">System Settings</h4>
                <div className="space-y-3">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-line" />
                    <span className="text-sm text-ink-700">Email notifications</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-line" />
                    <span className="text-sm text-ink-700">SMS alerts</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4 rounded border-line" />
                    <span className="text-sm text-ink-700">Two-factor authentication</span>
                  </label>
                </div>
              </div>

              <div className="border-t border-line pt-4">
                <h4 className="font-semibold text-ink-900 mb-3">Privacy Settings</h4>
                <div className="space-y-3">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-line" />
                    <span className="text-sm text-ink-700">Show profile to other users</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-line" />
                    <span className="text-sm text-ink-700">Allow activity tracking</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="flex gap-3 px-6 py-4 border-t border-line bg-surface rounded-b-xl">
              <Button fullWidth>Save Settings</Button>
              <Button
                variant="secondary"
                onClick={() => setShowUserSettings(false)}
                fullWidth
              >
                Back
              </Button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
