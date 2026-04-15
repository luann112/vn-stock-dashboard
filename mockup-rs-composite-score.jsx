import { useState } from "react";

// ═══════════════════════════════════════════
// RS Composite Score — UI Mockup
// 4 components breakdown panel + compact table row
// ═══════════════════════════════════════════

const MOCK_DATA = {
  hpg: {
    symbol: "HPG",
    price: "28,500",
    change: "+1.2%",
    volume: "12.3M",
    score: 78,
    signal: "outperformer",
    breakdown: {
      rsRating: { score: 34, max: 40, raw: 85, label: "Outperform 85% thị trường trong 12 tháng qua" },
      rsTrending: { score: 20, max: 20, up: true, label: "RS Line tăng trong 10 phiên gần nhất" },
      rsNearHigh: { score: 16, max: 20, pct: 80, label: "RS Line đang ở 80% so với đỉnh cao nhất 1 năm" },
      rsDays: { score: 8, max: 20, ratio: "8/22", pct: 36, label: "Outperform 8/22 phiên thị trường giảm (3 tháng)" },
    },
  },
  fpt: {
    symbol: "FPT",
    price: "125,000",
    change: "+0.5%",
    volume: "3.2M",
    score: 92,
    signal: "market_leader",
    breakdown: {
      rsRating: { score: 38, max: 40, raw: 95, label: "Outperform 95% thị trường trong 12 tháng qua" },
      rsTrending: { score: 20, max: 20, up: true, label: "RS Line tăng trong 10 phiên gần nhất" },
      rsNearHigh: { score: 19.8, max: 20, pct: 99, label: "RS Line đang ở 99% so với đỉnh — gần RS New High!" },
      rsDays: { score: 14.5, max: 20, ratio: "16/22", pct: 73, label: "Outperform 16/22 phiên thị trường giảm (3 tháng)" },
    },
  },
  mwg: {
    symbol: "MWG",
    price: "48,200",
    change: "-0.8%",
    volume: "5.1M",
    score: 35,
    signal: "laggard",
    breakdown: {
      rsRating: { score: 12, max: 40, raw: 30, label: "Outperform 30% thị trường trong 12 tháng qua" },
      rsTrending: { score: 0, max: 20, up: false, label: "RS Line giảm trong 10 phiên gần nhất" },
      rsNearHigh: { score: 16, max: 20, pct: 80, label: "RS Line đang ở 80% so với đỉnh cao nhất 1 năm" },
      rsDays: { score: 7, max: 20, ratio: "7/20", pct: 35, label: "Outperform 7/20 phiên thị trường giảm (3 tháng)" },
    },
  },
  vcb: {
    symbol: "VCB",
    price: "85,000",
    change: "+2.1%",
    volume: "8.7M",
    score: 84,
    signal: "market_leader",
    breakdown: {
      rsRating: { score: 36, max: 40, raw: 90, label: "Outperform 90% thị trường trong 12 tháng qua" },
      rsTrending: { score: 20, max: 20, up: true, label: "RS Line tăng trong 10 phiên gần nhất" },
      rsNearHigh: { score: 18, max: 20, pct: 90, label: "RS Line đang ở 90% so với đỉnh cao nhất 1 năm" },
      rsDays: { score: 10, max: 20, ratio: "10/18", pct: 56, label: "Outperform 10/18 phiên thị trường giảm (3 tháng)" },
    },
  },
};

const SIGNAL_CONFIG = {
  market_leader: { label: "Market Leader", color: "#059669", bg: "rgba(5,150,105,0.1)", border: "rgba(5,150,105,0.25)" },
  outperformer: { label: "Outperformer", color: "#d97706", bg: "rgba(217,119,6,0.1)", border: "rgba(217,119,6,0.25)" },
  average: { label: "Average", color: "#6b7280", bg: "rgba(107,114,128,0.1)", border: "rgba(107,114,128,0.25)" },
  laggard: { label: "Laggard", color: "#dc2626", bg: "rgba(220,38,38,0.1)", border: "rgba(220,38,38,0.25)" },
};

function getScoreColor(score) {
  if (score >= 80) return "#059669";
  if (score >= 60) return "#d97706";
  if (score >= 40) return "#6b7280";
  return "#dc2626";
}

function getBarColor(score, max) {
  const pct = score / max;
  if (pct >= 0.8) return "#059669";
  if (pct >= 0.5) return "#d97706";
  return "#dc2626";
}

// ═══ Progress Bar Component ═══
function ProgressBar({ score, max, color }) {
  const pct = (score / max) * 100;
  return (
    <div style={{ flex: 1, height: 7, borderRadius: 4, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
      <div
        style={{
          width: `${pct}%`,
          height: "100%",
          borderRadius: 4,
          background: `linear-gradient(90deg, ${color}66, ${color})`,
          transition: "width 0.6s cubic-bezier(0.16,1,0.3,1)",
        }}
      />
    </div>
  );
}

// ═══ Component Row ═══
function ComponentRow({ label, weight, score, max, color, subtitle, extra, binary, binaryUp }) {
  const barColor = color || getBarColor(score, max);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
      {/* Label + weight */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#f0f1f5" }}>{label}</span>
        <span
          style={{
            fontSize: 10,
            fontWeight: 500,
            color: "#5a6070",
            background: "rgba(255,255,255,0.04)",
            padding: "2px 7px",
            borderRadius: 4,
          }}
        >
          {weight}
        </span>
      </div>

      {binary ? (
        /* Binary: arrow + status + score */
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: binaryUp ? "#059669" : "#dc2626" }}>
              {binaryUp ? "▲" : "▼"}
            </span>
            <span
              style={{ fontSize: 13, fontWeight: 600, color: binaryUp ? "#059669" : "#dc2626", flex: 1 }}
            >
              {binaryUp ? "Đang outperform" : "Đang underperform"}
            </span>
            <span style={{ fontSize: 13, fontWeight: 700, color: binaryUp ? "#059669" : "#dc2626" }}>
              {score}/{max}
            </span>
          </div>
          <div
            style={{
              height: 5,
              borderRadius: 3,
              background: binaryUp
                ? "linear-gradient(90deg, rgba(5,150,105,0.3), rgba(5,150,105,0.7))"
                : "rgba(255,255,255,0.04)",
            }}
          />
        </>
      ) : (
        /* Continuous: progress bar + score */
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <ProgressBar score={score} max={max} color={barColor} />
          <span style={{ fontSize: 13, fontWeight: 700, color: barColor, minWidth: 44, textAlign: "right" }}>
            {Number.isInteger(score) ? score : score.toFixed(1)}/{max}
          </span>
        </div>
      )}

      {/* Subtitle */}
      <span style={{ fontSize: 11, color: "#4a5068", lineHeight: 1.4 }}>{subtitle}</span>
      {extra && (
        <span style={{ fontSize: 10, color: "#3d4455", fontWeight: 500 }}>{extra}</span>
      )}
    </div>
  );
}

// ═══ BREAKDOWN PANEL ═══
function RSBreakdownPanel({ data }) {
  const cfg = SIGNAL_CONFIG[data.signal];
  const scoreColor = getScoreColor(data.score);
  const b = data.breakdown;

  return (
    <div
      style={{
        width: 440,
        background: "rgba(15,23,42,0.95)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 16,
        padding: "26px 26px 22px",
        display: "flex",
        flexDirection: "column",
        gap: 22,
        boxShadow: "0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)",
        backdropFilter: "blur(16px)",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {/* Score circle */}
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: `${scoreColor}18`,
            border: `2.5px solid ${scoreColor}55`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 24, fontWeight: 800, color: scoreColor }}>{data.score}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span style={{ fontSize: 11, fontWeight: 500, color: "#5a6070", letterSpacing: 0.5, textTransform: "uppercase" }}>
            RS Composite Score — {data.symbol}
          </span>
          <span style={{ fontSize: 20, fontWeight: 700, color: cfg.color }}>{cfg.label}</span>
          <span style={{ fontSize: 12, color: "#4a5068" }}>
            {data.score >= 80
              ? "Ưu tiên theo dõi, cân nhắc entry khi có setup"
              : data.score >= 60
              ? "Đáng watchlist, chờ score tăng lên 80+"
              : data.score >= 40
              ? "Không có edge đặc biệt so với thị trường"
              : "Underperform — loại khỏi danh sách theo dõi"}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "rgba(255,255,255,0.06)" }} />

      {/* 4 Components */}
      <ComponentRow
        label="RS Rating"
        weight="40%"
        score={b.rsRating.score}
        max={b.rsRating.max}
        subtitle={b.rsRating.label}
        extra={`Percentile: ${b.rsRating.raw} / 100`}
      />
      <ComponentRow
        label="RS Line Trending"
        weight="20%"
        score={b.rsTrending.score}
        max={b.rsTrending.max}
        binary
        binaryUp={b.rsTrending.up}
        subtitle={b.rsTrending.label}
      />
      <ComponentRow
        label="RS Near High"
        weight="20%"
        score={b.rsNearHigh.score}
        max={b.rsNearHigh.max}
        subtitle={b.rsNearHigh.label}
        extra={b.rsNearHigh.pct >= 98 ? "🔥 Gần RS New High — tín hiệu tích lũy mạnh" : undefined}
      />
      <ComponentRow
        label="RS Days"
        weight="20%"
        score={b.rsDays.score}
        max={b.rsDays.max}
        subtitle={b.rsDays.label}
        extra={
          b.rsDays.pct >= 60
            ? `Tỉ lệ: ${b.rsDays.pct}% — đạt ngưỡng Leadership ✓`
            : `Tỉ lệ: ${b.rsDays.pct}% — dưới ngưỡng Leadership (60%)`
        }
      />

      {/* Footer */}
      <span style={{ fontSize: 10, color: "#3d4455", textAlign: "center", marginTop: 2 }}>
        RS Score là công cụ sàng lọc, không phải tín hiệu mua/bán. Lookback: 252 phiên (~1 năm)
      </span>
    </div>
  );
}

// ═══ COMPACT TABLE ROW ═══
function CompactScoreBadge({ score, trending }) {
  const color = getScoreColor(score);
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "3px 8px",
        borderRadius: 6,
        background: `${color}18`,
        border: `1px solid ${color}30`,
        cursor: "pointer",
      }}
    >
      <span style={{ fontSize: 13, fontWeight: 700, color }}>{score}</span>
      <span style={{ fontSize: 11, color: trending ? "#059669" : "#dc2626" }}>
        {trending ? "↑" : "↓"}
      </span>
    </div>
  );
}

function TableRow({ data, expanded, onToggle }) {
  const changeColor = data.change.startsWith("+") ? "#059669" : "#dc2626";
  return (
    <>
      <tr
        onClick={onToggle}
        style={{ cursor: "pointer", borderBottom: expanded ? "none" : "1px solid rgba(255,255,255,0.05)" }}
      >
        <td style={{ padding: "10px 12px", fontWeight: 600, color: "#f0f1f5", fontSize: 13 }}>{data.symbol}</td>
        <td style={{ padding: "10px 12px", color: "#c0c4d0", fontSize: 13, textAlign: "right" }}>{data.price}</td>
        <td style={{ padding: "10px 12px", color: changeColor, fontSize: 13, fontWeight: 600, textAlign: "right" }}>
          {data.change}
        </td>
        <td style={{ padding: "10px 12px", color: "#6b7280", fontSize: 12, textAlign: "right" }}>{data.volume}</td>
        <td style={{ padding: "10px 12px", textAlign: "center" }}>
          <CompactScoreBadge score={data.score} trending={data.breakdown.rsTrending.up} />
        </td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan={5} style={{ padding: "8px 12px 16px", background: "rgba(255,255,255,0.015)" }}>
            <RSBreakdownPanel data={data} />
          </td>
        </tr>
      )}
    </>
  );
}

// ═══ MAIN APP ═══
export default function RSMockup() {
  const [expandedRow, setExpandedRow] = useState("fpt");
  const [activePanel, setActivePanel] = useState("panel");
  const stocks = [MOCK_DATA.fpt, MOCK_DATA.vcb, MOCK_DATA.hpg, MOCK_DATA.mwg];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(145deg, #080c18 0%, #0d1424 50%, #0a101e 100%)",
        color: "#f0f1f5",
        fontFamily: "'Inter', -apple-system, sans-serif",
        padding: 40,
      }}
    >
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        {/* Title */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#f0f1f5", margin: 0 }}>
            RS Composite Score — UI Mockup
          </h1>
          <p style={{ fontSize: 13, color: "#5a6070", marginTop: 6, lineHeight: 1.5 }}>
            Click vào score badge để expand/collapse breakdown panel. Hai mockup: standalone panel + inline table.
          </p>
        </div>

        {/* Tab switcher */}
        <div style={{ display: "flex", gap: 2, marginBottom: 24 }}>
          {[
            { id: "panel", label: "Breakdown Panel" },
            { id: "table", label: "Watchlist Table" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActivePanel(tab.id)}
              style={{
                padding: "8px 18px",
                borderRadius: 8,
                border: "none",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                color: activePanel === tab.id ? "#f0f1f5" : "#5a6070",
                background: activePanel === tab.id ? "rgba(59,130,246,0.15)" : "transparent",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activePanel === "panel" ? (
          /* ═══ STANDALONE PANELS ═══ */
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            <RSBreakdownPanel data={MOCK_DATA.fpt} />
            <RSBreakdownPanel data={MOCK_DATA.mwg} />
          </div>
        ) : (
          /* ═══ TABLE VIEW ═══ */
          <div
            style={{
              background: "rgba(15,23,42,0.7)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 14,
              overflow: "hidden",
              backdropFilter: "blur(12px)",
            }}
          >
            <div style={{ padding: "16px 16px 8px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#c0c4d0" }}>Watchlist — RS Score</span>
              <span style={{ fontSize: 11, color: "#4a5068", marginLeft: 10 }}>Click row để xem breakdown</span>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  {["Mã CK", "Giá", "Thay đổi", "KL", "RS Score"].map((h, i) => (
                    <th
                      key={h}
                      style={{
                        padding: "10px 12px",
                        fontSize: 11,
                        fontWeight: 500,
                        color: "#4a5068",
                        textAlign: i === 0 ? "left" : i === 4 ? "center" : "right",
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stocks.map((s) => (
                  <TableRow
                    key={s.symbol}
                    data={s}
                    expanded={expandedRow === s.symbol.toLowerCase()}
                    onToggle={() =>
                      setExpandedRow(expandedRow === s.symbol.toLowerCase() ? null : s.symbol.toLowerCase())
                    }
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Legend */}
        <div style={{ marginTop: 28, display: "flex", gap: 16, flexWrap: "wrap" }}>
          {Object.entries(SIGNAL_CONFIG).map(([key, cfg]) => (
            <div key={key} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: cfg.color }} />
              <span style={{ fontSize: 11, color: "#5a6070" }}>
                {cfg.label} ({key === "market_leader" ? "≥80" : key === "outperformer" ? "60–79" : key === "average" ? "40–59" : "<40"})
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
