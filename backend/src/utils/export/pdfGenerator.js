import PDFDocument from "pdfkit";

/**
 * PDF Generator Utility
 * Generates a professional PDF report using pdfkit.
 *
 * @param {object} project - Mongoose project document (plain object)
 * @returns {Promise<Buffer>} PDF binary buffer
 */
export const generatePDF = (project) => {
  return new Promise((resolve, reject) => {
    try {
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

      // ── Colours & Fonts ─────────────────────────────────────────────────────
      const INDIGO = "#4F46E5";
      const SLATE_DARK = "#1E293B";
      const SLATE_MID = "#475569";
      const SLATE_LIGHT = "#94A3B8";
      const WHITE = "#FFFFFF";
      const BG_LIGHT = "#F8FAFC";
      const BORDER = "#E2E8F0";
      const EMERALD = "#059669";
      const PURPLE = "#7C3AED";
      const CYAN = "#0891B2";
      const ORANGE = "#EA580C";
      const ROSE = "#E11D48";

      // ── Helpers ──────────────────────────────────────────────────────────────
      const safeArray = (val) => (Array.isArray(val) && val.length > 0 ? val : null);
      const safeStr = (val, fallback = "Not specified") =>
        val && String(val).trim() ? String(val).trim() : fallback;

      const doc = new PDFDocument({
        size: "A4",
        margin: 50,
        info: {
          Title: project.title,
          Author: "AI-Powered System Architecture Generator",
          Subject: "Architecture Blueprint",
          Keywords: "architecture, system design, blueprint",
          CreationDate: new Date(),
        },
      });

      const chunks = [];
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      const pageWidth = doc.page.width - 100; // margins on both sides

      // ── Helper Renderers ──────────────────────────────────────────────────────

      /** Draw page footer */
      const drawFooter = () => {
        const y = doc.page.height - 40;
        doc
          .save()
          .moveTo(50, y - 8)
          .lineTo(doc.page.width - 50, y - 8)
          .strokeColor(BORDER)
          .lineWidth(0.5)
          .stroke()
          .fontSize(7)
          .fillColor(SLATE_LIGHT)
          .text(
            "Generated using AI-Powered System Architecture Generator",
            50,
            y,
            { align: "center", width: pageWidth }
          )
          .restore();
      };

      /** Add a new page with footer hook */
      const addPage = () => {
        doc.addPage();
        drawFooter();
      };

      /** Section heading block */
      const sectionHeading = (title, color = INDIGO) => {
        doc
          .moveDown(0.8)
          .fontSize(11)
          .fillColor(color)
          .font("Helvetica-Bold")
          .text(title.toUpperCase(), { underline: false })
          .moveDown(0.15);
        doc
          .moveTo(50, doc.y)
          .lineTo(50 + pageWidth, doc.y)
          .strokeColor(color)
          .lineWidth(1.5)
          .stroke();
        doc.moveDown(0.4);
      };

      /** Sub heading */
      const subHeading = (title, color = SLATE_DARK) => {
        doc
          .moveDown(0.5)
          .fontSize(9)
          .fillColor(color)
          .font("Helvetica-Bold")
          .text(title)
          .moveDown(0.2);
      };

      /** Body text paragraph */
      const bodyText = (text, color = SLATE_MID) => {
        doc
          .fontSize(9)
          .fillColor(color)
          .font("Helvetica")
          .text(safeStr(text), { lineGap: 2 })
          .moveDown(0.3);
      };

      /** Bullet list */
      const bulletList = (items = [], color = SLATE_MID) => {
        if (!safeArray(items)) {
          bodyText("Not specified");
          return;
        }
        items.forEach((item) => {
          doc
            .fontSize(9)
            .fillColor(color)
            .font("Helvetica")
            .text(`• ${item}`, { indent: 12, lineGap: 2 });
        });
        doc.moveDown(0.3);
      };

      /** Numbered list */
      const numberedList = (items = [], color = SLATE_MID) => {
        if (!safeArray(items)) {
          bodyText("Not specified");
          return;
        }
        items.forEach((item, idx) => {
          doc
            .fontSize(9)
            .fillColor(color)
            .font("Helvetica")
            .text(`${idx + 1}. ${item}`, { indent: 12, lineGap: 2 });
        });
        doc.moveDown(0.3);
      };

      /** Key-value info row */
      const infoRow = (key, value) => {
        const startY = doc.y;
        doc.fontSize(9).fillColor(SLATE_MID).font("Helvetica-Bold").text(`${key}:`, 50, startY, {
          continued: true,
          width: 140,
        });
        doc
          .font("Helvetica")
          .fillColor(SLATE_DARK)
          .text(` ${safeStr(value)}`, { lineGap: 1 });
        doc.moveDown(0.15);
      };

      // ══════════════════════════════════════════════════════════════════════════
      // COVER PAGE
      // ══════════════════════════════════════════════════════════════════════════

      // Cover banner background
      doc
        .save()
        .rect(0, 0, doc.page.width, 200)
        .fill(INDIGO)
        .restore();

      // Cover gradient band
      doc
        .save()
        .rect(0, 200, doc.page.width, 6)
        .fill(PURPLE)
        .restore();

      // Cover title
      doc
        .fontSize(26)
        .fillColor(WHITE)
        .font("Helvetica-Bold")
        .text(project.title, 50, 60, { align: "center", width: pageWidth });

      doc
        .fontSize(13)
        .fillColor("#C7D2FE")
        .font("Helvetica")
        .text("System Architecture Blueprint", 50, 120, { align: "center", width: pageWidth });

      doc
        .fontSize(9)
        .fillColor("#A5B4FC")
        .text(`Prepared by AI-Powered System Architecture Generator`, 50, 148, {
          align: "center",
          width: pageWidth,
        });

      // Cover metadata card
      const cardY = 230;
      doc
        .save()
        .roundedRect(50, cardY, pageWidth, 130, 6)
        .fill(BG_LIGHT)
        .restore();

      doc
        .save()
        .roundedRect(50, cardY, pageWidth, 130, 6)
        .strokeColor(BORDER)
        .lineWidth(1)
        .stroke()
        .restore();

      doc.moveDown(0);
      const metaLeft = 70;
      const metaRight = 50 + pageWidth / 2 + 10;
      const metaY = cardY + 18;

      doc.fontSize(9).font("Helvetica-Bold").fillColor(INDIGO).text("PROJECT OVERVIEW", metaLeft, metaY);
      doc.moveDown(0.6);

      const rowSpacing = 17;
      const rows = [
        ["Generated On", generatedDate],
        ["AI Provider", aiProviderLabel],
        ["Project Type", project.projectType || "Web Application"],
        ["Expected Scale", project.expectedScale || "Standard"],
        ["Cloud Platform", project.preferredCloud || "No Preference"],
        ["Primary Database", project.preferredDatabase || "No Preference"],
      ];

      rows.forEach(([key, val], idx) => {
        const ry = metaY + 22 + idx * rowSpacing;
        const col = idx % 2 === 0 ? metaLeft : metaRight;
        const rrow = Math.floor(idx / 2);
        const ry2 = metaY + 22 + rrow * rowSpacing;
        if (idx < 4) {
          doc.fontSize(8).fillColor(SLATE_MID).font("Helvetica-Bold").text(`${key}:`, metaLeft, ry2 + (idx % 2 === 0 ? 0 : 0), { continued: true, width: 120 });
          doc.font("Helvetica").fillColor(SLATE_DARK).text(` ${val}`);
        }
      });

      // Simpler two-column layout
      const col1x = metaLeft;
      const col2x = metaLeft + pageWidth / 2;
      const startMetaY = metaY + 20;
      const metaRows = [
        [["Generated On", generatedDate], ["AI Provider", aiProviderLabel]],
        [["Project Type", project.projectType || "Web Application"], ["Expected Scale", project.expectedScale || "Standard"]],
        [["Cloud Platform", project.preferredCloud || "No Preference"], ["Database", project.preferredDatabase || "No Preference"]],
      ];

      // Reset and draw cleanly
      doc.y = metaY + 16;
      doc.fontSize(8);
      metaRows.forEach(([left, right]) => {
        const rowY = doc.y;
        doc.fillColor(SLATE_MID).font("Helvetica-Bold").text(`${left[0]}:`, col1x, rowY, { continued: true, width: 100 });
        doc.font("Helvetica").fillColor(SLATE_DARK).text(` ${left[1]}`, { width: pageWidth / 2 - 30 });
        const afterLeft = doc.y;
        doc.font("Helvetica-Bold").fillColor(SLATE_MID).text(`${right[0]}:`, col2x, rowY, { continued: true, width: 100 });
        doc.font("Helvetica").fillColor(SLATE_DARK).text(` ${right[1]}`, { width: pageWidth / 2 - 30 });
        doc.y = afterLeft + 2;
      });

      drawFooter();

      // ══════════════════════════════════════════════════════════════════════════
      // PAGE 2 – EXECUTIVE SUMMARY & REQUIREMENTS
      // ══════════════════════════════════════════════════════════════════════════

      addPage();

      // Page header label
      doc
        .fontSize(8)
        .fillColor(SLATE_LIGHT)
        .font("Helvetica")
        .text(`${project.title} — Architecture Blueprint`, 50, 50, { align: "right", width: pageWidth });

      doc.y = 72;

      sectionHeading("Executive Summary", INDIGO);
      bodyText(arch.summary || project.description);

      sectionHeading("Architecture Pattern", PURPLE);
      subHeading(safeStr(arch.architecture?.pattern, "Client-Server Architecture"), SLATE_DARK);
      bodyText(arch.architecture?.description);

      sectionHeading("Requirements", CYAN);
      subHeading("Functional Requirements", CYAN);
      numberedList(arch.requirements?.functional);
      subHeading("Non-Functional Requirements", CYAN);
      bulletList(arch.requirements?.nonFunctional);

      // ══════════════════════════════════════════════════════════════════════════
      // PAGE 3 – TECHNOLOGY STACK
      // ══════════════════════════════════════════════════════════════════════════

      addPage();
      doc.y = 72;
      doc.fontSize(8).fillColor(SLATE_LIGHT).font("Helvetica").text(`${project.title} — Architecture Blueprint`, 50, 50, { align: "right", width: pageWidth });

      sectionHeading("Technology Stack", EMERALD);

      subHeading("Frontend", EMERALD);
      bulletList(arch.frontend?.recommended);
      if (arch.frontend?.reasoning) bodyText(`Rationale: ${arch.frontend.reasoning}`);

      subHeading("Backend", INDIGO);
      bulletList(arch.backend?.recommended);
      if (arch.backend?.reasoning) bodyText(`Rationale: ${arch.backend.reasoning}`);

      subHeading("Database", PURPLE);
      if (arch.database?.primary) {
        doc.fontSize(9).fillColor(SLATE_MID).font("Helvetica-Bold").text("Primary: ", { continued: true });
        doc.font("Helvetica").fillColor(SLATE_DARK).text(arch.database.primary);
      }
      bulletList(arch.database?.additional);
      if (arch.database?.reasoning) bodyText(`Rationale: ${arch.database.reasoning}`);

      subHeading("Authentication", CYAN);
      if (arch.authentication?.strategy) {
        doc.fontSize(9).fillColor(SLATE_MID).font("Helvetica-Bold").text("Strategy: ", { continued: true });
        doc.font("Helvetica").fillColor(SLATE_DARK).text(arch.authentication.strategy);
        doc.moveDown(0.2);
      }
      bulletList(arch.authentication?.recommendations);

      subHeading("Cloud Platform", ORANGE);
      if (arch.cloud?.provider) {
        doc.fontSize(9).fillColor(SLATE_MID).font("Helvetica-Bold").text("Provider: ", { continued: true });
        doc.font("Helvetica").fillColor(SLATE_DARK).text(arch.cloud.provider);
        doc.moveDown(0.2);
      }
      bulletList(arch.cloud?.services);

      subHeading("DevOps & CI/CD", ORANGE);
      if (safeArray(arch.devops?.containerization)) {
        doc.fontSize(8).fillColor(SLATE_MID).font("Helvetica-Bold").text("Containerization:");
        bulletList(arch.devops.containerization);
      }
      if (safeArray(arch.devops?.ciCd)) {
        doc.fontSize(8).fillColor(SLATE_MID).font("Helvetica-Bold").text("CI/CD Pipeline:");
        bulletList(arch.devops.ciCd);
      }
      if (safeArray(arch.devops?.monitoring)) {
        doc.fontSize(8).fillColor(SLATE_MID).font("Helvetica-Bold").text("Monitoring:");
        bulletList(arch.devops.monitoring);
      }

      // ══════════════════════════════════════════════════════════════════════════
      // PAGE 4 – SECURITY, SCALABILITY, SYSTEM COMPONENTS
      // ══════════════════════════════════════════════════════════════════════════

      addPage();
      doc.y = 72;
      doc.fontSize(8).fillColor(SLATE_LIGHT).font("Helvetica").text(`${project.title} — Architecture Blueprint`, 50, 50, { align: "right", width: pageWidth });

      sectionHeading("Security", ROSE);
      bulletList(arch.security);

      sectionHeading("Scalability", EMERALD);
      bulletList(arch.scalability);

      sectionHeading("System Components", INDIGO);
      const components = arch.components || [];

      if (components.length > 0) {
        // Table headers
        const colWidths = [
          Math.floor(pageWidth * 0.27),
          Math.floor(pageWidth * 0.13),
          Math.floor(pageWidth * 0.22),
          Math.floor(pageWidth * 0.38),
        ];
        const tableHeaders = ["Component", "Type", "Technology", "Description"];
        const tableX = 50;
        let tableY = doc.y;

        // Header row
        doc
          .save()
          .rect(tableX, tableY, pageWidth, 18)
          .fill(INDIGO)
          .restore();

        let cx = tableX + 4;
        tableHeaders.forEach((h, i) => {
          doc
            .fontSize(8)
            .fillColor(WHITE)
            .font("Helvetica-Bold")
            .text(h, cx, tableY + 5, { width: colWidths[i] - 6, lineBreak: false });
          cx += colWidths[i];
        });

        tableY += 18;

        components.forEach((comp, rowIdx) => {
          const rowHeight = 28;
          const bgColor = rowIdx % 2 === 0 ? WHITE : BG_LIGHT;

          doc
            .save()
            .rect(tableX, tableY, pageWidth, rowHeight)
            .fill(bgColor)
            .restore();

          // Row border
          doc
            .save()
            .rect(tableX, tableY, pageWidth, rowHeight)
            .strokeColor(BORDER)
            .lineWidth(0.5)
            .stroke()
            .restore();

          const cellValues = [
            comp.name || "—",
            comp.type || "service",
            comp.technology || "—",
            comp.description || "—",
          ];

          cx = tableX + 4;
          cellValues.forEach((val, i) => {
            doc
              .fontSize(8)
              .fillColor(i === 0 ? SLATE_DARK : SLATE_MID)
              .font(i === 0 ? "Helvetica-Bold" : "Helvetica")
              .text(val, cx, tableY + 8, {
                width: colWidths[i] - 6,
                lineBreak: false,
                ellipsis: true,
              });
            cx += colWidths[i];
          });

          tableY += rowHeight;

          // Page break check
          if (tableY > doc.page.height - 80) {
            addPage();
            tableY = 72;
            doc.y = 72;
          }
        });

        doc.y = tableY + 8;
      } else {
        bodyText("No system components defined.");
      }

      // ══════════════════════════════════════════════════════════════════════════
      // PAGE 5 – DATA FLOW
      // ══════════════════════════════════════════════════════════════════════════

      addPage();
      doc.y = 72;
      doc.fontSize(8).fillColor(SLATE_LIGHT).font("Helvetica").text(`${project.title} — Architecture Blueprint`, 50, 50, { align: "right", width: pageWidth });

      sectionHeading("Data Flow", PURPLE);

      const dataFlow = arch.dataFlow || [];

      if (dataFlow.length > 0) {
        const dfColWidths = [
          Math.floor(pageWidth * 0.22),
          Math.floor(pageWidth * 0.22),
          Math.floor(pageWidth * 0.2),
          Math.floor(pageWidth * 0.36),
        ];
        const dfHeaders = ["Source", "Target", "Protocol / Label", "Description"];
        const tableX = 50;
        let tableY = doc.y;

        // Header row
        doc
          .save()
          .rect(tableX, tableY, pageWidth, 18)
          .fill(PURPLE)
          .restore();

        let cx = tableX + 4;
        dfHeaders.forEach((h, i) => {
          doc
            .fontSize(8)
            .fillColor(WHITE)
            .font("Helvetica-Bold")
            .text(h, cx, tableY + 5, { width: dfColWidths[i] - 6, lineBreak: false });
          cx += dfColWidths[i];
        });

        tableY += 18;

        dataFlow.forEach((flow, rowIdx) => {
          const rowHeight = 28;
          const bgColor = rowIdx % 2 === 0 ? WHITE : BG_LIGHT;

          doc
            .save()
            .rect(tableX, tableY, pageWidth, rowHeight)
            .fill(bgColor)
            .restore();

          doc
            .save()
            .rect(tableX, tableY, pageWidth, rowHeight)
            .strokeColor(BORDER)
            .lineWidth(0.5)
            .stroke()
            .restore();

          const cellValues = [
            flow.source || "—",
            flow.target || "—",
            flow.label || "—",
            flow.description || "—",
          ];

          cx = tableX + 4;
          cellValues.forEach((val, i) => {
            doc
              .fontSize(8)
              .fillColor(i < 2 ? INDIGO : SLATE_MID)
              .font(i < 2 ? "Helvetica-Bold" : "Helvetica")
              .text(val, cx, tableY + 8, {
                width: dfColWidths[i] - 6,
                lineBreak: false,
                ellipsis: true,
              });
            cx += dfColWidths[i];
          });

          tableY += rowHeight;

          if (tableY > doc.page.height - 80) {
            addPage();
            tableY = 72;
            doc.y = 72;
          }
        });

        doc.y = tableY + 8;
      } else {
        bodyText("No data flow steps defined.");
      }

      // Constraints page (optional)
      if (project.constraints && project.constraints.trim()) {
        addPage();
        doc.y = 72;
        doc.fontSize(8).fillColor(SLATE_LIGHT).font("Helvetica").text(`${project.title} — Architecture Blueprint`, 50, 50, { align: "right", width: pageWidth });
        sectionHeading("Constraints & Notes", SLATE_MID);
        bodyText(project.constraints);
      }

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};
