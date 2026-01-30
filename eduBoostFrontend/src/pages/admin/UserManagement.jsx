import { MoreHorizontal, Search, Trash2, UserCheck, Shield } from 'lucide-react';

const UserManagement = () => {
    const users = [
        { id: 1, name: 'Alex Johnson', email: 'alex@example.com', role: 'Student', status: 'Active' },
        { id: 2, name: 'Sarah Connor', email: 'sarah.teacher@eduboost.com', role: 'Teacher', status: 'Active' },
        { id: 3, name: 'Michael Admin', email: 'admin@eduboost.com', role: 'Admin', status: 'Active' },
        { id: 4, name: 'Banned User', email: 'spammer@test.com', role: 'Student', status: 'Banned' },
    ];

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
                <div className="flex gap-2">
                    <button className="btn bg-white border border-gray-200 text-gray-600 hover:bg-gray-50">Export CSV</button>
                    <button className="btn btn-primary">+ Add User</button>
                </div>
            </div>

            <div className="glass rounded-2xl overflow-hidden p-6">
                <div className="flex justify-between mb-6">
                    <div className="relative w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input type="text" placeholder="Search by name or email..." className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                </div>

                <table className="w-full">
                    <thead className="bg-gray-50 border-y border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-500">User Info</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-500">Role</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-500">Status</th>
                            <th className="px-6 py-4 text-right text-sm font-semibold text-gray-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {users.map(user => (
                            <tr key={user.id} className="group hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-800">{user.name}</div>
                                            <div className="text-sm text-gray-500">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold
                                        ${user.role === 'Admin' ? 'bg-purple-100 text-purple-700' :
                                            user.role === 'Teacher' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}
                                    `}>
                                        {user.role === 'Admin' && <Shield size={12} />}
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"><UserCheck size={18} /></button>
                                        <button className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagement;
