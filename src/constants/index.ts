export const REFRESH_INTERVAL = 30_000;
export const CHART_REFRESH_INTERVAL = 60_000;
export const SIGNAL_REFRESH_INTERVAL = 300_000;
export const PENDING_STATUS_POLL_INTERVAL = 10_000;

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://vn-stock-api.railway.app";

export const WATCHLIST_STORAGE_KEY = "vn-stock-watchlist";

export const DEFAULT_SYMBOLS = [
  "VNM", "VIC", "HPG", "TCB", "VCB", "FPT", "MWG", "MSN",
] as const;

export const POPULAR_SYMBOLS = [
  "VNM", "VIC", "VHM", "HPG", "TCB", "VCB", "CTG", "BID",
  "MBB", "MSN", "MWG", "FPT", "VRE", "GAS", "PLX", "SAB",
  "VPB", "SSI", "PNJ", "REE",
] as const;

export const HOSE_SYMBOLS = [
  "VNM", "VIC", "VHM", "HPG", "TCB", "VCB", "CTG", "BID",
  "MBB", "MSN", "MWG", "FPT", "VRE", "GAS", "PLX", "SAB",
  "VPB", "HDB", "SSI", "PNJ", "REE", "DGC", "DHG",
] as const;

export const HNX_SYMBOLS = [
  "SHB", "EIB", "ACB", "STB", "VND", "HAG", "DBC",
] as const;

// ── UI Constants ────────────────────────────────────────────

export const CHART_HEIGHT = 320;
export const HEAT_CELL_SIZE = 90;

// ── Signal badge config ─────────────────────────────────────

export const SIGNAL_CONFIG: Record<string, { className: string; label: string }> = {
  BUY:     { className: "badge-buy",  label: "MUA" },
  SELL:    { className: "badge-sell", label: "BÁN" },
  HOLD:    { className: "badge-hold", label: "GIỮ" },
  UNKNOWN: { className: "badge-hold", label: "—" },
};

// ── Table headers ───────────────────────────────────────────

export const WATCHLIST_TABLE_HEADERS = [
  { label: "Mã / Tên",    align: "left"  },
  { label: "Giá",         align: "right" },
  { label: "% Ngày",      align: "right" },
  { label: "Khối lượng",  align: "right" },
  { label: "RSI",         align: "left"  },
  { label: "Tín hiệu",   align: "left"  },
  { label: "",            align: "left"  },
] as const;

export const ALERT_TABLE_HEADERS = [
  "Mã / Tên", "Tín hiệu", "Giá", "RSI", "Moving Averages", "Thời gian",
] as const;

// ── Filter options ──────────────────────────────────────────

export const ALERT_FILTER_OPTIONS: readonly { value: string; label: string }[] = [
  { value: "ALL",  label: "Tất cả" },
  { value: "BUY",  label: "Mua (BUY)" },
  { value: "SELL", label: "Bán (SELL)" },
  { value: "HOLD", label: "Giữ (HOLD)" },
] as const;

// ── Heatmap legend ──────────────────────────────────────────

export const HEATMAP_LEGEND_ITEMS = [
  { cssVar: "var(--heat-strong-bull)", label: ">+5%"      },
  { cssVar: "var(--heat-mid-bull)",    label: "+1 ~ +5%"  },
  { cssVar: "var(--heat-light-bull)",  label: "0 ~ +1%"   },
  { cssVar: "var(--heat-neutral)",     label: "0%"        },
  { cssVar: "var(--heat-faint-bear)",  label: "-1 ~ 0%"   },
  { cssVar: "var(--heat-mid-bear)",    label: "-5 ~ -1%"  },
  { cssVar: "var(--heat-strong-bear)", label: "<-5%"      },
] as const;

// ── Company names ───────────────────────────────────────────

export const COMPANY_NAMES: Readonly<Record<string, string>> = {
  VNM: "Vinamilk",
  VIC: "Vingroup",
  VHM: "Vinhomes",
  HPG: "Hoà Phát Group",
  TCB: "Techcombank",
  VCB: "Vietcombank",
  CTG: "VietinBank",
  BID: "BIDV",
  MBB: "MB Bank",
  ACB: "ACB Bank",
  STB: "Sacombank",
  MSN: "Masan Group",
  MWG: "Thế Giới Di Động",
  FPT: "FPT Corporation",
  VRE: "Vincom Retail",
  GAS: "PVGas",
  PLX: "Petrolimex",
  SAB: "Sabeco",
  VPB: "VPBank",
  HDB: "HDBank",
  SSI: "SSI Securities",
  VND: "VNDIRECT",
  SHB: "SHBank",
  EIB: "Eximbank",
  PNJ: "PNJ Jewelry",
  REE: "REE Corporation",
  DHG: "Hậu Giang Pharma",
  DGC: "Đức Giang Chemical",
  DBC: "Dabaco",
  HAG: "HAGL",
};
