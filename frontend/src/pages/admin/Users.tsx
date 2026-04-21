import { useState } from 'react';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  User,
  Shield,
  UserX,
  Mail,
  Calendar
} from 'lucide-react';
import { useAdminStore } from '@/store/store';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const roleOptions = [
  { value: 'all', label: 'All Roles' },
  { value: 'admin', label: 'Admin' },
  { value: 'user', label: 'User' },
];

export default function AdminUsers() {
  const { users, updateUserRole, deleteUser, fetchUsers } = useAdminStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedUser, setSelectedUser] = useState<typeof users[0] | null>(null);

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const handleRoleChange = async (userId: string, newRole: 'admin' | 'user') => {
    await updateUserRole(userId, newRole);
    fetchUsers();
  };

  const handleDelete = async (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      await deleteUser(userId);
      fetchUsers();
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-600';
      case 'user': return 'bg-blue-100 text-blue-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <AdminLayout>
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-serif font-bold text-[#1a1a1a]">
                Users
              </h1>
              <p className="text-[#666]">Manage user accounts and permissions</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
                <span className="text-sm text-[#666]">Total Users: </span>
                <span className="font-semibold">{users.length}</span>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl p-4 mb-6 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666]" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-[#e0e0e0] rounded-lg focus:outline-none focus:border-[#c9a96e]"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-[#666]" />
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-4 py-3 border border-[#e0e0e0] rounded-lg focus:outline-none focus:border-[#c9a96e]"
              >
                {roleOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#f8f8f8]">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-medium text-[#666]">User</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-[#666]">Email</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-[#666]">Role</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-[#666]">Joined</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-[#666]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-[#e0e0e0] last:border-b-0">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-[#c9a96e]/10 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-[#c9a96e]" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-[#666]">ID: {user.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-[#666]" />
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-[#666]">
                          <Calendar className="w-4 h-4" />
                          {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-2 hover:bg-[#f0f0f0] rounded-lg">
                              <MoreHorizontal className="w-5 h-5" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSelectedUser(user)}>
                              <User className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            {user.role === 'user' ? (
                              <DropdownMenuItem onClick={() => handleRoleChange(user.id, 'admin')}>
                                <Shield className="w-4 h-4 mr-2" />
                                Make Admin
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem onClick={() => handleRoleChange(user.id, 'user')}>
                                <User className="w-4 h-4 mr-2" />
                                Remove Admin
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem 
                              onClick={() => handleDelete(user.id)}
                              className="text-red-500"
                            >
                              <UserX className="w-4 h-4 mr-2" />
                              Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <User className="w-12 h-12 text-[#999] mx-auto mb-4" />
                <p className="text-[#666]">No users found</p>
              </div>
            )}
          </div>

      {/* User Details Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6 py-4">
              <div className="flex items-center gap-4">
                {selectedUser.avatar ? (
                  <img
                    src={selectedUser.avatar}
                    alt={selectedUser.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 bg-[#c9a96e]/10 rounded-full flex items-center justify-center">
                    <User className="w-10 h-10 text-[#c9a96e]" />
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-semibold">{selectedUser.name}</h3>
                  <p className="text-[#666]">{selectedUser.email}</p>
                  <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium capitalize ${getRoleColor(selectedUser.role)}`}>
                    {selectedUser.role}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#f8f8f8] p-4 rounded-lg">
                  <p className="text-sm text-[#666]">User ID</p>
                  <p className="font-medium">{selectedUser.id}</p>
                </div>
                <div className="bg-[#f8f8f8] p-4 rounded-lg">
                  <p className="text-sm text-[#666]">Joined</p>
                  <p className="font-medium">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              {selectedUser.phone && (
                <div className="bg-[#f8f8f8] p-4 rounded-lg">
                  <p className="text-sm text-[#666]">Phone</p>
                  <p className="font-medium">{selectedUser.phone}</p>
                </div>
              )}

              {selectedUser.addresses && selectedUser.addresses.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3">Addresses</h4>
                  <div className="space-y-2">
                    {selectedUser.addresses.map((addr) => (
                      <div key={addr.id} className="bg-[#f8f8f8] p-4 rounded-lg">
                        <p className="font-medium">{addr.name}</p>
                        <p className="text-sm text-[#666]">{addr.street}</p>
                        <p className="text-sm text-[#666]">
                          {addr.city}, {addr.state} {addr.zipCode}
                        </p>
                        {addr.isDefault && (
                          <span className="inline-block mt-2 px-2 py-1 bg-[#c9a96e]/10 text-[#c9a96e] text-xs rounded">
                            Default
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                {selectedUser.role === 'user' ? (
                  <Button 
                    onClick={() => {
                      handleRoleChange(selectedUser.id, 'admin');
                      setSelectedUser(null);
                    }}
                    className="flex-1 btn-primary"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Make Admin
                  </Button>
                ) : (
                  <Button 
                    onClick={() => {
                      handleRoleChange(selectedUser.id, 'user');
                      setSelectedUser(null);
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Remove Admin
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
