import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  ShadingType,
  BorderStyle,
  Header,
  Footer,
  PageNumber,
  NumberFormat,
  convertInchesToTwip,
  LevelFormat,
  UnderlineType,
} from "docx";

/**
 * DOCX Generator Utility
 * Generates a Microsoft Word document (.docx) from project architecture.
 *
 * @param {object} project - Mongoose project document (plain object)
 * @returns {Promise<Buffer>} DOCX binary buffer
 */
export const generateDOCX = async (project) => {
  const arch = project.architecture || {};
  const aiMeta = project.aiMetadata || arch.aiMetadata || {};

  const generatedDate = new Date(project.createdAt || Date.now()).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const aiProviderLabel =
    aiMeta.provider === "nvidia"
      ? `NVIDIA Nemotron (${aiMeta.model || "Nemotron"})`
      : `Google Gemini (${aiMeta.model || "gemini-2.5-flash"})`;

  // ── Colour constants (hex without #) ──────────────────────────────────────
  const INDIGO = "4F46E5";
  const PURPLE = "7C3AED";
  const SLATE_MID = "475569";
  const SLATE_LIGHT = "94A3B8";
  const WHITE = "FFFFFF";
  const BG_LIGHT = "F8FAFC";
  const EMERALD = "059669";
  const CYAN = "0891B2";
  const ORANGE = "EA580C";
  const ROSE = "E11D48";

  // ── Helpers ───────────────────────────────────────────────────────────────

  const safeStr = (val, fallback = "Not specified") =>
    val && String(val).trim() ? String(val).trim() : fallback;

  const safeArray = (val) => (Array.isArray(val) && val.length > 0 ? val : null);

  /** Build a heading paragraph */
  const heading1 = (text) =>
    new Paragraph({
      text,
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 300, after: 120 },
    });

  const heading2 = (text, colorHex = INDIGO) =>
    new Paragraph({
      children: [
        new TextRun({
          text,
          bold: true,
          color: colorHex,
          size: 24,
        }),
      ],
      spacing: { before: 240, after: 80 },
      border: {
        bottom: { color: colorHex, size: 6, style: BorderStyle.SINGLE },
      },
    });

  const heading3 = (text, colorHex = SLATE_MID) =>
    new Paragraph({
      children: [
        new TextRun({
          text,
          bold: true,
          color: colorHex,
          size: 20,
        }),
      ],
      spacing: { before: 160, after: 60 },
    });

  /** Normal body paragraph */
  const bodyParagraph = (text, colorHex = "1E293B") =>
    new Paragraph({
      children: [
        new TextRun({
          text: safeStr(text),
          color: colorHex,
          size: 18,
        }),
      ],
      spacing: { after: 80 },
    });

  /** Bullet item */
  const bulletItem = (text, colorHex = SLATE_MID) =>
    new Paragraph({
      children: [
        new TextRun({
          text: safeStr(text),
          color: colorHex,
          size: 18,
        }),
      ],
      bullet: { level: 0 },
      spacing: { after: 40 },
    });

  /** Build bullet list section or fallback */
  const bulletSection = (items, fallback = "Not specified", colorHex = SLATE_MID) => {
    if (!safeArray(items)) return [bodyParagraph(fallback, SLATE_LIGHT)];
    return items.map((item) => bulletItem(item, colorHex));
  };

  /** Key-value info row */
  const infoRow = (key, value) =>
    new Paragraph({
      children: [
        new TextRun({ text: `${key}: `, bold: true, color: SLATE_MID, size: 18 }),
        new TextRun({ text: safeStr(value), color: "1E293B", size: 18 }),
      ],
      spacing: { after: 60 },
    });

  /** Spacer */
  const spacer = (lines = 1) =>
    new Paragraph({ text: "", spacing: { after: lines * 100 } });

  // ── Table Builders ─────────────────────────────────────────────────────────

  /** Build a styled table header cell */
  const headerCell = (text, colorHex = INDIGO) =>
    new TableCell({
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text,
              bold: true,
              color: WHITE,
              size: 18,
            }),
          ],
          alignment: AlignmentType.LEFT,
        }),
      ],
      shading: {
        fill: colorHex,
        type: ShadingType.CLEAR,
        color: "auto",
      },
      margins: { top: 60, bottom: 60, left: 80, right: 80 },
    });

  /** Build a styled table data cell */
  const dataCell = (text, bold = false, colorHex = "1E293B", bgColor = WHITE) =>
    new TableCell({
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text: safeStr(text, "—"),
              bold,
              color: colorHex,
              size: 17,
            }),
          ],
        }),
      ],
      shading: { fill: bgColor, type: ShadingType.CLEAR, color: "auto" },
      margins: { top: 50, bottom: 50, left: 80, right: 80 },
    });

  /** Build system components table */
  const buildComponentsTable = (components) => {
    if (!safeArray(components)) return [bodyParagraph("No components defined.", SLATE_LIGHT)];

    const headerRow = new TableRow({
      children: [
        headerCell("Component", INDIGO),
        headerCell("Type", INDIGO),
        headerCell("Technology", INDIGO),
        headerCell("Description", INDIGO),
      ],
      tableHeader: true,
    });

    const dataRows = components.map((comp, idx) => {
      const bg = idx % 2 === 0 ? WHITE : BG_LIGHT;
      return new TableRow({
        children: [
          dataCell(comp.name, true, "1E293B", bg),
          dataCell(comp.type || "service", false, INDIGO, bg),
          dataCell(comp.technology, false, SLATE_MID, bg),
          dataCell(comp.description, false, SLATE_MID, bg),
        ],
      });
    });

    return [
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [headerRow, ...dataRows],
        margins: { top: 0, bottom: 0, left: 0, right: 0 },
      }),
      spacer(),
    ];
  };

  /** Build data flow table */
  const buildDataFlowTable = (dataFlow) => {
    if (!safeArray(dataFlow)) return [bodyParagraph("No data flow defined.", SLATE_LIGHT)];

    const headerRow = new TableRow({
      children: [
        headerCell("Source", PURPLE),
        headerCell("Target", PURPLE),
        headerCell("Protocol / Label", PURPLE),
        headerCell("Description", PURPLE),
      ],
      tableHeader: true,
    });

    const dataRows = dataFlow.map((flow, idx) => {
      const bg = idx % 2 === 0 ? WHITE : BG_LIGHT;
      return new TableRow({
        children: [
          dataCell(flow.source, true, INDIGO, bg),
          dataCell(flow.target, true, INDIGO, bg),
          dataCell(flow.label, false, SLATE_MID, bg),
          dataCell(flow.description, false, SLATE_MID, bg),
        ],
      });
    });

    return [
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [headerRow, ...dataRows],
        margins: { top: 0, bottom: 0, left: 0, right: 0 },
      }),
      spacer(),
    ];
  };

  // ── Document Assembly ─────────────────────────────────────────────────────

  const documentChildren = [
    // ─── Cover / Title ───────────────────────────────────────────────────────
    new Paragraph({
      children: [
        new TextRun({
          text: project.title,
          bold: true,
          color: INDIGO,
          size: 52,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 800, after: 200 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: "System Architecture Blueprint",
          color: PURPLE,
          size: 28,
          italics: true,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    }),

    spacer(2),

    // ─── Project Metadata ────────────────────────────────────────────────────
    infoRow("Generated On", generatedDate),
    infoRow("AI Provider", aiProviderLabel),
    infoRow("Project Type", project.projectType || "Web Application"),
    infoRow("Expected Scale", project.expectedScale || "Standard"),
    infoRow("Cloud Platform", project.preferredCloud || "No Preference"),
    infoRow("Primary Database", project.preferredDatabase || "No Preference"),

    spacer(2),

    // ─── Executive Summary ───────────────────────────────────────────────────
    heading2("Executive Summary", INDIGO),
    bodyParagraph(arch.summary || project.description),

    // ─── Architecture Pattern ────────────────────────────────────────────────
    heading2("Architecture Pattern", PURPLE),
    new Paragraph({
      children: [
        new TextRun({
          text: safeStr(arch.architecture?.pattern, "Client-Server Architecture"),
          bold: true,
          size: 22,
          color: PURPLE,
        }),
      ],
      spacing: { after: 80 },
    }),
    bodyParagraph(arch.architecture?.description),

    // ─── Requirements ────────────────────────────────────────────────────────
    heading2("Requirements", CYAN),

    heading3("Functional Requirements", CYAN),
    ...bulletSection(arch.requirements?.functional, "No functional requirements specified.", CYAN),

    heading3("Non-Functional Requirements", CYAN),
    ...bulletSection(arch.requirements?.nonFunctional, "No non-functional requirements specified.", SLATE_MID),

    // ─── Technology Stack ────────────────────────────────────────────────────
    heading2("Technology Stack", EMERALD),

    heading3("Frontend", EMERALD),
    ...bulletSection(arch.frontend?.recommended, "Not specified.", EMERALD),
    ...(arch.frontend?.reasoning
      ? [bodyParagraph(`Rationale: ${arch.frontend.reasoning}`, SLATE_MID)]
      : []),

    heading3("Backend", INDIGO),
    ...bulletSection(arch.backend?.recommended, "Not specified.", INDIGO),
    ...(arch.backend?.reasoning
      ? [bodyParagraph(`Rationale: ${arch.backend.reasoning}`, SLATE_MID)]
      : []),

    heading3("Database", PURPLE),
    infoRow("Primary Database", arch.database?.primary),
    ...bulletSection(arch.database?.additional, "No additional databases specified.", SLATE_MID),
    ...(arch.database?.reasoning
      ? [bodyParagraph(`Rationale: ${arch.database.reasoning}`, SLATE_MID)]
      : []),

    heading3("Authentication", CYAN),
    infoRow("Strategy", arch.authentication?.strategy),
    ...bulletSection(arch.authentication?.recommendations, "No authentication details specified.", SLATE_MID),

    heading3("Cloud Platform", ORANGE),
    infoRow("Provider", arch.cloud?.provider),
    ...bulletSection(arch.cloud?.services, "No cloud services specified.", SLATE_MID),

    heading3("DevOps & CI/CD", ORANGE),
    ...(safeArray(arch.devops?.containerization)
      ? [new Paragraph({ children: [new TextRun({ text: "Containerization:", bold: true, size: 18, color: ORANGE })], spacing: { after: 40 } }),
         ...arch.devops.containerization.map((i) => bulletItem(i, SLATE_MID))]
      : []),
    ...(safeArray(arch.devops?.ciCd)
      ? [new Paragraph({ children: [new TextRun({ text: "CI/CD Pipeline:", bold: true, size: 18, color: ORANGE })], spacing: { after: 40 } }),
         ...arch.devops.ciCd.map((i) => bulletItem(i, SLATE_MID))]
      : []),
    ...(safeArray(arch.devops?.monitoring)
      ? [new Paragraph({ children: [new TextRun({ text: "Monitoring:", bold: true, size: 18, color: ORANGE })], spacing: { after: 40 } }),
         ...arch.devops.monitoring.map((i) => bulletItem(i, SLATE_MID))]
      : []),

    // ─── Security ────────────────────────────────────────────────────────────
    heading2("Security", ROSE),
    ...bulletSection(arch.security, "No security specifications defined.", ROSE),

    // ─── Scalability ─────────────────────────────────────────────────────────
    heading2("Scalability", EMERALD),
    ...bulletSection(arch.scalability, "No scalability specifications defined.", EMERALD),

    // ─── System Components ───────────────────────────────────────────────────
    heading2("System Components", INDIGO),
    ...buildComponentsTable(arch.components),

    // ─── Data Flow ───────────────────────────────────────────────────────────
    heading2("Data Flow", PURPLE),
    ...buildDataFlowTable(arch.dataFlow),

    // ─── Constraints ─────────────────────────────────────────────────────────
    ...(project.constraints && project.constraints.trim()
      ? [heading2("Constraints & Notes", SLATE_MID), bodyParagraph(project.constraints)]
      : []),

    // ─── Footer notice ────────────────────────────────────────────────────────
    spacer(2),
    new Paragraph({
      children: [
        new TextRun({
          text: `Generated by AI-Powered System Architecture Generator  •  ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`,
          italics: true,
          color: SLATE_LIGHT,
          size: 16,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 200 },
      border: {
        top: { color: SLATE_LIGHT, size: 4, style: BorderStyle.SINGLE },
      },
    }),
  ];

  const doc = new Document({
    creator: "AI-Powered System Architecture Generator",
    title: project.title,
    description: `Architecture Blueprint for ${project.title}`,
    styles: {
      default: {
        document: {
          run: {
            font: "Calibri",
            size: 18,
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(1),
              bottom: convertInchesToTwip(1),
              left: convertInchesToTwip(1.2),
              right: convertInchesToTwip(1.2),
            },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${project.title} — Architecture Blueprint`,
                    color: SLATE_LIGHT,
                    size: 16,
                    italics: true,
                  }),
                ],
                alignment: AlignmentType.RIGHT,
                border: {
                  bottom: { color: SLATE_LIGHT, size: 4, style: BorderStyle.SINGLE },
                },
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Generated using AI-Powered System Architecture Generator",
                    color: SLATE_LIGHT,
                    size: 14,
                    italics: true,
                  }),
                ],
                alignment: AlignmentType.CENTER,
                border: {
                  top: { color: SLATE_LIGHT, size: 4, style: BorderStyle.SINGLE },
                },
              }),
            ],
          }),
        },
        children: documentChildren,
      },
    ],
  });

  return await Packer.toBuffer(doc);
};
