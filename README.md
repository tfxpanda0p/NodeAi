# NodeAI - Full Stack AI Workspace

NodeAI is a premium, full-stack interactive workspace that allows users to build and visualize AI prompt flows using a node-based interface. It integrates a React-based frontend with a robust Node.js/Express backend and MongoDB for persistence.

## 🌟 Overview

The project aims to demonstrate the seamless integration of modern technologies to create a functional AI-powered application. Users can input prompts into a source node, execute the flow to fetch AI responses via OpenRouter, and persist the interactions to a database.

## 🏗️ Project Structure

This is a monorepo containing both the frontend and backend:

-   **/api**: The Node.js/Express backend server.
-   **/client**: The React/Vite/React Flow frontend application.

## 🛠️ Tech Stack

### Frontend
- **React 19 & Vite**: Fast development and modern UI rendering.
- **React Flow (@xyflow/react)**: Powerful node-based interface for visualizing prompt-result connections.
- **Tailwind CSS v4**: Utility-first styling with premium dark-mode aesthetics.
- **GSAP & Three.js**: Advanced micro-animations and background effects (`Hyperspeed`, `DotGrid`).

### Backend
- **Node.js & Express**: High-performance API routing.
- **MongoDB & Mongoose**: Categorized storage for AI prompts and user history.
- **OpenRouter API**: Unified gateway to access various free/premium AI models.
- **Argon2 & JWT**: Secure authentication and session management via HTTP-only cookies.

### DevOps & Safety
- **Environment Variables**: Managed via `.env` files for security.
- **CORS & Rate Limiting**: Protection against unauthorized access and API abuse.

## 🚀 Getting Started

To run the entire project locally, follow these steps:

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/) (Local instance or Atlas URI)
- [OpenRouter API Key](https://openrouter.ai/keys)

### 2. Setup the Backend (API)
1.  Navigate to the `api` folder:
    ```bash
    cd api
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure `.env` (refer to `api/.env.example` or the README in the `api` folder).
4.  Start the server:
    ```bash
    npm run dev
    ```

### 3. Setup the Frontend (Client)
1.  Navigate to the `client` folder:
    ```bash
    cd client
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure `.env` (`VITE_API_URL=http://localhost:3000/api`).
4.  Start the client:
    ```bash
    npm run dev
    ```

## 🔧 Environment Variables

### API (.env)
- `PORT`: Server port (default: 3000).
- `MONGO_URI`: Your MongoDB connection string.
- `OPENROUTER_API_KEY`: Your OpenRouter API key.
- `MODEL_ID`: The AI model ID from OpenRouter (see **Known Issues** below).
- `JWT_SECRET`: Secret key for signing tokens.

### Client (.env)
- `VITE_API_URL`: The full URL to your backend API.

## ⚠️ Known Issues

### OpenRouter Model IDs are Deprecated

The models specified in the original project spec are **no longer available** on OpenRouter and will cause API errors:

| Model ID (Spec) | Error |
|:---|:---|
| `mistralai/mistral-7b-instruct:free` | `404 - No endpoints found` |
| `google/gemini-2.0-flash-lite-preview-02-05:free` | `400 - Not a valid model ID` |

**Working alternatives** — set one of these as your `MODEL_ID` in `api/.env`:

```
openrouter/free                              # Auto-picks any available free model
google/gemma-2-9b-it:free
mistralai/mistral-small-24b-instruct-2501:free
```

> 💡 For the latest list of free models, visit [openrouter.ai/models?max_price=0](https://openrouter.ai/models?max_price=0)


## 📝 Author

**Subham Banerjee**

---

Built with ❤️ for the future of AI node-based workflows.
