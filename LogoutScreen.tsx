import { useNavigate } from 'react-router-dom';
import './styles/LogoutPage.css';

const LogoutPage: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Perform logout logic
        console.log("User logged out");
        navigate('/login'); // Replaces history.push
    };

    const handleCancel = () => {
        navigate(-1); // Replaces history.goBack
    };

    return (
        <div className="logout-container">
            <h2>Are you sure you want to logout?</h2>
            <button onClick={handleLogout}>Logout</button>
            <button onClick={handleCancel}>Cancel</button>
        </div>
    );
};

export default LogoutPage;


