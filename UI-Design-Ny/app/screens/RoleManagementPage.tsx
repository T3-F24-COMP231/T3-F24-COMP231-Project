import React, { useState, useEffect } from 'react';
import './styles/RoleManagementPage.css';

interface User {
    id: number;
    name: string;
    role: string;
}

const RoleManagementPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        // Mock API call
        const fetchUsers = async () => {
            const mockUsers = [
                { id: 1, name: 'John Doe', role: 'Admin' },
                { id: 2, name: 'Jane Smith', role: 'User' },
            ];
            setUsers(mockUsers);
        };
        fetchUsers();
    }, []);

    const handleRoleChange = (id: number, newRole: string) => {
        setUsers(users.map((user) => (user.id === id ? { ...user, role: newRole } : user)));
        alert(`Role updated for user ID ${id} to ${newRole}`);
    };

    return (
        <div className="role-management-container">
            <h2>Role Management</h2>
            <table>
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Role</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.name}</td>
                            <td>{user.role}</td>
                            <td>
                                <select
                                    value={user.role}
                                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                >
                                    <option value="Admin">Admin</option>
                                    <option value="User">User</option>
                                    <option value="Guest">Guest</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default RoleManagementPage;
