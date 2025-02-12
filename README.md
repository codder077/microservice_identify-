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
   git clone https://github.com/codder077/microservice_identify-.git
   cd microservice_identify-
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and configure the following:
   ```env
   DB_USER=postgres
   DB_PASSWORD=""
   DB_HOST=""
   DB_PORT=5432
   DB_NAME=""
   EXTERNAL_DATABASE_URL=""
   ```

4. Start the server:
   ```bash
   npm run dev
   ```


## Database Schema
**Table: `contacts`**
| Column         | Type          | Description                          |
|---------------|--------------|--------------------------------------|
| id            | SERIAL PRIMARY KEY | Unique identifier                   |
| phoneNumber   | VARCHAR(15)   | Contact's phone number               |
| email         | VARCHAR(255)  | Contact's email address              |
| linkedId      | INT           | ID of the primary contact (if any)   |
| linkPrecedence| ENUM('primary', 'secondary') | Defines primary/secondary contact |
| createdAt     | TIMESTAMP     | Creation timestamp                    |
| updatedAt     | TIMESTAMP     | Last update timestamp                |
| deletedAt     | TIMESTAMP     | Soft delete timestamp (nullable)     |

## API Endpoints

### Identify User
**Endpoint:**
```
POST /identify
```
**Request Body:**
```json
{
	"email": "mcfly@hillvalley.edu",
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
      23
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
curl -X POST https://microservice-identify.onrender.com/identify \
     -H "Content-Type: application/json" \
     -d '{"email": "lorraine@hillvalley.edu", "phoneNumber": "123456"}'
```

## Technologies Used
- Node.js
- Express.js
- MySQL (using `mysql2`)
- TypeScript


