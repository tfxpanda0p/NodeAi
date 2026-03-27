# NodeAI - Interactive Client

The frontend for NodeAI, a premium interactive workspace for AI-powered node flows. Built with React and Vite, featuring a high-performance canvas and modern visual effects.

## ✨ Features

- **Interactive AI Canvas**: Connect nodes to build and visualize AI prompt flows using `@xyflow/react`.
- **Advanced Visuals**: 
  - Mouse-reactive `DotGrid` background.
  - Premium `Hyperspeed` visual system using Three.js and Postprocessing.
- **Authentication**: Secure Login and Registration flows.
- **Persistence**: 
  - Save AI interaction history.
  - Local state persistence for canvas nodes and edges.
- **Responsive Design**: Premium dark-mode UI powered by Tailwind CSS.

## 🚀 Tech Stack

- **Core**: [React 19](https://react.dev/), [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Graph/Nodes**: [@xyflow/react](https://reactflow.dev/) (React Flow)
- **Visuals**: [Three.js](https://threejs.org/), [GSAP](https://gsap.com/), [Postprocessing](https://pmndrs.github.io/postprocessing/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Routing**: [React Router DOM](https://reactrouter.com/)

## 🛠️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [NPM](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)

### Installation

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the `client` root and add your backend URL:
   ```env
   VITE_API_URL=http://localhost:3000/api
   ```

### Development

Run the development server:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

## 📂 Project Structure

- `src/assets/`: Static assets and images.
- `src/components/`: Reusable UI components (Navbar, Nodes, Backgrounds).
- `src/pages/`: Main application pages (Home, Canvas, Login, etc.).
- `src/App.jsx`: Main routing and application layout.
- `src/main.jsx`: Application entry point.

## 🔧 Environment Variables

The client requires the following environment variable:

- `VITE_API_URL`: The base URL for the NodeAI backend API.

---

Built with ❤️ by **Subham Banerjee** for AI enthusiasts.
