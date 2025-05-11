import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Form, Button, Table, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './styles/user-dashboard.css';

function UserDashboard() {
  const [loans, setLoans] = useState([]);
  const [loanDetails, setLoanDetails] = useState({ loanName: '', loanAmount: '', loanPurpose: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [activeLink, setActiveLink] = useState('apply-loan');

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const userId = localStorage.getItem('userId'); // Assuming userId is stored in localStorage
        const response = await axios.get(`http://localhost:5000/api/loans/${userId}`);
        setLoans(response.data);
      } catch (err) {
        console.error('Error fetching loans:', err);
        setError('Failed to fetch loans');
      }
    };

    fetchLoans();
  }, []);

  const handleLoanSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const userId = localStorage.getItem('userId'); // Get user ID from localStorage
      await axios.post('http://localhost:5000/api/loans', {
        userId,
        loanAmount: loanDetails.loanAmount,
        purpose: loanDetails.loanPurpose, // Send purpose
      });

      setMessage('Loan application submitted successfully!');
      setLoanDetails({ loanAmount: '', loanPurpose: '' }); // Clear form
      fetchLoans();
    } catch (err) {
      console.error('Error applying for loan:', err);
      setError('Failed to apply for loan'); // Display error message
    }
  };

  return (
    <Container fluid className="user-dashboard">
      <Row>
        {/* Sidebar */}
        <Col md={3} className="sidebar">
          <div className="sidebar-content">
            <h2>Loan Manager</h2>
            <nav>
              <Link to="/" className="sidebar-link">Dashboard</Link>
              <button onClick={() => setActiveLink('apply-loan')} className="sidebar-link">Apply for Loan</button>
              <button onClick={() => setActiveLink('loan-applications')} className="sidebar-link">Your Loan Applications</button>
              <Link to="/profile" className="sidebar-link">Profile</Link>
              <Link to="/settings" className="sidebar-link">Settings</Link>
            </nav>
          </div>
          <div className="sidebar-footer">
            <small>© 2025</small>
          </div>
        </Col>

        {/* Main Content */}
        <Col md={9} className="main-content d-flex justify-content-center align-items-center">
          <Row className="w-100 justify-content-center">
            <Col md={8}>
              <Card className="p-4 shadow-sm">
                <Card.Body>
                  {/* Apply for Loan */}
                  {activeLink === 'apply-loan' && (
                    <div>
                      <h2 className="text-center mb-4">Apply for a New Loan</h2>
                      {message && <Alert variant="success">{message}</Alert>}

                      <Form onSubmit={handleLoanSubmit}>
                        <Form.Group className="mb-3">
                          <Form.Label>Loan Amount</Form.Label>
                          <Form.Control
                            type="number"
                            value={loanDetails.loanAmount}
                            onChange={(e) => setLoanDetails({ ...loanDetails, loanAmount: e.target.value })}
                            placeholder="Enter loan amount"
                            required
                          />
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label>Loan Purpose</Form.Label>
                          <Form.Control
                            type="text"
                            value={loanDetails.loanPurpose}
                            onChange={(e) => setLoanDetails({ ...loanDetails, loanPurpose: e.target.value })}
                            placeholder="e.g., Car, Education"
                            required
                          />
                        </Form.Group>

                        <Button type="submit" variant="primary" className="w-100">
                          Submit Application
                        </Button>
                      </Form>
                    </div>
                  )}

                  {/* Loan Applications */}
                  {activeLink === 'loan-applications' && (
                    <div>
                      <h2 className="text-center mb-4">Your Loan Applications</h2>
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
                                <td>{loan.name}</td>
                                <td>${loan.loanAmount}</td>
                                <td>
                                  <span className={`badge bg-${loan.status === 'approved' ? 'success' : loan.status === 'rejected' ? 'danger' : 'warning'}`}>
                                    {loan.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      )}
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default UserDashboard;
