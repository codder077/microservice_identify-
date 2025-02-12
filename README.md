# Contact Identification Service

This is a Node.js and Express-based service that identifies users based on their email and phone number. It maintains a database of contacts and determines primary and secondary relationships between them.

## Table of Contents
- [Installation](#installation)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Usage](#usage)
- [Testing](#testing)
- [Example Requests and Responses](#example-requests-and-responses)
- [Technologies Used](#technologies-used)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/codder077/microservice.git
   cd microservice
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and configure the following:
   ```env
   MYSQL_HOST=your_mysql_host
   MYSQL_USER=your_mysql_user
   MYSQL_PASS=your_mysql_password
   MYSQL_DATABASE=your_database_name
   MYSQL_PORT=3306
   PORT=3000
   ```

4. Start the server:
   ```bash
   npm start
   ```

## Database Schema
The `contacts` table is structured as follows:

```sql
CREATE TABLE IF NOT EXISTS contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  phoneNumber VARCHAR(20) NULL,
  email VARCHAR(255) NULL,
  linkedId INT NULL,
  linkPrecedence ENUM('primary', 'secondary') NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deletedAt TIMESTAMP NULL
);
```

## API Endpoints

### Identify User
**Endpoint:**
```
POST /api/v1/identify
```
**Request Body:**
```json
{
	"email": "lorraine@hillvalley.edu",
	"phoneNumber":"123456"
}
```

**Response Format:**
```json
{
  "contact": {
    "primaryContactId": 1,
    "emails": [
      "lorraine@hillvalley.edu",
      "mcfly@hillvalley.edu"
    ],
    "phoneNumbers": [
      "123456"
    ],
    "secondaryContactIds": [
      23,
      28,
      29,
      31
    ]
  }
}
```

## Usage

- The service checks if a user already exists based on the provided email or phone number.
- If a match is found, it determines the primary contact and any linked secondary contacts.
- If no existing contact is found, it creates a new primary contact.
- If an existing contact is found but doesn't match both the email and phone number, a new secondary contact is created.

## Testing

You can test the API using tools like [Postman](https://www.postman.com/) or `curl`:
```bash
curl -X POST http://localhost:3000/api/v1/identify \
     -H "Content-Type: application/json" \
     -d '{"email": "lorraine@hillvalley.edu", "phoneNumber": "123456"}'
```

## Technologies Used
- Node.js
- Express.js
- MySQL (using `mysql2`)
- TypeScript


