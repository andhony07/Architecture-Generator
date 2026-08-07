import architecturePrompt from "./prompts/architecture.prompt.js";
import { generateWithGemini } from "./providers/gemini.provider.js";
import { generateWithNvidia } from "./providers/nvidia.provider.js";

/**
 * Clean raw text response from AI (strip ```json wrapper if present)
 */
const parseCleanJSON = (rawText) => {
  let cleaned = rawText.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  }
  return JSON.parse(cleaned);
};

/**
 * Normalize and validate architecture JSON structure & referential integrity
 */
const normalizeArchitectureJSON = (parsedData, project, metadata = {}) => {
  const title = project.title || project.projectName || "Software System";

  // Normalize components array & assign unique stable IDs if missing
  const rawComponents =
    Array.isArray(parsedData.components) && parsedData.components.length > 0
      ? parsedData.components
      : [
          {
            id: "comp-frontend",
            name: "Client Web Application",
            type: "frontend",
            technology: "React + Vite",
            description: "Frontend user interface",
          },
          {
            id: "comp-gateway",
            name: "API Gateway",
            type: "gateway",
            technology: "Express Gateway",
            description: "API Routing & Auth validation",
          },
          {
            id: "comp-backend",
            name: "Backend Application Engine",
            type: "backend",
            technology: "Node.js + Express",
            description: "Business logic server",
          },
          {
            id: "comp-database",
            name: "Primary Database Cluster",
            type: "database",
            technology: project.preferredDatabase || "MongoDB",
            description: "Primary data storage",
          },
        ];

  const components = rawComponents.map((comp, idx) => ({
    id: comp.id || `comp-${idx + 1}`,
    name: comp.name || `Component ${idx + 1}`,
    type: comp.type || "service",
    technology: comp.technology || comp.tech || "Custom Stack",
    description: comp.description || "System architecture component.",
  }));

  // Build lookup set of valid component IDs
  const validComponentIds = new Set(components.map((c) => c.id));
  const fallbackSourceId = components[0]?.id || "comp-1";
  const fallbackTargetId = components[components.length - 1]?.id || "comp-2";

  // Normalize dataFlow & verify referential integrity (source & target MUST exist in components)
  const rawDataFlow =
    Array.isArray(parsedData.dataFlow) && parsedData.dataFlow.length > 0
      ? parsedData.dataFlow
      : [
          {
            source: components[0]?.id,
            target: components[1]?.id || components[0]?.id,
            label: "HTTPS Request",
            description: "API Traffic Flow",
          },
          {
            source: components[1]?.id || components[0]?.id,
            target: components[2]?.id || components[0]?.id,
            label: "Internal Route",
            description: "Service Forwarding",
          },
          {
            source: components[2]?.id || components[0]?.id,
            target: components[3]?.id || components[0]?.id,
            label: "Database Query",
            description: "Data Read/Write",
          },
        ];

  const dataFlow = rawDataFlow.map((flow) => {
    const source = validComponentIds.has(flow.source)
      ? flow.source
      : fallbackSourceId;
    const target = validComponentIds.has(flow.target)
      ? flow.target
      : fallbackTargetId;
    return {
      source,
      target,
      label: flow.label || "Data Transfer",
      description: flow.description || `Data flow from ${source} to ${target}`,
    };
  });

  return {
    summary: parsedData.summary || `System architecture for ${title}`,
    requirements: {
      functional: Array.isArray(parsedData.requirements?.functional)
        ? parsedData.requirements.functional
        : [project.description],
      nonFunctional: Array.isArray(parsedData.requirements?.nonFunctional)
        ? parsedData.requirements.nonFunctional
        : ["High Availability", "Security Compliance", "Low Latency"],
    },
    architecture: {
      pattern: parsedData.architecture?.pattern || "Client-Server Microservices",
      description:
        parsedData.architecture?.description ||
        "Modular scalable full-stack architecture.",
    },
    frontend: {
      recommended: Array.isArray(parsedData.frontend?.recommended)
        ? parsedData.frontend.recommended
        : ["React", "Vite", "Tailwind CSS"],
      reasoning:
        parsedData.frontend?.reasoning || "Modern responsive client UI framework.",
    },
    backend: {
      recommended: Array.isArray(parsedData.backend?.recommended)
        ? parsedData.backend.recommended
        : ["Node.js", "Express.js"],
      reasoning:
        parsedData.backend?.reasoning ||
        "Event-driven asynchronous REST API engine.",
    },
    database: {
      primary:
        parsedData.database?.primary || project.preferredDatabase || "MongoDB",
      additional: Array.isArray(parsedData.database?.additional)
        ? parsedData.database.additional
        : ["Redis"],
      reasoning:
        parsedData.database?.reasoning ||
        "Document persistence with in-memory caching.",
    },
    apis: {
      style: parsedData.apis?.style || "RESTful API",
      recommendations: Array.isArray(parsedData.apis?.recommendations)
        ? parsedData.apis.recommendations
        : ["JSON Web Tokens", "Rate Limiting", "Input Validation"],
    },
    authentication: {
      strategy: parsedData.authentication?.strategy || "JWT Bearer Tokens",
      recommendations: Array.isArray(parsedData.authentication?.recommendations)
        ? parsedData.authentication.recommendations
        : ["Bcrypt password hashing", "HTTPS strictly enforced"],
    },
    cloud: {
      provider:
        parsedData.cloud?.provider || project.preferredCloud || "AWS / Cloud Agnostic",
      services: Array.isArray(parsedData.cloud?.services)
        ? parsedData.cloud.services
        : ["Container Service", "Managed Database", "Object Storage"],
    },
    devops: {
      containerization: Array.isArray(parsedData.devops?.containerization)
        ? parsedData.devops.containerization
        : ["Docker", "Docker Compose"],
      ciCd: Array.isArray(parsedData.devops?.ciCd)
        ? parsedData.devops.ciCd
        : ["GitHub Actions"],
      monitoring: Array.isArray(parsedData.devops?.monitoring)
        ? parsedData.devops.monitoring
        : ["Prometheus", "Grafana"],
    },
    security: Array.isArray(parsedData.security)
      ? parsedData.security
      : ["HTTPS encryption", "Sanitized inputs", "Secure CORS headers"],
    scalability: Array.isArray(parsedData.scalability)
      ? parsedData.scalability
      : ["Horizontal pod scaling", "Database indexing & read replicas"],
    components,
    dataFlow,
    aiMetadata: {
      provider: metadata.provider || "gemini",
      model: metadata.model || "gemini-2.5-flash",
    },
  };
};

export const generateArchitecture = async (projectData) => {
  const prompt = architecturePrompt(projectData);
  let rawResult = null;

  // Step 1: Attempt Primary Provider (Gemini)
  try {
    rawResult = await generateWithGemini(prompt);
    console.log(`[AI] Primary generation succeeded via ${rawResult.provider} (${rawResult.model})`);
  } catch (geminiError) {
    console.warn(
      `[AI] Primary provider (Gemini) failed: ${geminiError.message}. Triggering NVIDIA Nemotron fallback...`
    );

    // Step 2: Attempt Fallback Provider (NVIDIA Nemotron)
    try {
      rawResult = await generateWithNvidia(prompt);
      console.log(`[AI] Fallback generation succeeded via ${rawResult.provider} (${rawResult.model})`);
    } catch (nvidiaError) {
      console.error(`[AI] Fallback provider (NVIDIA Nemotron) failed:`, nvidiaError.message);
      throw new Error("AI architecture generation is temporarily unavailable. Please try again.");
    }
  }

  // Step 3: Validate & Normalize AI Output
  try {
    const parsedData = parseCleanJSON(rawResult.text);
    return normalizeArchitectureJSON(parsedData, projectData, {
      provider: rawResult.provider,
      model: rawResult.model,
    });
  } catch (parseError) {
    console.error(`[AI] JSON parsing error on ${rawResult.provider} output:`, parseError.message);
    return normalizeArchitectureJSON({}, projectData, {
      provider: rawResult.provider,
      model: rawResult.model,
    });
  }
};