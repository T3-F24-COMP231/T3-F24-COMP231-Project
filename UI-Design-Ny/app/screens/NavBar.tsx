// NavBar.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import './styles/NavBar.css';

const NavBar: React.FC = () => {
    return (
        <nav>
            <h1>Personal Financial Management</h1>
            <div>
                {/* Links to different pages */}
                <Link to="/register">Register</Link>
                <Link to="/login">Login</Link>
                {/* Display page links only after login */}
                <Link to="/add-record">Add Record</Link>
                <Link to="/summary">Summary</Link>
                <Link to="/debt-entry">Add Debt</Link>
                <Link to="/logout">Logout</Link>
                <Link to="/add-expense">Add Expense</Link>
                <Link to="/add-income">Add Income</Link>
                <Link to="/edit-debt">Edit Debt</Link>
                <Link to="/edit-income">Edit Income</Link>
                <Link to="/edit-expense">Edit Expense</Link>
                <li><Link to="/activity-log">Activity Log</Link></li>
                <li><Link to="/role-management">Role Management</Link></li>
                <li><Link to="/create-role">Create Role</Link></li>
                <li><Link to="/history-view">History View</Link></li>
                <li><Link to="/investments-visualization">Investments</Link></li>
                <li><Link to="/charts-and-graphs">Charts & Graphs</Link></li>
            </div>
        </nav>
    );
};

export default NavBar;
