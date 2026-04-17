"use client";

import { useEffect, useRef } from "react";

interface ParamHelpModalProps {
  onClose: () => void;
}

interface SectionProps {
  title: string;
  affects: string;
  meaning: string;
  tradeoff: string;
  example: string;
  recommendation: string;
}

function Section({ title, affects, meaning, tradeoff, example, recommendation }: SectionProps) {
  return (
    <div className="flex flex-col gap-2">
      <h4 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
        {title}
      </h4>
      <p className="text-xs" style={{ color: "var(--primary)" }}>
        Ảnh hưởng: {affects}
      </p>
      <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
        {meaning}
      </p>
      <div
        className="rounded-lg px-3 py-2 text-xs"
        style={{ backgroundColor: "var(--muted)", color: "var(--foreground)" }}
      >
        <span className="font-medium">Ví dụ: </span>{example}
      </div>
      <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
        <span className="font-medium">Trade-off: </span>{tradeoff}
      </p>
      <p className="text-xs font-medium" style={{ color: "var(--bull)" }}>
        Khuyến nghị: {recommendation}
      </p>
    </div>
  );
}

const SECTIONS: SectionProps[] = [
  {
    title: "Lookback (phiên nhìn lại)",
    affects: "RS Rating + RS Near High",
    meaning:
      "Số phiên giao dịch để tính return dài hạn (RS Rating) và tìm đỉnh RS Line (RS Near High). " +
      "Ví dụ: lookback=252 → so sánh hiệu suất giá trong 1 năm qua.",
    example:
      "lookback=252: HPG tăng 38% trong 252 phiên, outperform 85% VN100 → RS Rating = 85. " +
      "lookback=63: cùng HPG nhưng chỉ nhìn 3 tháng gần nhất, có thể cho kết quả khác.",
    tradeoff:
      "Ngắn (63) = bắt momentum mới sớm, nhưng nhiều false signal. " +
      "Dài (252) = ổn định, ít nhiễu, nhưng chậm phản ánh thay đổi.",
    recommendation: "126–252 cho position trading (giữ 1–6 tháng)",
  },
  {
    title: "Slope Window (cửa sổ xu hướng)",
    affects: "RS Trending",
    meaning:
      "Số phiên để xác định RS Line đang đi lên hay xuống. " +
      "So sánh RS Line hôm nay với RS Line N phiên trước — slope dương = 20đ, slope âm = 0đ.",
    example:
      "slope=10: RS Line hôm nay = 68.0, 10 phiên trước = 66.9 → slope dương → 20 điểm. " +
      "slope=3: chỉ nhìn 3 phiên, 1 phiên xấu có thể đảo chiều kết quả.",
    tradeoff:
      "Nhỏ (3–5) = nhạy, phát hiện đảo chiều sớm, nhưng dễ bị nhiễu bởi 1–2 phiên xấu. " +
      "Lớn (15–30) = ổn định hơn nhưng phản ứng chậm.",
    recommendation: "5–10 phiên (1–2 tuần giao dịch)",
  },
  {
    title: "Correction Window (cửa sổ điều chỉnh)",
    affects: "RS Days",
    meaning:
      "Số phiên quan sát để đếm bao nhiêu ngày cổ phiếu giảm ít hơn VN-Index khi thị trường giảm. " +
      "Tỉ lệ outperform > 60% = \"Leadership zone\" theo IBD/O'Neil.",
    example:
      "correction=60: trong 60 phiên, VN-Index giảm 22 phiên, VCB giảm ít hơn 16/22 phiên → " +
      "rs_days_pct = 72.7% → Leadership zone.",
    tradeoff:
      "Nhỏ (20–30) = phản ánh hành vi rất gần đây, dễ thay đổi. " +
      "Lớn (60–126) = bức tranh ổn định hơn về khả năng kháng cự.",
    recommendation: "60 phiên (~3 tháng giao dịch)",
  },
];

export function ParamHelpModal({ onClose }: ParamHelpModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleBackdrop = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) onClose();
  };

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdrop}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}
    >
      <div
        className="flex w-full max-w-lg max-h-[80vh] flex-col gap-5 rounded-2xl border p-6 shadow-lg overflow-y-auto"
        style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold" style={{ color: "var(--foreground)" }}>
            Giải thích tham số RS
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 transition-colors hover:bg-[color:var(--muted)]"
            style={{ color: "var(--muted-foreground)" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col gap-6">
          {SECTIONS.map((section) => (
            <Section key={section.title} {...section} />
          ))}
        </div>

        <button
          onClick={onClose}
          className="btn-primary w-full rounded-lg py-2.5 text-sm font-medium"
        >
          Đã hiểu
        </button>
      </div>
    </div>
  );
}
