/**
 * Markdown Generator Utility
 * Produces a professional GitHub-flavoured Markdown document from project architecture.
 *
 * @param {object} project - Mongoose project document (plain object)
 * @returns {string} Markdown text
 */
export const generateMarkdown = (project) => {
  const arch = project.architecture || {};
  const aiMeta = project.aiMetadata || arch.aiMetadata || {};

  const generatedDate = project.createdAt
    ? new Date(project.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  const aiProviderLabel =
    aiMeta.provider === "nvidia"
      ? `NVIDIA Nemotron (${aiMeta.model || "Nemotron"})`
      : `Google Gemini (${aiMeta.model || "gemini-2.5-flash"})`;

  // Helper: array to bullet list
  const bulletList = (items = [], fallback = "_Not specified_") => {
    if (!Array.isArray(items) || items.length === 0) return fallback;
    return items.map((i) => `- ${i}`).join("\n");
  };

  // Requirements
  const functional = arch.requirements?.functional || [];
  const nonFunctional = arch.requirements?.nonFunctional || [];

  // Tech stack sections
  const frontendItems = arch.frontend?.recommended || [];
  const backendItems = arch.backend?.recommended || [];
  const dbPrimary = arch.database?.primary || "_Not specified_";
  const dbAdditional = arch.database?.additional || [];
  const dbReasoning = arch.database?.reasoning || "";
  const authStrategy = arch.authentication?.strategy || "_Not specified_";
  const authRecommendations = arch.authentication?.recommendations || [];
  const cloudProvider = arch.cloud?.provider || "_Not specified_";
  const cloudServices = arch.cloud?.services || [];
  const devopsContainers = arch.devops?.containerization || [];
  const devopsCiCd = arch.devops?.ciCd || [];
  const devopsMonitoring = arch.devops?.monitoring || [];
  const security = arch.security || [];
  const scalability = arch.scalability || [];
  const components = arch.components || [];
  const dataFlow = arch.dataFlow || [];

  // Build component table
  const componentTable =
    components.length > 0
      ? [
          "| Component | Type | Technology | Description |",
          "|-----------|------|------------|-------------|",
          ...components.map(
            (c) =>
              `| **${c.name || "—"}** | \`${c.type || "service"}\` | ${c.technology || "—"} | ${c.description || "—"} |`
          ),
        ].join("\n")
      : "_No components defined._";

  // Build data flow table
  const dataFlowTable =
    dataFlow.length > 0
      ? [
          "| Source | → | Target | Protocol / Label | Description |",
          "|--------|---|--------|-----------------|-------------|",
          ...dataFlow.map(
            (f) =>
              `| \`${f.source || "—"}\` | → | \`${f.target || "—"}\` | ${f.label || "—"} | ${f.description || "—"} |`
          ),
        ].join("\n")
      : "_No data flow defined._";

  return `# ${project.title}

> **Generated:** ${generatedDate}  
> **AI Provider:** ${aiProviderLabel}  
> **Project Type:** ${project.projectType || "Web Application"}  
> **Expected Scale:** ${project.expectedScale || "Standard"}  
> **Cloud Platform:** ${project.preferredCloud || "No Preference"}  
> **Database Preference:** ${project.preferredDatabase || "No Preference"}

---

## Summary

${arch.summary || project.description || "_No summary available._"}

---

## Requirements

### Functional Requirements

${bulletList(functional, "_No functional requirements specified._")}

### Non-Functional Requirements

${bulletList(nonFunctional, "_No non-functional requirements specified._")}

---

## Architecture Pattern

**Pattern:** ${arch.architecture?.pattern || "_Not specified_"}

${arch.architecture?.description || ""}

---

## Technology Stack

### Frontend

${bulletList(frontendItems, "_Not specified_")}

${arch.frontend?.reasoning ? `> ${arch.frontend.reasoning}` : ""}

### Backend

${bulletList(backendItems, "_Not specified_")}

${arch.backend?.reasoning ? `> ${arch.backend.reasoning}` : ""}

### Database

**Primary:** ${dbPrimary}

${dbAdditional.length > 0 ? `**Additional:**\n${bulletList(dbAdditional)}` : ""}

${dbReasoning ? `> ${dbReasoning}` : ""}

### Authentication

**Strategy:** ${authStrategy}

${bulletList(authRecommendations)}

### Cloud Platform

**Provider:** ${cloudProvider}

${bulletList(cloudServices)}

### DevOps & CI/CD

**Containerization:**
${bulletList(devopsContainers)}

**CI/CD Pipeline:**
${bulletList(devopsCiCd)}

**Monitoring:**
${bulletList(devopsMonitoring)}

---

## Security

${bulletList(security, "_No security specifications defined._")}

---

## Scalability

${bulletList(scalability, "_No scalability specifications defined._")}

---

## System Components

${componentTable}

---

## Data Flow

${dataFlowTable}

---

${project.constraints ? `## Constraints\n\n${project.constraints}\n\n---\n\n` : ""}_Generated by **AI-Powered System Architecture Generator**_  
_Export Date: ${new Date().toISOString()}_
`;
};
