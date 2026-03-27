# Node.js AI Backend API

A robust REST API built with Node.js, Express, and MongoDB that provides secure user authentication and integrates with the OpenRouter AI API. This backend application manages user accounts, securely authenticates sessions via HTTP-only cookies, handles AI prompts, and stores user interaction history.

## Features

- **User Authentication:** Secure registration and login using Argon2 for password hashing and JSON Web Tokens (JWT).
- **Cookie-Based Sessions:** Token payload is generated and securely passed via HTTP-only, secure cookies, preventing client-side data tampering (XSS).
- **AI Integration:** Seamless integration with OpenRouter API to fetch AI responses using cutting-edge models.
- **Prompt History:** Users can view their past AI interactions with pagination support.
- **Security:** Built-in middleware for security (Helmet), CORS, and Rate Limiting to prevent abuse.
- **Error Handling:** Global error handling and logging via Winston/Morgan.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB & Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Security:** Argon2 (hashing), Helmet, CORS, Cookie-Parser, express-rate-limit
- **HTTP Client:** Axios (for communicating with OpenRouter)
- **Logging:** Morgan & Winston

## Prerequisites

- Node.js installed
- MongoDB URI (Local or Atlas)
- OpenRouter API Key

## Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env
PORT=3000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
OPENROUTER_API_KEY=your_openrouter_api_key
MODEL_ID=your_preferred_model_id (e.g., google/gemini-2.5-flash)
```

## Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd api
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```
   The server will start on `http://localhost:3000` (or the port defined in `.env`).

## API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/register` | Register a new user | No |
| `POST` | `/login` | Authenticate user & set cookie | No |
| `POST` | `/logout` | Clear auth cookie | Yes |
| `GET` | `/history` | Get user's paginated prompt history | Yes |

### AI Core (`/api/user`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/askAi` | Submit a prompt to AI. Stores temporary result in secure cookie. | Yes |
| `POST` | `/savePrompt`| Extracts prompt from secure cookie and saves it to MongoDB. | Yes |

## License

ISC License

## Author

**Subham Banerjee**
