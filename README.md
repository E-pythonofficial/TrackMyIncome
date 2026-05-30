# Income Tracker — Backend

Node.js + Express + MySQL

---

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
Create a `.env` file:
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=income_tracker
PORT=5000
```

### 3. Set up the database
- Open phpMyAdmin → `http://localhost/phpmyadmin`
- Create a database called `income_tracker`
- Click the SQL tab and run the schema in `src/db/schema.sql`

### 4. Run the server
```bash
npm run dev
```

Server runs at `http://localhost:5000`

---

## API Endpoints

| Method | URL | Description |
|---|---|---|
| POST | `/api/register` | Register user (all 3 form sections) |
| GET | `/api/users/:id` | Get user profile |
| GET | `/api/dashboard/:id` | Get dashboard data |

---

## Register Request Body
```json
{
  "fullname": "John Doe",
  "email": "john@example.com",
  "password": "secret123",
  "income_streams": [
    {
      "source_name": "Salary",
      "income_type": "salary",
      "estimated_monthly_amount": 250000
    }
  ],
  "expense_categories": [
    {
      "category_name": "Food",
      "category_type": "food",
      "estimated_monthly_spend": 40000,
      "priority": "high"
    }
  ]
}
```

---

## For the Frontend Team
- Base URL: `http://localhost:5000/api`
