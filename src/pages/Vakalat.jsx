// VakalatnamaEditor.jsx
// Dependencies: npm install jspdf
// Usage: import VakalatnamaEditor from "./VakalatnamaEditor"

import { useState, useRef, useCallback } from "react";
import jsPDF from "jspdf";

// ─── Constants ────────────────────────────────────────────────────────────────

const TIMES = "times";

const TYPE_STYLES = {
  heading:           { bg: "#e8eaf6", border: "#5c6bc0", dot: "#3949ab" },
  subheading:         { bg: "#e3f2fd", border: "#42a5f5", dot: "#1976d2" },
  normal:             { bg: "#f1f8e9", border: "#aed581", dot: "#558b2f" },
  "normal-list":      { bg: "#fff8e1", border: "#ffd54f", dot: "#f57f17" },
  "small-italic":     { bg: "#fce4ec", border: "#f48fb1", dot: "#c2185b" },
  "underline-center": { bg: "#f3e5f5", border: "#ce93d8", dot: "#7b1fa2" },
};

const DEFAULT_SECTIONS = [
  {
    id: "welfare",
    label: "Welfare Fund Note",
    type: "small-italic",
    text: "I/We am/are not a member/members of the Welfare Fund. Therefore a stamp of Rs.2/- is not affixed herewith.",
    align: "left",
    fontSize: 11,
    bold: false,
  },
  {
    id: "title",
    label: "Document Title",
    type: "heading",
    text: "VAKALATNAMA",
    align: "center",
    fontSize: 20,
    bold: true,
  },
  {
    id: "bail-no",
    label: "Bail Application No.",
    type: "normal",
    text: "Cri. Bail Appli. No.          /2026",
    align: "center",
    fontSize: 13,
    bold: false,
  },
  {
    id: "court",
    label: "Court Name",
    type: "subheading",
    text: "BEFORE THE HON'BLE SESSION JUDGE KOLHAPUR",
    align: "center",
    fontSize: 14,
    bold: true,
  },
  {
    id: "location",
    label: "Location",
    type: "subheading",
    text: "AT KOLHAPUR",
    align: "center",
    fontSize: 14,
    bold: true,
  },
  {
    id: "applicants",
    label: "Applicant Names",
    type: "normal-list",
    text: "1) Nilesh Laxman Yelgunde.\n2) Laxman Pralhad Yelgunde.\n3) Survana Laxman Yelgunde.\n4) Namrata Laxman Yelgunde.\n5) Raosaheb Apparao Narute.",
    align: "left",
    fontSize: 13,
    bold: false,
    suffix: "APPLICANTS.",
  },
  {
    id: "vs",
    label: "Versus",
    type: "normal",
    text: "Vs",
    align: "center",
    fontSize: 13,
    bold: false,
  },
  {
    id: "opponent",
    label: "Opponent",
    type: "subheading",
    text: "STATE OF MAHARASHTRA…………..OPPONENT.",
    align: "left",
    fontSize: 14,
    bold: true,
  },
  {
    id: "apptype",
    label: "Application Type",
    type: "underline-center",
    text: "Criminal bail Application u/s 482 of BNSS",
    align: "center",
    fontSize: 13,
    bold: false,
  },
  {
    id: "authorize-intro",
    label: "Authorization Intro",
    type: "normal",
    text: "I/We hereby above named Applicant do hereby appoint and authorize",
    align: "left",
    fontSize: 13,
    bold: false,
  },
  {
    id: "lead-adv",
    label: "Lead Advocate Details",
    type: "normal",
    text: "Adv. Udaysinh D. Patil, Reg No. MAH/2205/2004, Mob. 9922528288\nudpat88@gmail.com, Trimurti, plot no. 12, E, Saneguruji Housing Society, Ruikar colony, Kolhapur.",
    align: "left",
    fontSize: 13,
    bold: true,
  },
  {
    id: "adv-list",
    label: "Other Advocates",
    type: "normal",
    text: "Adv. P.B. Dalvi, MAH/1721/2006\nAdv. V.M. Kanari-Patil, MAH/4132/2017\nAdv. Shivam S. Patil, MAH/8436/2023\nAdv. Bharat S. Biradar, MAH/16140/2024\nAdv. M.A. Kadgave, MAH/4469/2025",
    align: "left",
    fontSize: 13,
    bold: false,
  },
  {
    id: "powers",
    label: "Powers Granted",
    type: "normal",
    text: "to appear, plead and to act, for me/us in the above matter, and to withdraw and receive moneys herein in and out of court, to pass effective receipt, to issue execution, settle or to compound the matter, to apply for an adjournment, to authorize any advocate to appear and to do all things incidental to the aforesaid purpose.",
    align: "justify",
    fontSize: 13,
    bold: false,
  },
  {
    id: "witness",
    label: "Witness Statement",
    type: "normal",
    text: "In witness whereof I/We have set my/our hand to this writing.",
    align: "left",
    fontSize: 13,
    bold: false,
  },
  {
    id: "date",
    label: "Date & Place",
    type: "normal",
    text: "Dated this         day of          April  2026\nKolhapur",
    align: "left",
    fontSize: 13,
    bold: false,
  },
];

// ─── PDF Generator ────────────────────────────────────────────────────────────

function generatePDF(sections) {
  // A4: 210mm × 297mm
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });

  const PAGE_W = 210;
  const PAGE_H = 297;
  const MARGIN_L = 20;
  const MARGIN_R = 20;
  const MARGIN_TOP = 18;
  const MARGIN_BOTTOM = 20;
  const USABLE_W = PAGE_W - MARGIN_L - MARGIN_R;

  let y = MARGIN_TOP;

  // ── helpers ──
  const needPage = (needed = 8) => {
    if (y + needed > PAGE_H - MARGIN_BOTTOM) {
      doc.addPage();
      y = MARGIN_TOP;
    }
  };

  const renderBlock = (s) => {
    const fs = Math.min(s.fontSize, 13);
    doc.setFontSize(fs);
    doc.setFont(
      TIMES,
      s.bold ? "bold" : s.type === "small-italic" ? "italic" : "normal"
    );

    const rawLines = s.text.split("\n");
    const allLines = rawLines.flatMap((line) =>
      doc.splitTextToSize(line, USABLE_W)
    );
    const lineH = fs * 0.45 + 1.2; // line height in mm

    allLines.forEach((line, idx) => {
      needPage(lineH + 2);

      if (s.align === "center") {
        doc.text(line, PAGE_W / 2, y, { align: "center" });
      } else if (s.align === "right") {
        doc.text(line, PAGE_W - MARGIN_R, y, { align: "right" });
      } else if (s.align === "justify" && idx < allLines.length - 1) {
        // Manual word-space justify
        const words = line.split(" ").filter(Boolean);
        if (words.length > 1) {
          const totalWordW = words.reduce(
            (acc, w) => acc + doc.getTextWidth(w),
            0
          );
          const gapW = (USABLE_W - totalWordW) / (words.length - 1);
          let cx = MARGIN_L;
          words.forEach((w) => {
            doc.text(w, cx, y);
            cx += doc.getTextWidth(w) + gapW;
          });
          y += lineH;
          return;
        }
        doc.text(line, MARGIN_L, y);
      } else {
        doc.text(line, MARGIN_L, y);
      }

      // Underline for underline-center type
      if (s.type === "underline-center") {
        const tw = doc.getTextWidth(line);
        const ulX = PAGE_W / 2 - tw / 2;
        doc.setLineWidth(0.3);
        doc.line(ulX, y + 0.9, ulX + tw, y + 0.9);
      }

      y += lineH;
    });

    // Suffix (e.g. "APPLICANTS." on the right)
    if (s.suffix) {
      doc.setFont(TIMES, "bold");
      doc.setFontSize(fs);
      // Place suffix aligned with the last line's y position
      const suffixY = y - (allLines.length > 0 ? 0 : 0);
      doc.text(s.suffix, PAGE_W - MARGIN_R, suffixY - lineH * allLines.length + lineH - 1, {
        align: "right",
      });
    }

    y += 2; // section gap
  };

  // ── Render all sections ──
  sections.forEach((s) => {
    if (s.type === "heading") {
      needPage(14);
      doc.setFontSize(16);
      doc.setFont(TIMES, "bold");
      doc.text(s.text, PAGE_W / 2, y, { align: "center" });
      y += 10;
    } else {
      renderBlock(s);
    }
  });

  // ── Signature block ──
 needPage(20);
  y += 6;

  // Left: advocate info
  doc.setFont(TIMES, "normal");
  doc.setFontSize(11);
  doc.text("Adv. for Applicants", MARGIN_L, y + 6);
  doc.text("Adv. Udaysinh D. Patil", MARGIN_L, y + 11);

  // Right: 1 signature line
  const SIG_RIGHT = PAGE_W - MARGIN_R;
  const SIG_LINE_W = 62;
  doc.setDrawColor(80);
  doc.setLineWidth(0.4);
  doc.line(SIG_RIGHT - SIG_LINE_W, y, SIG_RIGHT, y);

  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text("(Applicants' Signatures)", SIG_RIGHT, y + 5, { align: "right" });
  doc.setTextColor(0);

  // ── Save ──
  doc.save("Vakalatnama.pdf");
}

// ─── EditCard Component ───────────────────────────────────────────────────────

function EditCard({ section, isActive, onActivate, onChange }) {
  const ts = TYPE_STYLES[section.type];
  const taRef = useRef(null);
  const rows = Math.max(2, section.text.split("\n").length + (section.text.length > 60 ? 1 : 0));

  const handleCardClick = () => {
    onActivate();
    setTimeout(() => taRef.current?.focus(), 40);
  };

  return (
    <div
      onClick={handleCardClick}
      style={{
        background: isActive ? ts.bg : "#fff",
        border: `2px solid ${isActive ? ts.border : "#e2e8f0"}`,
        borderRadius: 14,
        padding: "14px 16px",
        marginBottom: 10,
        cursor: "pointer",
        transition: "all 0.15s",
        boxShadow: isActive
          ? `0 4px 16px ${ts.border}44`
          : "0 1px 4px rgba(0,0,0,0.06)",
      }}
    >
      {/* Label row */}
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: ts.dot,
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: ts.dot,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            fontFamily: "sans-serif",
          }}
        >
          {section.label}
        </span>
        {isActive && (
          <span
            style={{
              marginLeft: "auto",
              fontSize: 10,
              color: ts.dot,
              border: `1px solid ${ts.border}`,
              background: ts.bg,
              borderRadius: 20,
              padding: "1px 8px",
              fontFamily: "sans-serif",
            }}
          >
            editing
          </span>
        )}
      </div>

      {/* Textarea */}
      <textarea
        ref={taRef}
        value={section.text}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        onClick={(e) => e.stopPropagation()}
        style={{
          fontFamily: "'Times New Roman', Times, serif",
          fontSize: Math.min(section.fontSize, 14),
          fontWeight: section.bold ? "bold" : "normal",
          fontStyle: section.type === "small-italic" ? "italic" : "normal",
          textDecoration: section.type === "underline-center" ? "underline" : "none",
          textAlign: section.align === "justify" ? "left" : section.align,
          lineHeight: 1.6,
          width: "100%",
          background: "transparent",
          border: "none",
          outline: "none",
          resize: "none",
          color: "#1a1a2e",
          boxSizing: "border-box",
          padding: 0,
        }}
      />

      {/* Suffix */}
      {section.suffix && (
        <div
          style={{
            fontFamily: "'Times New Roman', Times, serif",
            fontSize: 12,
            fontWeight: "bold",
            color: "#333",
            textAlign: "right",
            marginTop: 4,
          }}
        >
          — {section.suffix}
        </div>
      )}
    </div>
  );
}

// ─── PreviewDoc Component ─────────────────────────────────────────────────────

function PreviewDoc({ sections }) {
  const TNR = "'Times New Roman', Times, serif";
  return (
    <div
      style={{
        background: "#fff",
        padding: "32px 28px",
        fontFamily: TNR,
        color: "#111",
        fontSize: 12,
        lineHeight: 1.7,
        minHeight: "297mm", // A4 height hint
      }}
    >
      {sections.map((s) => {
        const fs = Math.min(s.fontSize, 13);
        const commonStyle = {
          fontFamily: TNR,
          fontSize: fs,
          fontWeight: s.bold ? "bold" : "normal",
          fontStyle: s.type === "small-italic" ? "italic" : "normal",
          textDecoration: s.type === "underline-center" ? "underline" : "none",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          marginBottom: s.type === "heading" ? 14 : 5,
        };

        if (s.suffix) {
          return (
            <div
              key={s.id}
              style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 5 }}
            >
              <div style={{ ...commonStyle, textAlign: "left", marginBottom: 0 }}>
                {s.text}
              </div>
              <span style={{ fontFamily: TNR, fontSize: 12, fontWeight: "bold", whiteSpace: "nowrap" }}>
                {s.suffix}
              </span>
            </div>
          );
        }

        return (
          <div key={s.id} style={{ ...commonStyle, textAlign: s.align }}>
            {s.text}
          </div>
        );
      })}

      {/* Signature block */}
      <div
        style={{
          marginTop: 40,
          display: "flex",
          justifyContent: "space-between",
          fontFamily: TNR,
          fontSize: 11,
        }}
      >
        <div>
          <div style={{ marginBottom: 28 }} />
          <div>Adv. for Applicants</div>
          <div>Adv. Udaysinh D. Patil</div>
        </div>
        <div style={{ textAlign: "right" }}>
       <div style={{ lineHeight: 2.6, fontFamily: TNR }}>
  ________________________________________
</div>
          <div style={{ fontSize: 10, color: "#777" }}>(Applicants' Signatures)</div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function VakalatnamaEditor() {
  const [sections, setSections] = useState(() =>
    JSON.parse(JSON.stringify(DEFAULT_SECTIONS))
  );
  const [activeId, setActiveId] = useState(null);
  const [tab, setTab] = useState("edit");
  const [exporting, setExporting] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((msg, color = "#2e7d32") => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const updateSection = useCallback((id, text) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, text } : s))
    );
  }, []);

  const handleReset = () => {
    setSections(JSON.parse(JSON.stringify(DEFAULT_SECTIONS)));
    setActiveId(null);
    showToast("🔄 Reset done", "#1565c0");
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      generatePDF(sections);
      showToast("✅ PDF downloaded!");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      showToast("❌ " + msg, "#c62828");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f0f4ff",
        maxWidth: 520,
        margin: "0 auto",
        fontFamily: "Arial, sans-serif",
        position: "relative",
      }}
    >
      {/* ── Toast ── */}
      {toast && (
        <div
          style={{
            position: "fixed",
            top: 72,
            left: "50%",
            transform: "translateX(-50%)",
            background: toast.color,
            color: "#fff",
            padding: "10px 22px",
            borderRadius: 20,
            fontSize: 13,
            fontWeight: 600,
            zIndex: 9999,
            pointerEvents: "none",
            whiteSpace: "nowrap",
            boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
          }}
        >
          {toast.msg}
        </div>
      )}

      {/* ── Header ── */}
      <div
        style={{
          background: "linear-gradient(135deg,#1a237e,#283593)",
          padding: "16px 18px 12px",
          position: "sticky",
          top: 0,
          zIndex: 100,
          boxShadow: "0 2px 12px rgba(0,0,0,0.25)",
        }}
      >
        {/* Title row */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <span style={{ fontSize: 22 }}>⚖️</span>
          <div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>
              Vakalatnama Editor
            </div>
            <div style={{ color: "#9fa8da", fontSize: 11 }}>Session Judge Kolhapur</div>
          </div>
          <button
            onClick={handleExport}
            disabled={exporting}
            style={{
              marginLeft: "auto",
              background: exporting ? "#666" : "#43a047",
              color: "#fff",
              border: "none",
              borderRadius: 20,
              padding: "7px 14px",
              fontWeight: 700,
              fontSize: 12,
              cursor: exporting ? "not-allowed" : "pointer",
            }}
          >
            {exporting ? "⏳" : "⬇ PDF"}
          </button>
        </div>

        {/* Tabs */}
        <div
          style={{
            background: "rgba(255,255,255,0.15)",
            borderRadius: 10,
            display: "flex",
            padding: 3,
          }}
        >
          {["edit", "preview"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                flex: 1,
                background: tab === t ? "#fff" : "transparent",
                color: tab === t ? "#1a237e" : "#9fa8da",
                border: "none",
                borderRadius: 8,
                padding: "8px 0",
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {t === "edit" ? "✏️ Edit" : "👁 Preview"}
            </button>
          ))}
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ padding: "16px 14px 110px" }}>
        {tab === "edit" ? (
          <>
            {/* Hint */}
            <div
              style={{
                background: "#e8eaf6",
                border: "1px solid #c5cae9",
                borderRadius: 10,
                padding: "10px 14px",
                marginBottom: 14,
                fontSize: 12,
                color: "#3949ab",
                display: "flex",
                gap: 8,
              }}
            >
              <span>💡</span>
              <span>Tap any card to edit. Font &amp; formatting stay unchanged.</span>
            </div>

            {/* Cards */}
            {sections.map((s) => (
              <EditCard
                key={s.id}
                section={s}
                isActive={activeId === s.id}
                onActivate={() => setActiveId(s.id)}
                onChange={(val) => updateSection(s.id, val)}
              />
            ))}

            {/* Warning */}
            <div
              style={{
                background: "#fff3e0",
                border: "1px solid #ffcc80",
                borderRadius: 10,
                padding: "10px 14px",
                marginTop: 4,
                fontSize: 11,
                color: "#e65100",
                display: "flex",
                gap: 8,
              }}
            >
              <span>🖊️</span>
              <span>Signature lines are auto-generated. Physical signatures go on the printout.</span>
            </div>
          </>
        ) : (
          <div
            style={{
              background: "#fff",
              borderRadius: 14,
              overflow: "hidden",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            }}
          >
            <div
              style={{
                background: "#1a237e",
                padding: "10px 18px",
                color: "#fff",
                fontSize: 11,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              📄 DOCUMENT PREVIEW — A4
            </div>
            <PreviewDoc sections={sections} />
          </div>
        )}
      </div>

      {/* ── Bottom Bar ── */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: 520,
          background: "#fff",
          borderTop: "1px solid #e2e8f0",
          padding: "12px 18px",
          boxSizing: "border-box",
          display: "flex",
          gap: 10,
          zIndex: 200,
          boxShadow: "0 -4px 16px rgba(0,0,0,0.06)",
        }}
      >
        <button
          onClick={handleReset}
          style={{
            flex: 1,
            background: "#f5f5f5",
            color: "#555",
            border: "1px solid #ddd",
            borderRadius: 10,
            padding: "12px 0",
            fontWeight: 600,
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          🔄 Reset
        </button>
        <button
          onClick={handleExport}
          disabled={exporting}
          style={{
            flex: 2,
            background: exporting
              ? "#9e9e9e"
              : "linear-gradient(135deg,#1a237e,#3949ab)",
            color: "#fff",
            border: "none",
            borderRadius: 10,
            padding: "12px 0",
            fontWeight: 700,
            fontSize: 14,
            cursor: exporting ? "not-allowed" : "pointer",
            boxShadow: exporting ? "none" : "0 4px 14px rgba(26,35,126,0.3)",
          }}
        >
          {exporting ? "⏳ Generating..." : "⬇ Export PDF"}
        </button>
      </div>
    </div>
  );
}