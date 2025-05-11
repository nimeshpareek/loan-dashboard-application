import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles/admin-dashboard.css';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

function AdminDashboard() {
  const [stats, setStats] = useState({ totalUsers: 0, totalLoans: 0 });
  const [queries, setQueries] = useState([]);
  const [counts, setCounts] = useState({ approvedLoans: 0, rejectedLoans: 0, pendingLoans: 0 });

  const maleAvatar = 'https://via.placeholder.com/50/007bff/ffffff?text=M';
  const femaleAvatar = 'https://via.placeholder.com/50/f06292/ffffff?text=F';

  useEffect(() => {
    fetch('http://localhost:5000/api/statistics')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error('Statistics error:', err));

    fetch('http://localhost:5000/api/queries')
      .then(res => res.json())
      .then(data => setQueries(data))
      .catch(err => console.error('Queries error:', err));

    // Fetch loan counts
    axios.get('http://localhost:5000/api/loan-counts')
      .then((response) => setCounts(response.data))
      .catch((error) => console.error('Error fetching loan counts:', error));
  }, []);

  const dummyChartData = [
    { name: 'Jan', loans: 30 },
    { name: 'Feb', loans: 45 },
    { name: 'Mar', loans: 60 },
    { name: 'Apr', loans: 20 },
    { name: 'May', loans: 50 },
  ];

  return (
    <div className="admin-dashboard">
      <aside className="sidebar">
        <div>
          <h2>Loan Manager</h2>
          <nav>
            <a href="#" className="active">Dashboard</a>
            <a href="#">Users</a>
            <a href="#">Loans</a>
            <a href="#">Settings</a>
          </nav>
        </div>
        <div className="sidebar-footer">
          <small>© 2025</small>
        </div>
      </aside>

      <main className="main">
        <div className="main-header">Admin Dashboard</div>

        <div className="stats-container">
          <div className="stat-card">
            <h3>Total Users</h3>
            <p>{stats.totalUsers}</p>
          </div>
          <div className="stat-card">
            <h3>Total Loans</h3>
            <p>{stats.totalLoans}</p>
          </div>
        </div>

        <div className="charts">
          <div className="chart-card">
            <h4>Loan Trend (Monthly)</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dummyChartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="loans" fill="#4a90e2" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="queries-section">
          <h4>User Queries</h4>
          {queries.length === 0 ? (
            <p>No queries available.</p>
          ) : (
            <ul className="query-list">
              {queries.map((q) => (
                <li className="query-card" key={q.id}>
                  <img
                    src={q.gender === 'female' ? femaleAvatar : maleAvatar}
                    alt="Avatar"
                    className="query-avatar"
                  />
                  <div className="query-info">
                    <h5>{q.name}</h5>
                    <p>{q.message}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="loan-counts">
          <h4>Loan Counts</h4>
          <ul>
            <li>Approved Loans: {counts.approvedLoans}</li>
            <li>Rejected Loans: {counts.rejectedLoans}</li>
            <li>Pending Loans: {counts.pendingLoans}</li>
          </ul>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
