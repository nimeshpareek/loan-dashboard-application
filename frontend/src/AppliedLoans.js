import React, { useState, useEffect } from 'react';
import { Table, Alert } from 'react-bootstrap';

const AppliedLoans = () => {
  const [loans, setLoans] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const userId = localStorage.getItem('userId'); // Get user ID from localStorage

    if (!userId) {
      setError('User not logged in');
      return;
    }

    fetch(`http://localhost:5000/api/loans/${userId}`) // Use dynamic user ID
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch loans');
        }
        return response.json();
      })
      .then((data) => {
        setLoans(data);
      })
      .catch((err) => {
        console.error('Error fetching loans:', err);
        setError('Failed to fetch loans');
      });
  }, []);

  return (
    <div>
      <h2>Your Loan Applications</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      {loans.length === 0 ? (
        <p>No loan applications found.</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Purpose</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan, index) => (
              <tr key={loan.id}>
                <td>{index + 1}</td>
                <td>{loan.purpose}</td> {/* Display purpose */}
                <td>${loan.loanAmount}</td>
                <td>
                  <span
                    className={`badge bg-${
                      loan.status === 'approved'
                        ? 'success'
                        : loan.status === 'rejected'
                        ? 'danger'
                        : 'warning'
                    }`}
                  >
                    {loan.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default AppliedLoans;
