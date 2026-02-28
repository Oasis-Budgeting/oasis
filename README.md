# Oasis (formerly Bucket Budget)

![Oasis Banner](https://via.placeholder.com/800x200.png?text=Oasis+-+Self-Hosted+Envelope+Budgeting)

A beautifully designed, self-hosted envelope budgeting application tailored for simplicity, dynamic financial planning, and seamless local AI integration. Designed specifically to run on minimal hardware like the Raspberry Pi 4B (arm64 architecture) as well as any standard Docker-capable system.

## ✨ Features

- **Envelope Budgeting Made Easy:** Track your expenses effortlessly by categorizing funds into dedicated "envelopes" (buckets).
- **Personalized AI Financial Guidance:** 
  - Integrated local AI features connecting to powerful local LLMs via Ollama and LM Studio.
  - Export capabilities purposefully formatted to be LLM-understandable for tailored financial advice.
- **Beautiful & Dynamic UI:** 
  - A responsive, premium dark-mode-first React interface built with Tailwind CSS, Shadcn UI / Radix UI, and Framer Motion for buttery-smooth micro-animations.
  - Interactive, insight-rich data visualizations using Recharts.
- **Secure Authentication:** Built-in JWT-based user registration and login to keep your financial data private.
- **Self-Hosted & Lightweight:** 
  - Effortless deployment via Docker & Docker Compose.
  - Multi-architecture Docker image support natively built for `linux/amd64` and `linux/arm64`.

## 🛠️ Tech Stack

### Frontend
- React 19 & Vite
- Tailwind CSS & Tailwind Merge/Animate
- Radix UI Primitives & Lucide Icons
- Framer Motion (Animations)
- Recharts (Data Visualization)
- Zod & React Hook Form (Validation)

### Backend
- Node.js & Fastify (Extremely fast web framework)
- SQLite3 (Local, lightweight database)
- Knex.js (Query builder)
- Flyway (Database migrations via `node-flywaydb`)
- JWT & bcryptjs (Security & Auth)
- Prometheus (`prom-client`) for observability

## 🚀 Getting Started

The easiest way to get Oasis running is by using Docker Compose.

### Prerequisites
- Docker and Docker Compose installed on your machine.

### Quick Start (Docker)

1. Create a `docker-compose.yml` file:

```yaml
services:
  oasis:
    image: ghcr.io/suryavamsi6/bucket-budget:latest
    container_name: oasis
    ports:
      - "3000:3000"
    volumes:
      - ./data:/app/data
    restart: unless-stopped
    healthcheck:
      test: [ "CMD", "wget", "--spider", "-q", "http://localhost:3000/api/accounts" ]
      interval: 30s
      timeout: 10s
      retries: 3
```

2. Start the container:
```bash
docker-compose up -d
```

3. Access the application in your browser at `http://localhost:3000`.

## 💻 Local Development

If you prefer to run the application locally without Docker, or if you want to contribute:

### Prerequisites
- Node.js (v20+ recommended)
- Java (Required by Flyway for local database migrations)

### 1. Setup the Backend API

```bash
cd api
npm install
npm run migrate # Run Flyway schema migrations
npm run dev     # Start the Fastify server with watch mode
```

### 2. Setup the Frontend UI

Open a new terminal session:

```bash
cd ui
npm install
npm run dev     # Start the Vite development server
```

The frontend will be available at `http://localhost:5173` (or the port specified by Vite) and will proxy requests to the backend.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

[ISC / MIT] (Please update according to your specific license requirements).