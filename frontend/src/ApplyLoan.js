// src/components/ApplyLoan.js
import React, { useState } from 'react';
import axios from 'axios';

const ApplyLoan = () => {
  const [loanDetails, setLoanDetails] = useState({
    loanName: '',
    loanAmount: '',
    loanPurpose: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const userId = localStorage.getItem('userId'); // Assuming userId is stored in localStorage
      const response = await axios.post('http://localhost:5000/api/loans', {
        userId,
        loanAmount: loanDetails.loanAmount,
        name: loanDetails.loanName,
        purpose: loanDetails.loanPurpose,
      });

      setSuccess(response.data.message); // Display success message
      setLoanDetails({ loanName: '', loanAmount: '', loanPurpose: '' }); // Clear form
    } catch (err) {
      console.error('Error applying for loan:', err);
      setError('Failed to apply for loan'); // Display error message
    }
  };

  return (
    <div className="container">
      <div className="apply-loan-form">
        <h2>Apply for a Loan</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Loan Name"
              value={loanDetails.loanName}
              onChange={(e) => setLoanDetails({ ...loanDetails, loanName: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="number"
              placeholder="Loan Amount"
              value={loanDetails.loanAmount}
              onChange={(e) => setLoanDetails({ ...loanDetails, loanAmount: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <textarea
              placeholder="Purpose of Loan"
              value={loanDetails.loanPurpose}
              onChange={(e) => setLoanDetails({ ...loanDetails, loanPurpose: e.target.value })}
              required
            />
          </div>
          <button type="submit">Submit Application</button>
        </form>
      </div>
    </div>
  );
};

export default ApplyLoan;
