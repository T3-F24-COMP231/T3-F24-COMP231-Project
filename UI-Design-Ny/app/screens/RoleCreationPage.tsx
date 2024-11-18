import React from 'react';
import './styles/RoleCreationPage.css';

const RoleCreationPage: React.FC = () => {
    return (
        <div className="role-creation-container">
            <h2>Role Creation</h2>
            <form className="role-creation-form">
                <label>
                    Role Name:
                    <input type="text" placeholder="Enter role name" required />
                </label>
                <label>
                    Permissions:
                    <textarea placeholder="Enter role permissions" required></textarea>
                </label>
                <button type="submit" className="submit-button">Create Role</button>
            </form>
        </div>
    );
};

export default RoleCreationPage;
