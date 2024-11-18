import React, { useEffect, useState } from 'react';
import './styles/ActivityLogPage.css';

interface LogEntry {
    timestamp: string;
    activity: string;
    user: string;
}

const ActivityLogPage: React.FC = () => {
    const [logs, setLogs] = useState<LogEntry[]>([]);

    useEffect(() => {
        // Simulate fetching logs from an API
        const fetchLogs = async () => {
            const mockLogs: LogEntry[] = [
                { timestamp: '2024-11-16 14:30', activity: 'Logged In', user: 'JohnDoe' },
                { timestamp: '2024-11-16 14:35', activity: 'Added Income', user: 'JaneDoe' },
            ];
            setLogs(mockLogs);
        };
        fetchLogs();
    }, []);

    return (
        <div className="activity-log-container">
            <h2>Activity Log</h2>
            <table>
                <thead>
                    <tr>
                        <th>Timestamp</th>
                        <th>Activity</th>
                        <th>User</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.map((log, index) => (
                        <tr key={index}>
                            <td>{log.timestamp}</td>
                            <td>{log.activity}</td>
                            <td>{log.user}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ActivityLogPage;
