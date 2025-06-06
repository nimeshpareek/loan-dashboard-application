# Loan Dashboard Application

This is a full-stack Loan Dashboard Application that allows users to apply for loans, view their applied loans, and manage loan statuses. The application includes role-based access for admins, verifiers, and regular users.

## **Video Walkthrough**
Watch the video walkthrough of the application here: [YouTube Video](https://youtu.be/RprFns-CIFU)
---

## **Features**
- **User Login**: Users can log in with their credentials.
- **Role-Based Access**:
  - Admin: Access to the admin dashboard.
  - Verifier: Access to the verifier dashboard.
  - User: Apply for loans and view applied loans.
- **Loan Application**: Users can apply for loans with details like loan name, amount, and purpose.
- **View Applied Loans**: Users can view the loans they have applied for, along with their statuses (`pending`, `approved`, `rejected`).

---

## **Technologies Used**
- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Tokens)
- **Styling**: Bootstrap

---

## **Setup Instructions**

### **1. Prerequisites**
- Node.js (v14 or higher)
- MySQL Server
- npm (Node Package Manager)

---

### **2. Clone the Repository**
```bash
git clone https://github.com/nimeshpareek/loan-dashboard-application.git
cd loan-dashboard-app
```

---

### **3. Backend Setup**

#### **a. Navigate to the Backend Directory**
```bash
cd backend
```

#### **b. Install Dependencies**
```bash
npm install
```

#### **c. Configure the Database**
1. Open MySQL and create the database:
   ```sql
   CREATE DATABASE loan_dashboard;
   USE loan_dashboard;
   ```

2. Create the `users` table:
   ```sql
   CREATE TABLE users (
     id INT AUTO_INCREMENT PRIMARY KEY,
     username VARCHAR(255) NOT NULL UNIQUE,
     password VARCHAR(255) NOT NULL,
     gender VARCHAR(10) NOT NULL,
     role VARCHAR(50) NOT NULL DEFAULT 'user'
   );
   ```

3. Create the `loans` table:
   ```sql
   CREATE TABLE loans (
     id INT AUTO_INCREMENT PRIMARY KEY,
     user_id INT NOT NULL,
     loanAmount DECIMAL(10, 2), 
     name VARCHAR(255),         
     purpose VARCHAR(255),      
     status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
     FOREIGN KEY (user_id) REFERENCES users(id)
   );
   ```

4. Insert sample data into the `users` table:
   ```sql
   INSERT INTO users (username, password, gender, role)
   VALUES ('admin', 'admin123', 'male', 'admin'),
          ('verifier', 'verifier123', 'female', 'verifier'),
          ('testuser', 'testpassword', 'male', 'user');
   ```

#### **d. Start the Backend Server**
1. Create a `.env` file in the `backend` directory and add the following:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=loan_dashboard
   JWT_SECRET=your_jwt_secret
   ```

2. Start the server:
   ```bash
   npm start
   ```

3. The backend will run on `http://localhost:5000`.

---

### **4. Frontend Setup**

#### **a. Navigate to the Frontend Directory**
```bash
cd ../frontend
```

#### **b. Install Dependencies**
```bash
npm install
```

#### **c. Start the Frontend Server**
```bash
npm start
```

4. The frontend will run on `http://localhost:3000`.

---

## **Application Structure**

### **Backend**
- **Endpoints**:
  - `POST /api/login`: Authenticate users and return a JWT token.
  - `POST /api/loans`: Apply for a loan.
  - `GET /api/loans/:userId`: Fetch loans for a specific user.

- **File Structure**:
  ```
  backend/
  ├── index.js          # Main server file
  ├── package.json      # Backend dependencies
  └── .env              # Environment variables
  ```

### **Frontend**
- **Components**:
  - `Login.js`: Handles user login.
  - `AppliedLoans.js`: Displays loans applied by the user.
  - `ApplyLoan.js`: Allows users to apply for loans.
  - `AdminDashboard.js`: Admin dashboard (for managing loans).
  - `VerifierDashboard.js`: Verifier dashboard (for verifying loans).

- **File Structure**:
  ```
  frontend/
  ├── src/
  │   ├── App.js              # Main application file
  │   ├── Login.js            # Login component
  │   ├── AppliedLoans.js     # Applied loans component
  │   ├── ApplyLoan.js        # Apply loan component
  │   ├── AdminDashboard.js   # Admin dashboard
  │   ├── VerifierDashboard.js# Verifier dashboard
  │   └── index.js            # React entry point
  ├── package.json            # Frontend dependencies
  └── public/
  ```

---

## **Usage**

### **1. Login**
- Admin: `username: admin`, `password: admin123`
- Verifier: `username: verifier`, `password: verifier123`
- User: Use credentials from the database.

### **2. Apply for a Loan**
- Navigate to the **Apply Loan** page.
- Fill in the loan details and submit.

### **3. View Applied Loans**
- Navigate to the **Your Loan Applications** page to view the loans you’ve applied for.

---

## **Troubleshooting**

### **1. Backend Issues**
- Ensure the `.env` file is correctly configured.
- Check the database connection and credentials.

### **2. Frontend Issues**
- Ensure the backend is running on `http://localhost:5000`.
- Check the browser console for errors.

### **3. Database Issues**
- Verify that the `users` and `loans` tables are correctly created.
- Check the `user_id` in the `loans` table to ensure loans are associated with the correct user.

