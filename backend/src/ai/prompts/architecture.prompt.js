const architecturePrompt = ({
  title,
  description,
  projectType = "Web Application",
  expectedScale = "Standard",
  preferredCloud = "No Preference",
  preferredDatabase = "No Preference",
  constraints = "",
}) => `
You are a Principal Software Architect.

Analyze the following software requirements and design a production-grade system architecture.

### PROJECT SPECIFICATIONS:
- Project Title: ${title}
- Description & Requirements: ${description}
- Project Type: ${projectType}
- Target Scale: ${expectedScale}
- Preferred Cloud Provider: ${preferredCloud}
- Preferred Database Strategy: ${preferredDatabase}
- Additional Technical Constraints: ${constraints || "None"}

### CRITICAL INSTRUCTIONS:
1. Return ONLY raw, valid JSON with NO markdown formatting (do NOT wrap in \`\`\`json codeblocks).
2. For "components", every component MUST have a unique, stable string "id" (e.g. "comp-frontend", "comp-api-gateway", "comp-backend", "comp-database", "comp-cache").
3. For "components", "type" MUST be one of: "frontend", "backend", "database", "cache", "gateway", "service", "queue", "storage", "external", "cloud", "ai", "other".
4. For "dataFlow", every "source" and "target" MUST reference a valid component "id" defined in the components array.

### REQUIRED JSON SCHEMA:
{
  "summary": "High level executive summary of the system architecture",
  "requirements": {
    "functional": ["List of core functional features derived from description"],
    "nonFunctional": ["List of non-functional requirements like latency, SLA, uptime"]
  },
  "architecture": {
    "pattern": "e.g. Microservices, Monolithic, Serverless, Event-Driven",
    "description": "Detailed justification for selecting this architectural pattern"
  },
  "frontend": {
    "recommended": ["Frontend frameworks, libraries, build tools"],
    "reasoning": "Explanation for frontend choices"
  },
  "backend": {
    "recommended": ["Backend runtimes, frameworks, API engines"],
    "reasoning": "Explanation for backend choices"
  },
  "database": {
    "primary": "Primary database engine",
    "additional": ["Caching layers, search engines, memory stores"],
    "reasoning": "Database strategy justification"
  },
  "apis": {
    "style": "RESTful / GraphQL / gRPC",
    "recommendations": ["Key API endpoints or design patterns"]
  },
  "authentication": {
    "strategy": "JWT / OAuth2 / Session",
    "recommendations": ["Security & token handling recommendations"]
  },
  "cloud": {
    "provider": "AWS / Azure / GCP / Cloud Agnostic",
    "services": ["Key cloud resources to provision"]
  },
  "devops": {
    "containerization": ["Docker / Kubernetes"],
    "ciCd": ["GitHub Actions / GitLab CI"],
    "monitoring": ["Prometheus / Grafana / Datadog"]
  },
  "security": ["List of key security measures and compliance practices"],
  "scalability": ["List of strategies for horizontal and vertical scaling"],
  "components": [
    {
      "id": "comp-frontend",
      "name": "Client Application",
      "type": "frontend",
      "description": "React Single Page Application interface",
      "technology": "React + Vite + Tailwind CSS"
    },
    {
      "id": "comp-api-gateway",
      "name": "API Gateway",
      "type": "gateway",
      "description": "Routes incoming requests and handles rate-limiting & JWT auth",
      "technology": "Express Gateway"
    },
    {
      "id": "comp-backend",
      "name": "Core Application Service",
      "type": "backend",
      "description": "Handles business logic and controller endpoints",
      "technology": "Node.js + Express"
    },
    {
      "id": "comp-database",
      "name": "Primary Database",
      "type": "database",
      "description": "Document storage for user & project metadata",
      "technology": "MongoDB + Mongoose"
    }
  ],
  "dataFlow": [
    {
      "source": "comp-frontend",
      "target": "comp-api-gateway",
      "label": "HTTPS JSON API Request",
      "description": "Client sends API requests with JWT authorization header"
    },
    {
      "source": "comp-api-gateway",
      "target": "comp-backend",
      "label": "Internal Proxy Call",
      "description": "Gateway validates token and forwards request to service"
    },
    {
      "source": "comp-backend",
      "target": "comp-database",
      "label": "MongoDB Query",
      "description": "Backend executes document reads and writes"
    }
  ]
}
`;

export default architecturePrompt;